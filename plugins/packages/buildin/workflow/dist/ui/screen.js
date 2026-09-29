"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = screen;
const model_1 = require("../model");
const engine_1 = require("../engine");
const validation_1 = require("../validation");
const templates_1 = require("../templates");
const canvas_1 = require("./canvas");
const forms_1 = require("./forms");
/** Formats timestamps with the compact date layout used by the original list. */
function date(value) {
    const d = new Date(value);
    /** Pads one calendar component to two digits. */
    const pad = (part) => String(part).padStart(2, "0");
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
}
/** Describes the elapsed time since the most recent execution. */
function relative(value) {
    const minutes = Math.floor((Date.now() - value) / 60000);
    if (minutes < 1)
        return "Just now";
    if (minutes < 60)
        return minutes + " minutes ago";
    if (minutes < 1440)
        return Math.floor(minutes / 60) + " hours ago";
    return Math.floor(minutes / 1440) + " days ago";
}
/** Maps persisted run state to the original Material status presentation. */
function status(run) {
    return {
        SUCCESS: { text: "Execution Succeeded", color: "tertiary", icon: "CheckCircle" },
        FAILED: { text: "Execution Failed", color: "error", icon: "Error" },
        RUNNING: { text: "Executing", color: "primary", icon: "PlayCircle" },
        CANCELLED: { text: "Cancelled", color: "onSurfaceVariant", icon: "Close" },
    }[run];
}
/** Reproduces the Kotlin list, speed dial, graph, and transactional editing dialogs. */
function screen(ctx) {
    const UI = ctx.UI;
    const [state, setState] = ctx.useState("workflow-ui", {
        width: 0, tools: [],
        snapshot: { workflows: [], runs: [], manifestTemplates: [] }, workflow: null, ready: false, busy: false, saving: false, error: "",
        menu: false, selectionMode: false, marked: [], modal: "", name: "", description: "", enabled: true, text: "", path: "",
        selected: null, nodeDraft: null, adding: false, schedule: null, edgeId: null, conditionMode: "default",
        viewport: { x: 0, y: 0, zoom: 1, width: 0, height: 0 }, fitted: false, latest: null, logId: null, logNode: null,
    });
    const live = ctx.useRef("workflow-live", state);
    live.current = state;
    const drag = ctx.useRef("workflow-drag", { nodeId: null, before: null });
    /** Updates the current frame without losing asynchronous changes. */
    function update(patch) {
        const next = { ...live.current, ...patch };
        live.current = next;
        setState(next);
    }
    /** Reports failures both in the host log and on the active page or dialog. */
    async function perform(action) {
        try {
            update({ error: "" });
            await action();
        }
        catch (error) {
            console.error("[workflow UI]", error);
            update({ error: (0, engine_1.errorText)(error) });
        }
    }
    /** Resolves the selected workflow as an explicit precondition for editor actions. */
    function current() {
        const workflow = live.current.workflow;
        if (workflow === null)
            throw new Error("No workflow is being edited");
        return workflow;
    }
    /** Refreshes plugin data and the selected saved workflow from the main runtime. */
    async function request(message) {
        const result = await ToolPkg.ipc.call("workflow.service", message, { targetRuntime: "main" });
        const selected = live.current.workflow;
        const workflow = selected === null ? null : result.workflows.find(item => item.id === selected.id);
        const tools = result.tools === undefined ? live.current.tools : result.tools;
        update({ snapshot: { ...result, tools }, tools, ready: true, workflow: workflow === undefined ? null : workflow,
            marked: live.current.marked.filter(value => result.workflows.some(item => item.id === value)) });
        return { ...result, tools };
    }
    /** Saves one completed edit, keeping the modal available when validation fails. */
    async function commit(workflow) {
        if (live.current.busy || live.current.saving)
            throw new Error("Please wait for the current operation to complete");
        (0, validation_1.validateGraph)(workflow, false);
        update({ saving: true });
        try {
            await request({ action: "save", workflow });
        }
        finally {
            update({ saving: false });
        }
    }
    /** Opens a saved graph and requests an initial centered fit after measurement. */
    function open(workflow) {
        const runs = live.current.snapshot.runs.filter(item => item.workflowId === workflow.id).sort((a, b) => b.startedAt - a.startedAt);
        update({ workflow: (0, model_1.copy)(workflow), selected: null, modal: "", menu: false, fitted: false,
            latest: runs.length === 0 ? null : runs[0], viewport: { ...live.current.viewport, x: 0, y: 0, zoom: 1 } });
    }
    /** Opens the graph created by an operation that appends exactly one workflow. */
    function openCreated(snapshot) {
        const workflow = snapshot.workflows[snapshot.workflows.length - 1];
        if (workflow === undefined)
            throw new Error("The create result is missing a workflow");
        open(workflow);
    }
    /** Creates a compact dialog action with consistent failure handling. */
    function button(text, action, enabled = true, danger = false) {
        return UI.TextButton({ text, enabled: enabled && !state.saving, contentColor: danger ? "error" : "primary", onClick: () => perform(action) });
    }
    /** Creates a labeled Material icon button. */
    function iconButton(icon, label, action, enabled = true) {
        return UI.IconButton({ key: label, enabled: enabled && !state.saving, onClick: () => perform(action) }, UI.Icon({ name: icon, contentDescription: label, size: 22 }));
    }
    /** Closes editing without applying its detached draft to persisted data. */
    function dismiss() { update({ modal: "", nodeDraft: null, schedule: null, error: "" }); }
    /** Presents bounded, scrollable content and keeps actions outside the scroll area. */
    function dialog(key, title, body, actions, bodyHeight, close = dismiss) {
        return UI.Dialog({ key, onDismissRequest: close, closeOnDismissRequest: false,
            properties: { usePlatformDefaultWidth: false }, shape: { cornerRadius: 28 }, containerColor: "surfaceContainerHigh",
        }, UI.Column({ width: Math.min(560, Math.max(0, state.width - 32)), modifier: ctx.Modifier.heightIn(0, 650), padding: 24, spacing: 16 }, [
            UI.Text({ text: title, style: "headlineSmall" }),
            UI.LazyColumn({ key: key + ":body", weight: 1, weightFill: false, height: bodyHeight, fillMaxWidth: true, spacing: 12 }, [
                ...body, ...(state.error ? [UI.Text({ text: state.error, color: "error", key: "dialog-error" })] : []),
            ]),
            UI.FlowRow({ fillMaxWidth: true, horizontalArrangement: "end", spacing: 8 }, actions),
        ]));
    }
    /** Opens a detached node form, including node type selection when adding. */
    function showNode(node) {
        const v = live.current.viewport;
        const created = (0, model_1.newNode)("trigger");
        created.position = (0, canvas_1.snapPosition)((v.width / 2 - v.x) / v.zoom - 60, (v.height / 2 - v.y) / v.zoom - 40);
        update({ modal: "node", adding: node === null, nodeDraft: node === null ? created : (0, model_1.copy)(node), menu: false });
    }
    /** Persists an accepted node form; cancelling never inserts an unfinished node. */
    async function saveNode() {
        const node = live.current.nodeDraft;
        if (node === null)
            throw new Error("The node draft does not exist");
        const workflow = current();
        await commit({ ...workflow, nodes: live.current.adding ? [...workflow.nodes, node] : workflow.nodes.map(item => item.id === node.id ? node : item) });
        fit();
        dismiss();
    }
    /** Executes the saved graph and displays the completed execution result. */
    async function run() {
        const workflow = current();
        update({ busy: true, latest: null, menu: false });
        try {
            const snapshot = await request({ action: "run", id: workflow.id, triggerId: null, extras: {} });
            const runs = snapshot.runs.filter(item => item.workflowId === workflow.id).sort((a, b) => b.startedAt - a.startedAt);
            if (runs.length === 0)
                throw new Error("Execution finished but no run record was returned");
            update({ latest: runs[0], modal: "result" });
        }
        finally {
            update({ busy: false });
        }
    }
    /** Deletes a node and its edges after checking every parameter reference. */
    async function removeNode() {
        const workflow = current(), nodeId = live.current.selected;
        const dependents = workflow.nodes.filter(node => node.id !== nodeId && (0, model_1.values)(node).some(value => "nodeId" in value && value.nodeId === nodeId));
        if (dependents.length)
            throw new Error("Modify the parameter references of these nodes first: " + dependents.map(node => node.name).join(", "));
        await commit({ ...workflow, nodes: workflow.nodes.filter(node => node.id !== nodeId),
            connections: workflow.connections.filter(edge => edge.sourceNodeId !== nodeId && edge.targetNodeId !== nodeId) });
        update({ selected: null, fitted: false });
        fit();
        dismiss();
    }
    /** Fits graph bounds with the same 48dp padding and zoom limits as Kotlin. */
    function fit() {
        const workflow = live.current.workflow;
        const viewport = live.current.viewport;
        if (workflow !== null)
            update({ viewport: (0, canvas_1.fitViewport)(workflow, viewport),
                fitted: viewport.width > 0 && viewport.height > 0 && workflow.nodes.length > 0 });
    }
    /** Registers progress observation and loads state through the real main IPC service. */
    async function initialize() {
        ToolPkg.ipc.on("workflow.progress", progress => {
            const latest = live.current.latest;
            if (live.current.workflow?.id !== progress.workflowId)
                return true;
            if (latest !== null && (latest.startedAt > progress.startedAt ||
                (latest.id === progress.id && latest.finishedAt !== null)))
                return true;
            update({ latest: progress });
            return true;
        });
        await request({ action: "tool_catalog" });
    }
    /** Renders the original execution result strip inside a workflow card. */
    function executionStatus(workflow) {
        if (workflow.lastExecutionStatus === null)
            return [];
        const s = status(workflow.lastExecutionStatus);
        const rate = workflow.totalExecutions === 0 ? 0 : Math.floor(workflow.successfulExecutions / workflow.totalExecutions * 100);
        return [UI.Row({ fillMaxWidth: true, paddingHorizontal: 10, paddingVertical: 8, spacing: 6, verticalAlignment: "center",
                modifier: ctx.Modifier.background(ctx.MaterialTheme.colorScheme[s.color].copy({ alpha: 0.08 }), { cornerRadius: 8 }),
            }, [
                UI.Icon({ name: s.icon, size: 16, tint: s.color }),
                UI.Column({ weight: 1, spacing: 2 }, [
                    UI.Text({ text: s.text, style: "labelMedium", color: s.color }),
                    ...(workflow.lastExecutionTime === null ? [] : [UI.Text({ text: relative(workflow.lastExecutionTime), fontSize: 10, color: "onSurfaceVariant" })]),
                ]),
                ...(workflow.totalExecutions > 0 && workflow.lastExecutionStatus !== "RUNNING" ? [UI.Text({ text: rate + "%", style: "labelLarge",
                        color: rate >= 80 ? "tertiary" : rate >= 50 ? "primary" : "error" })] : []),
            ])];
    }
    /** Selects or deselects an item only while explicit multi-selection is active. */
    function mark(workflow) {
        const marked = live.current.marked;
        update({ marked: marked.includes(workflow.id) ? marked.filter(item => item !== workflow.id) : [...marked, workflow.id] });
    }
    /** Renders the outlined, clickable 18dp-padded card from WorkflowListScreen.kt. */
    function workflowCard(workflow) {
        const selected = state.marked.includes(workflow.id);
        return UI.Card({ key: workflow.id, fillMaxWidth: true, elevation: 0, shape: { cornerRadius: 12 },
            containerColor: selected ? "primaryContainer" : "surface", containerAlpha: selected ? 0.3 : 1,
            border: { width: 1, color: "outlineVariant" },
            modifier: ctx.Modifier.clickable(() => state.selectionMode ? mark(workflow) : open(workflow)),
        }, UI.Column({ padding: 18, spacing: 12, fillMaxWidth: true }, [
            UI.Row({ fillMaxWidth: true, verticalAlignment: "center", spacing: 8 }, [
                UI.Text({ text: workflow.name, style: "titleMedium", fontWeight: "medium", maxLines: 1, overflow: "ellipsis", weight: 1 }),
                ...(!workflow.enabled ? [UI.Text({ text: "Disabled", fontSize: 10, color: "error", paddingHorizontal: 6, paddingVertical: 2,
                        modifier: ctx.Modifier.background(ctx.MaterialTheme.colorScheme.errorContainer.copy({ alpha: 0.5 }), { cornerRadius: 4 }) })] : []),
                state.selectionMode
                    ? UI.Checkbox({ checked: selected, onCheckedChange: () => mark(workflow) })
                    : UI.Switch({ checked: workflow.enabled, modifier: ctx.Modifier.scale(0.82), onCheckedChange: (enabled) => perform(async () => {
                            await request({ action: "save", workflow: { ...workflow, enabled } });
                        }) }),
            ]),
            ...(workflow.description ? [UI.Text({ text: workflow.description, style: "bodySmall", color: "onSurfaceVariant", maxLines: 2, overflow: "ellipsis" })] : []),
            ...executionStatus(workflow),
            UI.Row({ fillMaxWidth: true, spacing: 4, verticalAlignment: "center" }, [
                UI.Text({ text: String(workflow.nodes.length), style: "labelMedium", fontWeight: "semibold", color: "primary" }),
                UI.Text({ text: "Nodes", style: "labelSmall", color: "onSurfaceVariant" }),
                ...(workflow.totalExecutions > 0 ? [UI.Icon({ name: "PlayCircle", size: 14, tint: "onSurfaceVariant", paddingStart: 8 }),
                    UI.Text({ text: String(workflow.totalExecutions), style: "labelSmall", color: "onSurfaceVariant" })] : []),
                UI.Box({ weight: 1 }),
                UI.Text({ text: date(workflow.updatedAt), style: "labelSmall", color: "onSurfaceVariant", maxLines: 1 }),
            ]),
        ]));
    }
    /** Groups compact cards by available width without platform-specific layout rules. */
    function cardRows() {
        const columns = Math.max(1, Math.floor((state.width - 28) / 372));
        const rows = [];
        for (let start = 0; start < state.snapshot.workflows.length; start += columns) {
            const items = state.snapshot.workflows.slice(start, start + columns);
            rows.push(UI.Row({ key: "workflow-row:" + start, fillMaxWidth: true, spacing: 12, verticalAlignment: "start" }, Array.from({ length: columns }, (_, index) => UI.Box({ weight: 1 }, index < items.length ? [workflowCard(items[index])] : []))));
        }
        return rows;
    }
    /** Renders the centered empty state or responsive scrollable card rows. */
    function listView() {
        if (!state.ready)
            return UI.Box({ fillMaxSize: true, contentAlignment: "center" }, state.error ? button("Reload", initialize) : UI.CircularProgressIndicator());
        if (state.snapshot.workflows.length === 0)
            return UI.Box({ fillMaxSize: true, contentAlignment: "center", padding: 24 }, UI.Column({ horizontalAlignment: "center", spacing: 8 }, [
                UI.Box({ width: 72, height: 72, contentAlignment: "center",
                    modifier: ctx.Modifier.background(ctx.MaterialTheme.colorScheme.primaryContainer.copy({ alpha: 0.3 }), { cornerRadius: 36 }) }, UI.Text({ text: "⚡", fontSize: 45 })),
                UI.Spacer({ height: 16 }),
                UI.Text({ text: "Start Building Workflows", style: "headlineSmall", fontWeight: "semibold" }),
                UI.Text({ text: "Automate your task flows", style: "bodyMedium", color: "onSurfaceVariant" }),
                UI.Spacer({ height: 24 }),
                UI.FilledTonalButton({ text: "+  New Workflow", height: 48, onClick: () => update({ modal: "create", name: "", description: "" }) }),
            ]));
        return UI.LazyColumn({ fillMaxSize: true, padding: 20, spacing: 12 }, [
            ...(state.selectionMode ? [UI.Card({ fillMaxWidth: true, elevation: 0, containerColor: "surfaceVariant" }, UI.Row({ padding: 12, spacing: 4, verticalAlignment: "center" }, [
                    UI.Text({ text: "Selected " + state.marked.length + " / " + state.snapshot.workflows.length, weight: 1, style: "bodyMedium" }),
                    button("Select All", () => update({ marked: state.snapshot.workflows.map(item => item.id) })),
                    button("Clear", () => update({ marked: [] })),
                ]))] : []),
            ...cardRows(),
            UI.Spacer({ height: 72 }),
        ]);
    }
    /** Renders the inset graph and persists positions only after a completed grid-snapped drag. */
    function editor(workflow) {
        return UI.Column({ fillMaxSize: true }, [
            UI.Row({ fillMaxWidth: true, spacing: 4, verticalAlignment: "center" }, [
                iconButton("ArrowBack", "Back to Workflow List", () => update({ workflow: null, menu: false, modal: "" }), !state.busy && !state.saving),
                UI.TextButton({ key: "Back to List Button", text: "Back to Workflow List", enabled: !state.busy && !state.saving,
                    onClick: () => update({ workflow: null, menu: false, modal: "" }) }),
                UI.Text({ text: workflow.name, style: "titleMedium", weight: 1, maxLines: 1, overflow: "ellipsis" }),
            ]),
            UI.Box({ weight: 1, fillMaxWidth: true, paddingHorizontal: 16, paddingVertical: 8 }, workflow.nodes.length === 0
                ? UI.Box({ fillMaxSize: true, background: "surfaceVariant", contentAlignment: "center" }, UI.Column({ padding: 24, spacing: 8, horizontalAlignment: "center" }, [
                    UI.Text({ text: "📋", fontSize: 45 }),
                    UI.Text({ text: "No nodes yet", style: "bodyLarge", color: "onSurfaceVariant" }),
                    UI.Text({ text: "Tap the + button in the bottom right corner to add nodes", style: "bodyMedium", color: "onSurfaceVariant" }),
                    button("Back to Workflow List", () => update({ workflow: null, menu: false, modal: "" }), !state.busy),
                ]))
                : (0, canvas_1.graphCanvas)(ctx, workflow, {
                    viewport: state.viewport, run: state.latest, dragging: drag.current.nodeId,
                    menu: nodeId => update({ selected: nodeId, modal: "nodeMenu", menu: false }),
                    fit,
                    begin: nodeId => { drag.current = { nodeId: state.busy || state.saving ? null : nodeId, before: (0, model_1.copy)(live.current.workflow) }; },
                    drag: (dx, dy) => {
                        const latest = live.current, selected = drag.current.nodeId;
                        if (selected === null)
                            update({ viewport: { ...latest.viewport, x: latest.viewport.x + dx, y: latest.viewport.y + dy } });
                        else
                            update({ workflow: { ...current(), nodes: current().nodes.map(node => node.id === selected
                                        ? { ...node, position: { x: node.position.x + dx / latest.viewport.zoom, y: node.position.y + dy / latest.viewport.zoom } } : node) } });
                    },
                    end: () => perform(async () => {
                        const nodeId = drag.current.nodeId;
                        drag.current = { nodeId: null, before: null };
                        if (nodeId === null)
                            return;
                        const moved = current();
                        await commit({ ...moved, nodes: moved.nodes.map(node => node.id === nodeId
                                ? { ...node, position: (0, canvas_1.snapPosition)(node.position.x, node.position.y) } : node) });
                    }),
                    cancel: () => {
                        const before = drag.current.before;
                        if (drag.current.nodeId !== null && before !== null)
                            update({ workflow: before });
                        drag.current = { nodeId: null, before: null };
                    },
                    transform: (x, y, zoom) => update({ viewport: { ...live.current.viewport, x, y, zoom } }),
                    resize: (width, height) => {
                        if (width === live.current.viewport.width && height === live.current.viewport.height)
                            return;
                        update({ viewport: { ...live.current.viewport, width, height } });
                        if (!live.current.fitted)
                            fit();
                    },
                })),
        ]);
    }
    /** Builds the expanding bottom-right action menu used by both Kotlin screens. */
    function speedDial() {
        const actions = [];
        if (state.workflow === null) {
            if (state.selectionMode) {
                if (state.marked.length)
                    actions.push({ label: "Delete Selected (" + state.marked.length + ")", icon: "Delete", danger: true, action: () => update({ modal: "delete" }) });
                actions.push({ label: "Exit Multi-Select", icon: "CheckCircle", action: () => update({ selectionMode: false, marked: [] }) });
            }
            else
                actions.push({ label: "Create Blank Workflow", icon: "Add", action: () => update({ modal: "create", name: "", description: "" }) }, { label: "Create from Template", icon: "PlayCircle", action: () => update({ modal: "templates" }) }, { label: "Multi-Select", icon: "CheckCircle", action: () => update({ selectionMode: true, marked: [] }) }, { label: "Import Workflow", icon: "FileUpload", action: () => update({ modal: "import", text: "" }) });
        }
        else {
            if (state.workflow.enabled || state.busy)
                actions.push({ label: state.busy ? "Cancel Execution" : "Trigger Workflow", icon: state.busy ? "Close" : "PlayArrow",
                    action: state.busy ? async () => { await request({ action: "cancel", id: current().id }); } : run });
            actions.push({ label: "View Logs", icon: "Call", action: async () => { await request({ action: "list" }); update({ modal: "logs", logId: null, logNode: null }); } }, { label: "Add Node", icon: "Add", enabled: !state.busy, action: () => showNode(null) }, { label: "Edit Workflow", icon: "Edit", enabled: !state.busy, action: () => {
                    const workflow = current();
                    update({ modal: "meta", name: workflow.name, description: workflow.description, enabled: workflow.enabled });
                } }, { label: "Delete Workflow", icon: "Delete", enabled: !state.busy, danger: true, action: () => update({ modal: "delete" }) });
        }
        return UI.Column({ key: "workflow-speed-dial", modifier: ctx.Modifier.align("bottomEnd").heightIn(0, 440),
            padding: 16, spacing: 16, horizontalAlignment: "end",
        }, [
            ...(state.menu ? [UI.LazyColumn({ key: "speed-dial-actions", weight: 1, weightFill: false, height: actions.length * 56, width: 260, spacing: 16 }, actions.map(item => UI.Row({ key: item.label, fillMaxWidth: true, horizontalArrangement: "end", verticalAlignment: "center", spacing: 12 }, [
                    UI.Box({ weight: 1, contentAlignment: "end" }, UI.Surface({ shape: { cornerRadius: 8 }, containerColor: "surface",
                        ...(item.enabled !== false && !state.saving ? { onClick: () => perform(async () => { update({ menu: false }); await item.action(); }) } : {}),
                    }, UI.Text({ text: item.label, paddingHorizontal: 12, paddingVertical: 8, style: "labelLarge" }))),
                    UI.SmallFloatingActionButton({ key: item.label + ":fab", icon: item.icon, shape: { cornerRadius: 12 },
                        enabled: item.enabled !== false && !state.saving,
                        containerColor: item.danger ? "errorContainer" : "primaryContainer", contentColor: item.danger ? "onErrorContainer" : "onPrimaryContainer",
                        onClick: () => perform(async () => { update({ menu: false }); await item.action(); }),
                    }),
                ])))] : []),
            UI.FloatingActionButton({ key: "workflow-menu", icon: state.menu ? "Close" : "Add", shape: { cornerRadius: 16 },
                containerColor: "primary", contentColor: "onPrimary", onClick: () => update({ menu: !live.current.menu }) }),
        ]);
    }
    /** Renders existing outgoing edges and available target cards in the connection dialog. */
    function connections(workflow, source) {
        const outgoing = workflow.connections.filter(edge => edge.sourceNodeId === source.id);
        const targets = workflow.nodes.filter(node => node.id !== source.id && !outgoing.some(edge => edge.targetNodeId === node.id));
        return [
            UI.Text({ text: "Source node: " + source.name, style: "bodyMedium", color: "onSurfaceVariant" }),
            ...(outgoing.length ? [UI.Text({ text: "Existing Connections", style: "titleSmall", color: "primary" })] : []),
            ...outgoing.map(edge => {
                const target = workflow.nodes.find(node => node.id === edge.targetNodeId);
                return UI.Card({ fillMaxWidth: true, elevation: 0, containerColor: "errorContainer", containerAlpha: 0.3 }, UI.Row({ padding: 12, verticalAlignment: "center" }, [
                    UI.Column({ weight: 1, spacing: 4 }, [UI.Text({ text: target.name }), UI.Text({ text: "→ " + (edge.condition === null
                                ? source.type === "condition" || source.type === "logic" ? "Default true branch" : "Unconditional" : edge.condition), style: "bodySmall", color: "onSurfaceVariant" })]),
                    iconButton("Edit", "Edit Connection Condition", () => update({ modal: "condition", edgeId: edge.id, text: edge.condition === null ? "" : edge.condition,
                        conditionMode: edge.condition === null || edge.condition === "" ? "default" : edge.condition === "false" ? "false" : "custom" })),
                    iconButton("Delete", "Delete Connection", async () => { await commit({ ...current(), connections: current().connections.filter(item => item.id !== edge.id) }); }, !state.busy),
                ]));
            }),
            ...(outgoing.length ? [UI.HorizontalDivider()] : []),
            UI.Text({ text: targets.length ? "Select target node" : "No nodes available to connect", style: "titleSmall", color: "primary" }),
            ...targets.map(target => UI.Card({ fillMaxWidth: true, elevation: 0, containerColor: "surfaceVariant" }, UI.Row({ padding: 12, spacing: 8, verticalAlignment: "center" }, [
                UI.Text({ text: target.type === "trigger" ? "🎯" : "⚙️" }),
                UI.Column({ weight: 1, spacing: 4 }, [UI.Text({ text: target.name }), ...(target.description ? [UI.Text({ text: target.description, style: "bodySmall", maxLines: 1 })] : [])]),
                iconButton("Add", "Connect to " + target.name, async () => {
                    const next = (0, model_1.copy)(current());
                    next.connections.push({ id: (0, model_1.id)("edge"), sourceNodeId: source.id, targetNodeId: target.id, condition: null });
                    await commit(next);
                }, !state.busy),
            ]))),
        ];
    }
    /** Shows run metadata and filters node output when invoked from a node menu. */
    function logs(workflow) {
        const runs = state.snapshot.runs.filter(run => run.workflowId === workflow.id).sort((a, b) => b.startedAt - a.startedAt);
        if (state.latest !== null && state.latest.workflowId === workflow.id) {
            const index = runs.findIndex(run => run.id === state.latest.id);
            if (index >= 0)
                runs[index] = state.latest;
            else
                runs.unshift(state.latest);
        }
        const selected = state.logId === null ? runs[0] : runs.find(run => run.id === state.logId);
        if (selected === undefined)
            return [UI.Text({ text: "No execution logs yet" })];
        return [
            ...(runs.length > 1 ? [(0, forms_1.choose)(ctx, "run-history", "Execution Records", selected.id, runs.map(run => ({ value: run.id, label: date(run.startedAt) + " · " + status(run.status).text })), logId => update({ logId }))] : []),
            UI.Text({ text: status(selected.status).text, style: "titleMedium", color: status(selected.status).color }),
            UI.Text({ text: "Start time: " + date(selected.startedAt), style: "bodySmall" }),
            ...(selected.finishedAt === null ? [] : [UI.Text({ text: "Duration: " + (selected.finishedAt - selected.startedAt) + " ms", style: "bodySmall" })]),
            UI.HorizontalDivider(),
            ...Object.entries(selected.nodes).filter(([nodeId]) => state.logNode === null || nodeId === state.logNode).map(([nodeId, result]) => {
                const node = workflow.nodes.find(item => item.id === nodeId);
                return UI.Column({ spacing: 6 }, [
                    UI.Text({ text: (node === undefined ? nodeId : node.name) + " · " + result.status, style: "titleSmall" }),
                    UI.Text({ text: result.output, fontSize: 12 }),
                ]);
            }),
            ...selected.logs.filter(entry => state.logNode === null || entry.nodeId === state.logNode).map(entry => UI.Text({ text: new Date(entry.time).toLocaleTimeString() + " " + entry.message, fontSize: 12, color: entry.level === "error" ? "error" : "onSurfaceVariant" })),
        ];
    }
    /** Renders every edit as an explicit confirm/cancel transaction, like the Kotlin dialogs. */
    function modal() {
        const workflow = state.workflow;
        const node = workflow === null ? undefined : workflow.nodes.find(item => item.id === state.selected);
        const cancel = button("Cancel", dismiss);
        const close = button("Close", dismiss);
        switch (state.modal) {
            case "": return [];
            case "create": return [dialog("create", "Create Workflow", [
                    (0, forms_1.field)(ctx, "create-name", "Workflow Name", state.name, name => update({ name })),
                    (0, forms_1.field)(ctx, "create-description", "Workflow Description", state.description, description => update({ description }), true),
                ], [close, button("Create", async () => openCreated(await request({ action: "create", name: live.current.name, description: live.current.description })), state.name.trim().length > 0)], 212)];
            case "templates": {
                const options = [
                    ...(0, templates_1.templates)().map(template => ({ key: `builtin:${template.id}`, name: template.name, description: template.description, builtin: template })),
                    ...state.snapshot.manifestTemplates.map(template => ({ key: `${template.sourceToolPkgId}:${template.templateId}`, name: template.displayName, description: template.description, manifest: template })),
                ];
                return [dialog("templates", "Select Template", options.map(option => UI.Card({
                        key: option.key,
                        fillMaxWidth: true, elevation: 0, containerColor: "surfaceVariant",
                        modifier: ctx.Modifier.clickable(() => perform(async () => {
                            const result = "builtin" in option
                                ? await request({ action: "import", json: JSON.stringify(option.builtin) })
                                : await request({ action: "import_manifest_template", sourceToolPkgId: option.manifest.sourceToolPkgId, templateId: option.manifest.templateId });
                            openCreated(result);
                        })),
                    }, UI.Column({ padding: 16, spacing: 8 }, [UI.Text({ text: option.name, style: "titleMedium" }), UI.Text({ text: option.description, style: "bodySmall", color: "onSurfaceVariant" })]))), [close], 320)];
            }
            case "meta": return [dialog("meta", "Edit Workflow", [
                    (0, forms_1.field)(ctx, "workflow-name", "Workflow Name", state.name, name => update({ name })),
                    (0, forms_1.field)(ctx, "workflow-description", "Workflow Description", state.description, description => update({ description }), true),
                    UI.Row({ fillMaxWidth: true, verticalAlignment: "center" }, [UI.Text({ text: "Enable Workflow", weight: 1 }), UI.Switch({ checked: state.enabled, onCheckedChange: (enabled) => update({ enabled }) })]),
                    UI.FlowRow({ spacing: 8 }, [
                        button("Export JSON", () => update({ modal: "export", text: JSON.stringify(current(), null, 2), path: "" })),
                        button("Copy Workflow", async () => { await request({ action: "copy", id: current().id }); await ctx.showToast("Workflow copied"); }),
                    ]),
                ], [cancel, button("Save", async () => { await commit({ ...current(), name: live.current.name, description: live.current.description, enabled: live.current.enabled }); dismiss(); }, state.name.trim().length > 0 && !state.busy)], 340)];
            case "node": {
                const draft = state.nodeDraft;
                if (draft === null || workflow === null)
                    throw new Error("The node editing context does not exist");
                const dialogs = [dialog("node:" + draft.id, state.adding ? "Add Node" : "Edit Node", [
                        ...(state.adding ? [(0, forms_1.choose)(ctx, "node-type", "Node Type", draft.type, Object.keys(model_1.STYLES).map(value => ({ value, label: model_1.STYLES[value].label + " Node" })), value => {
                                const next = (0, model_1.newNode)(value);
                                update({ nodeDraft: { ...next, id: draft.id, position: draft.position } });
                            })] : []),
                        ...(0, forms_1.nodeForm)(ctx, workflow, draft, state.tools, nodeDraft => update({ nodeDraft }), () => update({ schedule: (0, model_1.copy)(live.current.nodeDraft) })),
                    ], [cancel, button(state.adding ? "Add" : "Save", saveNode, !state.busy)], 440)];
                const schedule = state.schedule;
                if (schedule !== null && schedule.type === "trigger")
                    dialogs.push(dialog("schedule", "Schedule Configuration", (0, forms_1.scheduleForm)(ctx, schedule, value => update({ schedule: value })), [
                        button("Cancel", () => update({ schedule: null })),
                        button("Confirm", () => update({ nodeDraft: live.current.schedule, schedule: null })),
                    ], 400, () => update({ schedule: null })));
                return dialogs;
            }
            case "nodeMenu": {
                if (node === undefined)
                    throw new Error("The selected node does not exist");
                return [dialog("node-menu", node.name, [
                        UI.TextButton({ text: "✎  Edit Node", fillMaxWidth: true, enabled: !state.busy, onClick: () => showNode(node) }),
                        UI.TextButton({ text: "☎  View Logs", fillMaxWidth: true, onClick: () => update({ modal: "logs", logNode: node.id, logId: null }) }),
                        UI.TextButton({ text: "↗  Create Connection", fillMaxWidth: true, enabled: !state.busy, onClick: () => update({ modal: "connections" }) }),
                        UI.TextButton({ text: "Delete Node", contentColor: "error", fillMaxWidth: true, enabled: !state.busy, onClick: () => update({ modal: "deleteNode" }) }),
                    ], [cancel], 236)];
            }
            case "connections":
                if (workflow === null || node === undefined)
                    throw new Error("The edge editing context does not exist");
                return [dialog("connections", "Manage Connections", connections(workflow, node), [close], 400)];
            case "condition": {
                const edge = current().connections.find(item => item.id === state.edgeId);
                if (edge === undefined)
                    throw new Error("The edge does not exist");
                const source = current().nodes.find(item => item.id === edge.sourceNodeId);
                const target = current().nodes.find(item => item.id === edge.targetNodeId);
                const choices = [
                    { value: "default", label: source.type === "condition" || source.type === "logic" ? "Default (true branch)" : "Default (unconditional)" },
                    { value: "false", label: "false branch" }, { value: "custom", label: "Custom (regular expression / success or failure branch)" },
                ];
                return [dialog("condition", "Edit Connection Condition", [
                        UI.Text({ text: source.name + " → " + target.name, style: "bodyMedium" }),
                        ...choices.map(choice => UI.Row({ verticalAlignment: "center", spacing: 8 }, [
                            UI.RadioButton({ selected: state.conditionMode === choice.value, onClick: () => update({ conditionMode: choice.value }) }),
                            UI.Text({ text: choice.label, weight: 1 }),
                        ])),
                        ...(state.conditionMode === "custom" ? [(0, forms_1.field)(ctx, "edge-condition", "Regular expression / on_success / on_error", state.text, text => update({ text }))] : []),
                    ], [button("Cancel", () => update({ modal: "connections" })), button("Confirm", async () => {
                            const condition = live.current.conditionMode === "default" ? null : live.current.conditionMode === "false" ? "false" : live.current.text.trim();
                            await commit({ ...current(), connections: current().connections.map(item => item.id === edge.id ? { ...item, condition } : item) });
                            update({ modal: "connections" });
                        })], 260, () => update({ modal: "connections" }))];
            }
            case "logs":
                if (workflow === null)
                    throw new Error("Workflow does not exist");
                return [dialog("logs", state.logNode === null ? "Execution Logs" : "Node Execution Logs", logs(workflow), [close], 420)];
            case "result": return [dialog("result", "Execution Result", [
                    UI.Text({ text: state.latest === null ? "Execution finished" : status(state.latest.status).text }),
                ], [button("View Logs", () => update({ modal: "logs", logNode: null, logId: null })), button("OK", dismiss)], 64)];
            case "deleteNode": return [dialog("delete-node", "Confirm Deletion", [
                    UI.Text({ text: "Are you sure you want to delete node '" + (node === undefined ? "" : node.name) + "' and its related connections?" }),
                ], [cancel, button("Delete", removeNode, !state.busy, true)], 72)];
            case "delete": return [dialog("delete-workflow", "Confirm Deletion", [
                    UI.Text({ text: workflow === null ? "Are you sure you want to delete the selected " + state.marked.length + " workflows?" : "Are you sure you want to delete workflow '" + workflow.name + "'?" }),
                ], [cancel, button("Delete", async () => {
                        await request({ action: "delete", ids: workflow === null ? live.current.marked : [workflow.id] });
                        update({ workflow: null, marked: [], selectionMode: false });
                        dismiss();
                    }, !state.busy, true)], 72)];
            case "import": return [dialog("import", "Import Workflow", [
                    UI.Text({ text: "Import Workflow JSON. The workflow is disabled after import; review the node configuration before enabling.", style: "bodySmall" }),
                    (0, forms_1.field)(ctx, "import-json", "Workflow JSON", state.text, text => update({ text }), true),
                    button("Select JSON File", async () => {
                        const picked = await ctx.openFilePicker({ picker: "document", mimeTypes: ["application/json"] });
                        if (picked.cancelled)
                            return;
                        if (picked.files.length !== 1)
                            throw new Error("Please select a workflow file");
                        update({ text: (await Tools.Files.read(picked.files[0].path)).content });
                    }),
                ], [cancel, button("Import", async () => openCreated(await request({ action: "import", json: live.current.text })), state.text.trim().length > 0)], 310)];
            case "export": return [dialog("export", "Export Workflow", [
                    UI.OutlinedTextField({ value: state.text, onValueChange: () => { }, readOnly: true, minLines: 5, maxLines: 10, fillMaxWidth: true }),
                    (0, forms_1.field)(ctx, "export-path", "Save Path", state.path, path => update({ path })),
                ], [close, button("Export", async () => {
                        await Tools.Files.create(live.current.path, live.current.text);
                        await ctx.showToast("Workflow exported");
                        dismiss();
                    }, state.path.trim().length > 0)], 340)];
        }
    }
    return UI.Box({ fillMaxSize: true, key: "workflow-root", topBarTitle: UI.Text({ text: "Workflow" }), onLoad: () => perform(initialize),
        modifier: ctx.Modifier.onSizeChanged(size => {
            if (size.width !== live.current.width)
                update({ width: size.width });
        }),
    }, [
        state.workflow === null ? listView() : editor(state.workflow),
        speedDial(),
        ...(state.error && state.modal === "" ? [UI.Row({ modifier: ctx.Modifier.align("topCenter"), background: "errorContainer", padding: 12, spacing: 8, fillMaxWidth: true }, [
                UI.Text({ text: state.error, color: "onErrorContainer", weight: 1 }), button("Close", () => update({ error: "" })),
            ])] : []),
        ...modal(),
    ]);
}
