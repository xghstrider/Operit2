"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templates = templates;
const model_1 = require("./model");
/** Connects two template nodes with an optional branch condition. */
function connect(source, target, condition = null) {
    return {
        id: (0, model_1.id)("edge"),
        sourceNodeId: source.id,
        targetNodeId: target.id,
        condition,
    };
}
/** Creates a configured trigger node at the requested canvas position. */
function triggerNode(name, x, y, triggerType = "manual") {
    const node = (0, model_1.newNode)("trigger", x, y);
    if (node.type !== "trigger")
        throw new Error("Node type mismatch");
    node.name = name;
    node.triggerType = triggerType;
    return node;
}
/** Creates a configured execute node for a host tool. */
function executeNode(name, actionType, actionConfig, x, y) {
    const node = (0, model_1.newNode)("execute", x, y);
    if (node.type !== "execute")
        throw new Error("Node type mismatch");
    node.name = name;
    node.actionType = actionType;
    node.actionConfig = actionConfig;
    return node;
}
/** Creates a configured extraction node for deterministic template data. */
function extractNode(name, x, y) {
    const node = (0, model_1.newNode)("extract", x, y);
    if (node.type !== "extract")
        throw new Error("Node type mismatch");
    node.name = name;
    return node;
}
/** Creates a configured condition node for a template branch. */
function conditionNode(name, x, y) {
    const node = (0, model_1.newNode)("condition", x, y);
    if (node.type !== "condition")
        throw new Error("Node type mismatch");
    node.name = name;
    return node;
}
/** Creates a configured logic node for combining condition outputs. */
function logicNode(name, x, y) {
    const node = (0, model_1.newNode)("logic", x, y);
    if (node.type !== "logic")
        throw new Error("Node type mismatch");
    node.name = name;
    return node;
}
/** Builds a manual notification workflow. */
function manualNotification() {
    const workflow = (0, model_1.newWorkflow)("Manual Notification", "Sends a system notification after a manual trigger.");
    const trigger = triggerNode("Manual Trigger", 60, 80);
    const notification = executeNode("Send Notification", "send_notification", { title: { value: "Workflow" }, message: { value: "Workflow executed" } }, 300, 80);
    workflow.nodes = [trigger, notification];
    workflow.connections = [connect(trigger, notification)];
    return workflow;
}
/** Builds a graph that demonstrates true and false branches. */
function randomConditionBranch() {
    const workflow = (0, model_1.newWorkflow)("Random Number Condition Branch", "Generates a random number, compares its size, and shows different results along the true / false edges; does not call external tools.");
    const trigger = triggerNode("Manual Trigger", 60, 100);
    const random = extractNode("Random Number 0–100", 280, 100);
    random.mode = "RANDOM_INT";
    const condition = conditionNode("Greater Than or Equal to 50", 500, 100);
    condition.left = { nodeId: random.id };
    condition.operator = "GTE";
    condition.right = { value: "50" };
    const yes = extractNode("Larger Number", 740, 40);
    yes.mode = "CONCAT";
    yes.source = { value: "Value ≥ 50" };
    const no = extractNode("Smaller Number", 740, 180);
    no.mode = "CONCAT";
    no.source = { value: "Value < 50" };
    workflow.nodes = [trigger, random, condition, yes, no];
    workflow.connections = [
        connect(trigger, random),
        connect(random, condition),
        connect(condition, yes, "true"),
        connect(condition, no, "false"),
    ];
    return workflow;
}
/** Builds the old web-key extraction and conditional-link workflow. */
function webKeywordBranch() {
    const workflow = (0, model_1.newWorkflow)("Web Keyword Branch", "After visiting the web page, extract the Visit key; if the page contains Example Domain, continue to open the first link, otherwise visit the fallback page.");
    const trigger = triggerNode("Manual Trigger", 40, 120);
    const visit = executeNode("Visit Web Page", "visit_web", { url: { value: "https://example.com" } }, 260, 120);
    const visitKey = extractNode("Extract Visit key", 480, 120);
    visitKey.mode = "REGEX";
    visitKey.source = { nodeId: visit.id };
    visitKey.expression = "Visit key:\\s*([^\\s]+)";
    visitKey.group = 1;
    const condition = conditionNode("Contains Example Domain", 700, 120);
    condition.left = { nodeId: visit.id };
    condition.operator = "CONTAINS";
    condition.right = { value: "Example Domain" };
    const follow = executeNode("Open First Link", "visit_web", {
        visit_key: { nodeId: visitKey.id },
        link_number: { value: "1" },
    }, 940, 40);
    const fallback = executeNode("Visit Fallback Page", "visit_web", { url: { value: "https://example.org" } }, 940, 220);
    workflow.nodes = [trigger, visit, visitKey, condition, follow, fallback];
    workflow.connections = [
        connect(trigger, visit),
        connect(visit, visitKey),
        connect(visitKey, condition),
        connect(condition, follow, "true"),
        connect(condition, fallback, "false"),
    ];
    return workflow;
}
/** Builds a pure extraction chain that demonstrates output references. */
function extractionPipeline() {
    const workflow = (0, model_1.newWorkflow)("Data Extraction Pipeline", "Demonstrates string concatenation, substring extraction, and node output references with fixed values, then shows the processed result.");
    const trigger = triggerNode("Manual Trigger", 40, 120);
    const text = extractNode("Fixed Text", 260, 40);
    text.mode = "RANDOM_STRING";
    text.useFixed = true;
    text.fixedValue = "Operit";
    text.randomStringLength = 6;
    text.randomStringCharset = "Operit";
    const number = extractNode("Fixed Number", 260, 200);
    number.mode = "RANDOM_INT";
    number.useFixed = true;
    number.fixedValue = "42";
    const joined = extractNode("Concatenated Result", 500, 120);
    joined.mode = "CONCAT";
    joined.source = { nodeId: text.id };
    joined.others = [{ value: "-" }, { nodeId: number.id }];
    const preview = extractNode("Substring Preview", 720, 120);
    preview.mode = "SUB";
    preview.source = { nodeId: joined.id };
    preview.startIndex = 0;
    preview.length = 8;
    const show = executeNode("Show Result", "toast", { message: { nodeId: preview.id } }, 940, 120);
    workflow.nodes = [trigger, text, number, joined, preview, show];
    workflow.connections = [
        connect(trigger, text),
        connect(trigger, number),
        connect(text, joined),
        connect(number, joined),
        connect(joined, preview),
        connect(preview, show),
    ];
    return workflow;
}
/** Builds the old multi-condition AND branch with deterministic inputs. */
function logicAndBranch() {
    const workflow = (0, model_1.newWorkflow)("Logic AND Branch", "Sends a success notification when both conditions are satisfied; otherwise sends a not-satisfied notification.");
    const trigger = triggerNode("Manual Trigger", 40, 120);
    const firstValue = extractNode("Condition Value A", 260, 40);
    firstValue.mode = "RANDOM_INT";
    firstValue.useFixed = true;
    firstValue.fixedValue = "80";
    const secondValue = extractNode("Condition Value B", 260, 200);
    secondValue.mode = "RANDOM_INT";
    secondValue.useFixed = true;
    secondValue.fixedValue = "60";
    const first = conditionNode("A ≥ 50", 480, 40);
    first.left = { nodeId: firstValue.id };
    first.operator = "GTE";
    first.right = { value: "50" };
    const second = conditionNode("B ≥ 50", 480, 200);
    second.left = { nodeId: secondValue.id };
    second.operator = "GTE";
    second.right = { value: "50" };
    const all = logicNode("All Satisfied", 700, 120);
    all.operator = "AND";
    const success = executeNode("Send Success Notification", "toast", { message: { value: "Both conditions are satisfied" } }, 940, 40);
    const failure = executeNode("Send Failure Notification", "toast", { message: { value: "Not all conditions are satisfied" } }, 940, 200);
    workflow.nodes = [trigger, firstValue, secondValue, first, second, all, success, failure];
    workflow.connections = [
        connect(trigger, firstValue),
        connect(trigger, secondValue),
        connect(firstValue, first),
        connect(secondValue, second),
        connect(first, all),
        connect(second, all),
        connect(all, success, "true"),
        connect(all, failure, "false"),
    ];
    return workflow;
}
/** Builds a scheduled chat workflow that proactively sends a message through the host. */
function proactiveAiMessage() {
    const workflow = (0, model_1.newWorkflow)("AI Proactive Message (Scheduled)", "At 09:00 every day, opens the floating chat and sends a proactive message to the AI; disabled by default after import. Please review the content and time before enabling.");
    const trigger = triggerNode("Daily 09:00", 40, 120, "schedule");
    trigger.triggerConfig = {
        schedule_type: "cron",
        cron_expression: "0 9 * * *",
        enabled: "true",
        repeat: "true",
    };
    const start = executeNode("Start Chat Service", "start_chat_service", { initial_mode: { value: "WINDOW" }, keep_if_exists: { value: "true" } }, 280, 120);
    const create = executeNode("Create Workflow Conversation", "create_new_chat", { group: { value: "workflow" }, set_as_current_chat: { value: "true" } }, 520, 120);
    const send = executeNode("Send Proactive Message", "send_message_to_ai", {
        message: { value: "Good morning. Please proactively tell me the one thing most worth paying attention to today." },
        runtime: { value: "floating" },
        persist_turn: { value: "true" },
    }, 780, 120);
    workflow.nodes = [trigger, start, create, send];
    workflow.connections = [
        connect(trigger, start),
        connect(start, create),
        connect(create, send),
    ];
    return workflow;
}
/** Builds the built-in catalog used by both workflow UI implementations. */
function templates() {
    return [
        manualNotification(),
        randomConditionBranch(),
        webKeywordBranch(),
        extractionPipeline(),
        logicAndBranch(),
        proactiveAiMessage(),
    ];
}
