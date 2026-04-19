import { TriggerContext } from "@devvit/public-api";
import { AppInstall, AppUpgrade } from "@devvit/protos";
import { populateCleanupLogAndScheduleCleanup } from "./cleanupTasks";
import {
    ADHOC_POST_FLAIR_JOB,
    ADHOC_USER_FLAIR_JOB,
    CLEANUP_JOB,
    CLEANUP_JOB_CRON,
    MODINFO_CRON,
    UPDATE_MODINFO_JOB,
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

    const userFlairCron =
        (settings[AppSetting.UserFlairCron] as string) ?? "0 0 1 * *";
    const postFlairCron =
        (settings[AppSetting.PostFlairCron] as string) ?? "0 0 1 * *";

    await context.scheduler.runJob({
        cron: userFlairCron,
        name: ADHOC_USER_FLAIR_JOB,
    });

    await context.scheduler.runJob({
        cron: postFlairCron,
        name: ADHOC_POST_FLAIR_JOB,
    });

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
