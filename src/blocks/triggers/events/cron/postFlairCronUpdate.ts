import { CommentCreate, CommentUpdate } from "@devvit/protos";
import { TriggerContext } from "@devvit/public-api";
import { logger } from "../../../logger";
import { AppSetting } from "../../../settings";
import { ADHOC_POST_FLAIR_JOB } from "../../../constants";
import { formatMessage } from "../../utils/common-utilities";

async function updatePostFlairCron(
    event: CommentCreate | CommentUpdate,
    context: TriggerContext,
) {
    if (!event.comment) return;
    const settings = await context.settings.getAll();

    const newCron =
        (settings[AppSetting.PostFlairCron] as string) ?? "0 0 1 * *";

    const postFlairUpdateMessage = formatMessage(
        `Post Flair Cron updated to ${newCron}`,
        {},
    );

    try {
        await context.scheduler.runJob({
            name: ADHOC_POST_FLAIR_JOB,
            cron: newCron,
        });

        const cronUpdateNotificationSetting = ((settings[
                AppSetting.NotifyOnCronUpdateSuccess
            ] as string[]) ?? ["none"])[0];

        const comment = await context.reddit.submitComment({
            id: event.comment.id,
            text: postFlairUpdateMessage,
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
