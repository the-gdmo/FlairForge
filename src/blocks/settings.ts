import {
    SettingsFormField,
    SettingsFormFieldValidatorEvent,
    TriggerContext,
} from "@devvit/public-api";

// const cronRegex = /^((\*|([0-5]?\d)(-([0-5]?\d))?)(\/\d{1,2})?)\s((\*|(1?\d|2[0-3])(-(1?\d|2[0-3]))?)(\/\d{1,2})?)\s((\*|(0?[1-9]|[12]\d|3[01])(-(0?[1-9]|[12]\d|3[01]))?)(\/\d{1,2})?)\s((\*|(0?[1-9]|1[0-2])(-(0?[1-9]|1[0-2]))?)(\/\d{1,2})?)\s((\*|[0-6](-[0-6])?)(\/\d{1,2})?)$/;

export enum AppSetting {
    LeaderboardMode = "leaderboardMode",
    LeaderboardName = "leaderboardName",
    LeaderboardSize = "leaderboardSize",
    EnablePostFlair = "enablePostFlair",
    PostFlairTimeframes = "postFlairTimeframe",
    EnableUserFlair = "enableUserFlair",
    UserFlairTimeframes = "userFlairTimeframe",
    PostFlairText = "postFlairValue",
    UserFlairText = "userFlairValue",
    UserFlairTemplateID = "userFlairTemplateID",
    UserFlairCSSClass = "userFlairCSSClass",
    PostFlairTemplateID = "postFlairTemplateID",
    PostFlairCSSClass = "postFlairCSSClass",
    NotifyOnPostFlairSuccess = "notifyOnPostFlairSuccess",
    PostFlairAwardSuccess = "postFlairAwardSuccess",
    NotifyOnPostFlairFail = "notifyOnPostFlairFail",
    PostFlairAwardFail = "postFlairAwardFail",
    NotifyOnPostFlairCronUpdateFailNormalUser = "notifyOnPostFlairCronUpdateFailNormalUser",
    PostFlairCronUpdateFailNormalUserMessage = "PostFlairCronUpdateFailNormalUserMessage",
    NotifyOnUserFlairCronUpdateFailNormalUser = "notifyOnUserFlairCronUpdateFailNormalUser",
    UserFlairCronUpdateFailNormalUserMessage = "userFlairCronUpdateFailNormalUserMessage",
    NotifyOnPostFlairCronUpdateSuccess = "notifyOnPostFlairCronUpdateSuccess",
    PostFlairCronUpdateSuccessMessage = "postFlairCronUpdateSuccessMessage",
    NotifyOnPostFlairCronUpdateFail = "notifyOnPostFlairCronUpdateFail",
    PostFlairCronUpdateFailMessage = "postFlairCronUpdateFailMessage",
    NotifyOnUserFlairAwardSuccess = "notifyOnUserFlairAwardSuccess",
    UserFlairAwardSuccessMessage = "userFlairAwardSuccessMessage",
    NotifyOnUserFlairAwardFail = "notifyOnUserFlairAwardFail",
    UserFlairAwardFailMessage = "userFlairAwardFailMessage",
    NotifyOnUserFlairCronUpdateSuccess = "notifyOnUserFlairCronUpdateSuccess",
    UserFlairCronUpdateSuccessMessage = "userFlairCronUpdateSuccessMessage",
    NotifyOnUserFlairCronUpdateFail = "notifyOnUserFlairCronUpdateFail",
    UserFlairCronUpdateFailMessage = "userFlairCronUpdateFailMessage",
    PostFlairCronUpdateCommand = "postFlairCronUpdateCommand",
    UserFlairCronUpdateCommand = "userFlairCronUpdateCommand",
    DiscordServerLink = "discordServerLink",
    PostFlairTimeframeLabel = "postFlairTimeframeLabel",
    UserFlairTimeframeLabel = "userFlairTimeframeLabel",
}

export enum TemplateDefaults {
    PostFlairAwardSuccessMessage = "[This post]({{permalink}})'s flair was set to {{postFlairValue}}.",
    PostFlairAwardFailMessage = "[This post]({{permalink}})'s flair was unable to be set. Error:\n\n> {{error}}.",
    PostFlairCronUpdateSuccessMessage = "u/{{cronUpdater}} has successfully updated the cron for post flairing to **{{newCron}}**.",
    PostFlairCronUpdateFailMessage = "u/{{cronUpdater}} was unable to update the post flair cron. Error:\n\n> {{error}}",
    UserFlairAwardSuccessMessage = "**{{timeframe}}** was appended to u/{{awardee}}'s flair. New Flair: **{{awardeeFlair}}**.",
    UserFlairAwardFailMessage = "u/{{awardee}}'s flair was unable to be set on [this post]({{permalink}}).",
    UserFlairCronUpdateSuccessMessage = "u/{{cronUpdater}} has successfully updated the cron for user flairing to **{{newCron}}**.",
    UserFlairCronUpdateFailMessage = "u/{{cronUpdater}} was unable to update the user flair cron. Error:\n\n> {{error}}",
    PostFlairCronUpdateFailNormalUserMessage = "u/{{cronUpdater}}, you do not have permission to change the cron for post flair.",
    UserFlairCronUpdateFailNormalUserMessage = "u/{{cronUpdater}}, you do not have permission to change the cron for user flair.",
}

export enum PostFlairTimeframes {
    Hourly = "hourly",
    Daily = "daily",
    Weekly = "weekly",
    Monthly = "monthly",
    Yearly = "yearly",
}

export const PostFlairTimeframeOptionChoices = [
    {
        label: "Hourly",
        value: PostFlairTimeframes.Hourly,
    },
    {
        label: "Daily",
        value: PostFlairTimeframes.Daily,
    },
    {
        label: "Weekly",
        value: PostFlairTimeframes.Weekly,
    },
    {
        label: "Monthly",
        value: PostFlairTimeframes.Monthly,
    },
    {
        label: "Yearly",
        value: PostFlairTimeframes.Yearly,
    },
];

export enum LeaderboardMode {
    Off = "off",
    ModOnly = "modonly",
    Public = "public",
}

const LeaderboardModeOptionChoices = [
    { label: "Off", value: LeaderboardMode.Off },
    { label: "Mod Only", value: LeaderboardMode.ModOnly },
    {
        label: "Default settings for wiki",
        value: LeaderboardMode.Public,
    },
];

export enum UserFlairTimeframes {
    Hourly = "hourly",
    Daily = "daily",
    Weekly = "weekly",
    Monthly = "monthly",
    Yearly = "yearly",
}

export const UserFlairTimeframeOptionChoices = [
    {
        label: "Hourly",
        value: UserFlairTimeframes.Hourly,
    },
    {
        label: "Daily",
        value: UserFlairTimeframes.Daily,
    },
    {
        label: "Weekly",
        value: UserFlairTimeframes.Weekly,
    },
    {
        label: "Monthly",
        value: UserFlairTimeframes.Monthly,
    },
    {
        label: "Yearly",
        value: UserFlairTimeframes.Yearly,
    },
];

export enum PostFlairCronUpdateSuccessNotification {
    Off = "none",
    ReplyByPM = "replybypm",
    ReplyAsComment = "replybycomment",
    NotifyMods = "notifymods",
}

export const PostFlairCronUpdateSuccessNotificationOptionChoices = [
    {
        label: "No Notification",
        value: PostFlairCronUpdateSuccessNotification.Off,
    },
    {
        label: "Send user a private message",
        value: PostFlairCronUpdateSuccessNotification.ReplyByPM,
    },
    {
        label: "Reply as comment",
        value: PostFlairCronUpdateSuccessNotification.ReplyAsComment,
    },
    {
        label: "Send a modmail",
        value: PostFlairCronUpdateSuccessNotification.NotifyMods,
    },
];

export enum PostFlairCronUpdateFailNotification {
    ReplyByPM = "replybypm",
    ReplyAsComment = "replybycomment",
    NotifyMods = "notifymods",
}

export const PostFlairCronUpdateFailNotificationOptionChoices = [
    {
        label: "Send user a private message",
        value: PostFlairCronUpdateFailNotification.ReplyByPM,
    },
    {
        label: "Reply as comment",
        value: PostFlairCronUpdateFailNotification.ReplyAsComment,
    },
    {
        label: "Send a modmail",
        value: PostFlairCronUpdateFailNotification.NotifyMods,
    },
];

export enum PostFlairNormalUserCronUpdateFailNotification {
    ReplyByPM = "replybypm",
    ReplyAsComment = "replybycomment",
    NotifyMods = "notifymods",
}

export const PostFlairNormalUserCronUpdateFailNotificationOptionChoices = [
    {
        label: "Send user a private message",
        value: PostFlairNormalUserCronUpdateFailNotification.ReplyByPM,
    },
    {
        label: "Reply as comment",
        value: PostFlairNormalUserCronUpdateFailNotification.ReplyAsComment,
    },
    {
        label: "Send a modmail",
        value: PostFlairNormalUserCronUpdateFailNotification.NotifyMods,
    },
];

export enum UserFlairNormalUserCronUpdateFailNotification {
    ReplyByPM = "replybypm",
    ReplyAsComment = "replybycomment",
    NotifyMods = "notifymods",
}

export const UserFlairNormalUserCronUpdateFailNotificationOptionChoices = [
    {
        label: "Send user a private message",
        value: UserFlairNormalUserCronUpdateFailNotification.ReplyByPM,
    },
    {
        label: "Reply as comment",
        value: UserFlairNormalUserCronUpdateFailNotification.ReplyAsComment,
    },
    {
        label: "Send a modmail",
        value: UserFlairNormalUserCronUpdateFailNotification.NotifyMods,
    },
];

export enum UserFlairCronUpdateSuccessNotification {
    Off = "none",
    ReplyByPM = "replybypm",
    ReplyAsComment = "replybycomment",
    NotifyMods = "notifymods",
}

export const UserFlairCronUpdateSuccessNotificationOptionChoices = [
    {
        label: "No Notification",
        value: UserFlairCronUpdateSuccessNotification.Off,
    },
    {
        label: "Send user a private message",
        value: UserFlairCronUpdateSuccessNotification.ReplyByPM,
    },
    {
        label: "Reply as comment",
        value: UserFlairCronUpdateSuccessNotification.ReplyAsComment,
    },
    {
        label: "Send a modmail",
        value: UserFlairCronUpdateSuccessNotification.NotifyMods,
    },
];

export enum UserFlairCronUpdateFailNotification {
    ReplyByPM = "replybypm",
    ReplyAsComment = "replybycomment",
    NotifyMods = "notifymods",
}

export const UserFlairCronUpdateFailNotificationOptionChoices = [
    {
        label: "Send user a private message",
        value: UserFlairCronUpdateFailNotification.ReplyByPM,
    },
    {
        label: "Reply as comment",
        value: UserFlairCronUpdateFailNotification.ReplyAsComment,
    },
    {
        label: "Send a modmail",
        value: UserFlairCronUpdateFailNotification.NotifyMods,
    },
];

export enum PostFlairDayOfWeek {
    Sunday = "sunday",
    Monday = "monday",
    Tuesday = "tuesday",
    Wednesday = "wednesday",
    Thursday = "thursday",
    Friday = "friday",
    Saturday = "saturday",
}

export const PostFlairDayOfTheWeekOptionChoices = [
    {
        label: "Sunday",
        value: PostFlairDayOfWeek.Sunday,
    },
    {
        label: "Monday",
        value: PostFlairDayOfWeek.Monday,
    },
    {
        label: "Tuesday",
        value: PostFlairDayOfWeek.Tuesday,
    },
    {
        label: "Wednesday",
        value: PostFlairDayOfWeek.Wednesday,
    },
    {
        label: "Thursday",
        value: PostFlairDayOfWeek.Thursday,
    },
    {
        label: "Friday",
        value: PostFlairDayOfWeek.Friday,
    },
    {
        label: "Saturday",
        value: PostFlairDayOfWeek.Saturday,
    },
];

export enum UserFlairDayOfWeek {
    Sunday = "sunday",
    Monday = "monday",
    Tuesday = "tuesday",
    Wednesday = "wednesday",
    Thursday = "thursday",
    Friday = "friday",
    Saturday = "saturday",
}

export const UserFlairDayOfTheWeekOptionChoices = [
    {
        label: "Sunday",
        value: UserFlairDayOfWeek.Sunday,
    },
    {
        label: "Monday",
        value: UserFlairDayOfWeek.Monday,
    },
    {
        label: "Tuesday",
        value: UserFlairDayOfWeek.Tuesday,
    },
    {
        label: "Wednesday",
        value: UserFlairDayOfWeek.Wednesday,
    },
    {
        label: "Thursday",
        value: UserFlairDayOfWeek.Thursday,
    },
    {
        label: "Friday",
        value: UserFlairDayOfWeek.Friday,
    },
    {
        label: "Saturday",
        value: UserFlairDayOfWeek.Saturday,
    },
];

export enum PostFlairSuccessReplyOptions {
    NoReply = "noreply",
    ReplyByPM = "replybypm",
    ReplyAsComment = "replybycomment",
}

export const NotifyOnPostFlairSuccessReplyOptionChoices = [
    {
        label: "No Notification",
        value: PostFlairSuccessReplyOptions.NoReply,
    },
    {
        label: "Send user a private message",
        value: PostFlairSuccessReplyOptions.ReplyByPM,
    },
    {
        label: "Reply as comment",
        value: PostFlairSuccessReplyOptions.ReplyAsComment,
    },
];

export enum UserFlairAwardSuccessReplyOptions {
    NotifyMods = "notifymods",
    ReplyByPM = "replybypm",
    ReplyAsComment = "replybycomment",
}

export const NotifyOnUserFlairAwardSuccessReplyOptionChoices = [
    {
        label: "Send user a private message",
        value: UserFlairAwardSuccessReplyOptions.ReplyByPM,
    },
    {
        label: "Reply as comment",
        value: UserFlairAwardSuccessReplyOptions.ReplyAsComment,
    },
    {
        label: "Send moderators a message",
        value: UserFlairAwardSuccessReplyOptions.NotifyMods,
    },
];

export enum UserFlairAwardFailReplyOptions {
    NotifyMods = "notifymods",
    ReplyByPM = "replybypm",
    ReplyAsComment = "replybycomment",
}

export const NotifyOnUserFlairAwardFailReplyOptionChoices = [
    {
        label: "Send user a private message",
        value: UserFlairAwardFailReplyOptions.ReplyByPM,
    },
    {
        label: "Reply as comment",
        value: UserFlairAwardFailReplyOptions.ReplyAsComment,
    },
    {
        label: "Send moderators a message",
        value: UserFlairAwardFailReplyOptions.NotifyMods,
    },
];

export enum PostFlairUpdateFailReplyOptions {
    Off = "none",
    ReplyByPM = "replybypm",
    ReplyAsComment = "replybycomment",
}

export const NotifyOnPostFlairUpdateFailReplyOptionChoices = [
    {
        label: "No Notification",
        value: PostFlairUpdateFailReplyOptions.Off,
    },
    {
        label: "Send user a private message",
        value: PostFlairUpdateFailReplyOptions.ReplyByPM,
    },
    {
        label: "Reply as comment",
        value: PostFlairUpdateFailReplyOptions.ReplyAsComment,
    },
];

export enum UserFlairUpdateFailReplyOptions {
    Off = "none",
    ReplyByPM = "replybypm",
    ReplyAsComment = "replybycomment",
}

export const NotifyOnUserFlairUpdateFailReplyOptionChoices = [
    {
        label: "No Notification",
        value: UserFlairUpdateFailReplyOptions.Off,
    },
    {
        label: "Send user a private message",
        value: UserFlairUpdateFailReplyOptions.ReplyByPM,
    },
    {
        label: "Reply as comment",
        value: UserFlairUpdateFailReplyOptions.ReplyAsComment,
    },
];

export const appSettings: SettingsFormField[] = [
    {
        type: "group",
        label: "Flair Settings",
        fields: [
            {
                name: AppSetting.EnablePostFlair,
                type: "boolean",
                label: "Enable Post Flair?",
                helpText: "Whether or not to enable post flairing capabilities",
                defaultValue: true,
            },
            {
                name: AppSetting.PostFlairTimeframes,
                type: "select",
                label: "Post Flair Timeframe",
                helpText:
                    "What timeframe the bot should check to set flairs (eg hourly, daily, etc.)",
                options: PostFlairTimeframeOptionChoices,
                defaultValue: [PostFlairTimeframes.Monthly],
                onValidate: selectFieldHasOptionChosen,
            },
            {
                name: AppSetting.PostFlairTimeframeLabel,
                type: "string",
                label: "Post Flair Timeframe Label",
                helpText: "Will be added to the end of the post's flair",
                onValidate: validateTimeframe,
                defaultValue: "Month",
            },
            {
                name: AppSetting.PostFlairText,
                type: "string",
                label: "Post Flair Text",
                helpText:
                    `It is recommended to end this with whatever timeframe you chose (eg, "Day", "Week", etc.)` +
                    `followed by a space or something similar as this will continuously be incremented upwards` +
                    `and will append new <timeframe>s (comma-separated) as they gain more`,
                defaultValue: "Top Post Week ",
                onValidate: stringFieldContainsText,
            },
            {
                name: AppSetting.PostFlairTemplateID,
                type: "string",
                label: "Post Flair Template ID",
                defaultValue: "",
            },
            {
                name: AppSetting.PostFlairCSSClass,
                type: "string",
                label: "Post Flair CSS Class",
                defaultValue: "",
            },
            {
                name: AppSetting.EnableUserFlair,
                type: "boolean",
                label: "Enable User Flair?",
                helpText: "Whether or not to enable user flairing capabilities",
                defaultValue: true,
            },
            {
                name: AppSetting.UserFlairTimeframes,
                type: "select",
                label: "User Flair Timeframe",
                helpText:
                    "What timeframe the bot should check to set user flairs (eg hourly, daily, etc.)",
                options: UserFlairTimeframeOptionChoices,
                defaultValue: [UserFlairTimeframes.Monthly],
                onValidate: selectFieldHasOptionChosen,
            },
            {
                name: AppSetting.UserFlairTimeframeLabel,
                type: "string",
                label: "User Flair Timeframe Label",
                helpText: "Will be added to the end of the post's flair",
                onValidate: validateTimeframe,
                defaultValue: "Month",
            },
            {
                name: AppSetting.UserFlairText,
                type: "string",
                label: "User Flair Text",
                helpText:
                    `It is recommended to end this with whatever timeframe you chose (eg, "Day", "Week", etc.)` +
                    `followed by a space or something similar as this will continuously be incremented upwards` +
                    `and will append new months (comma-separated) as they gain more`,
                defaultValue: "Top Upvoted User",
                onValidate: stringFieldContainsText,
            },
            {
                name: AppSetting.UserFlairTemplateID,
                type: "string",
                label: "User Flair Template ID",
            },
            {
                name: AppSetting.UserFlairCSSClass,
                type: "string",
                label: "User Flair CSS Class",
            },
        ],
    },
    {
        type: "group",
        label: "Post Flair Related Message Settings",
        fields: [
            {
                name: AppSetting.NotifyOnPostFlairSuccess,
                type: "select",
                label: "Notify on post flair update (success)?",
                options: NotifyOnPostFlairSuccessReplyOptionChoices,
                defaultValue: [PostFlairSuccessReplyOptions.NoReply],
                onValidate: selectFieldHasOptionChosen,
            },
            {
                name: AppSetting.PostFlairAwardSuccess,
                type: "paragraph",
                label: "Post Flair Award Success Message",
                helpText: "Message to send when post flair is successfully set",
                defaultValue: TemplateDefaults.PostFlairAwardSuccessMessage,
                onValidate: paragraphFieldContainsText,
            },
            {
                name: AppSetting.NotifyOnPostFlairFail,
                type: "select",
                label: "Notify on post flair update (fail)?",
                options: NotifyOnPostFlairUpdateFailReplyOptionChoices,
                defaultValue: [PostFlairUpdateFailReplyOptions.Off],
                onValidate: selectFieldHasOptionChosen,
            },
            {
                name: AppSetting.PostFlairAwardFail,
                type: "paragraph",
                label: "Post Flair Award Fail Message",
                helpText:
                    "Message to send when the bot tries to award a post flair, but there is an error",
                defaultValue: TemplateDefaults.PostFlairAwardFailMessage,
                onValidate: paragraphFieldContainsText,
            },
            {
                name: AppSetting.NotifyOnPostFlairCronUpdateSuccess,
                type: "select",
                label: "Notify on post flair cron update (success)?",
                options: PostFlairCronUpdateSuccessNotificationOptionChoices,
                defaultValue: [
                    PostFlairCronUpdateSuccessNotification.NotifyMods,
                ],
                onValidate: selectFieldHasOptionChosen,
            },
            {
                name: AppSetting.PostFlairCronUpdateSuccessMessage,
                type: "paragraph",
                label: "Post Flair Cron Update Success Message",
                helpText: "Message sent when the cron is updated successfully",
                defaultValue:
                    TemplateDefaults.PostFlairCronUpdateSuccessMessage,
                onValidate: paragraphFieldContainsText,
            },
            {
                name: AppSetting.NotifyOnPostFlairCronUpdateFail,
                type: "select",
                label: "Notify on post flair cron update (fail)?",
                options: PostFlairCronUpdateFailNotificationOptionChoices,
                defaultValue: [PostFlairCronUpdateFailNotification.NotifyMods],
                onValidate: selectFieldHasOptionChosen,
            },
            {
                name: AppSetting.PostFlairCronUpdateFailMessage,
                type: "paragraph",
                label: "Post Flair Cron Update Fail Message",
                helpText: "Message sent when the cron update is unsuccessful",
                defaultValue: TemplateDefaults.PostFlairCronUpdateFailMessage,
                onValidate: paragraphFieldContainsText,
            },
            {
                name: AppSetting.NotifyOnPostFlairCronUpdateFailNormalUser,
                type: "select",
                label: "Notify on post flair cron update (fail, non-mod)?",
                options:
                    PostFlairNormalUserCronUpdateFailNotificationOptionChoices,
                defaultValue: [
                    PostFlairNormalUserCronUpdateFailNotification.NotifyMods,
                ],
                onValidate: selectFieldHasOptionChosen,
            },
            {
                name: AppSetting.PostFlairCronUpdateFailNormalUserMessage,
                type: "paragraph",
                label: "Post Flair Cron Update Attempted By Non-Mod Message",
                defaultValue:
                    TemplateDefaults.PostFlairCronUpdateFailNormalUserMessage,
                onValidate: paragraphFieldContainsText,
            },
        ],
    },
    {
        type: "group",
        label: "User Flair Related Message Settings",
        fields: [
            {
                name: AppSetting.NotifyOnUserFlairAwardSuccess,
                type: "select",
                label: "Notify on user flair update (success)?",
                options: NotifyOnUserFlairUpdateFailReplyOptionChoices,
                defaultValue: [UserFlairUpdateFailReplyOptions.Off],
                onValidate: selectFieldHasOptionChosen,
            },
            {
                name: AppSetting.UserFlairAwardSuccessMessage,
                type: "paragraph",
                label: "User Flair Award Success Message",
                helpText:
                    "Message to send when a user's flair is updated successfully",
                defaultValue: TemplateDefaults.UserFlairAwardSuccessMessage,
                onValidate: paragraphFieldContainsText,
            },
            {
                name: AppSetting.NotifyOnUserFlairAwardFail,
                type: "select",
                label: "Notify on user flair update (fail)?",
                options: NotifyOnUserFlairAwardFailReplyOptionChoices,
                defaultValue: [UserFlairAwardFailReplyOptions.NotifyMods],
                onValidate: selectFieldHasOptionChosen,
            },
            {
                name: AppSetting.UserFlairAwardFailMessage,
                type: "paragraph",
                label: "User Flair Award Fail Message",
                helpText:
                    "Message to send when the bot tries to update a user's flair, but an error occurs",
                defaultValue: TemplateDefaults.UserFlairAwardFailMessage,
                onValidate: paragraphFieldContainsText,
            },
            {
                name: AppSetting.NotifyOnUserFlairCronUpdateSuccess,
                type: "select",
                label: "Notify on user flair cron update (success)?",
                options: UserFlairCronUpdateSuccessNotificationOptionChoices,
                defaultValue: [
                    UserFlairCronUpdateSuccessNotification.NotifyMods,
                ],
                onValidate: selectFieldHasOptionChosen,
            },
            {
                name: AppSetting.UserFlairCronUpdateSuccessMessage,
                type: "paragraph",
                label: "User Flair Cron Update Success Message",
                helpText:
                    "Message to send when a user's flair is updated successfully",
                defaultValue:
                    TemplateDefaults.UserFlairCronUpdateSuccessMessage,
                onValidate: paragraphFieldContainsText,
            },
            {
                name: AppSetting.NotifyOnUserFlairCronUpdateFail,
                type: "select",
                label: "Notify on user flair cron update (fail)?",
                options: UserFlairCronUpdateFailNotificationOptionChoices,
                defaultValue: [UserFlairCronUpdateFailNotification.NotifyMods],
            },
            {
                name: AppSetting.UserFlairCronUpdateFailMessage,
                type: "paragraph",
                label: "User Flair Cron Update Fail Message",
                helpText: "Message sent when the cron update is unsuccessful",
                defaultValue: TemplateDefaults.UserFlairCronUpdateFailMessage,
                onValidate: paragraphFieldContainsText,
            },
            {
                name: AppSetting.NotifyOnUserFlairCronUpdateFailNormalUser,
                type: "select",
                label: "Notify on user flair cron update (fail, non-mod)?",
                options:
                    UserFlairNormalUserCronUpdateFailNotificationOptionChoices,
                defaultValue: [
                    UserFlairNormalUserCronUpdateFailNotification.NotifyMods,
                ],
                onValidate: selectFieldHasOptionChosen,
            },
            {
                name: AppSetting.UserFlairCronUpdateFailNormalUserMessage,
                type: "paragraph",
                label: "User Flair Cron Update Attempted By Non-Mod Message",
                defaultValue:
                    TemplateDefaults.UserFlairCronUpdateFailNormalUserMessage,
                onValidate: paragraphFieldContainsText,
            },
        ],
    },
    {
        type: "group",
        label: "Admin Settings",
        fields: [
            {
                name: AppSetting.PostFlairCronUpdateCommand,
                type: "string",
                label: "Post Flair Cron Update Command",
                helpText:
                    "You must use this in a comment any time you change the cron in the app settings",
                defaultValue: "/updatepostflaircron",
                onValidate: stringFieldContainsText,
            },
            {
                name: AppSetting.UserFlairCronUpdateCommand,
                type: "string",
                label: "User Flair Cron Update Command",
                helpText:
                    "You must use this in a comment any time you change the cron in the app settings",
                defaultValue: "/updateuserflaircron",
                onValidate: stringFieldContainsText,
            },
            {
                name: AppSetting.LeaderboardMode,
                type: "select",
                options: LeaderboardModeOptionChoices,
                label: "Wiki Leaderboard Mode",
                multiSelect: false,
                defaultValue: [LeaderboardMode.Off],
                onValidate: selectFieldHasOptionChosen,
            },
            {
                name: AppSetting.LeaderboardSize,
                type: "number",
                label: "Leaderboard Size",
                helpText: "Number of users to show on the leaderboard (1-100)",
                defaultValue: 50,
                onValidate: ({ value }) => {
                    if (value !== undefined && (value < 1 || value > 100)) {
                        return "Value should be between 1 and 100";
                    }
                },
            },
            {
                name: AppSetting.LeaderboardName,
                type: "string",
                label: "Leaderboard Wiki Name",
                helpText:
                    "Name of the wiki page for your subreddit's leaderboard (e.g. leaderboard). Singular form is recommended as there is only one leaderboard per subreddit",
                defaultValue: "leaderboard",
                onValidate: ({ value }) => {
                    if (!value || value.trim() === "") {
                        return "You must specify a wiki page name";
                    }
                },
            },
            {
                //DiscordServerLink
                name: AppSetting.DiscordServerLink,
                type: "string",
                label: "Discord Server Link",
                helpText:
                    "Optional. Link to your subreddit's discord server. A non-expiring link is recommended.",
            },
        ],
    },
];

function selectFieldHasOptionChosen(
    event: SettingsFormFieldValidatorEvent<string[]>,
) {
    if (!event.value || event.value.length !== 1) {
        return "You must choose an option (even if this is an irrelevant setting)";
    }
}

function stringFieldContainsText(
    event: SettingsFormFieldValidatorEvent<string>,
    _context: TriggerContext,
): string | void {
    if (typeof event.value !== "string") {
        return "Value must be a string.";
    }

    if (event.value.length === 0) {
        return "Field cannot be empty (even if this is an irrelevant setting).";
    }
}

function paragraphFieldContainsText(
    event: SettingsFormFieldValidatorEvent<string>,
    _context: TriggerContext,
): string | void {
    if (typeof event.value !== "string") {
        return "Value must be a string.";
    }

    if (event.value.length === 0) {
        return "Field cannot be empty (even if this is an irrelevant setting).";
    }
}

function validateTimeframe(event: SettingsFormFieldValidatorEvent<string>) {
    if (!event.value || event.value.trim() === "") {
        return `A timeframe must be specified (even if you have the timeframe set to "Disabled")`;
    }
    if (
        event.value.trim().includes("Hour") ||
        event.value.trim().includes("Day") ||
        event.value.trim().includes("Week") ||
        event.value.trim().includes("Month") ||
        event.value.trim().includes("Year")
    ) {
        return "You must specify a valid timeframe. Valid timeframes: Hour, Day, Week, Month, Year";
    }
}
