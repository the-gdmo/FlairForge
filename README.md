FlairForge is an app that manages user and post flair based on how highly a post was upvoted over x amount of time.

The app gets triggered on the day you specify and checks post karma from the top x time specified in the settings and awards the author of that post.

## Limitations

* The optional leaderboard will not track until it has flaired at least one user/post.
* If you uninstall and reinstall, all data will be reset back to 0. You can change the week number via the "Set week number" option.
* For flair setting options, if you specify both a CSS class and a flair template, the flair template will be used.
* All-time flairing isn't possible.

## Suggestions

I recommend testing settings out on a test subreddit before deploying to a real subreddit for the first time.

## Supported Placeholders
* `{{author}}`: The username of the poster. Will not contain 'u/'.
* `{{week}}`: What week the flair was changed on relative to when the bot was installed.
* `{{awardeeFlair}}`: Get the most up-to-date version of the awardee's flair.
* `{{title}}`: Get the title of the post being actioned.
* `{{postFlairValue}}`: Get the value of the post flair setting.
* `{{userFlairValue}}`: Get the value of the user flair setting.
* `{{awardee}}`: The user being awarded. Will not contain 'u/'.
* `{{permalink}}`: Links to the post being actioned.
* `{{helpPage}}`: Link to a page explaining how to use the bot. Uses the Old Reddit version of this page.
* `{{leaderboard}}`: Link to a page of the subreddit's leaderboard. Uses the Old Reddit version of this page.
* `{{subreddit}}`: Get the name of the subreddit. Will not contain 'r/'.
* `{{awardeePage}}`: Link to a recipient's individual page. Logs all points received and given that are not alternate commands.

## Data Stored

This application stores the reputation score awarded by the app for each user in a Redis data store and (if configured) as the user's flair.

If the application is removed from a subreddit, all data is deleted although the flairs will remain. If the application is subsequently re-installed, the week number will reset to 0 and you will have to manually change it back.

## Acknowledgements

[Base code forked from RepBot](https://github.com/the-gdmo/FlairForge).

## About

This app is open source and licensed under the BSD 3-Clause License. You can find the source code on GitHub [here](https://github.com/the-gdmo/FlairForge).

NOTE: If you remove the app from your subreddit, it will delete all data and you will have to manually edit the week number back to what it was before.

## Version History
### 0.0.1
* Getting base code out