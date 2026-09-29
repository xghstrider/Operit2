import { useMemo } from "react";
import {
  Button,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import type {
  Comparison,
  ExtractMode,
  ToolDefinition,
  ToolParameterSchema,
  Value,
  Workflow,
  WorkflowNode,
} from "../../src/model";

const comparisonOptions: { value: Comparison; label: string }[] = [
  { value: "EQ", label: "=" },
  { value: "NE", label: "≠" },
  { value: "GT", label: ">" },
  { value: "GTE", label: "≥" },
  { value: "LT", label: "<" },
  { value: "LTE", label: "≤" },
  { value: "CONTAINS", label: "Contains" },
  { value: "NOT_CONTAINS", label: "Does Not Contain" },
  { value: "IN", label: "In" },
  { value: "NOT_IN", label: "Not In" },
];

const logicOptions = [
  { value: "AND", label: "And" },
  { value: "OR", label: "Or" },
];

const extractModeOptions: { value: ExtractMode; label: string }[] = [
  { value: "REGEX", label: "Regex Extraction" },
  { value: "JSON", label: "JSON Access" },
  { value: "SUB", label: "Substring" },
  { value: "CONCAT", label: "Concatenation" },
  { value: "RANDOM_INT", label: "Random Integer" },
  { value: "RANDOM_STRING", label: "Random Text" },
];

const scheduleTypeOptions = [
  { value: "interval", label: "Run at Interval" },
  { value: "specific_time", label: "Run at Specific Time" },
  { value: "cron", label: "Cron Expression" },
];

/** Edits literals and upstream references using the persisted parameter contract. */
function Parameter({
  label,
  value,
  nodes,
  change,
  schema,
}: {
  label: string;
  value: Value;
  nodes: WorkflowNode[];
  change(value: Value): void;
  schema?: ToolParameterSchema;
}) {
  const type = schema?.type.trim().toLowerCase() ?? "string";
  const booleanTypes = new Set(["bool", "boolean"]);
  const numericTypes = new Set(["int", "integer", "number", "float", "double"]);
  const jsonTypes = new Set(["array", "object", "json"]);
  const literalValue = "value" in value ? value.value : "";
  return (
    <Stack spacing={1}>
      <Typography variant="body2">
        {label}
        {schema?.required ? " · Required" : " · Optional"}
      </Typography>
      {schema?.description && (
        <Typography variant="caption" color="text.secondary">
          {schema.description}
        </Typography>
      )}
      <TextField
        select
        size="small"
        label="Value Source"
        value={"value" in value ? "literal" : "reference"}
        onChange={(event) => {
          if (event.target.value === "literal") change({ value: "" });
          else if (nodes.length) change({ nodeId: nodes[0].id });
        }}
      >
        <MenuItem value="literal">Fixed Value</MenuItem>
        <MenuItem value="reference" disabled={!nodes.length}>
          Node Output
        </MenuItem>
      </TextField>
      {"value" in value ? (
        booleanTypes.has(type) ? (
          <FormControlLabel
            label={literalValue === "true" ? "On" : "Off"}
            control={
              <Switch
                checked={literalValue === "true"}
                onChange={(_, checked) => change({ value: String(checked) })}
              />
            }
          />
        ) : (
          <TextField
            size="small"
            multiline={jsonTypes.has(type)}
            minRows={jsonTypes.has(type) ? 3 : undefined}
            label={label}
            type={numericTypes.has(type) ? "number" : "text"}
            value={literalValue}
            onChange={(event) => change({ value: event.target.value })}
            helperText={schema?.description || undefined}
          />
        )
      ) : (
        <TextField
          select
          size="small"
          label="Source Node"
          value={value.nodeId}
          onChange={(event) => change({ nodeId: event.target.value })}
        >
          {nodes.map((node) => (
            <MenuItem key={node.id} value={node.id}>
              {node.name}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Stack>
  );
}

/** Edits every node kind without changing the execution schema. */
export function NodeForm({
  node,
  workflow,
  tools,
  change,
}: {
  node: WorkflowNode;
  workflow: Workflow;
  tools: ToolDefinition[];
  change(node: WorkflowNode): void;
}) {
  const sources = workflow.nodes.filter((item) => item.id !== node.id);
  const orderedTools = useMemo(
    () => [...tools].sort((left, right) => left.name.localeCompare(right.name)),
    [tools],
  );
  /** Updates a typed field on the current node draft. */
  function set(field: string, value: unknown) {
    change({ ...node, [field]: value } as WorkflowNode);
  }
  /** Builds a controlled text or integer input for one draft field. */
  function field(
    label: string,
    name: string,
    value: string | number,
    numeric = false,
  ) {
    return (
      <TextField
        key={name}
        size="small"
        label={label}
        type={numeric ? "number" : "text"}
        value={value}
        onChange={(event) =>
          set(name, numeric ? Number(event.target.value) : event.target.value)
        }
      />
    );
  }
  /** Builds an exact-choice selector for a draft field. */
  function select(
    label: string,
    name: string,
    value: string,
    options: { value: string; label: string }[],
  ) {
    return (
      <TextField
        select
        size="small"
        label={label}
        value={value}
        onChange={(event) => set(name, event.target.value)}
      >
        {options.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }
  /** Changes one schedule field while retaining the remaining configuration. */
  function config(name: string, value: string) {
    if (node.type === "trigger")
      change({
        ...node,
        triggerConfig: { ...node.triggerConfig, [name]: value },
      });
  }
  const selectedTool =
    node.type === "execute"
      ? orderedTools.find((tool) => tool.name === node.actionType)
      : undefined;
  /** Applies a selected tool schema and initializes its declared parameters. */
  function selectTool(actionType: string) {
    if (node.type !== "execute") return;
    const tool = orderedTools.find((item) => item.name === actionType);
    if (!tool) throw new Error(`Tool metadata does not exist: ${actionType}`);
    const actionConfig = Object.fromEntries(
      tool.parameters.map((parameter) => [
        parameter.name,
        node.actionConfig[parameter.name] ?? {
          value: parameter.default ?? "",
        },
      ]),
    );
    change({ ...node, actionType, actionConfig });
  }
  return (
    <Stack spacing={2} sx={{ pt: 1 }}>
      {field("Node Name", "name", node.name)}
      {field("Description", "description", node.description)}
      {node.type === "trigger" && (
        <>
          <TextField
            select
            size="small"
            label="Trigger Type"
            value={node.triggerType}
            onChange={(event) => {
              const kind = event.target.value as typeof node.triggerType;
              change({
                ...node,
                triggerType: kind,
                triggerConfig:
                  kind === "schedule"
                    ? {
                        schedule_type: "interval",
                        interval_ms: "900000",
                        enabled: "true",
                        repeat: "true",
                      }
                    : kind === "event"
                      ? { topic: "app.lifecycle.resumed" }
                      : {},
              });
            }}
          >
            {Object.entries({
              manual: "Manual",
              schedule: "Schedule",
              app_open: "App Open",
              event: "Host Event",
            }).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          {node.triggerType === "event" && (
            <TextField
              label="Event Topic"
              size="small"
              value={node.triggerConfig.topic}
              onChange={(event) => config("topic", event.target.value)}
            />
          )}
          {node.triggerType === "schedule" && (
            <>
              <TextField
                select
                size="small"
                label="Schedule Type"
                value={node.triggerConfig.schedule_type}
                onChange={(event) =>
                  change({
                    ...node,
                    triggerConfig: {
                      enabled: "true",
                      repeat: "true",
                      schedule_type: event.target.value,
                      ...{
                        interval: { interval_ms: "900000" },
                        specific_time: { specific_time: "2026-12-31 12:00:00" },
                        cron: { cron_expression: "0 9 * * *" },
                      }[event.target.value],
                    },
                  })
                }
              >
                {scheduleTypeOptions.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
              {Object.entries(node.triggerConfig)
                .filter(
                  ([name]) =>
                    !["enabled", "repeat", "schedule_type"].includes(name),
                )
                .map(([name, value]) => (
                  <TextField
                    key={name}
                    size="small"
                    label={name}
                    value={value}
                    onChange={(event) => config(name, event.target.value)}
                  />
                ))}
              {["enabled", "repeat"].map((name) => (
                <FormControlLabel
                  key={name}
                  label={name === "enabled" ? "Enable Schedule" : "Repeat"}
                  control={
                    <Switch
                      checked={node.triggerConfig[name] === "true"}
                      onChange={(_, checked) => config(name, String(checked))}
                    />
                  }
                />
              ))}
            </>
          )}
        </>
      )}
      {node.type === "execute" && (
        <>
          <TextField
            select
            size="small"
            label="Tool to Execute"
            value={node.actionType}
            onChange={(event) => selectTool(event.target.value)}
            helperText={
              selectedTool
                ? `${selectedTool.source === "package" ? "Tool Package" : "Built-in Tool"} · ${selectedTool.category}`
                : "Select a tool provided by the runtime"
            }
          >
            {orderedTools.map((tool) => (
              <MenuItem key={tool.name} value={tool.name}>
                {tool.name}
              </MenuItem>
            ))}
          </TextField>
          {selectedTool?.description && (
            <Typography variant="body2" color="text.secondary">
              {selectedTool.description}
            </Typography>
          )}
          {selectedTool ? (
            selectedTool.parameters.length ? (
              selectedTool.parameters.map((schema) => (
                <Parameter
                  key={schema.name}
                  label={schema.name}
                  schema={schema}
                  value={
                    node.actionConfig[schema.name] ?? {
                      value: schema.default ?? "",
                    }
                  }
                  nodes={sources}
                  change={(next) =>
                    set("actionConfig", {
                      ...node.actionConfig,
                      [schema.name]: next,
                    })
                  }
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                This tool requires no parameters
              </Typography>
            )
          ) : null}
          <FormControlLabel
            label="JavaScript Execution"
            control={
              <Switch
                checked={node.jsCode !== null}
                onChange={(_, checked) =>
                  set("jsCode", checked ? "return inputs;" : null)
                }
              />
            }
          />
          {node.jsCode !== null && (
            <TextField
              multiline
              minRows={6}
              label="Script (inputs, trigger, Tools, toolCall)"
              value={node.jsCode}
              onChange={(event) => set("jsCode", event.target.value)}
            />
          )}
        </>
      )}
      {node.type === "condition" && (
        <>
          <Parameter
            label="Left Value"
            value={node.left}
            nodes={sources}
            change={(value) => set("left", value)}
          />
          {select("Comparison", "operator", node.operator, comparisonOptions)}
          <Parameter
            label="Right Value"
            value={node.right}
            nodes={sources}
            change={(value) => set("right", value)}
          />
        </>
      )}
      {node.type === "logic" &&
        select("Logic Operation", "operator", node.operator, logicOptions)}
      {node.type === "extract" && (
        <>
          {select("Operation Mode", "mode", node.mode, extractModeOptions)}
          <Parameter
            label="Input Value"
            value={node.source}
            nodes={sources}
            change={(value) => set("source", value)}
          />
          {["REGEX", "JSON"].includes(node.mode) &&
            field("Expression / JSON Path", "expression", node.expression)}
          {node.mode === "REGEX" && field("Capture Group", "group", node.group, true)}
          {node.mode === "SUB" && (
            <>
              {field("Start Position", "startIndex", node.startIndex, true)}
              {field("Length (-1 to end)", "length", node.length, true)}
            </>
          )}
          {node.mode === "CONCAT" && (
            <>
              {node.others.map((value, index) => (
                <Stack key={index}>
                  <Parameter
                    label={"Concatenated Value " + (index + 1)}
                    value={value}
                    nodes={sources}
                    change={(next) =>
                      set(
                        "others",
                        node.others.map((item, i) =>
                          i === index ? next : item,
                        ),
                      )
                    }
                  />
                  <Button
                    onClick={() =>
                      set(
                        "others",
                        node.others.filter((_, i) => i !== index),
                      )
                    }
                  >
                    Remove
                  </Button>
                </Stack>
              ))}
              <Button
                onClick={() => set("others", [...node.others, { value: "" }])}
              >
                Add Concatenated Value
              </Button>
            </>
          )}
          {["RANDOM_INT", "RANDOM_STRING"].includes(node.mode) && (
            <>
              <FormControlLabel
                label="Use Fixed Value"
                control={
                  <Switch
                    checked={node.useFixed}
                    onChange={(_, checked) => set("useFixed", checked)}
                  />
                }
              />
              {node.useFixed ? (
                field("Fixed Value", "fixedValue", node.fixedValue)
              ) : node.mode === "RANDOM_INT" ? (
                <>
                  {field("Minimum", "randomMin", node.randomMin, true)}
                  {field("Maximum", "randomMax", node.randomMax, true)}
                </>
              ) : (
                <>
                  {field(
                    "Length",
                    "randomStringLength",
                    node.randomStringLength,
                    true,
                  )}
                  {field(
                    "Character Set",
                    "randomStringCharset",
                    node.randomStringCharset,
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </Stack>
  );
}



