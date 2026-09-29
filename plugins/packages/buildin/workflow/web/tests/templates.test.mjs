import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { execute } = require("../../dist/engine.js");
const { newNode } = require("../../dist/model.js");
const { templates } = require("../../dist/templates.js");
const { validateGraph } = require("../../dist/validation.js");
globalThis.PluginConfig = {
  async use(_key, initial) {
    return structuredClone(initial);
  },
  async flush() {},
};
const { dispatch } = require("../../dist/service.js");

/** Returns one template by its stable catalog name. */
function template(name) {
  const workflow = templates().find((item) => item.name === name);
  assert.ok(workflow, `Missing template: ${name}`);
  return workflow;
}

/** Creates a deterministic execution host that records every tool call. */
function host(responses = {}) {
  const calls = [];
  return {
    calls,
    async call(name, params) {
      calls.push({ name, params });
      const response = responses[name];
      if (typeof response === "function") return response(params, calls.length);
      return response ?? "ok";
    },
    async script() {
      throw new Error("Templates must not require a JavaScript node");
    },
    async changed() {},
    cancelled() {
      return false;
    },
  };
}

/** Returns the node with the requested display name. */
function node(workflow, name) {
  const result = workflow.nodes.find((item) => item.name === name);
  assert.ok(result, `Missing node: ${name}`);
  return result;
}

/** Waits for a background service state without assuming a fixed execution duration. */
async function waitFor(check) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const value = await check();
    if (value !== undefined) return value;
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  throw new Error("Timed out waiting for workflow state");
}

/** Validates every catalog template with its production execution constraints. */
test("every workflow template is an executable acyclic graph", () => {
  const catalog = templates();
  assert.deepEqual(
    catalog.map((item) => item.name),
    [
      "Manual Notification",
      "Random Number Condition Branch",
      "Web Keyword Branch",
      "Data Extraction Pipeline",
      "Logic AND Branch",
      "AI Proactive Message (Scheduled)",
    ],
  );
  for (const workflow of catalog) validateGraph(workflow, true);
});

/** Verifies every template uses the production import path and starts disabled. */
test("every workflow template imports as a disabled editable copy", async () => {
  for (const workflow of templates()) {
    const snapshot = await dispatch({
      action: "import",
      json: JSON.stringify(workflow),
    });
    const imported = snapshot.workflows.at(-1);
    assert.ok(imported, `Missing imported workflow: ${workflow.name}`);
    assert.equal(imported.name, workflow.name);
    assert.equal(imported.enabled, false);
    assert.notEqual(imported.id, workflow.id);
  }
});

/** Verifies background starts return promptly while retaining the workflow execution lock. */
test("background starts publish a running record without blocking the caller", async () => {
  let finishTool;
  globalThis.toolCall = () =>
    new Promise((resolve) => {
      finishTool = resolve;
    });
  const created = await dispatch({
    action: "create",
    name: "Background run",
    description: "",
  });
  const workflow = created.workflows.at(-1);
  const trigger = newNode("trigger");
  const action = newNode("execute");
  action.actionType = "test_background_tool";
  workflow.nodes = [trigger, action];
  workflow.connections = [
    {
      id: "background-edge",
      sourceNodeId: trigger.id,
      targetNodeId: action.id,
      condition: null,
    },
  ];
  const saved = await dispatch({ action: "save", workflow });
  const stored = saved.workflows.find((item) => item.id === workflow.id);
  await dispatch({
    action: "start",
    id: stored.id,
    triggerId: null,
    extras: {},
  });
  await waitFor(() =>
    typeof finishTool === "function" ? finishTool : undefined,
  );
  const running = await waitFor(async () => {
    const snapshot = await dispatch({ action: "list" });
    return snapshot.runs.find(
      (item) => item.workflowId === stored.id && item.status === "RUNNING",
    );
  });
  await assert.rejects(
    dispatch({ action: "save", workflow: stored }),
    /executing/,
  );
  finishTool("completed");
  const finished = await waitFor(async () => {
    const snapshot = await dispatch({ action: "list" });
    return snapshot.runs.find(
      (item) => item.id === running.id && item.status === "SUCCESS",
    );
  });
  assert.equal(finished.nodes[action.id].output, "completed");
});

/** Verifies the notification template sends its documented title and message. */
test("manual notification template calls the notification tool", async () => {
  const workflow = template("Manual Notification");
  const executionHost = host();
  const run = await execute(workflow, null, {}, executionHost);
  assert.equal(run.status, "SUCCESS");
  assert.deepEqual(executionHost.calls, [
    {
      name: "send_notification",
      params: { title: "Workflow", message: "Workflow executed" },
    },
  ]);
});

/** Verifies the random branch always executes exactly one terminal branch. */
test("random condition template selects one branch", async () => {
  const workflow = template("Random Number Condition Branch");
  const run = await execute(workflow, null, {}, host());
  const greater = run.nodes[node(workflow, "Larger Number").id];
  const smaller = run.nodes[node(workflow, "Smaller Number").id];
  assert.equal(run.status, "SUCCESS");
  assert.equal([greater.status, smaller.status].filter((status) => status === "success").length, 1);
  assert.equal([greater.status, smaller.status].filter((status) => status === "skipped").length, 1);
});

/** Verifies the web template extracts and reuses the previous visit key. */
test("web keyword template passes the extracted visit key to the follow-up visit", async () => {
  const workflow = template("Web Keyword Branch");
  const executionHost = host({
    visit_web(params, index) {
      if (index === 1) {
        assert.deepEqual(params, { url: "https://example.com" });
        return "Visit key: visit-123\nTitle: Example Domain";
      }
      assert.deepEqual(params, { visit_key: "visit-123", link_number: "1" });
      return "followed";
    },
  });
  const run = await execute(workflow, null, {}, executionHost);
  assert.equal(run.status, "SUCCESS");
  assert.deepEqual(executionHost.calls.map((call) => call.name), ["visit_web", "visit_web"]);
  assert.equal(run.nodes[node(workflow, "Visit Fallback Page").id].status, "skipped");
});

/** Verifies the extraction template forwards its processed output to the toast tool. */
test("extraction pipeline template forwards its output reference", async () => {
  const workflow = template("Data Extraction Pipeline");
  const executionHost = host();
  const run = await execute(workflow, null, {}, executionHost);
  assert.equal(run.status, "SUCCESS");
  assert.deepEqual(executionHost.calls, [
    { name: "toast", params: { message: "Operit-4" } },
  ]);
});

/** Verifies the AND template invokes only its all-conditions-satisfied branch. */
test("logic AND template invokes the successful branch", async () => {
  const workflow = template("Logic AND Branch");
  const executionHost = host();
  const run = await execute(workflow, null, {}, executionHost);
  assert.equal(run.status, "SUCCESS");
  assert.deepEqual(executionHost.calls, [
    { name: "toast", params: { message: "Both conditions are satisfied" } },
  ]);
  assert.equal(run.nodes[node(workflow, "Send Failure Notification").id].status, "skipped");
});

/** Verifies the scheduled proactive template starts a chat and sends its prompt. */
test("proactive AI template uses its scheduled trigger and chat tool sequence", async () => {
  const workflow = template("AI Proactive Message (Scheduled)");
  const trigger = node(workflow, "Daily 09:00");
  const executionHost = host();
  const run = await execute(workflow, trigger.id, {}, executionHost);
  assert.equal(run.status, "SUCCESS");
  assert.deepEqual(executionHost.calls, [
    {
      name: "start_chat_service",
      params: { initial_mode: "WINDOW", keep_if_exists: "true" },
    },
    {
      name: "create_new_chat",
      params: { group: "workflow", set_as_current_chat: "true" },
    },
    {
      name: "send_message_to_ai",
      params: {
        message: "Good morning. Please proactively tell me the one thing most worth paying attention to today.",
        runtime: "floating",
        persist_turn: "true",
      },
    },
  ]);
});
