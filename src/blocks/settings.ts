import {
    SettingsFormField,
    SettingsFormFieldValidatorEvent,
    TriggerContext,
} from "@devvit/public-api";

export enum AppSetting {
    EnablePostFlair = "enablePostFlair",
    PostFlairCron = "postFlairCron",
    NotifyOnCronUpdateSuccess = "notifyOnCronUpdateSuccess",
    CronUpdateSuccessMessage = "cronUpdateSuccessMessage",
    NotifyOnCronUpdateFail = "notifyOnCronUpdateFail",
    CronUpdateFailMessage = "cronUpdateFailMessage",
    // PostFlairTimeframe = "postFlairTimeframe",
    EnableUserFlair = "enableUserFlair",
    UserFlairCron = "userFlairCron",
    // UserFlairTimeframe = "userFlairTimeframe",
    PostFlairValue = "postFlairValue",
    UserFlairValue = "userFlairValue",
    UserFlairTemplateId = "userFlairTemplateId",
    UserFlairCSSClass = "userFlairCSSClass",
    PostFlairTemplateId = "postFlairTemplateId",
    PostFlairCSSClass = "postFlairCSSClass",
    NotifyOnPostFlairSuccess = "notifyOnPostFlairSuccess",
    PostFlairSuccessMessage = "postFlairSuccessMessage",
    NotifyOnPostFlairFail = "notifyOnPostFlairFail",
    PostFlairFailMessage = "postFlairFailMessage",
    NotifyOnUserFlairSuccess = "notifyOnUserFlairSuccess",
    UserFlairSuccessMessage = "userFlairSuccessMessage",
    NotifyOnUserFlairFail = "notifyOnUserFlairFail",
    UserFlairFailMessage = "userFlairFailMessage",
}

export enum TemplateDefaults {
    UserFlairFailMessage = "u/{{awardee}}'s flair was unable to be set on [this post]({{permalink}}).",
    UserFlairSuccessMessage = "{{week}} has been added to u/{{awardee}}'s flair. New flair: **{{awardeeFlair}}**.",
    PostFlairFailMessage = "[This post]({{permalink}})'s flair was unable to be set to **{{postFlairValue}}**.",
    PostFlairSuccessMessage = "[{{title}}]({{permalink}})'s flair has been set to **{{postFlairValue}}**",
    //todo: update the below messages
    CronUpdateFailMessage = "",
    CronUpdateSuccessMessage = "",
}

// export enum PostFlairTimeframes {
//     Off = "off",
//     Hourly = "hourly",
//     Daily = "daily",
//     Weekly = "weekly",
//     Monthly = "monthly",
//     Yearly = "yearly"
// }

// export const PostFlairTimeFrameOptionChoices = [
//     {
//         name: "Disabled",
//         value: PostFlairTimeframes.Off,
//     },
//     {
//         name: "Hourly",
//         value: PostFlairTimeframes.Hourly,
//     },
//     {
//         name: "Daily",
//         value: PostFlairTimeframes.Daily,
//     },
//     {
//         name: "Weekly",
//         value: PostFlairTimeframes.Weekly,
//     },
//     {
//         name: "Monthly",
//         value: PostFlairTimeframes.Monthly,
//     },
//     {
//         name: "Yearly",
//         value: PostFlairTimeframes.Yearly,
//     },
// ]

// export enum UserFlairTimeframes {
//     Off = "off",
//     Hourly = "hourly",
//     Daily = "daily",
//     Weekly = "weekly",
//     Monthly = "monthly",
//     Yearly = "yearly"
// }

// export const UserFlairTimeFrameOptionChoices = [
//     {
//         name: "Disabled",
//         value: UserFlairTimeframes.Off,
//     },
//     {
//         name: "Hourly",
//         value: UserFlairTimeframes.Hourly,
//     },
//     {
//         name: "Daily",
//         value: UserFlairTimeframes.Daily,
//     },
//     {
//         name: "Weekly",
//         value: UserFlairTimeframes.Weekly,
//     },
//     {
//         name: "Monthly",
//         value: UserFlairTimeframes.Monthly,
//     },
//     {
//         name: "Yearly",
//         value: UserFlairTimeframes.Yearly,
//     },
// ]

export enum PostFlairCronUpdateNotification {
    Off = "none",
    ReplyByPM = "replybypm",
    ReplyAsComment = "replybycomment",
    NotifyMods = "notifymods",
}

export const PostFlairCronUpdateNotificationOptionChoices = [
    {
        name: "No Notification",
        value: PostFlairCronUpdateNotification.Off,
    },
    {
        name: "Send user a private message",
        value: PostFlairCronUpdateNotification.ReplyByPM,
    },
    {
        name: "Reply as comment",
        value: PostFlairCronUpdateNotification.ReplyAsComment,
    },
    {
        name: "Send a modmail",
        value: PostFlairCronUpdateNotification.NotifyMods,
    },
];

export enum UserFlairCronUpdateNotification {
    Off = "none",
    ReplyByPM = "replybypm",
    ReplyAsComment = "replybycomment",
    NotifyMods = "notifymods",
}

export const UserFlairCronUpdateNotificationOptionChoices = [
    {
        name: "No Notification",
        value: UserFlairCronUpdateNotification.Off,
    },
    {
        name: "Send user a private message",
        value: UserFlairCronUpdateNotification.ReplyByPM,
    },
    {
        name: "Reply as comment",
        value: UserFlairCronUpdateNotification.ReplyAsComment,
    },
    {
        name: "Send a modmail",
        value: UserFlairCronUpdateNotification.NotifyMods,
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
        name: "Sunday",
        value: PostFlairDayOfWeek.Sunday,
    },
    {
        name: "Monday",
        value: PostFlairDayOfWeek.Monday,
    },
    {
        name: "Tuesday",
        value: PostFlairDayOfWeek.Tuesday,
    },
    {
        name: "Wednesday",
        value: PostFlairDayOfWeek.Wednesday,
    },
    {
        name: "Thursday",
        value: PostFlairDayOfWeek.Thursday,
    },
    {
        name: "Friday",
        value: PostFlairDayOfWeek.Friday,
    },
    {
        name: "Saturday",
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
        name: "Sunday",
        value: UserFlairDayOfWeek.Sunday,
    },
    {
        name: "Monday",
        value: UserFlairDayOfWeek.Monday,
    },
    {
        name: "Tuesday",
        value: UserFlairDayOfWeek.Tuesday,
    },
    {
        name: "Wednesday",
        value: UserFlairDayOfWeek.Wednesday,
    },
    {
        name: "Thursday",
        value: UserFlairDayOfWeek.Thursday,
    },
    {
        name: "Friday",
        value: UserFlairDayOfWeek.Friday,
    },
    {
        name: "Saturday",
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

export enum UserFlairSuccessReplyOptions {
    NotifyMods = "notifymods",
    ReplyByPM = "replybypm",
    ReplyAsComment = "replybycomment",
}

export const NotifyOnUserFlairSuccessReplyOptionChoices = [
    {
        label: "Send user a private message",
        value: UserFlairSuccessReplyOptions.ReplyByPM,
    },
    {
        label: "Reply as comment",
        value: UserFlairSuccessReplyOptions.ReplyAsComment,
    },
    {
        label: "Send moderators a message",
        value: UserFlairSuccessReplyOptions.NotifyMods,
    },
];

//end dah
export enum PostFlairFailReplyOptions {
    NotifyMods = "notifymods",
    ReplyByPM = "replybypm",
    ReplyAsComment = "replybycomment",
}

export const NotifyOnPostFlairFailReplyOptionChoices = [
    {
        label: "Send user a private message",
        value: PostFlairFailReplyOptions.ReplyByPM,
    },
    {
        label: "Reply as comment",
        value: PostFlairFailReplyOptions.ReplyAsComment,
    },
    {
        label: "Send moderators a message",
        value: PostFlairFailReplyOptions.NotifyMods,
    },
];

export enum UserFlairFailReplyOptions {
    NotifyMods = "notifymods",
    ReplyByPM = "replybypm",
    ReplyAsComment = "replybycomment",
}

export const NotifyOnUserFlairFailReplyOptionChoices = [
    {
        label: "Send user a private message",
        value: UserFlairFailReplyOptions.ReplyByPM,
    },
    {
        label: "Reply as comment",
        value: UserFlairFailReplyOptions.ReplyAsComment,
    },
    {
        label: "Send moderators a message",
        value: UserFlairFailReplyOptions.NotifyMods,
    },
];

export const appSettings: SettingsFormField[] = [
    // {
    //     type: "group",
    //     label: "Test label",
    //     helpText:
    //         "Testing label",
    //     fields: [
    //         {
    //             name: "test",
    //             type: "string",
    //             label: "Test",
    //             helpText: "Test",
    //             defaultValue: "test",
    //         },
    //     ],
    // },
    {
        type: "group",
        label: "Flair Settings",
        helpText: "",
        fields: [
            {
                name: AppSetting.EnablePostFlair,
                type: "boolean",
                label: "",
                helpText: "Whether or not to enable post flairing capabilities",
                defaultValue: true,
            },
            {
                name: AppSetting.PostFlairCron,
                type: "string",
                label: "Post Flair Cron",
                helpText: "When this should run in cron time",
                defaultValue: "0 0 1 * *",
                onValidate: validateCron,
            },
            {
                name: AppSetting.EnableUserFlair,
                type: "boolean",
                label: "",
                helpText: "",
                defaultValue: true,
            },
            {
                name: AppSetting.UserFlairCron,
                type: "string",
                label: "User Flair Cron",
                helpText: "When this should run in cron time",
                defaultValue: "0 0 1 * *",
                onValidate: validateCron,
            },
        ],
    },
];

function isFlairTemplateValid(event: SettingsFormFieldValidatorEvent<string>) {
    const flairTemplateRegex = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){4}[0-9a-f]{8}$/i;
    if (event.value && !flairTemplateRegex.test(event.value)) {
        return "Invalid flair template ID";
    }
}

function selectFieldHasOptionChosen(
    event: SettingsFormFieldValidatorEvent<string[]>,
) {
    if (!event.value || event.value.length !== 1) {
        return "You must choose an option (even if this is an irrelevant setting)";
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

function validateCron(event: SettingsFormFieldValidatorEvent<string>) {
    const cronRegex =
        /^((\*|([0-5]?\d)(-([0-5]?\d))?)(\/\d{1,2})?)\s((\*|(1?\d|2[0-3])(-(1?\d|2[0-3]))?)(\/\d{1,2})?)\s((\*|(0?[1-9]|[12]\d|3[01])(-(0?[1-9]|[12]\d|3[01]))?)(\/\d{1,2})?)\s((\*|(0?[1-9]|1[0-2])(-(0?[1-9]|1[0-2]))?)(\/\d{1,2})?)\s((\*|[0-6](-[0-6])?)(\/\d{1,2})?)$/;

    if (!event.value || event.value.length === 0) {
        return "Field cannot be empty (even if this is an irrelevant setting).";
    }
    if (typeof event.value !== "string") {
        return "Value must be a string.";
    }
    if (!cronRegex.test(event.value)) {
        return "Field must contain a valid cron. If you do not know how to do this, check [this site](https://crontab.cronhub.io/).";
    }
}
