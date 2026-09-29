"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.object = object;
exports.string = string;
exports.parameter = parameter;
exports.parseNode = parseNode;
exports.parseWorkflow = parseWorkflow;
exports.validateGraph = validateGraph;
const model_1 = require("./model");
const schedule_1 = require("./schedule");
/** Requires a plain JSON object at an external input boundary. */
function object(value, label) {
    if (typeof value !== "object" || value === null || Array.isArray(value))
        throw new Error(`${label} must be an object`);
    return value;
}
/** Requires a string instead of coercing malformed external input. */
function string(value, label) {
    if (typeof value !== "string")
        throw new Error(`${label} must be a string`);
    return value;
}
/** Requires a finite numeric field. */
function number(value, label) {
    if (typeof value !== "number" || !Number.isFinite(value))
        throw new Error(`${label} must be a finite number`);
    return value;
}
/** Validates parameter values, including Kotlin serialization type annotations. */
function parameter(value) {
    const raw = object(value, "parameters");
    if (Object.hasOwnProperty.call(raw, "nodeId") && !Object.hasOwnProperty.call(raw, "value"))
        return { nodeId: string(raw.nodeId, "nodeId") };
    if (Object.hasOwnProperty.call(raw, "value") && !Object.hasOwnProperty.call(raw, "nodeId"))
        return { value: string(raw.value, "value") };
    throw new Error("Parameters must be {value: string} or {nodeId: node ID}");
}
/** Checks an enum value against its exact public vocabulary. */
function enumValue(value, accepted, label) {
    if (typeof value !== "string" || !accepted.some(item => item === value))
        throw new Error(`Invalid value for ${label}: ${JSON.stringify(value)}`);
    return value;
}
/** Decodes a node and applies only the documented initial values of omitted fields. */
function parseNode(value) {
    const raw = object(value, "node");
    const type = enumValue(raw.type, ["trigger", "execute", "condition", "logic", "extract"], "node type");
    const data = { ...(0, model_1.newNode)(type), ...raw };
    const position = object(data.position, "position");
    const base = { id: string(data.id, "id"), name: string(data.name, "name"), description: string(data.description, "description"),
        position: { x: number(position.x, "x"), y: number(position.y, "y") } };
    if (base.id === "")
        throw new Error("Node ID cannot be empty");
    switch (type) {
        case "trigger": {
            const node = (0, model_1.newNode)("trigger");
            if (node.type !== "trigger")
                throw new Error("Node type mismatch");
            const config = object(data.triggerConfig, "triggerConfig");
            return { ...node, ...base, triggerType: enumValue(data.triggerType, ["manual", "schedule", "app_open", "event"], "trigger type"),
                triggerConfig: Object.fromEntries(Object.entries(config).map(([key, item]) => [key, string(item, key)])) };
        }
        case "execute": return { ...base, type, actionType: string(data.actionType, "actionType"),
            actionConfig: Object.fromEntries(Object.entries(object(data.actionConfig, "actionConfig")).map(([key, item]) => [key, parameter(item)])),
            jsCode: data.jsCode === null ? null : string(data.jsCode, "jsCode") };
        case "condition": return { ...base, type, left: parameter(data.left), right: parameter(data.right),
            operator: enumValue(data.operator, ["EQ", "NE", "GT", "GTE", "LT", "LTE", "CONTAINS", "NOT_CONTAINS", "IN", "NOT_IN"], "comparison operator") };
        case "logic": return { ...base, type, operator: enumValue(data.operator, ["AND", "OR"], "logical operator") };
        case "extract": {
            if (!Array.isArray(data.others))
                throw new Error("others must be an array");
            if (typeof data.useFixed !== "boolean")
                throw new Error("useFixed must be a boolean");
            return { ...base, type, source: parameter(data.source), mode: enumValue(data.mode, ["REGEX", "JSON", "SUB", "CONCAT", "RANDOM_INT", "RANDOM_STRING"], "extraction mode"),
                expression: string(data.expression, "expression"), group: number(data.group, "group"), others: data.others.map(parameter),
                startIndex: number(data.startIndex, "startIndex"), length: number(data.length, "length"), randomMin: number(data.randomMin, "randomMin"),
                randomMax: number(data.randomMax, "randomMax"), randomStringLength: number(data.randomStringLength, "randomStringLength"),
                randomStringCharset: string(data.randomStringCharset, "randomStringCharset"), useFixed: data.useFixed, fixedValue: string(data.fixedValue, "fixedValue") };
        }
    }
}
/** Imports workflow graph fields and deliberately resets runtime statistics. */
function parseWorkflow(value) {
    const raw = object(value, "workflow");
    if (!Array.isArray(raw.nodes) || !Array.isArray(raw.connections))
        throw new Error("nodes and connections must be arrays");
    const result = (0, model_1.newWorkflow)(string(raw.name, "name"));
    if (raw.id !== undefined)
        result.id = string(raw.id, "id");
    if (raw.description !== undefined)
        result.description = string(raw.description, "description");
    if (raw.enabled !== undefined) {
        if (typeof raw.enabled !== "boolean")
            throw new Error("enabled must be a boolean");
        result.enabled = raw.enabled;
    }
    result.nodes = raw.nodes.map(parseNode);
    result.connections = raw.connections.map(item => {
        const edge = object(item, "connection");
        return { id: string(edge.id, "Connection ID"), sourceNodeId: string(edge.sourceNodeId, "Source"), targetNodeId: string(edge.targetNodeId, "Target"),
            condition: edge.condition === null || edge.condition === undefined ? null : string(edge.condition, "Edge condition") };
    });
    validateGraph(result, false);
    return result;
}
/** Validates structure, references and cycles before persistence or execution. */
function validateGraph(workflow, executable) {
    if (!workflow.name.trim())
        throw new Error("Workflow name cannot be empty");
    const nodes = new Map(workflow.nodes.map(node => [node.id, node]));
    if (nodes.size !== workflow.nodes.length)
        throw new Error("Duplicate node ID");
    if (new Set(workflow.connections.map(edge => edge.id)).size !== workflow.connections.length)
        throw new Error("Duplicate edge ID");
    const degree = new Map(workflow.nodes.map(node => [node.id, 0]));
    const next = new Map(workflow.nodes.map(node => [node.id, []]));
    const parents = new Map(workflow.nodes.map(node => [node.id, []]));
    for (const edge of workflow.connections) {
        if (!nodes.has(edge.sourceNodeId) || !nodes.has(edge.targetNodeId))
            throw new Error("An edge points to a node that does not exist");
        if (nodes.get(edge.targetNodeId).type === "trigger")
            throw new Error("Trigger nodes cannot have incoming edges");
        next.get(edge.sourceNodeId).push(edge.targetNodeId);
        parents.get(edge.targetNodeId).push(edge.sourceNodeId);
        degree.set(edge.targetNodeId, degree.get(edge.targetNodeId) + 1);
        if (edge.condition !== null && edge.condition !== "" && !["true", "false", "on_success", "success", "ok", "on_error", "error", "failed"].includes(edge.condition.toLowerCase()))
            new RegExp(edge.condition);
    }
    const queue = [...degree].filter(([, count]) => count === 0).map(([key]) => key);
    for (let index = 0; index < queue.length; index++) {
        for (const target of next.get(queue[index])) {
            degree.set(target, degree.get(target) - 1);
            if (degree.get(target) === 0)
                queue.push(target);
        }
    }
    if (queue.length !== workflow.nodes.length)
        throw new Error("The workflow has a circular dependency");
    for (const node of workflow.nodes) {
        parseNode(node);
        const ancestors = new Set();
        const visit = [...parents.get(node.id)];
        for (let index = 0; index < visit.length; index++) {
            if (ancestors.has(visit[index]))
                continue;
            ancestors.add(visit[index]);
            visit.push(...parents.get(visit[index]));
        }
        for (const value of (0, model_1.values)(node)) {
            if ("nodeId" in value && !nodes.has(value.nodeId))
                throw new Error(`The node referenced by ${node.name} does not exist`);
            if (executable && "nodeId" in value && !ancestors.has(value.nodeId))
                throw new Error(`The node referenced by ${node.name} must be upstream through an edge`);
        }
        if (executable && node.type === "trigger")
            (0, schedule_1.validateTrigger)(node);
        if (executable && node.type === "execute" && !node.actionType.trim() && (node.jsCode === null || !node.jsCode.trim()))
            throw new Error(`${node.name} has no tool or script configured yet`);
        if (executable && node.type === "extract") {
            if (node.mode === "REGEX")
                new RegExp(node.expression);
            for (const value of [node.group, node.startIndex, node.length, node.randomMin, node.randomMax, node.randomStringLength])
                if (!Number.isSafeInteger(value))
                    throw new Error("Extract index, length, and range must be integers");
            if (node.group < 0 || node.startIndex < 0 || node.length < -1 || node.randomMax < node.randomMin || node.randomStringLength < 0 || node.randomStringLength > 10000 || node.randomStringCharset.length === 0)
                throw new Error("Extract node parameters are out of range");
        }
    }
    if (executable && !workflow.nodes.some(node => node.type === "trigger"))
        throw new Error("A workflow requires at least one trigger node");
}
