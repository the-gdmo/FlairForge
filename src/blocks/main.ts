import {
    Context,
    Devvit,
    FormField,
    FormOnSubmitEvent,
    JSONObject,
    MenuItemOnPressEvent,
} from "@devvit/public-api";
import { appSettings } from "./settings";
import { onAppFirstInstall, onAppInstallOrUpgrade } from "./installEvents";
import { modLeaderboardInfoJob, updateLeaderboard } from "./leaderboard";
import { cleanupDeletedAccounts } from "./cleanupTasks";
import {
    ADHOC_CLEANUP_JOB,
    ADHOC_POST_FLAIR_JOB,
    ADHOC_USER_FLAIR_JOB,
    CLEANUP_JOB,
    UPDATE_LEADERBOARD_JOB,
    UPDATE_MODINFO_JOB,
} from "./constants";
import { logger } from "./logger";
import { addPostFlair } from "./triggers/updateTypes/update/postFlairUpdate";
import { getWeekKey, setWeekKey } from "./triggers/utils/redisKeys";
import { getSubredditName } from "./utility";
import { addUserFlair } from "./triggers/updateTypes/update/userFlairUpdate";

Devvit.addSettings(appSettings);

Devvit.addTrigger({
    event: "AppInstall",
    onEvent: onAppFirstInstall,
});

Devvit.addTrigger({
    events: ["AppInstall", "AppUpgrade"],
    onEvent: onAppInstallOrUpgrade,
});

Devvit.addSchedulerJob({
    name: UPDATE_MODINFO_JOB,
    onRun: modLeaderboardInfoJob,
});
Devvit.addSchedulerJob({
    name: UPDATE_LEADERBOARD_JOB,
    onRun: updateLeaderboard,
});

Devvit.addSchedulerJob({
    name: CLEANUP_JOB,
    onRun: cleanupDeletedAccounts,
});

Devvit.addSchedulerJob({
    name: ADHOC_POST_FLAIR_JOB,
    onRun: addPostFlair,
});

Devvit.addSchedulerJob({
    name: ADHOC_USER_FLAIR_JOB,
    onRun: addUserFlair,
});

Devvit.addSchedulerJob({
    name: ADHOC_CLEANUP_JOB,
    onRun: cleanupDeletedAccounts,
});

Devvit.addMenuItem({
    label: "[FlairForge] - Set Week Number",
    forUserType: "moderator",
    location: "comment",
    onPress: handleManualWeekSetting,
});

Devvit.addMenuItem({
    label: "[FlairForge] - Pin Comment",
    location: "comment",
    forUserType: "moderator",
    onPress: handleCommentPin,
});

export const manualSetWeekForm = Devvit.createForm(
    (data) => ({ fields: data.fields as FormField[] }),
    manualSetWeekFormHandler,
);

export async function handleCommentPin(
    event: MenuItemOnPressEvent,
    context: Context,
): Promise<void> {
    if (event.location !== "comment" || !event.targetId) {
        context.ui.showToast({
            text: "Invalid comment target.",
        });
        return;
    }

    try {
        const comment = await context.reddit.getCommentById(event.targetId);
        if (!comment) {
            context.ui.showToast({
                text: "Comment not found.",
            });
            return;
        }

        const appUser = await context.reddit.getAppUser();

        if (comment.authorName !== appUser.username) {
            context.ui.showToast({
                text: "Only comments created by u/ can be pinned.",
            });
            logger.warn("❌ Attempted to pin non-bot comment", {
                commentAuthor: comment.authorName,
                botUsername: appUser.username,
            });
            return;
        }

        // 🔒 Must be a top-level comment (parent is the post)
        if (!comment.parentId?.startsWith("t3_")) {
            context.ui.showToast({
                text: "Only top-level comments can be pinned.",
            });
            await logger.error(
                `❌ Attempted to pin comment that isn't top-level`,
            );
            return;
        }

        if (comment.isStickied()) {
            context.ui.showToast({
                text: "This comment is already pinned.",
            });
            await logger.error(
                `❌ Attempted to pin comment that is already stickied`,
            );
            return;
        }
        await comment.distinguish(true);

        context.ui.showToast({
            text: "Comment pinned successfully",
        });

        logger.info("📌 Comment pinned", {
            commentId: comment.id,
        });
    } catch (err) {
        await logger.error("❌ Failed to pin comment", {
            commentId: event.targetId,
            error: String(err),
        });

        context.ui.showToast({
            text: "Failed to pin comment.",
        });
    }
}

export async function handleManualWeekSetting(
    _: MenuItemOnPressEvent,
    context: Context,
) {
    const currentScore = await getWeekKey(context);

    const fields = [
        {
            name: "week",
            type: "number",
            defaultValue: currentScore,
            label: `Enter a new week`,
            helpText: "Warning: This will overwrite the week count",
            multiSelect: false,
            required: true,
        },
    ];

    context.ui.showForm(manualSetWeekForm, { fields });
}

export async function manualSetWeekFormHandler(
    event: FormOnSubmitEvent<JSONObject>,
    context: Context,
) {
    const entry = event.values.week as number | undefined;
    if (
        typeof entry !== "number" ||
        isNaN(entry) ||
        parseInt(entry.toString(), 10) < 1
    ) {
        context.ui.showToast("You must enter a new score (1 or higher)");
        return;
    }

    await setWeekKey(context, entry.toString());
    const subredditName = await getSubredditName(context);

    context.ui.showToast(`Week for ${subredditName} is now ${entry}`);
}

Devvit.configure({
    redditAPI: true,
    redis: true,
});

export default Devvit;
