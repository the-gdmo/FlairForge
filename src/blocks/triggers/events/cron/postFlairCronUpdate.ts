import { CommentCreate, CommentUpdate } from "@devvit/protos";
import { TriggerContext } from "@devvit/public-api";
import { logger } from "../../../logger";
import { AppSetting, PostFlairCronUpdateSuccessNotification } from "../../../settings";
import { ADHOC_POST_FLAIR_JOB } from "../../../constants";
import { formatMessage } from "../../utils/common-utilities";

async function updatePostFlairCron(
    event: CommentCreate | CommentUpdate,
    context: TriggerContext,
) {
    if (!event.comment || !event.subreddit || !event.author) return;
    const settings = await context.settings.getAll();

    //todo: figure out how to get the newCron from the comment body

    const postFlairUpdateSuccessMessage = formatMessage(
        `Post Flair Cron updated to ${newCron}`,
        {},
    );

    try {
        await context.scheduler.runJob({
            name: ADHOC_POST_FLAIR_JOB,
            cron: newCron,
        });

        const postCronUpdateSuccessNotificationSetting = ((settings[
            AppSetting.NotifyOnPostFlairCronUpdateSuccess
        ] as string[]) ?? ["none"])[0];

        if (
            postCronUpdateSuccessNotificationSetting ===
            PostFlairCronUpdateSuccessNotification.ReplyAsComment
        ) {
            const comment = await context.reddit.submitComment({
                id: event.comment.id,
                text: postFlairUpdateSuccessMessage,
            });

            await comment.distinguish();
        } else if (
            postCronUpdateSuccessNotificationSetting ===
            PostFlairCronUpdateSuccessNotification.ReplyByPM
        ) {
            await context.reddit.sendPrivateMessage({
                to: event.comment.author,
                subject: `Cron Update Successful in r/${event.subreddit.name}`,
                text: postFlairUpdateSuccessMessage,
            });
        } else if (
            postCronUpdateSuccessNotificationSetting ===
            PostFlairCronUpdateSuccessNotification.NotifyMods
        ) {
            await context.reddit.modMail.createModDiscussionConversation({
                subject: `Cron Message Update by u/${event.author.name} successful`,
                bodyMarkdown: postFlairUpdateSuccessMessage,
                subredditId: context.subredditId,
            });
        }

        logger.info("🏅 User Flair Cron updated", {
            newCron,
        });
    } catch (err) {
        const postFlairUpdateFailMessage = formatMessage(
            `Post Flair Cron was unable to be updated. Error: ${err}`,
            {},
        );

        const cronUpdateFailNotificationSetting = ((settings[
            AppSetting.NotifyOnPostFlairCronUpdateFail
        ] as string[]) ?? ["off"])[0];



        logger.error(
            "There was an error trying to update the user cron",
            { error: err },
            context,
        );
    }
}
