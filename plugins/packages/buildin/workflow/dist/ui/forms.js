"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.field = field;
exports.choose = choose;
exports.options = options;
exports.scheduleForm = scheduleForm;
exports.nodeForm = nodeForm;
const model_1 = require("../model");
const validation_1 = require("../validation");
/** Creates a keyed, controlled text field. */
function field(ctx, key, label, value, change, multiline = false) {
    return ctx.UI.OutlinedTextField({ key, label, value, onValueChange: change, singleLine: !multiline, minLines: multiline ? 3 : 1, maxLines: multiline ? 5 : 1, fillMaxWidth: true });
}
/** Presents the outlined dropdown used by the Kotlin node dialogs. */
function choose(ctx, key, label, value, options, change) {
    const option = options.find(item => item.value === value);
    return ctx.UI.DropdownMenu({ key, label, text: option === undefined ? value : option.label,
        fillMaxWidth: true, onClick: (index) => change(options[index].value),
    }, options.map(item => ctx.UI.Text({ text: item.label, paddingVertical: 8 })));
}
/** Builds choices whose values and labels are identical. */
function options(values) { return values.map(value => ({ value, label: value })); }
/** Edits a literal value or an exact upstream-node reference. */
function parameterField(ctx, key, label, value, workflow, self, change) {
    const referenced = "nodeId" in value;
    return ctx.UI.Column({ fillMaxWidth: true, spacing: 6 }, [
        ctx.UI.Row({ verticalAlignment: "center", spacing: 8 }, [ctx.UI.Text({ text: label, weight: 1 }), ctx.UI.Text({ text: "Referenced Node", style: "labelSmall" }),
            ctx.UI.Switch({ checked: referenced, onCheckedChange: checked => {
                    if (checked) {
                        const source = workflow.nodes.find(node => node.id !== self);
                        if (source === undefined) {
                            void ctx.showToast("Please create the upstream node first");
                            return;
                        }
                        change({ nodeId: source.id });
                    }
                    else
                        change({ value: "" });
                } })]),
        referenced ? choose(ctx, key, "Source", value.nodeId, workflow.nodes.filter(node => node.id !== self).map(node => ({ value: node.id, label: `${node.name} · ${node.id.slice(-6)}` })), nodeId => change({ nodeId }))
            : field(ctx, key, "Static Value", value.value, text => change({ value: text }), true),
    ]);
}
/** Renders one tool parameter using its declared type and an upstream reference switch. */
function toolParameterField(ctx, key, schema, value, workflow, self, change) {
    const type = schema.type.trim().toLowerCase();
    const referenced = "nodeId" in value;
    const referenceToggle = ctx.UI.Row({ verticalAlignment: "center", spacing: 8 }, [
        ctx.UI.Text({ text: schema.name + (schema.required ? " · Required" : " · Optional"), weight: 1 }),
        ctx.UI.Switch({ checked: referenced, onCheckedChange: checked => {
                if (checked) {
                    const source = workflow.nodes.find(node => node.id !== self);
                    if (source === undefined) {
                        void ctx.showToast("Please create the upstream node first");
                        return;
                    }
                    change({ nodeId: source.id });
                }
                else
                    change({ value: schema.default ?? "" });
            } }),
        ctx.UI.Text({ text: referenced ? "Referenced Node" : "Fixed Value", style: "labelSmall" }),
    ]);
    const input = referenced
        ? choose(ctx, key + ":source", "Source", value.nodeId, workflow.nodes.filter(node => node.id !== self).map(node => ({ value: node.id, label: `${node.name} · ${node.id.slice(-6)}` })), nodeId => change({ nodeId }))
        : ["bool", "boolean"].includes(type)
            ? ctx.UI.Row({ verticalAlignment: "center", spacing: 8 }, [
                ctx.UI.Text({ text: value.value === "true" ? "On" : "Off", weight: 1 }),
                ctx.UI.Switch({ checked: value.value === "true", onCheckedChange: checked => change({ value: String(checked) }) }),
            ])
            : field(ctx, key, schema.description || schema.name, value.value, text => change({ value: text }), ["array", "object", "json"].includes(type));
    return ctx.UI.Column({ fillMaxWidth: true, spacing: 5 }, [
        referenceToggle,
        ...(schema.description ? [ctx.UI.Text({ text: schema.description, style: "bodySmall", color: "onSurfaceVariant" })] : []),
        input,
    ]);
}
/** Edits integral values with visible validation instead of silently coercing text. */
function integer(ctx, key, label, value, change) {
    return field(ctx, key, label, String(value), text => {
        if (!/^-?\d+$/.test(text) || !Number.isSafeInteger(Number(text))) {
            void ctx.showToast("Please enter a whole integer");
            return;
        }
        change(Number(text));
    });
}
/** Builds schedule-specific inputs using the original configuration names. */
function scheduleForm(ctx, node, change) {
    const c = node.triggerConfig;
    /** Replaces one configured schedule field. */
    const set = (key, value) => change({ ...node, triggerConfig: { ...c, [key]: value } });
    return [
        choose(ctx, `${node.id}:schedule`, "Schedule Type", c.schedule_type, [{ value: "interval", label: "Interval" }, { value: "specific_time", label: "Specific Time" }, { value: "cron", label: "Cron Expression" }], value => {
            const config = { enabled: "true", repeat: "true", schedule_type: value };
            if (value === "interval")
                change({ ...node, triggerConfig: { ...config, interval_ms: "900000" } });
            if (value === "specific_time")
                change({ ...node, triggerConfig: { ...config, repeat: "false", specific_time: "2026-12-31 12:00:00" } });
            if (value === "cron")
                change({ ...node, triggerConfig: { ...config, cron_expression: "0 9 * * *" } });
        }),
        ...(c.schedule_type === "interval" ? [field(ctx, `${node.id}:interval`, "Interval (ms, minimum 60000)", c.interval_ms, value => set("interval_ms", value))] : []),
        ...(c.schedule_type === "specific_time" ? [field(ctx, `${node.id}:time`, "Local time YYYY-MM-DD HH:mm:ss", c.specific_time, value => set("specific_time", value))] : []),
        ...(c.schedule_type === "cron" ? [field(ctx, `${node.id}:cron`, "Cron: minute hour day month weekday", c.cron_expression, value => set("cron_expression", value)),
            choose(ctx, `${node.id}:presets`, "Common Schedules", c.cron_expression, [{ value: "0 9 * * *", label: "Daily at 09:00" }, { value: "0 9 * * 1-5", label: "Weekdays at 09:00" }, { value: "*/15 * * * *", label: "Every 15 minutes" }], value => set("cron_expression", value))] : []),
        ctx.UI.Row({ spacing: 8, verticalAlignment: "center" }, [ctx.UI.Text({ text: "Repeat", weight: 1 }), ctx.UI.Switch({ checked: c.repeat === "true", onCheckedChange: value => set("repeat", String(value)) })]),
        ctx.UI.Row({ spacing: 8, verticalAlignment: "center" }, [ctx.UI.Text({ text: "Enable Schedule", weight: 1 }), ctx.UI.Switch({ checked: c.enabled === "true", onCheckedChange: value => set("enabled", String(value)) })]),
        ctx.UI.Text({ text: "Checked against the host's local time with one-minute precision. Background running depends on the host lifecycle.", style: "bodySmall", color: "onSurfaceVariant" }),
    ];
}
/** Renders all node-specific settings with typed parameter references. */
function nodeForm(ctx, workflow, node, tools, change, configureSchedule) {
    const UI = ctx.UI;
    const content = [
        field(ctx, `${node.id}:name`, "Node Name", node.name, name => change({ ...node, name })),
        field(ctx, `${node.id}:description`, "Description", node.description, description => change({ ...node, description })),
    ];
    if (node.type === "trigger") {
        content.push(choose(ctx, `${node.id}:trigger`, "Trigger Type", node.triggerType, [{ value: "manual", label: "Manual" }, { value: "schedule", label: "Schedule" }, { value: "app_open", label: "App Cold Start" }, { value: "event", label: "Host Event" }], value => {
            const next = (0, model_1.copy)(node);
            next.triggerType = value;
            next.triggerConfig = value === "schedule" ? { schedule_type: "interval", interval_ms: "900000", enabled: "true", repeat: "true" } : value === "event" ? { topic: "app.lifecycle.resumed" } : {};
            change(next);
        }));
        if (node.triggerType === "schedule")
            content.push(UI.Button({ text: "Configure Schedule Trigger", fillMaxWidth: true, onClick: configureSchedule }), UI.Text({ text: "Schedule trigger configured", style: "bodySmall", color: "primary" }));
        if (node.triggerType === "app_open")
            content.push(UI.Text({ text: "This workflow is triggered automatically when the app starts.", style: "bodySmall", color: "onSurfaceVariant" }));
        if (node.triggerType === "event")
            content.push(choose(ctx, `${node.id}:topic`, "Event", node.triggerConfig.topic, options(["app.lifecycle.resumed", "system.network.changed", "system.power.connected", "system.power.disconnected", "system.screen.on", "system.screen.off", "system.battery.low", "system.battery.okay"]), topic => change({ ...node, triggerConfig: { topic } })));
    }
    if (node.type === "execute") {
        const orderedTools = [...tools].sort((left, right) => left.name.localeCompare(right.name));
        const selectedTool = orderedTools.find(tool => tool.name === node.actionType);
        content.push(choose(ctx, `${node.id}:tools`, "Tool to Execute", node.actionType, orderedTools.map(tool => ({ value: tool.name, label: tool.name })), actionType => {
            const tool = orderedTools.find(item => item.name === actionType);
            if (tool === undefined)
                throw new Error(`Tool metadata not found: ${actionType}`);
            const actionConfig = Object.fromEntries(tool.parameters.map(parameter => [parameter.name, node.actionConfig[parameter.name] ?? { value: parameter.default ?? "" }]));
            change({ ...node, actionType, actionConfig });
        }));
        if (selectedTool?.description)
            content.push(UI.Text({ text: selectedTool.description, style: "bodySmall", color: "onSurfaceVariant" }));
        if (selectedTool) {
            for (const schema of selectedTool.parameters) {
                content.push(toolParameterField(ctx, `${node.id}:param:${schema.name}`, schema, node.actionConfig[schema.name] ?? { value: schema.default ?? "" }, workflow, node.id, next => change({ ...node, actionConfig: { ...node.actionConfig, [schema.name]: next } })));
            }
            if (selectedTool.parameters.length === 0)
                content.push(UI.Text({ text: "This tool requires no parameters", style: "bodySmall", color: "onSurfaceVariant" }));
        }
        content.push(UI.Row({ spacing: 8, verticalAlignment: "center" }, [UI.Text({ text: "JavaScript Execution Mode", weight: 1 }), UI.Switch({ checked: node.jsCode !== null, onCheckedChange: value => change({ ...node, jsCode: value ? "return inputs;" : null }) })]));
        if (node.jsCode !== null)
            content.push(field(ctx, `${node.id}:js`, "Script (use return for the result; await is supported)", node.jsCode, jsCode => change({ ...node, jsCode }), true), UI.Text({ text: "Available variables: inputs, trigger, Tools, and toolCall. The script runs directly in the plugin environment.", style: "bodySmall" }));
    }
    if (node.type === "condition")
        content.push(parameterField(ctx, `${node.id}:left`, "Left Value", node.left, workflow, node.id, left => change({ ...node, left })), choose(ctx, `${node.id}:operator`, "Comparison", node.operator, [
            { value: "EQ", label: "=" }, { value: "NE", label: "≠" }, { value: "GT", label: ">" },
            { value: "GTE", label: "≥" }, { value: "LT", label: "<" }, { value: "LTE", label: "≤" },
            { value: "CONTAINS", label: "Contains" }, { value: "NOT_CONTAINS", label: "Does Not Contain" }, { value: "IN", label: "In" }, { value: "NOT_IN", label: "Not In" },
        ], operator => change((0, validation_1.parseNode)({ ...node, operator }))), parameterField(ctx, `${node.id}:right`, "Right Value (JSON array for IN)", node.right, workflow, node.id, right => change({ ...node, right })));
    if (node.type === "logic")
        content.push(choose(ctx, `${node.id}:logic`, "Logic Operation", node.operator, [{ value: "AND", label: "AND" }, { value: "OR", label: "OR" }], operator => change((0, validation_1.parseNode)({ ...node, operator }))), UI.Text({ text: "Operates on boolean results from input connections that completed successfully.", style: "bodySmall" }));
    if (node.type === "extract") {
        content.push(choose(ctx, `${node.id}:mode`, "Operation Mode", node.mode, [
            { value: "REGEX", label: "Regex Extract" }, { value: "JSON", label: "JSON Extract" }, { value: "SUB", label: "Substring" },
            { value: "CONCAT", label: "Concatenate Strings" }, { value: "RANDOM_INT", label: "Random Integer" }, { value: "RANDOM_STRING", label: "Random String" },
        ], mode => change((0, validation_1.parseNode)({ ...node, mode }))));
        if (node.mode !== "RANDOM_INT" && node.mode !== "RANDOM_STRING")
            content.push(parameterField(ctx, `${node.id}:source`, "Source Data", node.source, workflow, node.id, source => change({ ...node, source })));
        if (node.mode === "REGEX" || node.mode === "JSON")
            content.push(field(ctx, `${node.id}:expression`, node.mode === "JSON" ? "JSON path, e.g. $.data[0].name" : "Regular Expression", node.expression, expression => change({ ...node, expression })));
        if (node.mode === "REGEX")
            content.push(integer(ctx, `${node.id}:group`, "Capture group (0 means the entire match)", node.group, group => change({ ...node, group })));
        if (node.mode === "SUB")
            content.push(integer(ctx, `${node.id}:start`, "Start", node.startIndex, startIndex => change({ ...node, startIndex })), integer(ctx, `${node.id}:length`, "Length (-1 means to the end)", node.length, length => change({ ...node, length })));
        if (node.mode === "CONCAT") {
            node.others.forEach((value, index) => content.push(parameterField(ctx, `${node.id}:other:${index}`, `Concatenated value ${index + 1}`, value, workflow, node.id, next => change({ ...node, others: node.others.map((item, i) => i === index ? next : item) }))));
            content.push(UI.Button({ text: "Add Value", onClick: () => change({ ...node, others: [...node.others, { value: "" }] }) }), UI.Button({ text: "Remove Last Item", enabled: node.others.length > 0, onClick: () => change({ ...node, others: node.others.slice(0, -1) }) }));
        }
        if (node.mode === "RANDOM_INT" || node.mode === "RANDOM_STRING") {
            content.push(UI.Row({ spacing: 8, verticalAlignment: "center" }, [UI.Text({ text: "Use Fixed Value", weight: 1 }), UI.Switch({ checked: node.useFixed, onCheckedChange: useFixed => change({ ...node, useFixed }) })]));
            if (node.useFixed)
                content.push(field(ctx, `${node.id}:fixed`, "Fixed Value", node.fixedValue, fixedValue => change({ ...node, fixedValue })));
            else if (node.mode === "RANDOM_INT")
                content.push(integer(ctx, `${node.id}:min`, "Minimum", node.randomMin, randomMin => change({ ...node, randomMin })), integer(ctx, `${node.id}:max`, "Maximum (inclusive)", node.randomMax, randomMax => change({ ...node, randomMax })));
            else
                content.push(integer(ctx, `${node.id}:randomLength`, "Length", node.randomStringLength, randomStringLength => change({ ...node, randomStringLength })), field(ctx, `${node.id}:charset`, "Character Set", node.randomStringCharset, randomStringCharset => change({ ...node, randomStringCharset })));
        }
    }
    return content;
}
