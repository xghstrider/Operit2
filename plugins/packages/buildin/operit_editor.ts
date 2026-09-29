/* METADATA
{
    "name": "operit_editor",
    "display_name": {
        "zh": "Operit Platform Editor",
        "en": "Operit Platform Editor"
    },
    "description": {
        "zh": "Operit2 platform editing and troubleshooting manual. Targets the current-version core command; does not replicate the legacy soft setting tool surface.",
        "en": "Operit2 platform editing and troubleshooting guide for the current core command surface."
    },
    "enabledByDefault": false,
    "category": "System",
    "tools": [
        {
            "name": "operit_editor",
            "description": {
                "zh": "Read the Operit2 platform editing manual. For actual config, package, Skill, MCP, model, chat, and workspace operations, call the system tool execute_cli_command directly.",
                "en": "Read the Operit2 platform editing guide. Use the system execute_cli_command tool for package, skill, MCP, model, chat, and workspace operations."
            },
            "parameters": [
                {
                    "name": "query",
                    "description": {
                        "zh": "Optional. Describes the target of this editing or troubleshooting task.",
                        "en": "Optional editing or troubleshooting target."
                    },
                    "type": "string",
                    "required": false
                }
            ]
        }
    ]
}*/

type OperitEditorParams = {
    query?: string;
};

const OPERIT_EDITOR_GUIDE = `
# Operit2 Platform Editor

This package only provides the current Operit2 platform editing manual. For executing actions, use the system tool execute_cli_command; its parameter is an array of CLI strings.

Common entry points:

- General help: besides ["package", "help"], the top-level entry can be queried with an empty array or a specific top-level command.
- Package manager: ["package", "list"], ["package", "more"], ["package", "load", "<name>"], ["package", "show", "<name>"], ["package", "enable", "<name>"], ["package", "disable", "<name>"], ["package", "use", "<name>"], ["package", "exec", "<package:tool>", "<params-json>"].
- Skill：["skill", "list"]、["skill", "show", "<name>"]、["skill", "visible", "<name>", "true"]、["skill", "visible", "<name>", "false"]、["skill", "errors"]。
- MCP：["mcp", "dir"]、["mcp", "list"]、["mcp", "show", "<name>"]、["mcp", "enable", "<name>"]、["mcp", "disable", "<name>"]、["mcp", "start", "<name>"]、["mcp", "tools", "<name>"]。
- Models: ["model", "list"], ["model", "show", "<id>"], ["model", "function-list"], ["model", "function-show", "<type>"], ["model", "function-set", "<type>", "<provider-id>", "<model-id>"].
- Preferences: ["prefs", "show"], ["prefs", "thinking"], ["prefs", "stream"], ["prefs", "media-history"], ["prefs", "mcp-timeout"].
- Logs: ["log", "show"], ["log", "package"], ["log", "path"], ["log", "clear"].
- Tools: ["tool", "list"], ["tool", "show", "<name>"], ["tool", "exec", "<name>", "<params-json>"].
- Workspaces: ["workspace", "commands"], ["workspace", "run", "<command-id>"], ["workspace", "list"], ["workspace", "bind-default"].

Plugin authoring conventions:

- Use the current-version type definitions bundled with the package in the PackageBuilder skill.
- The development directory is fixed at Download/Operit/dev_package/<package-id> on the phone.
- The package id stays unchanged once it is first decided.
- Use the terminal for TypeScript/JavaScript development, compilation, installation, and testing.
- Install and debug through the current-version package core command and system tools; do not use the legacy SoftwareSettings package switches, direct script running, or model settings enum interfaces.

Package system notes:

- Built-in packages come from the resources bundled with the app.
- Semi built-in packages come from external candidates in the app resources; view them with ["package", "more"], and add them to the load list with ["package", "load", "<name>"].
- Before calling a package in the current conversation, use ["package", "use", "<name>"] to have the runtime activate it.
- ToolPkg subpackages are parsed and displayed by the package system; do not hand-write separate recognition logic.

Execution principles:

- Check the real state with the corresponding core command first, then run modification commands.
- Confirm with the user before changing user config, enabling/disabling packages, enabling/disabling MCP, or deleting resources.
- Do not pull PackageBuilder types from the cloud; use the types bundled with the current software.
`.trim();

async function operit_editor(params: OperitEditorParams = {}) {
    const query = params.query?.trim();
    if (!query) {
        return OPERIT_EDITOR_GUIDE;
    }
    return `Goal: ${query}\n\n${OPERIT_EDITOR_GUIDE}`;
}

exports.operit_editor = operit_editor;
exports.main = operit_editor;
