<!--
Changelog Header Order:
1. Breaking Changes
2. New Features
3. Improvements
4. Bug Fixes
5. Technical Changes
6. Deprecations
-->

## Version 2.5.2

### Improvements

- Minor backend tweaks and optimizations
- Optimized object creation in main display update loops to prevent memory accumulation
- Replaced native scrollbar with a more sleek version
- Reduced mobile UI font sizes on the main display

### Bug Fixes

- Fixed issue where the changelog wouldn’t display after the first view
- Fixed auto update functionality to properly check for updates at configured intervals
- Fixed bug causing the upcoming schedule to not update at day rollover in Auto mode
- Fixed the date configurations not persisting after reloading the page
- Restored keyboard shortcuts for calendar edits

## Version 2.5.1

- Added new Troubleshooting section in the Advanced settings tab

## Version 2.5.0

### New Features

- Enhanced update checker now detects updates before deployment is ready
- Added "update pending" notifications when new versions are detected in development
- Users now get early notification that an update is coming, then automatic notification when ready

### Improvements

- Update notifications now provide clearer context about update availability vs readiness
- Added better handling of notifications to fix potential memory issues
- Memory handling is improved slightly
- Overhauled README.md

### Bug Fixes

- Current period highlight now properly initializes after the first period has begun
- Auto update function now properly executes per interval

## Version 2.4.1

### Bug Fixes

- Fixed elapsed time display not updating properly during periods - now updates every second as intended

## Version 2.4.0

### New Features

- Notification modals now buffer instead of override each other when trying to show simultaneously
- Clicking on the version number in the footer now reshows the "What's New" notification
- Added a Feedback button to the footer that links directly to GitHub issues

### Improvements

- Updating across multiple versions now displays the missed version's changes
- Auto update checker is now more accurate, checking actual deployment rather than repository
- "What's New" notification now directly pulls from the changelog for consistency

### Bug Fixes

- Fixed issue with current period not switching properly on the schedule display
- Fixed Auto Check For Updates not working

## Version 2.3.1

- Auto update modal no longer appears every time on startup
- Reverted icon change

## Version 2.3.0 - Optimization Update

### UI Improvements

- Overhauled schedule configuration UI: schedules are now displayed in a unified category.
- Updated settings modal UI for consistency with other modals.
- Settings are now organized into three tabs: **General**, **Display**, **Advanced**.
- Improved mobile UI to some degree.
- "What’s New" modal is now less intrusive.

### New Features

- Added quick offset adjustment by the hour.
- Added a setting to display your localStorage limit.
- Added an automatic update checker (defaults to hourly checks).

### Enhancements

- Highly optimized main loops, improving performance and
- Better validation highlighting in the schedule creator.
- Additional performance optimizations throughout.
- Replaced math.js library with a custom parser.

### Bug Fixes

- Fixed custom schedules not updating when toggling odd/even.
- Fixed schedules not properly resetting when switching between main/special.

### Other Changes

- Timer functionality temporarily removed.

## Version 2.2.1

- Fixed some bugs where the display wouldn't render correctly at times
- Clamped maximum values for the time adjustment input field to 100k years
- Default calendar changed to remove holidays, an experimental feature

## Version 2.2.0

### Main Changes

- Replaced all native browser alerts/confirms with custom styled modals and toast notifications
- Added ability to clear all browser storage via the Clear All Data button
- New user experience with version tracking system
  - First-time users get welcome modal offering to load default calendar
  - Returning users see "What's New" notifications on version upgrades
- Calendar Improvements
  - New users automatically prompted to load school calendar
  - "Load Default Calendar" and "Clear All Data" buttons for easy management

### Bug Fixes

- Fixed AutoSchedule button state on blank calendars
- Visual of the odd/even toggle now properly updates when changing days
- Fixed automatic day transitions when using time adjustment

### Improvements

- AutoSchedule automatically runs when default calendar is loaded

## Version 2.1.1

- Small patch to address needing to hard refresh to fix calendar functioning correctly for existing users

## Version 2.1.0 - Full Calendar Release

### Main Changes

- Introduced **completely new Calendar interface**, returning the auto scheduling feature
  - Ability to add standard and custom schedules
  - Ability to import and export calendars
  - Right click to select schedules
  - Keyboard shortcuts to quickly add schedules

### Technical Improvements

- Improved performance of display updates
- Small optimizations

### Known Issues

- GUI does not scale correctly on different resolutions
- Top panel alignment can block text display in certain screen sizes
- Timer input is reversed
- Countdown sometimes stops at `01` instead of `00`
- Custom schedule IDs cannot be renamed
- Color scheme setting no longer functions

## Version 2.0.1

- Small patch to address needing to hard refresh to fix new CSS being displayed correctly

## Version 2.0.0 - Schedule Management System

### Major Features

- **Custom Schedule Creator & Manager**: Create, edit, organize, and reorder schedules with full control
- **Persistent Storage**: All preferences and schedules save automatically in localStorage
- **Import/Export**: Backup and share schedules and settings as JSON


### Schedule Manager Features

- Create standard or block (odd/even) schedules
- Clone existing schedules to build off on
- Configure button position on button panel
- Hide unused schedules
- Preview schedules before saving

### Technical Improvements

- Major code refactoring for performance improvements and maintainability
- School Schedules button now dynamically updates based on the current school year

### UI/UX Enhancements

- Cleaner, more visually appealing interface

### Known Issues

- GUI does not scale correctly on different resolutions
- Top panel alignment can block text display in certain screen sizes
- Timer input is reversed
- Countdown sometimes stops at `01` instead of `00`
- Auto Schedule only works for Jan–June 2024 (v2.1 planned)
- Custom schedule IDs cannot be renamed
- Color scheme setting no longer functions

## Version 1.6.59

- Added testing schedule for the CAASP weeks.
- Fixed the hover animation of the special schedules moving the entire panel.

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
