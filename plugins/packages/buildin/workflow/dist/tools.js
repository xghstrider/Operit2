"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
exports.import_workflow = import_workflow;
exports.run = run;
exports.save = save;
exports.cancel = cancel;
const validation_1 = require("./validation");
/* METADATA
{
  "name": "workflow",
  "display_name": {"zh":"Workflow","en":"Workflow"},
  "description": {"zh":"Manage and execute visual workflows. Workflows are saved in the current plugin.","en":"Manage and execute plugin-owned visual workflows."},
  "tools": [
    {"name":"list","description":"List workflows and recent run records","parameters":[]},
    {"name":"import_workflow","description":"Import workflow JSON; generates a new ID, starts disabled, and returns the import result.","parameters":[{"name":"json","type":"string","required":true,"description":"Workflow JSON"}]},
    {"name":"run","description":"Run an enabled workflow; tool calls run with host permissions.","parameters":[{"name":"id","type":"string","required":true,"description":"Workflow ID"},{"name":"triggerId","type":"string","required":false,"description":"Specified trigger node ID"}]},
    {"name":"save","description":"Update a workflow; the revision returned by list must be preserved to prevent overwriting other edits.","parameters":[{"name":"json","type":"string","required":true,"description":"Full Workflow JSON including the revision"}]},
    {"name":"cancel","description":"Request cancellation of subsequent execution after the current node finishes","parameters":[{"name":"id","type":"string","required":true,"description":"Workflow ID"}]}
  ]
}
*/
const workflowServiceName = "workflow.service";
/** Calls the one main-runtime owner shared by UI, tools and schedules. */
function call(request) { return ToolPkg.ipc.call(workflowServiceName, request, { targetRuntime: "main" }); }
/** Lists workflows together with retained execution records. */
async function list() { return call({ action: "list" }); }
/** Imports a new disabled workflow after structural validation. */
async function import_workflow(params) { return call({ action: "import", json: params.json }); }
/** Executes all entry nodes or one explicitly selected trigger. */
async function run(params) {
    return call({ action: "run", id: params.id, triggerId: params.triggerId === undefined ? null : params.triggerId, extras: {} });
}
/** Updates an existing graph using the caller's exact saved revision. */
async function save(params) {
    const raw = (0, validation_1.object)(JSON.parse(params.json), "workflow");
    const workflow = (0, validation_1.parseWorkflow)(raw);
    if (typeof raw.revision !== "number" || !Number.isSafeInteger(raw.revision))
        throw new Error("revision must be an integer");
    workflow.revision = raw.revision;
    return call({ action: "save", workflow });
}
/** Requests cooperative cancellation without claiming to interrupt host tools. */
async function cancel(params) { return call({ action: "cancel", id: params.id }); }
