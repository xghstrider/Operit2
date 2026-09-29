import {
  COMPLETE_PLAN_TOOL_NAME,
  GET_PLAN_TOOL_NAME,
  SUBPACKAGE_ID,
} from "./plan_mode_constants.js";
import { resolvePlanModeI18n } from "./plan_mode_i18n.js";

/** Appends a non-empty prompt segment with a stable separator. */
export function appendPrompt(basePrompt: string, extraPrompt: string): string {
  const base = basePrompt.trim();
  const extra = extraPrompt.trim();
  if (!extra) {
    return base;
  }
  return base ? `${base}\n\n${extra}` : extra;
}

/** Resolves the planning-only prompt in the requested language. */
export function buildPlanningModePrompt(useEnglish?: boolean): string {
  return resolvePlanModeI18n(useEnglish).promptPlanningMode;
}

/** Builds the implementation prompt for an already persisted plan. */
export function buildExistingPlanPrompt(useEnglish?: boolean): string {
  const text = resolvePlanModeI18n(useEnglish);
  const getPlanTool = `${SUBPACKAGE_ID}:${GET_PLAN_TOOL_NAME}`;
  const completePlanTool = `${SUBPACKAGE_ID}:${COMPLETE_PLAN_TOOL_NAME}`;
  const lines = [text.promptExistingPlanPrefix];
  if (useEnglish) {
    lines.push(`- Call \`${getPlanTool}\` before you start working.`);
    lines.push("- Base your implementation on the returned plan content.");
    lines.push(
      `- When and only when every planned item is truly complete, call \`${completePlanTool}\` exactly once.`
    );
  } else {
    lines.push(`- Before starting work, first call \`${getPlanTool}\`.`);
    lines.push("- Carry out the implementation based on the returned plan content.");
    lines.push(
      `- Only call \`${completePlanTool}\` once, after all plan items are truly complete.`
    );
  }
  return lines.join("\n");
}
