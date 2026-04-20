import { CommentCreate, CommentUpdate } from "@devvit/protos";
import { TriggerContext } from "@devvit/public-api";
import { logger } from "../../../logger";
import {
    AppSetting,
    PostFlairNormalUserCronUpdateFailNotification,
    PostFlairTimeframes,
    TemplateDefaults,
} from "../../../settings";
import {
    ADHOC_POST_FLAIR_JOB,
    HOURLY_CRON,
    DAILY_CRON,
    WEEKLY_CRON,
    MONTHLY_CRON,
    YEARLY_CRON,
} from "../../../constants";
import { formatMessage } from "../../utils/common-utilities";
import { isModerator } from "../../../utility";

export async function updatePostFlairCron(
    event: CommentCreate | CommentUpdate,
    context: TriggerContext,
) {
    if (!event.comment || !event.author || !event.subreddit) return;
    const author = await context.reddit.getUserById(event.author.id);
    if (!author) return;

    const settings = await context.settings.getAll();
    const commentBody = event.comment.body?.trim() ?? "";

    const command =
        (settings[AppSetting.PostFlairCronUpdateCommand] as string) ??
        "!updatepostflaircron";

    // 🚫 Not command
    if (!commentBody.toLowerCase().startsWith(command.toLowerCase())) {
        return;
    }

    // 🔐 Mod check
    const subredditName = await context.reddit.getCurrentSubredditName();
    const isMod = await isModerator(
        context,
        event.subreddit.name,
        author.username,
    );

    if (!isMod) {
        logger.warn("❌ Non-mod attempted cron update", {
            user: author.username,
        });
        const postFlairCronUpdateFailNormalUserNotificationSetting = ((settings[
            AppSetting.NotifyOnPostFlairCronUpdateFailNormalUser
        ] as string[]) ?? ["none"])[0];

        const nonModTriedToChangePostFlairCronTemplate = formatMessage(
            (settings[
                AppSetting.PostFlairCronUpdateFailNormalUserMessage
            ] as string) ??
                TemplateDefaults.PostFlairCronUpdateFailNormalUserMessage,
            { cronUpdater: author.username, subreddit: subredditName },
        );

        if (
            postFlairCronUpdateFailNormalUserNotificationSetting ===
            PostFlairNormalUserCronUpdateFailNotification.NotifyMods
        ) {
            await context.reddit.modMail.createModDiscussionConversation({
                subject: "",
                bodyMarkdown: nonModTriedToChangePostFlairCronTemplate,
                subredditId: event.subreddit.id,
            });
        } else if (
            postFlairCronUpdateFailNormalUserNotificationSetting ===
            PostFlairNormalUserCronUpdateFailNotification.ReplyByPM
        ) {
            await context.reddit.sendPrivateMessage({
                to: author.username,
                subject: `You do not have permission to change crons in r/${subredditName}`,
                text: nonModTriedToChangePostFlairCronTemplate,
            });
        } else if (
            postFlairCronUpdateFailNormalUserNotificationSetting ===
            PostFlairNormalUserCronUpdateFailNotification.ReplyAsComment
        ) {
            const nonModTriedToChangePostFlairCronComment =
                await context.reddit.submitComment({
                    id: event.comment.id,
                    text: nonModTriedToChangePostFlairCronTemplate,
                });

            nonModTriedToChangePostFlairCronComment.distinguish();
        }

        return;
    }

    const postFlairTimeframes = settings[
        AppSetting.PostFlairTimeframes
    ] as PostFlairTimeframes;

    // 🧠 Map timeframe → cron
    let newCron: string = "";

    switch (postFlairTimeframes) {
        case PostFlairTimeframes.Off:
        const currentJobs = await context.scheduler.listJobs();
                    const existingJob = currentJobs.find(
                        (job) => job.name === ADHOC_POST_FLAIR_JOB,
                    );
                    if (!existingJob) return;
        
                    await Promise.all(
                        currentJobs.map((_) =>
                            context.scheduler.cancelJob(existingJob.id),
                        ),
                    );
                    break;
        case PostFlairTimeframes.Hourly:
            newCron = HOURLY_CRON;
            break;
        case PostFlairTimeframes.Daily:
            newCron = DAILY_CRON;
            break;
        case PostFlairTimeframes.Weekly:
            newCron = WEEKLY_CRON;
            break;
        case PostFlairTimeframes.Monthly:
            newCron = MONTHLY_CRON;
            break;
        case PostFlairTimeframes.Yearly:
            newCron = YEARLY_CRON;
            break;
    }

    try {
        const currentJobs = await context.scheduler.listJobs();
        const existingJob = currentJobs.find(
            (job) => job.name === ADHOC_POST_FLAIR_JOB,
        );

        if (!existingJob) {
            return;
        }

        const existingCron = existingJob?.data as { cron?: string };

        // 🟢 Case: Already set correctly
        if (existingCron === newCron) {
            await reply(
                context,
                event.comment.id,
                `ℹ️ Cron already set to "${newCron}"`,
            );

            logger.info("ℹ️ Cron unchanged", { newCron });
            return;
        }

        // 🔄 Cancel ALL existing jobs
        await Promise.all(
            currentJobs.map((_) => context.scheduler.cancelJob(existingJob.id)),
        );

        // 🚀 Create new job
        await context.scheduler.runJob({
            name: ADHOC_POST_FLAIR_JOB,
            cron: newCron,
        });

        await reply(
            context,
            event.comment.id,
            `✅ Post Flair cron updated to "${newCron}"`,
        );

        logger.info("✅ Post Flair cron updated", {
            newCron,
            triggeredBy: author.username,
        });
    } catch (err) {
        logger.error(
            "❌ Error updating post flair cron",
            { error: err },
            context,
        );
    }
}

// small helper to keep things clean
async function reply(context: TriggerContext, parentId: string, text: string) {
    const comment = await context.reddit.submitComment({
        id: parentId,
        text: formatMessage(text, {}),
    });
    await comment.distinguish();
}
