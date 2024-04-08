## Version 1.6.58

- Possible fix for April 8th not set to late schedule?

## Version 1.6.57

- Moved time button to the panel.
- Fixed the panel not connecting to the top of the screen.
- Updated School Schedues link due to BHS new website
- Added actual footers this time

## Version 1.6.56 (Hotfix)

- Fixed an error where the auto schedule would still work and bug out the schedule if set to a distant future date

## Version 1.6.55

- Fixed bug where the panel would not update if the auto schedule was selecting a special schedule
- Added a draggable countdown timer togglable by a button and flashes the screen red and beeps at the end (Click to stop the alarm)
- Added button to github page
- Put schedule modifiers into a separate draggable panel
- Darkened the colors of the Odd/Even schedule
- Added better hover transitions
- Updated README.md to reflect on new features
- Added a zen mode (Right click toggles the visibility of all extra buttons)

## Version 1.5.50

- Added new "Auto" button manually set the schedule to today.
- Added button click color transitions
- Added new information where you can see tomorrow's schedule
- Added the ability to traverse between days
- Moved changelog to open to a new github tab
- Fixed bug where switching days with the day selector would not properly run the auto schedule feature.
- Removed unused code
- Added an icon for the tab
- Separated css into its own file
- Added link to view school calendar and schedule
- Updated README finally to reflect additional changes
- Added a no school display for non-student days

## Version 1.4.26

- Buttons look better now
- Moved changelog to a panel
- Trello board has been created: [Trello Board Link](https://trello.com/b/b8STAMDw/clock)
- Optimized code (again)
- Adjustment field is now a calculator... I wonder what `log(2phi)*2(10/3)+cos(0)/sec(pi)` is...

## Version 1.3.21

- Fixed a bug where adjusting the time with the scroll wheel would cause a desync due to not updating timeAdj properly
- Fixed a bug that caused the screen to flash at the rate of updates per ms when color scheme was set to random by minute
- The ability to now use decimals to adjust time more precisely
- Now using an experimental internal database structure to automatically set the correct schedule according to the day (Only in 2024)
- Changed color scheme dropdown menu'displaySeconds colors when switching to be more consistent
- Added missing "Gray on black" color scheme option to color scheme dropdown menu

## Version 1.2.13

### Navigation:

- Added buttons to navigate across different schedules
- Added button toggle between odd and even days
- Added Normal, Late Start, and Minimum/Finals Schedules
- Dropdown menu shows Anchor, Rally, and Extended Lunch Schedules

### Clock/Time:

- Time adjustment input now turns reddish to indicate invalid number
- Added the ability to change Time adjustment by scrolling on hover
- Fixed Time incorrectly displaying if the time adjustment input is not a valid number
- Added ability to change update time per millisecond for accuracy (Default: 100)
- Swapped Current date/time text to subtitles when selecting Min Extended Snack

### Optimization/Fixes:

- Clock now changes immediately upon entering new time adjustment value
- Schedule now loads instantly instead of after one second
- Removed functions that were never called in the first place

### Other:

- Added Changelog
