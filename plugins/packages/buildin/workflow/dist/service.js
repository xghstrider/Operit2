"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceManifestTemplates = replaceManifestTemplates;
exports.dispatch = dispatch;
exports.receive = receive;
exports.trigger = trigger;
const model_1 = require("./model");
const engine_1 = require("./engine");
const schedule_1 = require("./schedule");
const validation_1 = require("./validation");
let database = null;
let writes = Promise.resolve();
const active = new Map();
const launching = new Set();
/** Loads plugin-owned storage exactly once in the main runtime. */
async function load() {
    if (database === null)
        database = initialize();
    return database;
}
/** Marks unfinished records as interrupted after a runtime restart. */
async function initialize() {
    const db = await PluginConfig.use("workflows", { version: 2, workflows: [], runs: [], fired: {}, manifestTemplates: [] });
    if (db.version === 1) {
        db.version = 2;
        db.manifestTemplates = [];
        await PluginConfig.flush(db);
    }
    if (db.version !== 2)
        throw new Error(`Unsupported data version: ${db.version}`);
    const runs = (0, model_1.copy)(db.runs);
    let changed = false;
    for (const run of runs) {
        if (run.status !== "RUNNING")
            continue;
        changed = true;
        run.status = "FAILED";
        run.finishedAt = Date.now();
        run.logs.push({ time: Date.now(), nodeId: "", level: "error", message: "Runtime interrupted; this execution did not complete." });
        for (const node of Object.values(run.nodes))
            if (node.status === "running" || node.status === "pending") {
                node.status = "failed";
                node.output = "Runtime interrupted";
                node.finishedAt = Date.now();
            }
        const workflow = db.workflows.find(item => item.id === run.workflowId);
        if (workflow) {
            workflow.failedExecutions++;
            workflow.lastExecutionStatus = "FAILED";
        }
    }
    if (changed) {
        db.runs = runs;
        db.workflows = (0, model_1.copy)(db.workflows);
        await PluginConfig.flush(db);
    }
    return db;
}
/** Serializes durable writes and surfaces storage failures to every caller. */
async function persist(db) {
    writes = writes.then(() => PluginConfig.flush(db));
    await writes;
}
/** Returns detached state so UI edits cannot mutate stored definitions. */
async function snapshot() {
    const db = await load();
    return (0, model_1.copy)({ workflows: db.workflows, runs: db.runs, manifestTemplates: db.manifestTemplates });
}
/** Returns the persisted workflow snapshot together with host-owned tool schemas. */
async function toolCatalogSnapshot() {
    const result = await snapshot();
    result.tools = getToolCatalog().tools;
    return result;
}
/** Replaces one source package in the persisted manifest-template registry. */
async function replaceManifestTemplates(sourceToolPkgId, templates) {
    const db = await load();
    const retained = db.manifestTemplates.filter(item => item.sourceToolPkgId !== sourceToolPkgId);
    db.manifestTemplates = [...retained, ...(0, model_1.copy)(templates)];
    await persist(db);
}
/** Looks up an existing workflow by exact identity. */
function find(db, workflowId) {
    const workflow = db.workflows.find(item => item.id === workflowId);
    if (!workflow)
        throw new Error(`Workflow does not exist: ${workflowId}`);
    return workflow;
}
/** Rejects changes to a workflow while its saved snapshot is executing. */
function editable(workflowId) {
    if (active.has(workflowId))
        throw new Error("Workflow is currently executing; it can be modified or deleted only after it finishes");
}
/** Formats the actual tool output without hiding execution errors. */
function output(value) {
    if (typeof value === "string")
        return value;
    const text = JSON.stringify(value);
    if (text === undefined)
        throw new Error("The tool or script did not return a serializable result");
    return text;
}
/** Persists node transitions and execution statistics inside the owning runtime. */
async function record(db, run) {
    const previous = db.runs.find(item => item.id === run.id);
    const workflow = find(db, run.workflowId);
    if (!previous) {
        workflow.totalExecutions++;
        workflow.lastExecutionTime = run.startedAt;
    }
    if (run.status !== "RUNNING" && (previous === undefined || previous.status === "RUNNING")) {
        if (run.status === "SUCCESS")
            workflow.successfulExecutions++;
        if (run.status === "FAILED")
            workflow.failedExecutions++;
    }
    workflow.lastExecutionStatus = run.status;
    db.workflows = (0, model_1.copy)(db.workflows);
    const entries = db.runs.filter(item => item.id !== run.id);
    entries.push((0, model_1.copy)(run));
    const running = entries.filter(item => item.status === "RUNNING");
    const finished = entries.filter(item => item.status !== "RUNNING").sort((a, b) => b.startedAt - a.startedAt).slice(0, 100);
    db.runs = [...running, ...finished];
    await persist(db);
}
/** Executes a saved workflow independently of its UI route lifetime. */
async function runWorkflow(workflowId, triggerId, extras, observer, reserved = false) {
    const db = await load();
    if (!reserved)
        editable(workflowId);
    const workflow = (0, model_1.copy)(find(db, workflowId));
    if (!workflow.enabled)
        throw new Error("Workflow is disabled");
    const control = { cancelled: false };
    active.set(workflowId, control);
    try {
        await (0, engine_1.execute)(workflow, triggerId, extras, {
            /** Invokes host tools with their existing permission and error contracts. */
            call: async (name, params) => output(await toolCall(name, params)),
            /** Executes explicitly authored JavaScript with async host tool access. */
            script: async (code, inputs, trigger) => {
                const evaluate = new Function("inputs", "trigger", "Tools", "toolCall", `"use strict"; return (async function() {\n${code}\n})();`);
                return output(await evaluate(inputs, trigger, Tools, toolCall));
            },
            /** Publishes durable progress before notifying an attached UI observer. */
            changed: async (run) => {
                await record(db, run);
                if (observer)
                    await observer(run);
            },
            /** Checks cooperative cancellation between node executions. */
            cancelled: () => control.cancelled,
        });
    }
    finally {
        active.delete(workflowId);
    }
}
/** Starts a workflow without holding the caller context open for its full execution. */
async function startWorkflow(workflowId, triggerId, extras, observer) {
    if (active.has(workflowId) || launching.has(workflowId))
        throw new Error("Workflow is currently executing; it can be triggered again only after it finishes");
    launching.add(workflowId);
    void runWorkflow(workflowId, triggerId, extras, observer, true)
        .catch(error => console.error(`[workflow] Background execution failed for ${workflowId}: ${(0, engine_1.errorText)(error)}`))
        .finally(() => launching.delete(workflowId));
    return snapshot();
}
/** Owns all UI and tool mutations, with optimistic revisions for saved graphs. */
async function dispatch(request, observer) {
    const db = await load();
    switch (request.action) {
        case "list": return snapshot();
        case "tool_catalog": return toolCatalogSnapshot();
        case "create": {
            if (!request.name.trim())
                throw new Error("Workflow name cannot be empty");
            db.workflows = [...db.workflows, (0, model_1.newWorkflow)(request.name.trim(), request.description)];
            break;
        }
        case "save": {
            editable(request.workflow.id);
            const stored = find(db, request.workflow.id);
            if (stored.revision !== request.workflow.revision)
                throw new Error("The workflow has been modified elsewhere; please reload it before editing");
            const parsed = (0, validation_1.parseWorkflow)(request.workflow);
            const next = { ...stored, name: parsed.name, description: parsed.description, enabled: parsed.enabled, nodes: parsed.nodes,
                connections: parsed.connections, updatedAt: Date.now(), revision: stored.revision + 1 };
            (0, validation_1.validateGraph)(next, false);
            db.workflows = db.workflows.map(item => item.id === next.id ? next : item);
            break;
        }
        case "copy": {
            const next = (0, model_1.duplicate)(find(db, request.id));
            next.name += " copy";
            db.workflows = [...db.workflows, next];
            break;
        }
        case "delete": {
            request.ids.forEach(editable);
            db.workflows = db.workflows.filter(item => !request.ids.includes(item.id));
            db.runs = db.runs.filter(item => !request.ids.includes(item.workflowId));
            for (const key of Object.keys(db.fired))
                if (request.ids.some(workflowId => key.startsWith(workflowId + ":")))
                    delete db.fired[key];
            db.fired = { ...db.fired };
            break;
        }
        case "import": {
            const raw = JSON.parse(request.json);
            const next = (0, model_1.duplicate)((0, validation_1.parseWorkflow)(raw));
            next.enabled = false;
            db.workflows = [...db.workflows, next];
            break;
        }
        case "import_manifest_template": {
            const template = db.manifestTemplates.find(item => item.sourceToolPkgId === request.sourceToolPkgId && item.templateId === request.templateId);
            if (template === undefined)
                throw new Error(`Workflow template does not exist: ${request.sourceToolPkgId}/${request.templateId}`);
            const next = (0, model_1.duplicate)(template.workflow);
            next.name = template.displayName;
            next.description = template.description;
            next.enabled = false;
            db.workflows = [...db.workflows, next];
            break;
        }
        case "run":
            await runWorkflow(request.id, request.triggerId, request.extras, observer);
            return snapshot();
        case "start": return startWorkflow(request.id, request.triggerId, request.extras, observer);
        case "cancel": {
            const control = active.get(request.id);
            if (!control)
                throw new Error("This workflow has no execution in progress");
            control.cancelled = true;
            return snapshot();
        }
    }
    await persist(db);
    return snapshot();
}
/** Routes cross-runtime requests and keeps progress observers outside execution semantics. */
async function receive(request, meta) {
    const context = meta.callerContextKey;
    if (request.action !== "run" && request.action !== "start")
        return dispatch(request);
    if (context === undefined)
        return dispatch(request);
    const observer = async (run) => {
        // The UI context is awaiting this service call and cannot acknowledge progress yet.
        // Detach a snapshot so notification delivery never holds the execution lock.
        void ToolPkg.ipc.call("workflow.progress", (0, model_1.copy)(run), { targetRuntime: "ui", targetContextKey: context })
            .catch(error => { console.error("[workflow] Progress delivery failed", error); });
    };
    return request.action === "start"
        ? startWorkflow(request.id, request.triggerId, request.extras, observer)
        : dispatch(request, observer);
}
/** Creates a stable schedule identity including its exact configuration. */
function scheduleKey(workflow, node) {
    return `${workflow.id}:${node.id}:${JSON.stringify(Object.entries(node.triggerConfig).sort(([a], [b]) => a.localeCompare(b)))}`;
}
/** Delivers due triggers serially, preventing overlapping runs of one workflow. */
async function trigger(kind, topic = "", extras = {}) {
    const db = await load();
    for (const workflow of (0, model_1.copy)(db.workflows)) {
        if (!workflow.enabled || active.has(workflow.id))
            continue;
        for (const node of workflow.nodes) {
            if (node.type !== "trigger" || node.triggerType !== kind)
                continue;
            try {
                if (kind === "event" && node.triggerConfig.topic !== topic)
                    continue;
                if (kind === "schedule") {
                    const key = scheduleKey(workflow, node);
                    const last = Object.prototype.hasOwnProperty.call(db.fired, key) ? db.fired[key] : null;
                    if (!(0, schedule_1.isDue)(node, last, workflow.createdAt, Date.now()))
                        continue;
                    // Commit the firing before tools run so a restart cannot repeat a side effect.
                    db.fired = { ...db.fired, [key]: Date.now() };
                    await persist(db);
                }
                await runWorkflow(workflow.id, node.id, extras);
            }
            catch (error) {
                console.error(`[workflow] Trigger failed for ${workflow.id}/${node.id}: ${(0, engine_1.errorText)(error)}`);
                throw error;
            }
        }
    }
}
