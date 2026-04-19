import { TriggerContext } from "@devvit/public-api";

export const CURRENT_WEEK_KEY = `currentWeek`;

export async function getWeekKey(context: TriggerContext): Promise<string> {
    const currentWeek = await context.redis.get(CURRENT_WEEK_KEY);
    if (currentWeek) {
        return currentWeek;
    } else {
        await context.redis.set(CURRENT_WEEK_KEY, "0");
        return "0";
    }
}

export async function incrementWeekKey(context: TriggerContext): Promise<void> {
    const newWeek = (parseInt(await getWeekKey(context)) + 1).toString();
    await context.redis.set(CURRENT_WEEK_KEY, newWeek);
}

export async function setWeekKey(context: TriggerContext, value: string): Promise<void> {
    await context.redis.set(CURRENT_WEEK_KEY, value);
}