"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCron = parseCron;
exports.matchesCron = matchesCron;
exports.specificTime = specificTime;
exports.validateTrigger = validateTrigger;
exports.isDue = isDue;
/** Expands one standard five-field cron component with explicit bounds. */
function cronField(source, min, max) {
    const result = new Set();
    for (const part of source.split(",")) {
        const match = /^(\*|\d+(?:-\d+)?)(?:\/(\d+))?$/.exec(part);
        if (!match)
            throw new Error(`Invalid Cron field: ${source}`);
        const step = match[2] === undefined ? 1 : Number(match[2]);
        const range = match[1] === "*" ? [min, max] : match[1].split("-").map(Number);
        const start = range[0];
        const end = range.length === 2 ? range[1] : (match[2] === undefined ? start : max);
        if (step < 1 || start < min || end > max || start > end)
            throw new Error(`Cron field out of range: ${source}`);
        for (let value = start; value <= end; value += step)
            result.add(value);
    }
    return result;
}
/** Parses a cron expression without interpreting arbitrary text. */
function parseCron(expression) {
    const fields = expression.trim().split(/\s+/);
    if (fields.length !== 5)
        throw new Error("Cron requires five fields: minute hour day month weekday");
    return fields.map((field, index) => cronField(field, [0, 0, 1, 1, 0][index], [59, 23, 31, 12, 7][index]));
}
/** Matches local time using conventional cron day-of-month/day-of-week semantics. */
function matchesCron(expression, now) {
    const fields = parseCron(expression);
    const raw = expression.trim().split(/\s+/);
    const date = new Date(now);
    const dom = fields[2].has(date.getDate());
    const dow = fields[4].has(date.getDay()) || (date.getDay() === 0 && fields[4].has(7));
    const day = raw[2] === "*" ? dow : raw[4] === "*" ? dom : dom || dow;
    return fields[0].has(date.getMinutes()) && fields[1].has(date.getHours()) && fields[3].has(date.getMonth() + 1) && day;
}
/** Validates a local calendar date and rejects normalized impossible dates. */
function specificTime(text) {
    const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(text);
    if (!match)
        throw new Error("Specific time format: YYYY-MM-DD HH:mm:ss");
    const [year, month, day, hour, minute] = match.slice(1, 6).map(Number);
    const second = match[6] === undefined ? 0 : Number(match[6]);
    const date = new Date(year, month - 1, day, hour, minute, second);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day || date.getHours() !== hour || date.getMinutes() !== minute || date.getSeconds() !== second)
        throw new Error("The specified time does not exist");
    return date.getTime();
}
/** Validates the executable trigger configuration. */
function validateTrigger(node) {
    if (node.triggerType !== "schedule")
        return;
    const c = node.triggerConfig;
    if (c.enabled !== "true" && c.enabled !== "false")
        throw new Error("The schedule enabled state must be true or false");
    if (c.repeat !== "true" && c.repeat !== "false")
        throw new Error("The schedule repeat state must be true or false");
    switch (c.schedule_type) {
        case "interval":
            if (!Number.isSafeInteger(Number(c.interval_ms)) || Number(c.interval_ms) < 60000)
                throw new Error("The schedule interval must be at least 60000 milliseconds");
            break;
        case "specific_time":
            specificTime(c.specific_time);
            break;
        case "cron":
            parseCron(c.cron_expression);
            break;
        default: throw new Error("Unknown schedule type");
    }
}
/** Determines whether a schedule is due, without replaying missed intervals. */
function isDue(node, last, createdAt, now) {
    validateTrigger(node);
    const c = node.triggerConfig;
    if (c.enabled !== "true" || (c.repeat === "false" && last !== null))
        return false;
    switch (c.schedule_type) {
        case "interval": return now - (last === null ? createdAt : last) >= Number(c.interval_ms);
        case "specific_time": return last === null && now >= specificTime(c.specific_time);
        case "cron": return (last === null || Math.floor(last / 60000) !== Math.floor(now / 60000)) && matchesCron(c.cron_expression, now);
        default: throw new Error("Unknown schedule type");
    }
}
