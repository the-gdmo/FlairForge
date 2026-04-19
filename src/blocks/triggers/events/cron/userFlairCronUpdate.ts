import { CommentCreate, CommentUpdate } from "@devvit/protos";
import { TriggerContext } from "@devvit/public-api";
import { logger } from "../../../logger";
import { AppSetting } from "../../../settings";
import { ADHOC_USER_FLAIR_JOB } from "../../../constants";
import { formatMessage } from "../../utils/common-utilities";

async function updateUserFlairCron(
    event: CommentCreate | CommentUpdate,
    context: TriggerContext,
) {
    if (!event.comment) return;
    const settings = await context.settings.getAll();

    const newCron =
        (settings[AppSetting.UserFlairCron] as string) ?? "0 0 1 * *";

    const userFlairUpdateMessage = formatMessage(
        `User Flair Cron updated to ${newCron}`,
        {},
    );

    try {
        await context.scheduler.runJob({
            name: ADHOC_USER_FLAIR_JOB,
            cron: newCron,
        });

        const comment = await context.reddit.submitComment({
            id: event.comment.id,
            text: userFlairUpdateMessage,
        });

        await comment.distinguish();

        logger.info("🏅 User Flair Cron updated", {
            newCron,
        });
    } catch (err) {
        logger.error(
            "There was an error trying to update the user cron",
            { error: err },
            context,
        );
    }
}
