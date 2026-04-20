export const USER_USER_HISTORY = "userUserHistory";
export const USER_FLAIR_HISTORY = "userFlairHistory";
// Job Names
export const UPDATE_LEADERBOARD_JOB = "updateLeaderboard";
export const UPDATE_MODINFO_JOB = "updateModInfo";
export const CLEANUP_JOB = "cleanupDeletedAccounts";
export const ADHOC_CLEANUP_JOB = "cleanupDeletedAccountsAdhoc";
export const VALIDATE_REGEX_JOB = "validateRegex";
export const ADHOC_POST_FLAIR_JOB = "updatePostFlairAdhoc";
export const ADHOC_USER_FLAIR_JOB = "updateUserFlairAdhoc";

// Job Cron
export const CLEANUP_JOB_CRON = "0 23 * * *";
export const MODINFO_CRON = "0 * * * *";

export const HOURLY_CRON = "0 * * * *";
export const DAILY_CRON = "0 0 * * *";
export const WEEKLY_CRON = "0 0 * * 0";
export const MONTHLY_CRON = "0 0 1 * *";
export const YEARLY_CRON = "0 0 1 1 *";
