import { CommentCreate, CommentUpdate } from "@devvit/protos";
import { TriggerContext } from "@devvit/public-api";
import { logger } from "../../../logger";
import { AppSetting, UserFlairTimeframes } from "../../../settings";
import {
    ADHOC_USER_FLAIR_JOB,
    HOURLY_CRON,
    DAILY_CRON,
    WEEKLY_CRON,
    MONTHLY_CRON,
    YEARLY_CRON,
} from "../../../constants";
import { formatMessage } from "../../utils/common-utilities";
import { isModerator } from "../../../utility";

export async function updateUserFlairCron(
    event: CommentCreate | CommentUpdate,
    context: TriggerContext,
) {
    if (!event.comment || !event.author || !event.subreddit) return;

    const author = await context.reddit.getUserById(event.author.id);
    if (!author) return;

    const settings = await context.settings.getAll();
    const commentBody = event.comment.body?.trim() ?? "";

    const command =
        (settings[AppSetting.UserFlairCronUpdateCommand] as string) ??
        "!updateuserflaircron";

    // 🚫 Not command
    if (!commentBody.toLowerCase().startsWith(command.toLowerCase())) {
        return;
    }

    // 🔐 Mod check
    const isMod = await isModerator(
        context,
        event.subreddit.name,
        author.username,
    );

    if (!isMod) {
        logger.warn("❌ Non-mod attempted user flair cron update", {
            user: author.username,
        });
        return;
    }

    const timeframe =
        (settings[AppSetting.UserFlairTimeframes] as UserFlairTimeframes) ??
        UserFlairTimeframes.Monthly;

    // 🧠 Map timeframe → cron
    let newCron: string = "";

    switch (timeframe) {
        case UserFlairTimeframes.Off:
            const currentJobs = await context.scheduler.listJobs();
            const existingJob = currentJobs.find(
                (job) => job.name === ADHOC_USER_FLAIR_JOB,
            );
            if (!existingJob) return;

            await Promise.all(
                currentJobs.map((_) =>
                    context.scheduler.cancelJob(existingJob.id),
                ),
            );
            break;
        case UserFlairTimeframes.Hourly:
            newCron = HOURLY_CRON;
            break;
        case UserFlairTimeframes.Daily:
            newCron = DAILY_CRON;
            break;
        case UserFlairTimeframes.Weekly:
            newCron = WEEKLY_CRON;
            break;
        case UserFlairTimeframes.Monthly:
            newCron = MONTHLY_CRON;
            break;
        case UserFlairTimeframes.Yearly:
            newCron = YEARLY_CRON;
            break;
        default:
            break;
    }

    const userFlairUpdateMessage = formatMessage(
        `User Flair Cron updated to "${newCron}"`,
        {},
    );

    try {
        const currentJobs = await context.scheduler.listJobs();

        const existingJob = currentJobs.find(
            (job) => job.name === ADHOC_USER_FLAIR_JOB,
        );

        const existingCron = (
            existingJob?.data as { cron?: string } | undefined
        )?.cron;

        // 🟢 Already set
        if (existingJob && existingCron === newCron) {
            await reply(
                context,
                event.comment.id,
                `ℹ️ Cron already set to "${newCron}"`,
            );

            logger.info("ℹ️ User flair cron unchanged", { newCron });
            return;
        }

        // 🔄 Cancel existing jobs (same behavior as your post version)
        await Promise.all(
            currentJobs
                .filter((job) => job.name === ADHOC_USER_FLAIR_JOB)
                .map((job) => context.scheduler.cancelJob(job.id)),
        );

        // 🚀 Create new job (store cron in data)
        await context.scheduler.runJob({
            name: ADHOC_USER_FLAIR_JOB,
            cron: newCron,
            data: { cron: newCron },
        });

        await reply(context, event.comment.id, userFlairUpdateMessage);

        logger.info("🏅 User Flair Cron updated", {
            newCron,
            triggeredBy: author.username,
        });
    } catch (err) {
        logger.error(
            "❌ Error updating user flair cron",
            { error: err },
            context,
        );
    }
}

// helper
async function reply(context: TriggerContext, parentId: string, text: string) {
    const comment = await context.reddit.submitComment({
        id: parentId,
        text: formatMessage(text, {}),
    });
    await comment.distinguish();
}
