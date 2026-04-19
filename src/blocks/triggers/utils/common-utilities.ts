import { SettingsValues, TriggerContext } from "@devvit/public-api";
import { AppSetting } from "../../settings";
import { logger } from "../../logger";

export function formatMessage(
    template: string,
    placeholders: Record<string, string>,
): string {
    let result = template;
    for (const [key, value] of Object.entries(placeholders)) {
        const regex = new RegExp(`{{${key}}}`, "g");
        result = result.replace(regex, value);
    }

    const footer = `\n\n---\n\n^(I am a bot - please contact the mods with any questions)`;
    if (
        !result
            .trim()
            .endsWith(
                `\n\n---\n\n^(I am a bot - please contact the mods with any questions)`,
            )
    ) {
        result = result.trim() + footer;
    }

    return result;
}

export async function userFlairValue(context: TriggerContext) {
    const settings = await context.settings.getAll();
    const userFlair = ((settings[AppSetting.UserFlairValue] as string) ?? "")
        .toLowerCase()
        .trim();
    return userFlair;
}

export async function postFlairValue(context: TriggerContext) {
    const settings = await context.settings.getAll();
    const postFlair = ((settings[AppSetting.PostFlairValue] as string) ?? "")
        .toLowerCase()
        .trim();
    return postFlair;
}

//todo: Edit this to work
export async function updateUserFlair(
    context: TriggerContext,
    subredditName: string,
    commentAuthor: string,
    newScore: number,
    settings: SettingsValues,
) {
    const pointSymbol = (settings[AppSetting.PointSymbol] as string) ?? "";
    const flairSetting = ((settings[AppSetting.ExistingFlairHandling] as
        | string[]
        | undefined) ?? [
        ExistingFlairOverwriteHandling.OverwriteNumeric,
    ])[0] as ExistingFlairOverwriteHandling;

    // Make sure newScore is a safe primitive
    const scoreValue =
        newScore !== undefined && newScore !== null ? Number(newScore) : 0;

    let flairText = "";
    switch (flairSetting) {
        case ExistingFlairOverwriteHandling.OverwriteNumericSymbol:
            flairText = `${scoreValue}${pointSymbol}`;
            break;
        case ExistingFlairOverwriteHandling.OverwriteNumeric:
        default:
            flairText = `${scoreValue}`;
            break;
    }

    // CSS class + template logic
    let cssClass = settings[AppSetting.CSSClass] as string | undefined;
    let flairTemplate = settings[AppSetting.FlairTemplate] as
        | string
        | undefined;

    // If using a flair template, CSS class cannot be used
    if (flairTemplate) cssClass = undefined;

    try {
        await context.reddit.setUserFlair({
            subredditName,
            username: commentAuthor,
            cssClass,
            flairTemplateId: flairTemplate,
            text: flairText,
        });

        logger.info(
            `🧑‍🎨 Awardee flair updated: u/${commentAuthor} → (“${flairText}”)`,
        );
    } catch (err) {
        logger.error("❌ Failed to update awardee flair", {
            user: commentAuthor,
            err,
        });
    }
}

//todo: Edit this to work
export async function updatePostFlair(
    context: TriggerContext,
    subredditName: string,
    commentAuthor: string,
    newScore: number,
    settings: SettingsValues,
) {
    const pointSymbol = (settings[AppSetting.PointSymbol] as string) ?? "";
    const flairSetting = ((settings[AppSetting.ExistingFlairHandling] as
        | string[]
        | undefined) ?? [
        ExistingFlairOverwriteHandling.OverwriteNumeric,
    ])[0] as ExistingFlairOverwriteHandling;

    // Make sure newScore is a safe primitive
    const scoreValue =
        newScore !== undefined && newScore !== null ? Number(newScore) : 0;

    let flairText = "";
    switch (flairSetting) {
        case ExistingFlairOverwriteHandling.OverwriteNumericSymbol:
            flairText = `${scoreValue}${pointSymbol}`;
            break;
        case ExistingFlairOverwriteHandling.OverwriteNumeric:
        default:
            flairText = `${scoreValue}`;
            break;
    }

    // CSS class + template logic
    let cssClass = settings[AppSetting.CSSClass] as string | undefined;
    let flairTemplate = settings[AppSetting.FlairTemplate] as
        | string
        | undefined;

    // If using a flair template, CSS class cannot be used
    if (flairTemplate) cssClass = undefined;

    try {
        await context.reddit.setUserFlair({
            subredditName,
            username: commentAuthor,
            cssClass,
            flairTemplateId: flairTemplate,
            text: flairText,
        });

        logger.info(
            `🧑‍🎨 Awardee flair updated: u/${commentAuthor} → (“${flairText}”)`,
        );
    } catch (err) {
        logger.error("❌ Failed to update awardee flair", {
            user: commentAuthor,
            err,
        });
    }
}
