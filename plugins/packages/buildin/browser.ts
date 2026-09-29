/* METADATA
{
    "name": "browser",
    "display_name": {
        "zh": "Browser Automation Operations",
        "en": "Browser Automation"
    },
    "description": {
        "zh": "A browser automation toolkit strictly aligned with the default Playwright MCP browser tool surface.",
        "en": "Browser automation tools aligned to the default Playwright MCP browser surface."
    },
    "enabledByDefault": true,
    "category": "Automatic",
    "tools": [
        {
            "name": "click",
            "description": { "zh": "Click an element by snapshot ref, including refs inside same-origin iframes.", "en": "Click an element by snapshot ref, including refs inside same-origin iframes." },
            "parameters": [
                { "name": "ref", "description": { "zh": "Target element ref from the snapshot; provide ref or selector.", "en": "Target element ref from the snapshot; provide ref or selector." }, "type": "string", "required": false },
                { "name": "selector", "description": { "zh": "Optional element selector.", "en": "Optional element selector." }, "type": "string", "required": false },
                { "name": "element", "description": { "zh": "Optional human-readable element description.", "en": "Optional human-readable element description." }, "type": "string", "required": false },
                { "name": "doubleClick", "description": { "zh": "Optional double click.", "en": "Optional double click." }, "type": "boolean", "required": false },
                { "name": "button", "description": { "zh": "Optional mouse button: left/right/middle.", "en": "Optional mouse button: left/right/middle." }, "type": "string", "required": false },
                { "name": "modifiers", "description": { "zh": "Optional modifier keys array.", "en": "Optional modifier keys array." }, "type": "array", "required": false }
            ]
        },
        {
            "name": "close",
            "description": { "zh": "Close the current tab.", "en": "Close the current tab." },
            "parameters": []
        },
        {
            "name": "close_all",
            "description": { "zh": "Close all tabs.", "en": "Close all tabs." },
            "parameters": []
        },
        {
            "name": "console_messages",
            "description": { "zh": "Read console messages.", "en": "Read console messages." },
            "parameters": [
                { "name": "level", "description": { "zh": "Optional log level: error/warning/info/debug. Defaults to info.", "en": "Optional log level: error/warning/info/debug. Defaults to info." }, "type": "string", "required": false },
                { "name": "filename", "description": { "zh": "Optional output file name.", "en": "Optional output file name." }, "type": "string", "required": false }
            ]
        },
        {
            "name": "drag",
            "description": { "zh": "Drag between two elements.", "en": "Drag between two elements." },
            "parameters": [
                { "name": "startElement", "description": { "zh": "Human-readable source element description.", "en": "Human-readable source element description." }, "type": "string", "required": true },
                { "name": "startRef", "description": { "zh": "Source element ref.", "en": "Source element ref." }, "type": "string", "required": true },
                { "name": "endElement", "description": { "zh": "Human-readable target element description.", "en": "Human-readable target element description." }, "type": "string", "required": true },
                { "name": "endRef", "description": { "zh": "Target element ref.", "en": "Target element ref." }, "type": "string", "required": true }
            ]
        },
        {
            "name": "evaluate",
            "description": { "zh": "Evaluate a JavaScript function on the page or an element.", "en": "Evaluate a JavaScript function on the page or an element." },
            "parameters": [
                { "name": "function", "description": { "zh": "Function source to execute.", "en": "Function source to execute." }, "type": "string", "required": true },
                { "name": "element", "description": { "zh": "Optional human-readable element description.", "en": "Optional human-readable element description." }, "type": "string", "required": false },
                { "name": "ref", "description": { "zh": "Optional target element ref.", "en": "Optional target element ref." }, "type": "string", "required": false }
            ]
        },
        {
            "name": "upload",
            "description": { "zh": "Upload files to the current file chooser.", "en": "Upload files to the current file chooser." },
            "parameters": [
                { "name": "paths", "description": { "zh": "Optional absolute file paths; omit to cancel the file chooser.", "en": "Optional absolute file paths; omit to cancel the file chooser." }, "type": "array", "required": false }
            ]
        },
        {
            "name": "fill_form",
            "description": { "zh": "Fill multiple form fields.", "en": "Fill multiple form fields." },
            "parameters": [
                { "name": "fields", "description": { "zh": "Array of form fields.", "en": "Array of form fields." }, "type": "array", "required": true }
            ]
        },
        {
            "name": "handle_dialog",
            "description": { "zh": "Handle the current dialog.", "en": "Handle the current dialog." },
            "parameters": [
                { "name": "accept", "description": { "zh": "Whether to accept the dialog.", "en": "Whether to accept the dialog." }, "type": "boolean", "required": true },
                { "name": "promptText", "description": { "zh": "Optional prompt text.", "en": "Optional prompt text." }, "type": "string", "required": false }
            ]
        },
        {
            "name": "hover",
            "description": { "zh": "Hover over an element.", "en": "Hover over an element." },
            "parameters": [
                { "name": "ref", "description": { "zh": "Target element ref.", "en": "Target element ref." }, "type": "string", "required": true },
                { "name": "element", "description": { "zh": "Optional human-readable element description.", "en": "Optional human-readable element description." }, "type": "string", "required": false }
            ]
        },
        {
            "name": "goto",
            "description": { "zh": "Navigate to a URL.", "en": "Navigate to a URL." },
            "parameters": [
                { "name": "url", "description": { "zh": "Target URL.", "en": "Target URL." }, "type": "string", "required": true }
            ]
        },
        {
            "name": "back",
            "description": { "zh": "Go back to the previous page.", "en": "Go back to the previous page." },
            "parameters": []
        },
        {
            "name": "network_requests",
            "description": { "zh": "Read network requests for the current page.", "en": "Read network requests for the current page." },
            "parameters": [
                { "name": "includeStatic", "description": { "zh": "Optional include static resource requests. Defaults to false.", "en": "Optional include static resource requests. Defaults to false." }, "type": "boolean", "required": false },
                { "name": "filename", "description": { "zh": "Optional output file name.", "en": "Optional output file name." }, "type": "string", "required": false }
            ]
        },
        {
            "name": "press_key",
            "description": { "zh": "Press a keyboard key.", "en": "Press a keyboard key." },
            "parameters": [
                { "name": "key", "description": { "zh": "Key name.", "en": "Key name." }, "type": "string", "required": true }
            ]
        },
        {
            "name": "resize",
            "description": { "zh": "Resize the browser viewport.", "en": "Resize the browser viewport." },
            "parameters": [
                { "name": "width", "description": { "zh": "Width.", "en": "Width." }, "type": "number", "required": true },
                { "name": "height", "description": { "zh": "Height.", "en": "Height." }, "type": "number", "required": true }
            ]
        },
        {
            "name": "run_code",
            "description": { "zh": "Run a Playwright-style code snippet.", "en": "Run a Playwright-style code snippet." },
            "parameters": [
                { "name": "code", "description": { "zh": "Code snippet.", "en": "Code snippet." }, "type": "string", "required": true }
            ]
        },
        {
            "name": "select_option",
            "description": { "zh": "Select options in a dropdown.", "en": "Select options in a dropdown." },
            "parameters": [
                { "name": "ref", "description": { "zh": "Target element ref.", "en": "Target element ref." }, "type": "string", "required": true },
                { "name": "values", "description": { "zh": "Values to select.", "en": "Values to select." }, "type": "array", "required": true },
                { "name": "element", "description": { "zh": "Optional human-readable element description.", "en": "Optional human-readable element description." }, "type": "string", "required": false }
            ]
        },
        {
            "name": "snapshot",
            "description": { "zh": "Get a structured page snapshot, including same-origin iframe content.", "en": "Get a structured page snapshot, including same-origin iframe content." },
            "parameters": [
                { "name": "filename", "description": { "zh": "Optional snapshot output file name.", "en": "Optional snapshot output file name." }, "type": "string", "required": false },
                { "name": "selector", "description": { "zh": "Optional root element selector for a partial snapshot.", "en": "Optional root element selector for a partial snapshot." }, "type": "string", "required": false },
                { "name": "depth", "description": { "zh": "Optional snapshot tree depth limit.", "en": "Optional snapshot tree depth limit." }, "type": "number", "required": false }
            ]
        },
        {
            "name": "type",
            "description": { "zh": "Type text into an editable element.", "en": "Type text into an editable element." },
            "parameters": [
                { "name": "ref", "description": { "zh": "Target element ref.", "en": "Target element ref." }, "type": "string", "required": true },
                { "name": "text", "description": { "zh": "Text to type.", "en": "Text to type." }, "type": "string", "required": true },
                { "name": "element", "description": { "zh": "Optional human-readable element description.", "en": "Optional human-readable element description." }, "type": "string", "required": false },
                { "name": "submit", "description": { "zh": "Optional submit after typing.", "en": "Optional submit after typing." }, "type": "boolean", "required": false },
                { "name": "slowly", "description": { "zh": "Optional type slowly.", "en": "Optional type slowly." }, "type": "boolean", "required": false }
            ]
        },
        {
            "name": "wait_for",
            "description": { "zh": "Wait for text to appear, disappear, or for a duration.", "en": "Wait for text to appear, disappear, or for a duration." },
            "parameters": [
                { "name": "time", "description": { "zh": "Optional number of seconds to wait.", "en": "Optional number of seconds to wait." }, "type": "number", "required": false },
                { "name": "text", "description": { "zh": "Optional text to wait for.", "en": "Optional text to wait for." }, "type": "string", "required": false },
                { "name": "textGone", "description": { "zh": "Optional text to wait to disappear.", "en": "Optional text to wait to disappear." }, "type": "string", "required": false }
            ]
        },
        {
            "name": "tabs",
            "description": { "zh": "List, create, select, or close tabs.", "en": "List, create, select, or close tabs." },
            "parameters": [
                { "name": "action", "description": { "zh": "Action: list/create/select/close.", "en": "Action: list/create/select/close." }, "type": "string", "required": true },
                { "name": "index", "description": { "zh": "Optional 0-based tab index.", "en": "Optional 0-based tab index." }, "type": "number", "required": false }
            ]
        }
    ]
}*/

const MAX_INLINE_BROWSER_TEXT_CHARS = 24000;
type BrowserTabAction = "list" | "create" | "select" | "close";
type BrowserMouseButton = "left" | "right" | "middle";
type BrowserModifierKey = "Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift";
type ToolParamValue = string | number | boolean | object;
type BrowserToolResult = string | { value: string; toString(): string };

interface FilenamePayload {
    filename?: string;
}

interface SnapshotPayload extends FilenamePayload {
    selector?: string;
    depth?: number;
}

interface ClickPayload {
    ref?: string;
    selector?: string;
    element?: string;
    button?: BrowserMouseButton;
    modifiers?: BrowserModifierKey[];
    doubleClick?: boolean;
}

interface ConsoleMessagesPayload extends FilenamePayload {
    level: string;
}

interface EvaluatePayload {
    function: string;
    ref?: string;
    element?: string;
}

interface UploadPayload {
    paths?: string[];
}

interface FillFormFieldPayload {
    name: string;
    type: string;
    value: ToolParamValue;
    ref?: string;
    selector?: string;
}

interface FillFormPayload {
    fields: FillFormFieldPayload[];
}

interface HandleDialogPayload {
    accept: boolean;
    promptText?: string;
}

interface HoverPayload {
    ref: string;
    element?: string;
}

interface DragPayload {
    startElement: string;
    startRef: string;
    endElement: string;
    endRef: string;
}

interface GotoPayload {
    url: string;
}

interface NetworkRequestsPayload extends FilenamePayload {
    includeStatic?: boolean;
}

interface PressKeyPayload {
    key: string;
}

interface ResizePayload {
    width: number;
    height: number;
}

interface RunCodePayload {
    code: string;
}

interface SelectOptionPayload {
    ref: string;
    values: string[];
    element?: string;
}

interface TypePayload {
    ref: string;
    text: string;
    element?: string;
    submit?: boolean;
    slowly?: boolean;
}

interface WaitForPayload {
    time?: number;
    text?: string;
    textGone?: string;
}

interface TabsPayload {
    action: BrowserTabAction;
    index?: number;
}

const TOOL_NAMES = [
    "click",
    "close",
    "close_all",
    "console_messages",
    "drag",
    "evaluate",
    "upload",
    "fill_form",
    "handle_dialog",
    "hover",
    "goto",
    "back",
    "network_requests",
    "press_key",
    "resize",
    "run_code",
    "select_option",
    "snapshot",
    "type",
    "wait_for",
    "tabs"
];

function normalizeOptionalString(value?: string): string | undefined {
    if (value === undefined) {
        return undefined;
    }
    const normalized = value.trim();
    return normalized ? normalized : undefined;
}

function buildLargeOutputFilename(prefix: string, extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const rand = Math.floor(Math.random() * 1000000);
    return OPERIT_CLEAN_ON_EXIT_DIR + "/browser_" + prefix + "_" + timestamp + "_" + rand + "." + extension;
}

function browserResultText(result: BrowserToolResult): string {
    return typeof result === "string" ? result : result.value;
}

async function maybePersistLargeBrowserResponse(
    result: BrowserToolResult,
    prefix: string,
    extension: string = "md"
) {
    const text = browserResultText(result);
    if (text.length <= MAX_INLINE_BROWSER_TEXT_CHARS) {
        return result;
    }
    await Tools.Files.mkdir(OPERIT_CLEAN_ON_EXIT_DIR, true);
    const filename = buildLargeOutputFilename(prefix, extension);
    await Tools.Files.write(filename, text, false);
    const normalizedPath = filename.replace(/\\/g, "/");
    return "Large browser response saved to:\n- [Browser Output](" + normalizedPath + ")";
}

async function click(params: ClickPayload) {
    const result = await Tools.Net.browserClick(params);
    return maybePersistLargeBrowserResponse(result, "click");
}

async function close() {
    const result = await Tools.Net.browserClose({});
    return maybePersistLargeBrowserResponse(result, "close");
}

async function close_all() {
    const result = await Tools.Net.browserCloseAll({});
    return maybePersistLargeBrowserResponse(result, "close_all");
}

async function console_messages(params: Partial<ConsoleMessagesPayload> = {}) {
    const result = await Tools.Net.browserConsoleMessages(params);
    return maybePersistLargeBrowserResponse(result, "console_messages");
}

async function drag(params: DragPayload) {
    const result = await Tools.Net.browserDrag(params);
    return maybePersistLargeBrowserResponse(result, "drag");
}

async function evaluate(params: EvaluatePayload) {
    const result = await Tools.Net.browserEvaluate(params);
    return maybePersistLargeBrowserResponse(result, "evaluate");
}

async function upload(params: UploadPayload = {}) {
    const result = await Tools.Net.browserFileUpload(params);
    return maybePersistLargeBrowserResponse(result, "upload");
}

function normalizeFormFields(fields: FillFormFieldPayload[]): FillFormFieldPayload[] {
    if (fields.length === 0) {
        throw new Error("fields must be a non-empty array");
    }
    return fields.map((field, index) => {
        const normalized: FillFormFieldPayload = {
            name: field.name.trim(),
            type: field.type.trim(),
            value: field.value as ToolParamValue
        };
        if (!normalized.name) {
            throw new Error("fields[" + index + "].name is required");
        }
        if (!normalized.type) {
            throw new Error("fields[" + index + "].type is required");
        }
        const ref = normalizeOptionalString(field.ref);
        const selector = normalizeOptionalString(field.selector);
        if (!ref && !selector) {
            throw new Error("fields[" + index + "] requires ref or selector");
        }
        if (ref) {
            normalized.ref = ref;
        }
        if (selector) {
            normalized.selector = selector;
        }
        return normalized;
    });
}

async function fill_form(params: FillFormPayload) {
    const payload: FillFormPayload = {
        fields: normalizeFormFields(params.fields)
    };
    const result = await Tools.Net.browserFillForm(payload);
    return maybePersistLargeBrowserResponse(result, "fill_form");
}

async function handle_dialog(params: HandleDialogPayload) {
    const result = await Tools.Net.browserHandleDialog(params);
    return maybePersistLargeBrowserResponse(result, "handle_dialog");
}

async function hover(params: HoverPayload) {
    const result = await Tools.Net.browserHover(params);
    return maybePersistLargeBrowserResponse(result, "hover");
}

async function goto(params: GotoPayload) {
    const result = await Tools.Net.browserNavigate(params);
    const text = browserResultText(result);
    if (text.length > MAX_INLINE_BROWSER_TEXT_CHARS) {
        return maybePersistLargeBrowserResponse(result, "goto");
    }
    return JSON.parse(text);
}

async function back() {
    const result = await Tools.Net.browserNavigateBack({});
    return maybePersistLargeBrowserResponse(result, "back");
}

async function network_requests(params: NetworkRequestsPayload = {}) {
    const result = await Tools.Net.browserNetworkRequests(params);
    return maybePersistLargeBrowserResponse(result, "network_requests");
}

async function press_key(params: PressKeyPayload) {
    const result = await Tools.Net.browserPressKey(params);
    return maybePersistLargeBrowserResponse(result, "press_key");
}

async function resize(params: ResizePayload) {
    const result = await Tools.Net.browserResize(params);
    return maybePersistLargeBrowserResponse(result, "resize");
}

async function run_code(params: RunCodePayload) {
    const result = await Tools.Net.browserRunCode(params);
    return maybePersistLargeBrowserResponse(result, "run_code");
}

async function select_option(params: SelectOptionPayload) {
    const result = await Tools.Net.browserSelectOption(params);
    return maybePersistLargeBrowserResponse(result, "select_option");
}

async function snapshot(params: SnapshotPayload = {}) {
    const result = await Tools.Net.browserSnapshot(params);
    return maybePersistLargeBrowserResponse(result, "snapshot");
}

async function type(params: TypePayload) {
    const result = await Tools.Net.browserType(params);
    return maybePersistLargeBrowserResponse(result, "type");
}

async function wait_for(params: WaitForPayload = {}) {
    const result = await Tools.Net.browserWaitFor(params);
    return maybePersistLargeBrowserResponse(result, "wait_for");
}

async function tabs(params: TabsPayload) {
    const result = await Tools.Net.browserTabs(params);
    return maybePersistLargeBrowserResponse(result, "tabs");
}

async function browserMain() {
    return "Browser package ready: " + TOOL_NAMES.join(", ");
}

exports.click = click;
exports.close = close;
exports.close_all = close_all;
exports.console_messages = console_messages;
exports.drag = drag;
exports.evaluate = evaluate;
exports.upload = upload;
exports.fill_form = fill_form;
exports.handle_dialog = handle_dialog;
exports.hover = hover;
exports.goto = goto;
exports.back = back;
exports.network_requests = network_requests;
exports.press_key = press_key;
exports.resize = resize;
exports.run_code = run_code;
exports.select_option = select_option;
exports.snapshot = snapshot;
exports.type = type;
exports.wait_for = wait_for;
exports.tabs = tabs;
exports.main = browserMain;
