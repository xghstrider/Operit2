const ENV_KEY = "OPERIT_THINKING_GUIDANCE_ENABLED";
const TOGGLE_ID = "thinking_guidance";
const MENU_HOOK_ID = "thinking_guidance_menu";
const PROMPT_HOOK_ID = "thinking_guidance_prompt";
const ENABLED_VALUES = new Set(["1", "true", "yes", "on"]);
const THINKING_GUIDANCE_PROMPT_EN = `THINKING PROCESS GUIDELINES:
- Before providing your final response, you MUST use a <think> block to outline your thought process. This is for your internal monologue.
- In your thoughts, deconstruct the user's request, consider alternatives, anticipate outcomes, and reflect on the best strategy. Formulate a precise action plan. Your plan should be efficient, and you may use tools in parallel or sequentially as appropriate. The tool system will decide and handle execution conflicts automatically.
- The user will see your thoughts but cannot reply to them directly. This block is NOT saved in the chat history, so your final answer must be self-contained.
- The <think> block must be immediately followed by your final answer or tool call without any newlines.
- CRITICAL REMINDER: Even if previous messages in the chat history do not show a <think> block, you MUST include one in your current response. This is a mandatory instruction for this conversation mode.`;
const THINKING_GUIDANCE_PROMPT_ZH = `Thinking Process Guide:
- Before providing the final answer, you must use the <think> block to lay out your thinking process. This is your inner monologue.
- In your thinking, break down the user's request, evaluate alternative approaches, anticipate execution outcomes, and reflect on the best strategy to form a precise action plan. Your plan should be efficient; tools may be called in parallel or sequentially, and any conflicts are decided and handled by the tool system itself.
- The user can see your thinking process but cannot reply to it directly. This block is not saved in the chat history, so your final answer must be complete.
- The <think> block must come immediately before your final answer or tool call, with no newlines in between.
- Important reminder: even if previous messages in the chat history have no <think> block, you must still use it in this reply as required. This is a mandatory instruction.`;
function readEnabled() {
    if (typeof getEnv !== "function") {
        return false;
    }
    const raw = getEnv(ENV_KEY);
    return ENABLED_VALUES.has(String(raw || "").trim().toLowerCase());
}
async function writeEnabled(enabled) {
    await Tools.SoftwareSettings.writeEnvironmentVariable(ENV_KEY, enabled ? "true" : "false");
}
function preferredLanguage(event) {
    return event && event.eventPayload && event.eventPayload.useEnglish ? "en" : "zh";
}
function guidancePrompt(event) {
    return preferredLanguage(event) === "en" ? THINKING_GUIDANCE_PROMPT_EN : THINKING_GUIDANCE_PROMPT_ZH;
}
async function onInputMenuToggle(event) {
    const payload = (event && event.eventPayload) || {};
    const action = payload.action;
    const enabled = readEnabled();
    if (action === "create") {
        return {
            toggles: [
                {
                    id: TOGGLE_ID,
                    title: preferredLanguage(event) === "en" ? "Thinking Guidance" : "Thinking Guidance",
                    description: preferredLanguage(event) === "en"
                        ? "Injects <think> guidance for non-reasoning models. Not recommended for native reasoning models."
                        : "Injects <think> thinking guidance for non-thinking models; not recommended for models with native thinking.",
                    icon: "psychology",
                    isChecked: enabled,
                    slot: "thinking",
                },
            ],
        };
    }
    if (action === "toggle" && payload.toggleId === TOGGLE_ID) {
        await writeEnabled(!enabled);
        return null;
    }
    return null;
}
function onSystemPromptCompose(event) {
    const stage = (event && (event.eventName || event.event)) || "";
    if (stage !== "after_compose_system_prompt") {
        return null;
    }
    if (!readEnabled()) {
        return null;
    }
    const currentPrompt = (event && event.eventPayload && event.eventPayload.systemPrompt) || "";
    return { systemPrompt: `${currentPrompt}\n\n${guidancePrompt(event)}` };
}
function registerToolPkg() {
    ToolPkg.registerInputMenuTogglePlugin({
        id: MENU_HOOK_ID,
        function: onInputMenuToggle,
    });
    ToolPkg.registerSystemPromptComposeHook({
        id: PROMPT_HOOK_ID,
        function: onSystemPromptCompose,
    });
    return true;
}
if (typeof exports !== "undefined") {
    exports.registerToolPkg = registerToolPkg;
    exports.onInputMenuToggle = onInputMenuToggle;
    exports.onSystemPromptCompose = onSystemPromptCompose;
}
