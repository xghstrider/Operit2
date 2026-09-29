use operit_host_api::HostEnvironmentDescriptor;

use crate::chat::config::SystemToolPrompts::{
    SystemToolPromptCategory, SystemToolPrompts, ToolParameterSchema, ToolPrompt,
};

pub struct SystemToolPromptsInternal;

impl SystemToolPromptsInternal {
    #[allow(non_snake_case)]
    pub fn internalToolCategoriesEn() -> Vec<SystemToolPromptCategory> {
        Self::internalToolCategoriesEnForHost(&HostEnvironmentDescriptor::android())
    }

    #[allow(non_snake_case)]
    pub fn internalToolCategoriesEnForHost(
        host_environment: &HostEnvironmentDescriptor,
    ) -> Vec<SystemToolPromptCategory> {
        internalToolCategoriesEnSource()
            .into_iter()
            .map(|category| {
                SystemToolPrompts::applyHostEnvironmentToCategory(category, host_environment, true)
            })
            .collect()
    }

    #[allow(non_snake_case)]
    pub fn internalToolCategoriesCn() -> Vec<SystemToolPromptCategory> {
        Self::internalToolCategoriesCnForHost(&HostEnvironmentDescriptor::android())
    }

    #[allow(non_snake_case)]
    pub fn internalToolCategoriesCnForHost(
        host_environment: &HostEnvironmentDescriptor,
    ) -> Vec<SystemToolPromptCategory> {
        internalToolCategoriesCnSource()
            .into_iter()
            .map(|category| {
                SystemToolPrompts::applyHostEnvironmentToCategory(category, host_environment, false)
            })
            .collect()
    }
}

fn internalToolCategoriesEnSource() -> Vec<SystemToolPromptCategory> {
    vec![
        category(
            "Internal Tools",
            "",
            vec![
                tool(
                    "get_terminal_info",
                    "Get terminal platform info and supported terminal types.",
                    "",
                    vec![],
                    "",
                    "",
                ),
                tool(
                    "apply_file",
                    "Applies edits to a file by finding and replacing/deleting a matched content block.",
                    "",
                    vec![
                        param("path", "string", "file path", true, None),
                        param("type", "string", "operation type: replace | delete | create", true, None),
                        param("old", "string", "the exact content to be matched and replaced/deleted (required for replace/delete)", false, None),
                        param("new", "string", "the new content to insert (required for replace/create)", false, None)
                    ],
                    "\n  - **How it works**:\n    - The tool finds the best fuzzy match of `old` in the current file content (not by line numbers) and applies the requested operation.\n    - You can call this tool multiple times to apply multiple independent edits.\n\n  - **Parameters**:\n    - `type`:\n      - `replace`: replace the matched `old` content with `new`\n      - `delete`: delete the matched `old` content\n      - `create`: create the file when it does not exist (write `new` as full file content)\n    - `old`: required for `replace` / `delete`\n    - `new`: required for `replace` / `create`\n\n  - **CRITICAL RULES**:\n    1. **If you need to rewrite a whole existing file**: do **NOT** use apply_file to overwrite it. Instead, call `delete_file` first, then use `apply_file` with `type=create`.\n    2. **If you need to modify an existing file**: you **MUST** use `type=replace` (or `type=delete`) and provide `old` / `new`. Do **NOT** delete the whole file and rewrite it.\n",
                    "",
                ),
                tool(
                    "create_terminal_session",
                    "Create or get a terminal session.",
                    "",
                    vec![
                        param("session_name", "string", "terminal session name", true, None),
                        param("type", "string", "optional terminal type. Linux host supports linux. Windows host supports bash and powershell.", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "execute_in_terminal_session",
                    "Execute a command in a terminal session and collect full output.",
                    "",
                    vec![
                        param("session_id", "string", "terminal session id", true, None),
                        param("command", "string", "command to execute", true, None),
                        param("timeout_ms", "integer", "optional, command timeout in milliseconds", false, Some("1800000".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "execute_in_terminal_session_streaming",
                    "Execute a command in a terminal session and stream output.",
                    "",
                    vec![
                        param("session_id", "string", "terminal session id", true, None),
                        param("command", "string", "command to execute", true, None),
                        param("timeout_ms", "integer", "optional, command timeout in milliseconds", false, Some("1800000".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "execute_hidden_terminal_command",
                    "Execute a command in a hidden non-PTY terminal executor. Commands using the same executor_key reuse the same hidden login context and are not shown in the visible terminal UI.",
                    "",
                    vec![
                        param("command", "string", "command to execute", true, None),
                        param("type", "string", "optional terminal type. Linux host supports linux. Windows host supports bash and powershell.", false, None),
                        param("executor_key", "string", "optional, hidden executor key used to reuse the same background shell context", false, Some("default".to_string())),
                        param("timeout_ms", "integer", "optional, command timeout in milliseconds", false, Some("120000".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "input_in_terminal_session",
                    "Write input to a terminal session. At least one of input or control is required. Typical usage is sending input first, then control=enter to submit.",
                    "",
                    vec![
                        param("session_id", "string", "terminal session id", true, None),
                        param("input", "string", "text to write to the terminal (can include newlines)", false, None),
                        param("control", "string", "control key or modifier (e.g. enter/tab/esc/up/down/left/right/home/end/pageup/pagedown, or ctrl with input=c for Ctrl+C)", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "close_terminal_session",
                    "Close a terminal session.",
                    "",
                    vec![
                        param("session_id", "string", "terminal session id", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "get_terminal_session_screen",
                    "Get only the current visible PTY screen content for a terminal session (single screen, no scrollback/history).",
                    "",
                    vec![
                        param("session_id", "string", "terminal session id", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "music_play",
                    "Play audio inside the app using the built-in music player.",
                    "",
                    vec![
                        param("source", "string", "audio source", true, None),
                        param("source_type", "string", "source type: path | url | uri", true, None),
                        param("title", "string", "optional display title", false, None),
                        param("artist", "string", "optional display artist", false, None),
                        param("loop", "boolean", "optional, repeat this track", false, None),
                        param("volume", "number", "optional, 0 to 1", false, None),
                        param("start_position_ms", "integer", "optional start position in milliseconds", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "music_pause",
                    "Pause the current app music playback.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "music_resume",
                    "Resume the current app music playback.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "music_stop",
                    "Stop the current app music playback.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "music_seek",
                    "Seek the current app music playback.",
                    "",
                    vec![
                        param("position_ms", "integer", "target position in milliseconds", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "music_set_volume",
                    "Set the current app music playback volume.",
                    "",
                    vec![
                        param("volume", "number", "volume from 0 to 1", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "music_status",
                    "Get the current app music playback status.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "request_bluetooth_permission",
                    "Request Bluetooth permission for the current platform.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "get_bluetooth_state",
                    "Get Bluetooth adapter support, enabled state, and state label.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "request_enable_bluetooth",
                    "Request enabling Bluetooth on the current platform.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "list_bluetooth_bonded_devices",
                    "List bonded Bluetooth devices.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "scan_bluetooth_devices",
                    "Scan nearby Bluetooth classic and BLE devices.",
                    "",
                    vec![
                        param("duration_ms", "integer", "optional scan duration in milliseconds", false, Some("10000".to_string())),
                        param("include_ble", "boolean", "optional, include BLE devices", false, Some("true".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_connect",
                    "Connect to a Bluetooth classic device.",
                    "",
                    vec![
                        param("address", "string", "Bluetooth device address", true, None),
                        param("uuid", "string", "optional service UUID", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_listen",
                    "Create a Bluetooth classic listener.",
                    "",
                    vec![
                        param("name", "string", "optional service name", false, None),
                        param("uuid", "string", "optional service UUID", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_accept",
                    "Accept one Bluetooth classic connection from a listener session.",
                    "",
                    vec![
                        param("listener_session_id", "string", "listener session id", true, None),
                        param("timeout_ms", "integer", "optional timeout in milliseconds", false, Some("30000".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_send",
                    "Send text or base64 bytes to a Bluetooth classic session.",
                    "",
                    vec![
                        param("session_id", "string", "Bluetooth session id", true, None),
                        param("text", "string", "text payload; provide exactly one of text or data_base64", false, None),
                        param("data_base64", "string", "base64 payload; provide exactly one of text or data_base64", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_read",
                    "Read data from a Bluetooth classic session.",
                    "",
                    vec![
                        param("session_id", "string", "Bluetooth session id", true, None),
                        param("max_bytes", "integer", "optional maximum bytes to read", false, Some("4096".to_string())),
                        param("timeout_ms", "integer", "optional timeout in milliseconds", false, Some("30000".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_send_and_read",
                    "Send text or base64 bytes to a Bluetooth classic session and read the response.",
                    "",
                    vec![
                        param("session_id", "string", "Bluetooth session id", true, None),
                        param("text", "string", "text payload; provide exactly one of text or data_base64", false, None),
                        param("data_base64", "string", "base64 payload; provide exactly one of text or data_base64", false, None),
                        param("max_bytes", "integer", "optional maximum bytes to read", false, Some("4096".to_string())),
                        param("timeout_ms", "integer", "optional timeout in milliseconds", false, Some("30000".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_close",
                    "Close a Bluetooth classic listener, classic session, or BLE session.",
                    "",
                    vec![
                        param("session_id", "string", "Bluetooth session id", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_ble_connect",
                    "Connect to a BLE device.",
                    "",
                    vec![
                        param("address", "string", "BLE device address", true, None),
                        param("auto_connect", "boolean", "optional, request auto connect where supported", false, Some("false".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_ble_discover_services",
                    "Discover BLE services and characteristics for a BLE session.",
                    "",
                    vec![
                        param("session_id", "string", "BLE session id", true, None),
                        param("timeout_ms", "integer", "optional timeout in milliseconds", false, Some("30000".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_ble_read_characteristic",
                    "Read a BLE characteristic.",
                    "",
                    vec![
                        param("session_id", "string", "BLE session id", true, None),
                        param("service_uuid", "string", "BLE service UUID", true, None),
                        param("characteristic_uuid", "string", "BLE characteristic UUID", true, None),
                        param("timeout_ms", "integer", "optional timeout in milliseconds", false, Some("30000".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_ble_write_characteristic",
                    "Write text or base64 bytes to a BLE characteristic.",
                    "",
                    vec![
                        param("session_id", "string", "BLE session id", true, None),
                        param("service_uuid", "string", "BLE service UUID", true, None),
                        param("characteristic_uuid", "string", "BLE characteristic UUID", true, None),
                        param("text", "string", "text payload; provide exactly one of text or data_base64", false, None),
                        param("data_base64", "string", "base64 payload; provide exactly one of text or data_base64", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_ble_write_and_read_characteristic",
                    "Write text or base64 bytes to one BLE characteristic and read another characteristic.",
                    "",
                    vec![
                        param("session_id", "string", "BLE session id", true, None),
                        param("write_service_uuid", "string", "write BLE service UUID", true, None),
                        param("write_characteristic_uuid", "string", "write BLE characteristic UUID", true, None),
                        param("read_service_uuid", "string", "read BLE service UUID", true, None),
                        param("read_characteristic_uuid", "string", "read BLE characteristic UUID", true, None),
                        param("text", "string", "text payload; provide exactly one of text or data_base64", false, None),
                        param("data_base64", "string", "base64 payload; provide exactly one of text or data_base64", false, None),
                        param("timeout_ms", "integer", "optional timeout in milliseconds", false, Some("30000".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_ble_subscribe_characteristic",
                    "Subscribe or unsubscribe BLE characteristic notifications.",
                    "",
                    vec![
                        param("session_id", "string", "BLE session id", true, None),
                        param("service_uuid", "string", "BLE service UUID", true, None),
                        param("characteristic_uuid", "string", "BLE characteristic UUID", true, None),
                        param("enable", "boolean", "optional, true subscribes and false unsubscribes", false, Some("true".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_ble_read_notifications",
                    "Read queued BLE characteristic notifications for a BLE session.",
                    "",
                    vec![
                        param("session_id", "string", "BLE session id", true, None),
                        param("limit", "integer", "optional maximum notification count", false, Some("50".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_click",
                    "Click an element on the current page by browser_snapshot ref, including refs inside same-origin iframes.",
                    "",
                    vec![
                        param("ref", "string", "target element ref from browser_snapshot output; provide ref or selector", false, None),
                        param("selector", "string", "optional CSS selector used when ref is not available", false, None),
                        param("element", "string", "optional, human-readable element description", false, None),
                        param("doubleClick", "boolean", "optional, perform a double click instead of a single click", false, Some("false".to_string())),
                        param("button", "string", "optional mouse button: left/right/middle", false, Some("left".to_string())),
                        param("modifiers", "array", "optional modifier keys array: Alt/Control/ControlOrMeta/Meta/Shift", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_close",
                    "Close the current browser tab. Closing the last tab also closes the browser overlay.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "browser_close_all",
                    "Close all browser tabs. This also closes the browser overlay.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "browser_console_messages",
                    "Read browser console messages for the current page.",
                    "",
                    vec![
                        param("level", "string", "optional console level: error/warning/info/debug", false, Some("info".to_string())),
                        param("filename", "string", "optional output file name for large results", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_drag",
                    "Perform drag and drop between two page elements.",
                    "",
                    vec![
                        param("startElement", "string", "human-readable source element description", true, None),
                        param("startRef", "string", "source element ref from browser_snapshot output", true, None),
                        param("endElement", "string", "human-readable target element description", true, None),
                        param("endRef", "string", "target element ref from browser_snapshot output", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_evaluate",
                    "Evaluate a JavaScript function on the page or on a target element.",
                    "",
                    vec![
                        param("function", "string", "() => { ... } or (element) => { ... }", true, None),
                        param("element", "string", "optional, human-readable element description", false, None),
                        param("ref", "string", "optional target element ref; required when element is provided", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_file_upload",
                    "Upload one or multiple files to the active file chooser. Omit paths to cancel the chooser.",
                    "",
                    vec![
                        param("paths", "array", "optional absolute file paths", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_fill_form",
                    "Fill multiple form fields on the current page.",
                    "",
                    vec![
                        param("fields", "array", "array of field objects with name/type/value plus ref or selector", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_handle_dialog",
                    "Accept or dismiss the currently open dialog.",
                    "",
                    vec![
                        param("accept", "boolean", "true to accept, false to dismiss", true, None),
                        param("promptText", "string", "optional prompt text when handling a prompt dialog", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_hover",
                    "Hover over an element on the current page.",
                    "",
                    vec![
                        param("element", "string", "optional, human-readable element description", false, None),
                        param("ref", "string", "target element ref from browser_snapshot output", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_navigate",
                    "Navigate the active browser tab to a URL. If no tab exists yet, the first tab is created automatically.",
                    "",
                    vec![
                        param("url", "string", "target URL", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_navigate_back",
                    "Go back in the current tab history.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "browser_network_requests",
                    "Read network requests recorded for the current page.",
                    "",
                    vec![
                        param("includeStatic", "boolean", "optional, include static asset requests", false, Some("false".to_string())),
                        param("filename", "string", "optional output file name for large results", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_press_key",
                    "Press a keyboard key in the current page.",
                    "",
                    vec![
                        param("key", "string", "key name, for example ArrowLeft or a", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_resize",
                    "Resize the browser viewport.",
                    "",
                    vec![
                        param("width", "number", "viewport width", true, None),
                        param("height", "number", "viewport height", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_run_code",
                    "Run a Playwright-style code snippet against the current tab.",
                    "",
                    vec![
                        param("code", "string", "Playwright-style JavaScript snippet", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_select_option",
                    "Select option values in a dropdown element.",
                    "",
                    vec![
                        param("element", "string", "optional, human-readable element description", false, None),
                        param("ref", "string", "target select element ref from browser_snapshot output", true, None),
                        param("values", "array", "option values or visible texts to select", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_snapshot",
                    "Capture a structured accessibility-style snapshot of the current page, including same-origin iframe content.",
                    "",
                    vec![
                        param("filename", "string", "optional output snapshot file name", false, None),
                        param("selector", "string", "optional root element selector for a partial snapshot", false, None),
                        param("depth", "integer", "optional snapshot tree depth limit", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_take_screenshot",
                    "Take a screenshot of the current page or of a specific element.",
                    "",
                    vec![
                        param("type", "string", "optional image type: png or jpeg", false, Some("png".to_string())),
                        param("filename", "string", "optional output file name", false, None),
                        param("element", "string", "optional element description; when present ref is required", false, None),
                        param("ref", "string", "optional element ref; when present element is required", false, None),
                        param("fullPage", "boolean", "optional full-page capture; cannot be used with element screenshots", false, Some("false".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_type",
                    "Type text into an editable element.",
                    "",
                    vec![
                        param("element", "string", "optional, human-readable element description", false, None),
                        param("ref", "string", "target element ref from browser_snapshot output", true, None),
                        param("text", "string", "text to type", true, None),
                        param("submit", "boolean", "optional, press Enter after typing", false, Some("false".to_string())),
                        param("slowly", "boolean", "optional, type character by character", false, Some("false".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_wait_for",
                    "Wait for text to appear, disappear, or for a duration to pass.",
                    "",
                    vec![
                        param("time", "number", "optional wait duration in seconds", false, None),
                        param("text", "string", "optional text that must appear", false, None),
                        param("textGone", "string", "optional text that must disappear", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_tabs",
                    "List, create, select, or close browser tabs using 0-based indexes.",
                    "",
                    vec![
                        param("action", "string", "one of: list, create, select, close", true, None),
                        param("index", "integer", "optional tab index used by select or close", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "device_info",
                    "Get device information.",
                    "",
                    Vec::new(),
                    "",
                    "",
                )
            ],
            "",
        ),
        category(
            "Extended Memory Tools",
            "",
            vec![
                tool(
                    "create_memory",
                    "Creates a new memory node in the library. Use this when you want to save important information for future reference.",
                    "",
                    vec![
                        param("target_owner_key", "string", "required, memory owner key such as character:<character-id> or shared:<shared-id>", true, None),
                        param("title", "string", "required, string", true, None),
                        param("content", "string", "required, string", true, None),
                        param("content_type", "string", "optional", false, Some("\"text/plain\"".to_string())),
                        param("source", "string", "optional", false, Some("\"ai_created\"".to_string())),
                        param("folder_path", "string", "optional", false, Some("\"\"".to_string())),
                        param("tags", "string", "optional, comma-separated string", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "update_memory",
                    "Updates an existing memory node by title. Use this to modify an existing memory's content or metadata.",
                    "",
                    vec![
                        param("target_owner_key", "string", "required, memory owner key such as character:<character-id> or shared:<shared-id>", true, None),
                        param("old_title", "string", "required, string to identify the memory", true, None),
                        param("new_title", "string", "optional, string, new title if renaming", false, None),
                        param("content", "string", "optional, string", false, None),
                        param("content_type", "string", "optional, string", false, None),
                        param("source", "string", "optional, string", false, None),
                        param("credibility", "number", "optional, float 0-1", false, None),
                        param("importance", "number", "optional, float 0-1", false, None),
                        param("folder_path", "string", "optional, string", false, None),
                        param("tags", "string", "optional, comma-separated string", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "delete_memory",
                    "Deletes a memory node from the library by title. Use with caution as this operation is irreversible.",
                    "",
                    vec![
                        param("target_owner_key", "string", "required, memory owner key such as character:<character-id> or shared:<shared-id>", true, None),
                        param("title", "string", "required, string to identify the memory", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "link_memories",
                    "Creates a semantic link between two memories in the library. Use this to establish relationships between related concepts, facts, or pieces of information. This helps build a knowledge graph structure for better memory retrieval and understanding.",
                    "",
                    vec![
                        param("target_owner_key", "string", "required, memory owner key such as character:<character-id> or shared:<shared-id>", true, None),
                        param("source_title", "string", "required, string, the title of the source memory", true, None),
                        param("target_title", "string", "required, string, the title of the target memory", true, None),
                        param("link_type", "string", "optional, string, the type of relationship such as \"related\", \"causes\", \"explains\", \"part_of\", \"contradicts\", etc.", false, Some("\"related\"".to_string())),
                        param("weight", "number", "optional, float 0.0-1.0, the strength of the link with 1.0 being strongest", false, Some("0.7".to_string())),
                        param("description", "string", "optional, string, additional context about the relationship", false, Some("\"\"".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "query_memory_links",
                    "Queries links in the memory graph. Supports filtering by link_id, source_title, target_title, and link_type. Use this before updating/deleting links to precisely identify targets.",
                    "",
                    vec![
                        param("target_owner_key", "string", "required, memory owner key such as character:<character-id> or shared:<shared-id>", true, None),
                        param("link_id", "integer", "optional, exact link id", false, None),
                        param("source_title", "string", "optional, exact source memory title", false, None),
                        param("target_title", "string", "optional, exact target memory title", false, None),
                        param("link_type", "string", "optional, relation type filter", false, None),
                        param("limit", "integer", "optional, int 1-200, maximum links to return", false, Some("20".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "update_user_preferences",
                    "Updates USER.md directly. Use this when stable information about the user or their working style should be remembered in the user profile markdown.",
                    "",
                    vec![
                        param("target_owner_key", "string", "required, memory owner key such as character:<character-id> or shared:<shared-id>", true, None),
                        param("content", "string", "required, complete updated USER.md markdown content", true, None)
                    ],
                    "",
                    "",
                )
            ],
            "",
        ),
        category(
            "Extended HTTP Tools",
            "",
            vec![
                tool(
                    "http_request",
                    "Send HTTP request.",
                    "",
                    vec![
                        param("url", "string", "url", true, None),
                        param("method", "string", "GET/POST/PUT/DELETE", true, None),
                        param("headers", "string", "headers", false, None),
                        param("body", "string", "body", false, None),
                        param("body_type", "string", "json/form/text/xml", false, None),
                        param("ignore_ssl", "boolean", "ignore https certificate verification, true/false", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "multipart_request",
                    "Upload files.",
                    "",
                    vec![
                        param("url", "string", "url", true, None),
                        param("method", "string", "POST/PUT", true, None),
                        param("headers", "string", "headers", false, None),
                        param("form_data", "string", "form_data", false, None),
                        param("files", "string", "JSON array string. Each item is an object: {\"field_name\": string, \"file_path\": string, \"content_type\"?: string, \"file_name\"?: string}", false, None),
                        param("ignore_ssl", "boolean", "ignore https certificate verification, true/false", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "manage_cookies",
                    "Manage cookies.",
                    "",
                    vec![
                        param("action", "string", "get/set/clear", true, None),
                        param("domain", "string", "domain", false, None),
                        param("cookies", "string", "cookies", false, None)
                    ],
                    "",
                    "",
                )
            ],
            "",
        ),
        category(
            "Extended File Tools",
            "",
            vec![
                tool(
                    "file_exists",
                    "Check if a file or directory exists.",
                    "",
                    vec![
                        param("path", "string", "target path", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "move_file",
                    "Move or rename a file or directory.",
                    "",
                    vec![
                        param("source", "string", "source path", true, None),
                        param("destination", "string", "destination path", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "copy_file",
                    "Copy a file or directory through VFS paths.",
                    "",
                    vec![
                        param("source", "string", "source path", true, None),
                        param("destination", "string", "destination path", true, None),
                        param("recursive", "boolean", "boolean", false, Some("false".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "file_info",
                    "Get detailed information about a file or directory including type, size, permissions, owner, group, and last modified time.",
                    "",
                    vec![
                        param("path", "string", "target path", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "zip_files",
                    "Compress files or directories.",
                    "",
                    vec![
                        param("source", "string", "path to compress", true, None),
                        param("destination", "string", "output zip file", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "unzip_files",
                    "Extract a zip file.",
                    "",
                    vec![
                        param("source", "string", "zip file path", true, None),
                        param("destination", "string", "extract path", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "open_file",
                    "Open a file using the system's default application.",
                    "",
                    vec![
                        param("path", "string", "file path", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "share_file",
                    "Share a file with other applications.",
                    "",
                    vec![
                        param("path", "string", "file path", true, None),
                        param("title", "string", "optional share title", false, Some("\"Share File\"".to_string()))
                    ],
                    "",
                    "",
                )
            ],
            "",
        ),
        category(
            "Chat Tools",
            "",
            vec![
                tool(
                    "start_chat_service",
                    "Start the floating chat service.",
                    "",
                    vec![
                        param("initial_mode", "string", "optional, initial floating mode: WINDOW, BALL, VOICE_BALL, FULLSCREEN, RESULT_DISPLAY, SCREEN_OCR", false, None),
                        param("auto_enter_voice_chat", "boolean", "optional, if true then enter voice mode automatically when opening FULLSCREEN", false, Some("false".to_string())),
                        param("wake_launched", "boolean", "optional, true if launched by wake word so UI can adjust behavior", false, Some("false".to_string())),
                        param("timeout_ms", "integer", "optional, auto close the floating window after this timeout (milliseconds). <=0 disables auto-exit.", false, None),
                        param("keep_if_exists", "boolean", "optional, if true and service already running, do not force floating window mode change", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "stop_chat_service",
                    "Stop the floating chat service.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "create_new_chat",
                    "Create a new chat.",
                    "",
                    vec![
                        param("group", "string", "optional group name for the new chat", false, None),
                        param("set_as_current_chat", "boolean", "optional, whether to switch to the new chat (default true)", false, None),
                        param("character_card_id", "string", "optional, character card id to bind for the new chat", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "list_chats",
                    "List chats (supports filtering and sorting).",
                    "",
                    vec![
                        param("query", "string", "optional, title keyword filter", false, None),
                        param("match", "string", "optional, contains | exact | regex (default contains)", false, None),
                        param("limit", "integer", "optional, max results (default 50)", false, None),
                        param("sort_by", "string", "optional, updatedAt | createdAt | messageCount (default updatedAt)", false, None),
                        param("sort_order", "string", "optional, asc | desc (default desc)", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "find_chat",
                    "Find a chat by title and return its info.",
                    "",
                    vec![
                        param("query", "string", "title keyword/regex", true, None),
                        param("match", "string", "optional, contains | exact | regex (default contains)", false, None),
                        param("index", "integer", "optional, pick Nth match (default 0)", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "agent_status",
                    "Check a chat's input processing status.",
                    "",
                    vec![
                        param("chat_id", "string", "target chat id", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "switch_chat",
                    "Switch to a chat.",
                    "",
                    vec![
                        param("chat_id", "string", "target chat id", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "update_chat_title",
                    "Update a chat title.",
                    "",
                    vec![
                        param("chat_id", "string", "target chat id", true, None),
                        param("title", "string", "new chat title", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "delete_chat",
                    "Delete a chat by id.",
                    "",
                    vec![
                        param("chat_id", "string", "target chat id", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "send_message_to_ai",
                    "Send a user message to AI.",
                    "",
                    vec![
                        param("message", "string", "message content", true, None),
                        param("chat_id", "string", "optional, target chat id", false, None),
                        param("runtime", "string", "optional, runtime slot for this send: main | floating (default floating)", false, None),
                        param("role_card_id", "string", "optional, role card id to use for this send", false, None),
                        param("sender_name", "string", "optional, display name of the sender when AI sends as user", false, None),
                        param("persist_turn", "boolean", "optional, whether this user/AI turn should be persisted to chat history; default true", false, None),
                        param("notify_reply", "boolean", "optional, override whether this turn sends reply-completed notification", false, None),
                        param("hide_user_message", "boolean", "optional, hide user message content in UI and show a placeholder marker while keeping original content in history/context", false, None),
                        param("disable_warning", "boolean", "optional, suppress AI-generated warning markup for this turn; when true, warning-driven retry branches stop instead of continuing", false, None),
                        param("timeout_ms", "integer", "optional, maximum wait time in milliseconds for this send, including response-stream acquisition and AI reply; default 180000", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "list_character_cards",
                    "List all role cards.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "get_chat_messages",
                    "Get messages from a specific chat (cross-chat history read).",
                    "",
                    vec![
                        param("chat_id", "string", "target chat id", true, None),
                        param("order", "string", "optional, asc/desc (default desc)", false, None),
                        param("limit", "integer", "optional, number of messages to return (default 20, max 200)", false, None)
                    ],
                    "",
                    "",
                )
            ],
            "",
        ),
        category(
            "Internal File Tools",
            "",
            vec![
                tool(
                    "read_file_full",
                    "Read the full content of a file without enforcing size limit.",
                    "",
                    vec![
                        param("path", "string", "file path", true, None),
                        param("text_only", "boolean", "optional", false, Some("false".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "read_file_binary",
                    "Read binary file and return base64 content.",
                    "",
                    vec![
                        param("path", "string", "file path", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "write_file",
                    "Write content to a file.",
                    "",
                    vec![
                        param("path", "string", "file path", true, None),
                        param("content", "string", "file content", true, None),
                        param("append", "boolean", "optional", false, Some("false".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "write_file_binary",
                    "Write base64 content to a binary file.",
                    "",
                    vec![
                        param("path", "string", "file path", true, None),
                        param("base64Content", "string", "base64 encoded content", true, None)
                    ],
                    "",
                    "",
                )
            ],
            "",
        ),
        category(
            "Internal UI Tools",
            "",
            vec![
                tool(
                    "get_page_info",
                    "Get current page/window UI information.",
                    "",
                    vec![
                        param("format", "string", "optional, xml/json", false, Some("xml".to_string())),
                        param("detail", "string", "optional", false, Some("summary".to_string())),
                        param("display", "string", "optional, display id for multi-display", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "tap",
                    "Tap at screen coordinates.",
                    "",
                    vec![
                        param("x", "integer", "x coordinate", true, None),
                        param("y", "integer", "y coordinate", true, None),
                        param("display", "string", "optional, display id", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "long_press",
                    "Long press at screen coordinates.",
                    "",
                    vec![
                        param("x", "integer", "x coordinate", true, None),
                        param("y", "integer", "y coordinate", true, None),
                        param("display", "string", "optional, display id", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "swipe",
                    "Swipe from start to end coordinates.",
                    "",
                    vec![
                        param("start_x", "integer", "start x", true, None),
                        param("start_y", "integer", "start y", true, None),
                        param("end_x", "integer", "end x", true, None),
                        param("end_y", "integer", "end y", true, None),
                        param("duration", "integer", "optional, duration in ms", false, Some("300".to_string())),
                        param("display", "string", "optional, display id", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "click_element",
                    "Click a UI element by resource id / class name / content description / bounds.",
                    "",
                    vec![
                        param("resourceId", "string", "optional", false, None),
                        param("className", "string", "optional", false, None),
                        param("contentDesc", "string", "optional", false, None),
                        param("bounds", "string", "optional, format: [left,top][right,bottom]", false, None),
                        param("partialMatch", "boolean", "optional, enable partial match for selectors", false, Some("false".to_string())),
                        param("index", "integer", "optional", false, Some("0".to_string())),
                        param("display", "string", "optional, display id", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "set_input_text",
                    "Set input text in focused field.",
                    "",
                    vec![
                        param("text", "string", "text to input (can be empty to clear)", true, None),
                        param("display", "string", "optional, display id", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "press_key",
                    "Press a key via keyevent.",
                    "",
                    vec![
                        param("key_code", "string", "key code, e.g. KEYCODE_HOME", true, None),
                        param("display", "string", "optional, display id", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "capture_screenshot",
                    "Capture a screenshot and return a file path.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "run_ui_subagent",
                    "Run a lightweight UI automation subagent.",
                    "",
                    vec![
                        param("intent", "string", "task description", true, None),
                        param("max_steps", "integer", "optional", false, Some("20".to_string())),
                        param("agent_id", "string", "optional, reuse agent session id. If omitted or 'default', uses the main screen. If provided and not 'default', the requested virtual screen session must be active/available; otherwise the run fails.", false, None),
                        param("target_app", "string", "optional, target app package name", false, None)
                    ],
                    "",
                    "",
                )
            ],
            "",
        ),
        category(
            "Software Settings Tools",
            "",
            vec![
                tool(
                    "read_environment_variable",
                    "Read current value of an environment variable by key.",
                    "",
                    vec![
                        param("key", "string", "environment variable key", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "write_environment_variable",
                    "Write an environment variable by key; empty value clears it.",
                    "",
                    vec![
                        param("key", "string", "environment variable key", true, None),
                        param("value", "string", "optional, value to write; empty clears the key", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "execute_cli_command",
                    "Execute an Operit CLI command by argument array and return stdout/stderr output.",
                    "",
                    vec![
                        param("args", "string", "JSON string array of CLI arguments, matching Tools.SoftwareSettings.exec(args)", true, None)
                    ],
                    "",
                    "",
                )
            ],
            "",
        ),
        category(
            "Internal System Tools",
            "",
            vec![
                tool(
                    "close_all_virtual_displays",
                    "Close all virtual display overlays.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "modify_system_setting",
                    "Modify a system setting.",
                    "",
                    vec![
                        param("setting", "string", "setting key (alias: key)", true, None),
                        param("value", "string", "setting value", true, None),
                        param("namespace", "string", "optional, system/secure/global", false, Some("system".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "get_system_setting",
                    "Get a system setting.",
                    "",
                    vec![
                        param("setting", "string", "setting key (alias: key)", true, None),
                        param("namespace", "string", "optional, system/secure/global", false, Some("system".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "install_app",
                    "Request app installation through the current host.",
                    "",
                    vec![
                        param("path", "string", "installer file path for the current host, for example Android APK, Windows MSI/MSIX/EXE, or Linux desktop installer file", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "uninstall_app",
                    "Request app uninstallation through the current host.",
                    "",
                    vec![
                        param("package_name", "string", "host app/package identifier, for example Android package name, Windows Appx/MSIX package name or MSI product code, or Linux Flatpak app id/local .desktop file", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "list_installed_apps",
                    "List installed apps.",
                    "",
                    vec![
                        param("include_system_apps", "boolean", "optional", false, Some("false".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "start_app",
                    "Start an app through the current host.",
                    "",
                    vec![
                        param("package_name", "string", "host app/package identifier or executable name", true, None),
                        param("activity", "string", "optional, Android activity class name", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "stop_app",
                    "Stop an app background process through the current host.",
                    "",
                    vec![
                        param("package_name", "string", "host app/package identifier or process name", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "get_notifications",
                    "Get current host notifications when the host exposes a notification history/listener API.",
                    "",
                    vec![
                        param("limit", "integer", "optional", false, Some("10".to_string())),
                        param("include_ongoing", "boolean", "optional", false, Some("false".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "get_app_usage_time",
                    "Get foreground or process usage time from the current host. On Android this uses Usage Access; desktop hosts report the data exposed by the platform host.",
                    "",
                    vec![
                        param("package_name", "string", "optional, exact app package name to query", false, None),
                        param("since_hours", "integer", "optional, look back this many hours", false, Some("24".to_string())),
                        param("limit", "integer", "optional, max apps to return when package_name is not provided", false, Some("10".to_string())),
                        param("include_system_apps", "boolean", "optional, include system apps when package_name is not provided", false, Some("false".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "toast",
                    "Show a short toast/message on the current host.",
                    "",
                    vec![
                        param("message", "string", "toast text", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "send_notification",
                    "Send a notification using the AI reply completion notification channel.",
                    "",
                    vec![
                        param("title", "string", "optional", false, None),
                        param("message", "string", "notification body", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "get_device_location",
                    "Get current host device location.",
                    "",
                    vec![
                        param("timeout", "integer", "optional, seconds", false, Some("10".to_string())),
                        param("high_accuracy", "boolean", "optional", false, Some("false".to_string())),
                        param("include_address", "boolean", "optional", false, Some("true".to_string()))
                    ],
                    "",
                    "",
                )
            ],
            "",
        ),
    ]
}

fn internalToolCategoriesCnSource() -> Vec<SystemToolPromptCategory> {
    vec![
        category(
            "Internal tools",
            "",
            vec![
                tool(
                    "get_terminal_info",
                    "Get terminal platform information and supported terminal types.",
                    "",
                    vec![],
                    "",
                    "",
                ),
                tool(
                    "apply_file",
                    "Edit files by finding and replacing/deleting matching content blocks.",
                    "",
                    vec![
                        param("path", "string", "File path", true, None),
                        param("type", "string", "Operation type: replace | delete | create", true, None),
                        param("old", "string", "Original content to match/replace/delete (required for replace/delete)", false, None),
                        param("new", "string", "New content to insert (required for replace/create)", false, None)
                    ],
                    "\n  - **How it works**:\n    - The tool performs a best-effort fuzzy match of `old` against the file's current content (line numbers are not used), then performs the specified operation.\n    - You can call this tool multiple times to make several independent edits to the same file.\n\n  - **Parameters**:\n    - `type`:\n      - `replace`: replace the matched `old` with `new`\n      - `delete`: delete the matched `old`\n      - `create`: create the file when it does not exist (using `new` as the full file content)\n    - `old`: required for `replace` / `delete`\n    - `new`: required for `replace` / `create`\n\n  - **Key rules**:\n    1. **If you need to rewrite an entire existing file**: do not use apply_file to overwrite it directly. First use `delete_file`, then use `apply_file` with `type=create`.\n    2. **If you need to modify an existing file**: you must use `type=replace` (or `type=delete`) and provide `old/new` (or `old`). Do not delete the whole file and rewrite it.\n",
                    "",
                ),
                tool(
                    "create_terminal_session",
                    "Create or get a terminal session.",
                    "",
                    vec![
                        param("session_name", "string", "Terminal session name", true, None),
                        param("type", "string", "Optional terminal type. Linux host supports linux. Windows host supports bash and powershell.", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "execute_in_terminal_session",
                    "Execute a command in a terminal session and return the complete output in one go.",
                    "",
                    vec![
                        param("session_id", "string", "Terminal session ID", true, None),
                        param("command", "string", "The command to execute", true, None),
                        param("timeout_ms", "integer", "Optional, timeout in milliseconds", false, Some("1800000".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "execute_in_terminal_session_streaming",
                    "Execute a command in a terminal session and stream the output back.",
                    "",
                    vec![
                        param("session_id", "string", "Terminal session ID", true, None),
                        param("command", "string", "The command to execute", true, None),
                        param("timeout_ms", "integer", "Optional, timeout in milliseconds", false, Some("1800000".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "execute_hidden_terminal_command",
                    "Execute a command in a hidden non-PTY terminal executor. Commands using the same executor_key reuse the same background login context and are not shown in the visible terminal UI.",
                    "",
                    vec![
                        param("command", "string", "The command to execute", true, None),
                        param("type", "string", "Optional terminal type. Linux host supports linux. Windows host supports bash and powershell.", false, None),
                        param("executor_key", "string", "Optional, hidden executor key used to reuse the same background shell context", false, Some("default".to_string())),
                        param("timeout_ms", "integer", "Optional, timeout in milliseconds", false, Some("120000".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "input_in_terminal_session",
                    "Write input to a terminal session. Provide at least one of input and control. Usually send input first, then send control=enter to submit the content.",
                    "",
                    vec![
                        param("session_id", "string", "Terminal session ID", true, None),
                        param("input", "string", "Text to write to the terminal (may contain newlines)", false, None),
                        param("control", "string", "Control key or modifier key (e.g. enter/tab/esc/up/down/left/right/home/end/pageup/pagedown, or control=ctrl with input=c for Ctrl+C)", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "close_terminal_session",
                    "Close the terminal session.",
                    "",
                    vec![
                        param("session_id", "string", "Terminal session ID", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "get_terminal_session_screen",
                    "Get the currently visible PTY screen content of a terminal session (one screen only, excluding the scrollback history buffer).",
                    "",
                    vec![
                        param("session_id", "string", "Terminal session ID", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "music_play",
                    "Play audio using the app's built-in music player.",
                    "",
                    vec![
                        param("source", "string", "Audio source", true, None),
                        param("source_type", "string", "Source type: path | url | uri", true, None),
                        param("title", "string", "Optional, display title", false, None),
                        param("artist", "string", "Optional, display artist", false, None),
                        param("loop", "boolean", "Optional, loop the current track", false, None),
                        param("volume", "number", "Optional, 0 to 1", false, None),
                        param("start_position_ms", "integer", "Optional, playback start position in milliseconds", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "music_pause",
                    "Pause the current in-app music playback.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "music_resume",
                    "Resume the current in-app music playback.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "music_stop",
                    "Stop the current in-app music playback.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "music_seek",
                    "Seek the current in-app music playback position.",
                    "",
                    vec![
                        param("position_ms", "integer", "Target position in milliseconds", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "music_set_volume",
                    "Set the current in-app music playback volume.",
                    "",
                    vec![
                        param("volume", "number", "Volume, 0 to 1", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "music_status",
                    "Get the current in-app music playback state.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "request_bluetooth_permission",
                    "Request Bluetooth permission on the current platform.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "get_bluetooth_state",
                    "Get Bluetooth adapter support, enabled state, and state label.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "request_enable_bluetooth",
                    "Request to enable Bluetooth on the current platform.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "list_bluetooth_bonded_devices",
                    "List paired Bluetooth devices.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "scan_bluetooth_devices",
                    "Scan for nearby Bluetooth Classic and BLE devices.",
                    "",
                    vec![
                        param("duration_ms", "integer", "Optional, scan duration in milliseconds", false, Some("10000".to_string())),
                        param("include_ble", "boolean", "Optional, whether to include BLE devices", false, Some("true".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_connect",
                    "Connect to a Bluetooth Classic device.",
                    "",
                    vec![
                        param("address", "string", "Bluetooth device address", true, None),
                        param("uuid", "string", "Optional, service UUID", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_listen",
                    "Create a Bluetooth Classic listening session.",
                    "",
                    vec![
                        param("name", "string", "Optional, service name", false, None),
                        param("uuid", "string", "Optional, service UUID", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_accept",
                    "Accept a Bluetooth Classic connection from the listening session.",
                    "",
                    vec![
                        param("listener_session_id", "string", "Listening session ID", true, None),
                        param("timeout_ms", "integer", "Optional, timeout in milliseconds", false, Some("30000".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_send",
                    "Send text or base64 bytes to a Bluetooth Classic session.",
                    "",
                    vec![
                        param("session_id", "string", "Bluetooth session ID", true, None),
                        param("text", "string", "Text payload; either text or data_base64 must be provided", false, None),
                        param("data_base64", "string", "base64 payload; either text or data_base64 must be provided", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_read",
                    "Read data from a Bluetooth Classic session.",
                    "",
                    vec![
                        param("session_id", "string", "Bluetooth session ID", true, None),
                        param("max_bytes", "integer", "Optional, maximum number of bytes to read", false, Some("4096".to_string())),
                        param("timeout_ms", "integer", "Optional, timeout in milliseconds", false, Some("30000".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_send_and_read",
                    "Send text or base64 bytes to a Bluetooth Classic session and read the response.",
                    "",
                    vec![
                        param("session_id", "string", "Bluetooth session ID", true, None),
                        param("text", "string", "Text payload; either text or data_base64 must be provided", false, None),
                        param("data_base64", "string", "base64 payload; either text or data_base64 must be provided", false, None),
                        param("max_bytes", "integer", "Optional, maximum number of bytes to read", false, Some("4096".to_string())),
                        param("timeout_ms", "integer", "Optional, timeout in milliseconds", false, Some("30000".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_close",
                    "Close a Bluetooth Classic listener, Classic session, or BLE session.",
                    "",
                    vec![
                        param("session_id", "string", "Bluetooth session ID", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_ble_connect",
                    "Connect to a BLE device.",
                    "",
                    vec![
                        param("address", "string", "BLE device address", true, None),
                        param("auto_connect", "boolean", "Optional, request auto connection on supported platforms", false, Some("false".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_ble_discover_services",
                    "Discover services and characteristics of a BLE session.",
                    "",
                    vec![
                        param("session_id", "string", "BLE session ID", true, None),
                        param("timeout_ms", "integer", "Optional, timeout in milliseconds", false, Some("30000".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_ble_read_characteristic",
                    "Read a BLE characteristic.",
                    "",
                    vec![
                        param("session_id", "string", "BLE session ID", true, None),
                        param("service_uuid", "string", "BLE service UUID", true, None),
                        param("characteristic_uuid", "string", "BLE characteristic UUID", true, None),
                        param("timeout_ms", "integer", "Optional, timeout in milliseconds", false, Some("30000".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_ble_write_characteristic",
                    "Write text or base64 bytes to a BLE characteristic.",
                    "",
                    vec![
                        param("session_id", "string", "BLE session ID", true, None),
                        param("service_uuid", "string", "BLE service UUID", true, None),
                        param("characteristic_uuid", "string", "BLE characteristic UUID", true, None),
                        param("text", "string", "Text payload; either text or data_base64 must be provided", false, None),
                        param("data_base64", "string", "base64 payload; either text or data_base64 must be provided", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_ble_write_and_read_characteristic",
                    "Write text or base64 bytes to one BLE characteristic and read another BLE characteristic.",
                    "",
                    vec![
                        param("session_id", "string", "BLE session ID", true, None),
                        param("write_service_uuid", "string", "BLE service UUID to write to", true, None),
                        param("write_characteristic_uuid", "string", "BLE characteristic UUID to write to", true, None),
                        param("read_service_uuid", "string", "BLE service UUID to read from", true, None),
                        param("read_characteristic_uuid", "string", "BLE characteristic UUID to read from", true, None),
                        param("text", "string", "Text payload; either text or data_base64 must be provided", false, None),
                        param("data_base64", "string", "base64 payload; either text or data_base64 must be provided", false, None),
                        param("timeout_ms", "integer", "Optional, timeout in milliseconds", false, Some("30000".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_ble_subscribe_characteristic",
                    "Subscribe to or unsubscribe from BLE characteristic notifications.",
                    "",
                    vec![
                        param("session_id", "string", "BLE session ID", true, None),
                        param("service_uuid", "string", "BLE service UUID", true, None),
                        param("characteristic_uuid", "string", "BLE characteristic UUID", true, None),
                        param("enable", "boolean", "Optional, true to subscribe, false to unsubscribe", false, Some("true".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "bluetooth_ble_read_notifications",
                    "Read cached characteristic notifications of a BLE session.",
                    "",
                    vec![
                        param("session_id", "string", "BLE session ID", true, None),
                        param("limit", "integer", "Optional, maximum number of notifications", false, Some("50".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_click",
                    "Click a current page element by its ref from browser_snapshot, including refs inside same-origin iframes.",
                    "",
                    vec![
                        param("ref", "string", "Target element ref from browser_snapshot output; provide at least one of ref and selector", false, None),
                        param("selector", "string", "Optional, CSS selector to use when ref is unavailable", false, None),
                        param("element", "string", "Optional, human-readable element description", false, None),
                        param("doubleClick", "boolean", "Optional, whether to double-click", false, Some("false".to_string())),
                        param("button", "string", "Optional mouse button: left/right/middle", false, Some("left".to_string())),
                        param("modifiers", "array", "Optional array of modifier keys: Alt/Control/ControlOrMeta/Meta/Shift", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_close",
                    "Close the current browser tab. Closing the last tab also closes the browser floating window.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "browser_close_all",
                    "Close all browser tabs and close the browser floating window.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "browser_console_messages",
                    "Read the browser console messages of the current page.",
                    "",
                    vec![
                        param("level", "string", "Optional, console level: error/warning/info/debug", false, Some("info".to_string())),
                        param("filename", "string", "Optional, output filename for large results", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_drag",
                    "Perform a drag and drop between two page elements.",
                    "",
                    vec![
                        param("startElement", "string", "Human-readable description of the source element", true, None),
                        param("startRef", "string", "Source element ref", true, None),
                        param("endElement", "string", "Human-readable description of the target element", true, None),
                        param("endRef", "string", "Target element ref", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_evaluate",
                    "Execute a JavaScript function on the page or on a target element.",
                    "",
                    vec![
                        param("function", "string", "() => { ... } or (element) => { ... }", true, None),
                        param("element", "string", "Optional, human-readable element description", false, None),
                        param("ref", "string", "Optional, target element ref; must be provided together with element", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_file_upload",
                    "Upload one or more files to the current file chooser. Cancels the chooser when paths is not provided.",
                    "",
                    vec![
                        param("paths", "array", "Optional, array of absolute file paths", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_fill_form",
                    "Fill in multiple form fields on the current page in batch.",
                    "",
                    vec![
                        param("fields", "array", "Array of field objects, each containing name/type/value plus a ref or selector", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_handle_dialog",
                    "Accept or dismiss the currently open dialog.",
                    "",
                    vec![
                        param("accept", "boolean", "true to accept, false to dismiss", true, None),
                        param("promptText", "string", "Optional, text to enter when handling a prompt", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_hover",
                    "Hover over a target element on the current page.",
                    "",
                    vec![
                        param("element", "string", "Optional, human-readable element description", false, None),
                        param("ref", "string", "Target element ref", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_navigate",
                    "Navigate the currently active tab to the specified URL. If there is no tab yet, the first tab is created automatically.",
                    "",
                    vec![
                        param("url", "string", "Target URL", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_navigate_back",
                    "Go back in the current tab's history.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "browser_network_requests",
                    "Read the network requests recorded for the current page.",
                    "",
                    vec![
                        param("includeStatic", "boolean", "Optional, whether to include static resource requests", false, Some("false".to_string())),
                        param("filename", "string", "Optional, output filename for large results", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_press_key",
                    "Press a keyboard key on the current page.",
                    "",
                    vec![
                        param("key", "string", "Key name, e.g. ArrowLeft or a", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_resize",
                    "Resize the browser viewport.",
                    "",
                    vec![
                        param("width", "number", "Viewport width", true, None),
                        param("height", "number", "Viewport height", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_run_code",
                    "Run a Playwright-style code snippet.",
                    "",
                    vec![
                        param("code", "string", "Playwright-style JavaScript code snippet", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_select_option",
                    "Select one or more option values in a dropdown element.",
                    "",
                    vec![
                        param("element", "string", "Optional, human-readable element description", false, None),
                        param("ref", "string", "Target dropdown element ref from browser_snapshot output", true, None),
                        param("values", "array", "Array of values or visible texts to select", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_snapshot",
                    "Capture a structured accessibility-style snapshot of the current page, including same-origin iframe content.",
                    "",
                    vec![
                        param("filename", "string", "Optional, output snapshot filename", false, None),
                        param("selector", "string", "Optional, root element selector for a partial snapshot", false, None),
                        param("depth", "integer", "Optional, snapshot tree depth limit", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_take_screenshot",
                    "Take a screenshot of the current page or a specific element.",
                    "",
                    vec![
                        param("type", "string", "Optional, image type: png or jpeg", false, Some("png".to_string())),
                        param("filename", "string", "Optional, output filename", false, None),
                        param("element", "string", "Optional, element description; ref must be provided together with it", false, None),
                        param("ref", "string", "Optional, element ref; element must be provided together with it", false, None),
                        param("fullPage", "boolean", "Optional, whether to take a full-page screenshot; not available for element screenshots", false, Some("false".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_type",
                    "Type text into an editable element.",
                    "",
                    vec![
                        param("element", "string", "Optional, human-readable element description", false, None),
                        param("ref", "string", "Target element ref from browser_snapshot output", true, None),
                        param("text", "string", "Text to type", true, None),
                        param("submit", "boolean", "Optional, whether to press Enter to submit after typing", false, Some("false".to_string())),
                        param("slowly", "boolean", "Optional, whether to type character by character", false, Some("false".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_wait_for",
                    "Wait for text to appear or disappear, or wait for a specified duration.",
                    "",
                    vec![
                        param("time", "number", "Optional, number of seconds to wait", false, None),
                        param("text", "string", "Optional, text to wait for to appear", false, None),
                        param("textGone", "string", "Optional, text to wait for to disappear", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "browser_tabs",
                    "List, create, switch, or close browser tabs using 0-based indexes.",
                    "",
                    vec![
                        param("action", "string", "One of list/create/select/close", true, None),
                        param("index", "integer", "Optional, tab index used by select or close", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "device_info",
                    "Get device information.",
                    "",
                    Vec::new(),
                    "",
                    "",
                )
            ],
            "",
        ),
        category(
            "Extended Memory Tools",
            "",
            vec![
                tool(
                    "create_memory",
                    "Create a new memory node in the memory library. Use it when you want to save important information for future reference.",
                    "",
                    vec![
                        param("target_owner_key", "string", "Required, memory owner key, e.g. character:<character-id> or shared:<shared-id>", true, None),
                        param("title", "string", "Required, string", true, None),
                        param("content", "string", "Required, string", true, None),
                        param("content_type", "string", "Optional", false, Some("\"text/plain\"".to_string())),
                        param("source", "string", "Optional", false, Some("\"ai_created\"".to_string())),
                        param("folder_path", "string", "Optional", false, Some("\"\"".to_string())),
                        param("tags", "string", "Optional, comma-separated string", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "update_memory",
                    "Update an existing memory node by title. Used to modify the content or metadata of an existing memory.",
                    "",
                    vec![
                        param("target_owner_key", "string", "Required, memory owner key, e.g. character:<character-id> or shared:<shared-id>", true, None),
                        param("old_title", "string", "Required, string, used to identify the memory", true, None),
                        param("new_title", "string", "Optional, string, new title when renaming", false, None),
                        param("content", "string", "Optional, string", false, None),
                        param("content_type", "string", "Optional, string", false, None),
                        param("source", "string", "Optional, string", false, None),
                        param("credibility", "number", "Optional, float 0-1", false, None),
                        param("importance", "number", "Optional, float 0-1", false, None),
                        param("folder_path", "string", "Optional, string", false, None),
                        param("tags", "string", "Optional, comma-separated string", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "delete_memory",
                    "Delete a memory node from the memory library by title. Use with caution; this operation is irreversible.",
                    "",
                    vec![
                        param("target_owner_key", "string", "Required, memory owner key, e.g. character:<character-id> or shared:<shared-id>", true, None),
                        param("title", "string", "Required, string, used to identify the memory", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "link_memories",
                    "Create a semantic link between two memories in the memory library. Used to build relationships between related concepts, facts, or pieces of information. This helps build a knowledge graph structure for better memory retrieval and understanding.",
                    "",
                    vec![
                        param("target_owner_key", "string", "Required, memory owner key, e.g. character:<character-id> or shared:<shared-id>", true, None),
                        param("source_title", "string", "Required, string, title of the source memory", true, None),
                        param("target_title", "string", "Required, string, title of the target memory", true, None),
                        param("link_type", "string", "Optional, string, relation type, e.g. \"related\", \"causes\", \"explains\", \"part_of\", \"contradicts\", etc.", false, Some("\"related\"".to_string())),
                        param("weight", "number", "Optional, float 0.0-1.0, link strength, 1.0 is the strongest", false, Some("0.7".to_string())),
                        param("description", "string", "Optional, string, additional context about the relation", false, Some("\"\"".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "query_memory_links",
                    "Query links in the memory graph. Supports filtering by link_id, source_title, target_title, and link_type. Suitable for precisely locating a target before updating/deleting a link.",
                    "",
                    vec![
                        param("target_owner_key", "string", "Required, memory owner key, e.g. character:<character-id> or shared:<shared-id>", true, None),
                        param("link_id", "integer", "Optional, exact link ID", false, None),
                        param("source_title", "string", "Optional, exact title of the source memory", false, None),
                        param("target_title", "string", "Optional, exact title of the target memory", false, None),
                        param("link_type", "string", "Optional, relation type filter", false, None),
                        param("limit", "integer", "Optional, integer 1-200, maximum number of links to return", false, Some("20".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "update_user_preferences",
                    "Update USER.md directly. Use it when stable user information or the user's way of working needs to be written into the user profile markdown.",
                    "",
                    vec![
                        param("target_owner_key", "string", "Required, memory owner key, e.g. character:<character-id> or shared:<shared-id>", true, None),
                        param("content", "string", "Required, the updated full USER.md markdown content", true, None)
                    ],
                    "",
                    "",
                )
            ],
            "",
        ),
        category(
            "Extended HTTP Tools",
            "",
            vec![
                tool(
                    "http_request",
                    "Send an HTTP request.",
                    "",
                    vec![
                        param("url", "string", "url", true, None),
                        param("method", "string", "GET/POST/PUT/DELETE", true, None),
                        param("headers", "string", "headers", false, None),
                        param("body", "string", "body", false, None),
                        param("body_type", "string", "json/form/text/xml", false, None),
                        param("ignore_ssl", "boolean", "Whether to ignore HTTPS certificate verification, true/false", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "multipart_request",
                    "Upload files.",
                    "",
                    vec![
                        param("url", "string", "url", true, None),
                        param("method", "string", "POST/PUT", true, None),
                        param("headers", "string", "headers", false, None),
                        param("form_data", "string", "form_data", false, None),
                        param("files", "string", "JSON array string. Each element is an object: {\"field_name\": string, \"file_path\": string, optional \"content_type\": string, optional \"file_name\": string}", false, None),
                        param("ignore_ssl", "boolean", "Whether to ignore HTTPS certificate verification, true/false", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "manage_cookies",
                    "Manage cookies.",
                    "",
                    vec![
                        param("action", "string", "get/set/clear", true, None),
                        param("domain", "string", "domain", false, None),
                        param("cookies", "string", "cookies", false, None)
                    ],
                    "",
                    "",
                )
            ],
            "",
        ),
        category(
            "Extended File Tools",
            "",
            vec![
                tool(
                    "file_exists",
                    "Check whether a file or directory exists.",
                    "",
                    vec![
                        param("path", "string", "Target path", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "move_file",
                    "Move or rename a file or directory.",
                    "",
                    vec![
                        param("source", "string", "Source path", true, None),
                        param("destination", "string", "Target path", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "copy_file",
                    "Copy a file or directory via VFS paths.",
                    "",
                    vec![
                        param("source", "string", "Source path", true, None),
                        param("destination", "string", "Target path", true, None),
                        param("recursive", "boolean", "Boolean", false, Some("false".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "file_info",
                    "Get detailed information about a file or directory, including type, size, permissions, owner, group, and last modified time.",
                    "",
                    vec![
                        param("path", "string", "Target path", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "zip_files",
                    "Compress a file or directory.",
                    "",
                    vec![
                        param("source", "string", "Path to compress", true, None),
                        param("destination", "string", "Output zip file", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "unzip_files",
                    "Extract a zip file.",
                    "",
                    vec![
                        param("source", "string", "Zip file path", true, None),
                        param("destination", "string", "Extraction path", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "open_file",
                    "Open a file with the system default application.",
                    "",
                    vec![
                        param("path", "string", "File path", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "share_file",
                    "Share a file with other applications.",
                    "",
                    vec![
                        param("path", "string", "File path", true, None),
                        param("title", "string", "Optional share title", false, Some("\"Share File\"".to_string()))
                    ],
                    "",
                    "",
                )
            ],
            "",
        ),
        category(
            "Conversation Tools",
            "",
            vec![
                tool(
                    "start_chat_service",
                    "Start the conversation service (floating window).",
                    "",
                    vec![
                        param("initial_mode", "string", "Optional, initial floating mode: WINDOW, BALL, VOICE_BALL, FULLSCREEN, RESULT_DISPLAY, SCREEN_OCR", false, None),
                        param("auto_enter_voice_chat", "boolean", "Optional, when true, automatically enter voice mode when opening FULLSCREEN", false, Some("false".to_string())),
                        param("wake_launched", "boolean", "Optional, true if launched by a wake word so the UI can adjust its behavior", false, Some("false".to_string())),
                        param("timeout_ms", "integer", "Optional, automatically close the floating window after the timeout (ms); <=0 disables auto-close", false, None),
                        param("keep_if_exists", "boolean", "Optional, do not force switching the floating window mode if the service is already running", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "stop_chat_service",
                    "Stop the conversation service (floating window).",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "create_new_chat",
                    "Create a new conversation.",
                    "",
                    vec![
                        param("group", "string", "New conversation group name (optional)", false, None),
                        param("set_as_current_chat", "boolean", "Optional, whether to switch to the new conversation (default true)", false, None),
                        param("character_card_id", "string", "Optional, character card ID to bind when creating the conversation", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "list_chats",
                    "List all conversations (supports filtering and sorting).",
                    "",
                    vec![
                        param("query", "string", "Optional, filter by title keyword", false, None),
                        param("match", "string", "Optional, contains | exact | regex (default contains)", false, None),
                        param("limit", "integer", "Optional, maximum number of entries to return (default 50)", false, None),
                        param("sort_by", "string", "Optional, updatedAt | createdAt | messageCount (default updatedAt)", false, None),
                        param("sort_order", "string", "Optional, asc | desc (default desc)", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "find_chat",
                    "Find a conversation by title and return its information.",
                    "",
                    vec![
                        param("query", "string", "Title keyword/regex", true, None),
                        param("match", "string", "Optional, contains | exact | regex (default contains)", false, None),
                        param("index", "integer", "Optional, select the Nth match (default 0)", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "agent_status",
                    "Query the input processing state of a conversation.",
                    "",
                    vec![
                        param("chat_id", "string", "Target conversation ID", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "switch_chat",
                    "Switch to the specified conversation.",
                    "",
                    vec![
                        param("chat_id", "string", "Target conversation ID", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "update_chat_title",
                    "Update the conversation title.",
                    "",
                    vec![
                        param("chat_id", "string", "Target conversation ID", true, None),
                        param("title", "string", "New conversation title", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "delete_chat",
                    "Delete a conversation by ID.",
                    "",
                    vec![
                        param("chat_id", "string", "Target conversation ID", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "send_message_to_ai",
                    "Send a message to the AI.",
                    "",
                    vec![
                        param("message", "string", "Message content", true, None),
                        param("chat_id", "string", "Optional, target conversation ID", false, None),
                        param("runtime", "string", "Optional, runtime used for this send: main | floating (default floating)", false, None),
                        param("role_card_id", "string", "Optional, character card ID used for this send", false, None),
                        param("sender_name", "string", "Optional, display name when sending as the user", false, None),
                        param("persist_turn", "boolean", "Optional, whether the user message and AI reply of this turn are persisted to chat history, default true", false, None),
                        param("notify_reply", "boolean", "Optional, overrides whether a reply-completion notification is sent for this turn", false, None),
                        param("hide_user_message", "boolean", "Optional, hide only the user message body in the UI and show a placeholder marker, while keeping the original text in history and context", false, None),
                        param("disable_warning", "boolean", "Optional, disable the AI-generated warning marker for this turn; when true, branches that rely on warnings to continue retrying stop directly", false, None),
                        param("timeout_ms", "integer", "Optional, maximum wait time for this send (ms), overriding response stream fetching and AI reply waiting; default 180000", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "list_character_cards",
                    "List all character cards.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "get_chat_messages",
                    "Read the message content of the specified conversation (cross-topic read).",
                    "",
                    vec![
                        param("chat_id", "string", "Target conversation ID", true, None),
                        param("order", "string", "Optional, asc/desc (default desc)", false, None),
                        param("limit", "integer", "Optional, number of messages to return (default 20, max 200)", false, None)
                    ],
                    "",
                    "",
                )
            ],
            "",
        ),
        category(
            "Internal File Tools",
            "",
            vec![
                tool(
                    "read_file_full",
                    "Read the full file content (no size limit).",
                    "",
                    vec![
                        param("path", "string", "File path", true, None),
                        param("text_only", "boolean", "Optional", false, Some("false".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "read_file_binary",
                    "Read a binary file and return its Base64 content.",
                    "",
                    vec![
                        param("path", "string", "File path", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "write_file",
                    "Write file content.",
                    "",
                    vec![
                        param("path", "string", "File path", true, None),
                        param("content", "string", "File content", true, None),
                        param("append", "boolean", "Optional", false, Some("false".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "write_file_binary",
                    "Write Base64 content to a binary file.",
                    "",
                    vec![
                        param("path", "string", "File path", true, None),
                        param("base64Content", "string", "Base64 encoded content", true, None)
                    ],
                    "",
                    "",
                )
            ],
            "",
        ),
        category(
            "Internal UI Tools",
            "",
            vec![
                tool(
                    "get_page_info",
                    "Get the current page/window UI information.",
                    "",
                    vec![
                        param("format", "string", "Optional, xml/json", false, Some("xml".to_string())),
                        param("detail", "string", "Optional", false, Some("summary".to_string())),
                        param("display", "string", "Optional, display id for multi-screen", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "tap",
                    "Tap screen coordinates.",
                    "",
                    vec![
                        param("x", "integer", "x coordinate", true, None),
                        param("y", "integer", "y coordinate", true, None),
                        param("display", "string", "Optional, display id for multi-screen", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "long_press",
                    "Long-press screen coordinates.",
                    "",
                    vec![
                        param("x", "integer", "x coordinate", true, None),
                        param("y", "integer", "y coordinate", true, None),
                        param("display", "string", "Optional, display id for multi-screen", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "swipe",
                    "Perform a swipe gesture.",
                    "",
                    vec![
                        param("start_x", "integer", "Start x", true, None),
                        param("start_y", "integer", "Start y", true, None),
                        param("end_x", "integer", "End x", true, None),
                        param("end_y", "integer", "End y", true, None),
                        param("duration", "integer", "Optional, duration in milliseconds", false, Some("300".to_string())),
                        param("display", "string", "Optional, display id for multi-screen", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "click_element",
                    "Click a UI element (resourceId / className / contentDesc / bounds).",
                    "",
                    vec![
                        param("resourceId", "string", "Optional", false, None),
                        param("className", "string", "Optional", false, None),
                        param("contentDesc", "string", "Optional", false, None),
                        param("bounds", "string", "Optional, format: [left,top][right,bottom]", false, None),
                        param("partialMatch", "boolean", "Optional, whether to enable partial matching", false, Some("false".to_string())),
                        param("index", "integer", "Optional", false, Some("0".to_string())),
                        param("display", "string", "Optional, display id for multi-screen", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "set_input_text",
                    "Set input box text (pass an empty string to clear it).",
                    "",
                    vec![
                        param("text", "string", "Text to enter", true, None),
                        param("display", "string", "Optional, display id for multi-screen", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "press_key",
                    "Press a key (keyevent).",
                    "",
                    vec![
                        param("key_code", "string", "Key code, e.g. KEYCODE_HOME", true, None),
                        param("display", "string", "Optional, display id for multi-screen", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "capture_screenshot",
                    "Take a screenshot and return the file path.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "run_ui_subagent",
                    "Run a lightweight UI automation sub-agent.",
                    "",
                    vec![
                        param("intent", "string", "Task description", true, None),
                        param("max_steps", "integer", "Optional", false, Some("20".to_string())),
                        param("agent_id", "string", "Optional, reusable agent session ID. When omitted or set to 'default', the main screen is used; when set to something other than 'default', it requests the corresponding virtual screen session, which must be available, otherwise this run fails.", false, None),
                        param("target_app", "string", "Optional, target app package name", false, None)
                    ],
                    "",
                    "",
                )
            ],
            "",
        ),
        category(
            "Software Settings Tools",
            "",
            vec![
                tool(
                    "read_environment_variable",
                    "Read the current value of an environment variable by key.",
                    "",
                    vec![
                        param("key", "string", "Environment variable name", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "write_environment_variable",
                    "Write an environment variable by key; when value is empty the variable is cleared.",
                    "",
                    vec![
                        param("key", "string", "Environment variable name", true, None),
                        param("value", "string", "Optional, value to write; an empty value clears the variable", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "execute_cli_command",
                    "Execute an Operit CLI command with an argument array and return the stdout/stderr output.",
                    "",
                    vec![
                        param("args", "string", "JSON string array of CLI arguments, corresponding to Tools.SoftwareSettings.exec(args)", true, None)
                    ],
                    "",
                    "",
                )
            ],
            "",
        ),
        category(
            "Internal System Tools",
            "",
            vec![
                tool(
                    "close_all_virtual_displays",
                    "Close all virtual screens.",
                    "",
                    Vec::new(),
                    "",
                    "",
                ),
                tool(
                    "modify_system_setting",
                    "Modify a system setting.",
                    "",
                    vec![
                        param("setting", "string", "Setting key (alias: key)", true, None),
                        param("value", "string", "Setting value", true, None),
                        param("namespace", "string", "Optional, system/secure/global", false, Some("system".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "get_system_setting",
                    "Get a system setting.",
                    "",
                    vec![
                        param("setting", "string", "Setting key (alias: key)", true, None),
                        param("namespace", "string", "Optional, system/secure/global", false, Some("system".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "install_app",
                    "Request app installation through the current host (requires user confirmation).",
                    "",
                    vec![
                        param("path", "string", "Installer file path on the current host, e.g. Android APK, Windows MSI/MSIX/EXE, or a Linux desktop installer file", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "uninstall_app",
                    "Request app uninstallation through the current host (requires user confirmation).",
                    "",
                    vec![
                        param("package_name", "string", "Host app/package identifier, e.g. Android package name, Windows Appx/MSIX package name or MSI product code, Linux Flatpak app ID, or a local .desktop file", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "list_installed_apps",
                    "List installed apps.",
                    "",
                    vec![
                        param("include_system_apps", "boolean", "Optional", false, Some("false".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "start_app",
                    "Launch an app through the current host.",
                    "",
                    vec![
                        param("package_name", "string", "Host app/package identifier or executable name", true, None),
                        param("activity", "string", "Optional, Android Activity class name", false, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "stop_app",
                    "Stop the app's background process through the current host.",
                    "",
                    vec![
                        param("package_name", "string", "Host app/package identifier or process name", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "get_notifications",
                    "Get notifications when the current host exposes a notification history/listening interface.",
                    "",
                    vec![
                        param("limit", "integer", "Optional", false, Some("10".to_string())),
                        param("include_ongoing", "boolean", "Optional", false, Some("false".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "get_app_usage_time",
                    "Read foreground or per-app usage duration on the current host. Android uses Usage Access; desktop hosts return the data the platform host can provide.",
                    "",
                    vec![
                        param("package_name", "string", "Optional, exact app package name", false, None),
                        param("since_hours", "integer", "Optional, how many hours back to aggregate", false, Some("24".to_string())),
                        param("limit", "integer", "Optional, maximum number of apps to return when package_name is not provided", false, Some("10".to_string())),
                        param("include_system_apps", "boolean", "Optional, whether to include system apps when package_name is not provided", false, Some("false".to_string()))
                    ],
                    "",
                    "",
                ),
                tool(
                    "toast",
                    "Show a short toast on the current host.",
                    "",
                    vec![
                        param("message", "string", "Toast text", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "send_notification",
                    "Send a notification using the AI reply completion notification channel.",
                    "",
                    vec![
                        param("title", "string", "Optional", false, None),
                        param("message", "string", "Notification content", true, None)
                    ],
                    "",
                    "",
                ),
                tool(
                    "get_device_location",
                    "Get the device location information of the current host.",
                    "",
                    vec![
                        param("timeout", "integer", "Optional, timeout in seconds", false, Some("10".to_string())),
                        param("high_accuracy", "boolean", "Optional", false, Some("false".to_string())),
                        param("include_address", "boolean", "Optional", false, Some("true".to_string()))
                    ],
                    "",
                    "",
                )
            ],
            "",
        ),
    ]
}

fn category(
    category_name: &str,
    category_header: &str,
    tools: Vec<ToolPrompt>,
    category_footer: &str,
) -> SystemToolPromptCategory {
    SystemToolPromptCategory {
        category_name: category_name.to_string(),
        category_header: category_header.to_string(),
        tools,
        category_footer: category_footer.to_string(),
    }
}

fn tool(
    name: &str,
    description: &str,
    parameters: &str,
    parameters_structured: Vec<ToolParameterSchema>,
    details: &str,
    notes: &str,
) -> ToolPrompt {
    ToolPrompt {
        name: name.to_string(),
        description: description.to_string(),
        parameters: parameters.to_string(),
        parameters_structured,
        details: details.to_string(),
        notes: notes.to_string(),
    }
}

fn param(
    name: &str,
    value_type: &str,
    description: &str,
    required: bool,
    default: Option<String>,
) -> ToolParameterSchema {
    ToolParameterSchema {
        name: name.to_string(),
        value_type: value_type.to_string(),
        description: description.to_string(),
        required,
        default,
    }
}
