import { formatDate } from "date-fns";
import { logger } from "./logger";
import { getSubredditName, SafeWikiClient } from "./utility";
import {
    JobContext,
    JSONObject,
    ScheduledJobEvent,
    TriggerContext,
    WikiPage,
} from "@devvit/public-api";
import {
    USER_FLAIR_HISTORY,
    USER_USER_HISTORY,
} from "./constants";
import { AppSetting } from "./settings";

export async function updateLeaderboard(
    event: ScheduledJobEvent<JSONObject | undefined>,
    context: JobContext,
) {
    const settings = await context.settings.getAll();

    const leaderboardMode = settings[AppSetting.LeaderboardMode] as
        | string[]
        | undefined;

    if (
        !leaderboardMode ||
        leaderboardMode.length === 0 ||
        leaderboardMode[0] === "off"
    ) {
        logger.debug("🏁 Leaderboard mode off — skipping update.");
        return;
    }

    const wikiPageName =
        (settings[AppSetting.LeaderboardName] as string | undefined) ??
        "leaderboard";

    const leaderboardSize =
        (settings[AppSetting.LeaderboardSize] as number | undefined) ?? 20;

    const subredditName = await getSubredditName(context);

    // ───────── Fetch scores ─────────

    const postScores = await context.redis.zRange(
        USER_FLAIR_HISTORY,
        0,
        leaderboardSize - 1,
        { by: "rank", reverse: true },
    );

    const userScores = await context.redis.zRange(
        USER_USER_HISTORY,
        0,
        leaderboardSize - 1,
        { by: "rank", reverse: true },
    );

    function buildTable(data: any[]) {
        if (data.length === 0) return "No data.";

        return `
User | Score
-|-
${data
    .map(
        (entry) =>
            `[${entry.member}](https://reddit.com/r/${subredditName}/wiki/user/${entry.member})|${entry.score}`,
    )
    .join("\n")}
`.trim();
    }

    const postTable = buildTable(postScores);
    const userTable = buildTable(userScores);

    // ───────── Build wiki ─────────

    const wikiContents = `
# Leaderboard for ${subredditName}

## Post Flair Scoreboard
${postTable}

---

## User Flair Scoreboard
${userTable}
`.trim();

    // ───────── Write wiki ─────────

    let wikiPage: WikiPage | undefined;

    try {
        wikiPage = await context.reddit.getWikiPage(
            subredditName,
            wikiPageName,
        );
    } catch {}

    if (wikiPage) {
        if (wikiPage.content !== wikiContents) {
            await context.reddit.updateWikiPage({
                subredditName,
                page: wikiPageName,
                content: wikiContents,
                reason: event.data?.reason as string | undefined,
            });
        }
    } else {
        await context.reddit.createWikiPage({
            subredditName,
            page: wikiPageName,
            content: wikiContents,
            reason: "Create leaderboard",
        });
    }

    logger.info("📊 Dual leaderboard updated");
}

export async function updateUserWiki(
    context: TriggerContext,
    username: string,
) {
    username = username.toLowerCase();

    const subredditName =
        context.subredditName ??
        (await context.reddit.getCurrentSubreddit()).name;

    async function load(key: string) {
        const raw = await context.redis.zRange(key, 0, -1, { by: "rank" });
        return raw.map((r) => JSON.parse(r.member));
    }

    const postHistory = await load(USER_FLAIR_HISTORY);
    const userHistory = await load(USER_USER_HISTORY);

    function buildPostTable(list: any[]) {
        if (list.length === 0) return "No history.";

        return `
| Date | Count | Post |
| :-: | :-: | :-- |
${list
    .map(
        (e) =>
            `| ${formatDate(e.date, new Date(e.date).toISOString().replace("T", " ").slice(0, 16) + " UTC")} | ${
                e.count
            } | [${e.postTitle}](${e.postUrl})`,
    )
    .join("\n")}
`.trim();
    }

    function buildUserTable(list: any[]) {
        if (list.length === 0) return "No history.";

        return `
| Date | Count |
| :-: | :-: |
${list
    .map(
        (e) =>
            `| ${formatDate(e.date, new Date(e.date).toISOString().replace("T", " ").slice(0, 16) + " UTC")} | ${
                e.count
            }`,
    )
    .join("\n")}
`.trim();
    }

    const content = `
# Flair History for u/${username}

## Post Flair Scoreboard
${buildPostTable(postHistory)}

---

## User Flair Scoreboard
${buildUserTable(userHistory)}
`.trim();

    await context.reddit.updateWikiPage({
        subredditName,
        page: `user/${username}`,
        content,
        reason: "Update user flair history",
    });

    logger.info("📄 User dual flair wiki updated", { username });
}

function modInfoTemplate(subredditName: string): string {
    return (
        `# TheRepBot Mod Info for r/${subredditName}\n\n` +
        `***This page is automatically managed by TheRepBot. Any edits will be overwritten.***\n\n` +
        `---\n\n` +
        `## Leaderboard Configuration\n\n` +
        `* If no help page is set, the leaderboard post will not include a link to a help page.\n\n` +
        `* If you want to change the name of the help page, you must update the "Point System Help Page" setting.\n\n` +
        `* **Note:** If you change the leaderboard name in settings, the wiki page link will be updated in the leaderboard post but the old page's contents` +
        ` will not be pulled and you will have to edit the new one manually.\n\n`
    );
}

export async function modLeaderboardInfoJob(
    _: ScheduledJobEvent<JSONObject | undefined>,
    context: JobContext,
) {
    const subreddit = await context.reddit.getCurrentSubreddit();
    const subredditName = subreddit.name;
    const safeWiki = new SafeWikiClient(context.reddit);
    const wikiPath = "therepbot/modinfo";

    const template = modInfoTemplate(subredditName);

    let existingPage = undefined;
    try {
        existingPage = await safeWiki.getWikiPage(subredditName, wikiPath);

        if (!existingPage) {
            await safeWiki.createWikiPage({
                subredditName,
                page: wikiPath,
                content: template,
                reason: "Mod info wiki page setup",
            });
            logger.info(`📘 No existing wiki page found — created ${wikiPath}`);
        }
        logger.info("ℹ️ Existing mod info wiki page found");
    } catch (err) {
        logger.error("❌ Error retrieving mod info wiki page", {
            error: String(err),
        });
    }
    // ──────────────── set page content to template ────────────────

    await context.reddit.updateWikiPage({
        subredditName,
        page: wikiPath,
        content: template,
        reason: `Set page to template content`,
    });
}
