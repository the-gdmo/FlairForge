import { TriggerContext } from "@devvit/public-api";
import { AppInstall, AppUpgrade } from "@devvit/protos";
import { populateCleanupLogAndScheduleCleanup } from "./cleanupTasks";
import {
    ADHOC_POST_FLAIR_JOB,
    ADHOC_USER_FLAIR_JOB,
    CLEANUP_JOB,
    CLEANUP_JOB_CRON,
    DAILY_CRON,
    HOURLY_CRON,
    MODINFO_CRON,
    MONTHLY_CRON,
    UPDATE_MODINFO_JOB,
    WEEKLY_CRON,
    YEARLY_CRON,
} from "./constants";
import {
    AppSetting,
    PostFlairTimeframes,
    UserFlairTimeframes,
} from "./settings";

export async function onAppFirstInstall(
    _: AppInstall,
    context: TriggerContext,
) {
    await context.redis.set("InstallDate", new Date().getTime().toString());
}

export async function onAppInstallOrUpgrade(
    _: AppInstall | AppUpgrade,
    context: TriggerContext,
) {
    const currentJobs = await context.scheduler.listJobs();
    await Promise.all(
        currentJobs.map((job) => context.scheduler.cancelJob(job.id)),
    );

    const settings = await context.settings.getAll();

    const userFlairTimeframes = ((settings[
        AppSetting.UserFlairTimeframes
    ] as string[]) ?? ["off"])[0];

    const postFlairTimeframes = ((settings[
        AppSetting.PostFlairTimeframes
    ] as string[]) ?? ["off"])[0];

    switch (userFlairTimeframes) {
        case UserFlairTimeframes.Hourly:
            await context.scheduler.runJob({
                cron: HOURLY_CRON,
                name: ADHOC_USER_FLAIR_JOB,
            });
            break;
        case UserFlairTimeframes.Daily:
            await context.scheduler.runJob({
                cron: DAILY_CRON,
                name: ADHOC_USER_FLAIR_JOB,
            });
            break;
        case UserFlairTimeframes.Weekly:
            await context.scheduler.runJob({
                cron: WEEKLY_CRON,
                name: ADHOC_USER_FLAIR_JOB,
            });
            break;
        case UserFlairTimeframes.Monthly:
            await context.scheduler.runJob({
                cron: MONTHLY_CRON,
                name: ADHOC_USER_FLAIR_JOB,
            });
            break;
        case UserFlairTimeframes.Yearly:
            await context.scheduler.runJob({
                cron: YEARLY_CRON,
                name: ADHOC_USER_FLAIR_JOB,
            });
            break;
    }

    switch (postFlairTimeframes) {
        case PostFlairTimeframes.Hourly:
            await context.scheduler.runJob({
                cron: HOURLY_CRON,
                name: ADHOC_POST_FLAIR_JOB,
            });
            break;
        case PostFlairTimeframes.Daily:
            await context.scheduler.runJob({
                cron: DAILY_CRON,
                name: ADHOC_POST_FLAIR_JOB,
            });
            break;
        case PostFlairTimeframes.Weekly:
            await context.scheduler.runJob({
                cron: WEEKLY_CRON,
                name: ADHOC_POST_FLAIR_JOB,
            });
            break;
        case PostFlairTimeframes.Monthly:
            await context.scheduler.runJob({
                cron: MONTHLY_CRON,
                name: ADHOC_POST_FLAIR_JOB,
            });
            break;
        case PostFlairTimeframes.Yearly:
            await context.scheduler.runJob({
                cron: YEARLY_CRON,
                name: ADHOC_POST_FLAIR_JOB,
            });
            break;
    }

    await context.scheduler.runJob({
        name: CLEANUP_JOB,
        cron: CLEANUP_JOB_CRON,
    });
    await context.scheduler.runJob({
        name: UPDATE_MODINFO_JOB,
        cron: MODINFO_CRON,
    });

    await populateCleanupLogAndScheduleCleanup(context);

    await context.scheduler.runJob({
        name: "updateLeaderboard",
        runAt: new Date(),
        data: { reason: "FlairForge has been installed or upgraded." },
    });
}
