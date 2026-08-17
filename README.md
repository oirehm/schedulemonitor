# Schedule Monitor

A browser-based tool that tracks your current class period and schedule in real time. While it is built for Bellflower High School, it is usable by anyone.

Live: <https://oirehm.github.io/schedulemonitor/>

[![Version](https://img.shields.io/badge/version-2.7.0-blue.svg)](https://github.com/oirehm/schedulemonitor/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://oirehm.github.io/schedulemonitor/)

## Features

- Live display of your current period, time remaining, next period, and tomorrow's schedule
- Schedule dropdown to select which schedule to display
- Calendar for assigning schedules to dates
  - Click-drag or Ctrl/Shift multi-select, right-click to set a schedule
  - Year overview to see your schedules for each month
  - Auto mode reads your calendar to select the schedule for the day automatically
- Time Control to offset your time and preview future/past dates  (Settings → General)
- Custom schedule builder to make your own schedules
- Import/export your schedules or calendar data as JSON for backup or sharing
- Bellflower calendar comes pre-loaded (see [Bellflower calendar accuracy](#bellflower-calendar-accuracy))
- Extra Customization
  - Date and Time format
  - Light/Dark Modes + Additional Menu Colors

## Getting started

Visit the [live link](https://oirehm.github.io/schedulemonitor) and either load the Bellflower calendar or start empty. If you're at another school, start empty, build your schedules in Schedule Manager, then use the calendar to assign them to dates.

## Data

Everything (schedules, calendar, preferences, etc) is stored in your browser's local storage on your own machine. Use ``Calendar`` and/or ``Schedules`` to export a JSON backup or import one someone shared with you.

## Bellflower calendar accuracy

I try to keep the default calendar updated and accurate as changes are announced, but schedules can change during the year and I can make mistakes. Double check important dates against the official school calendar on [Bellflower High School's website](https://bellflowerhigh.org/), and use the Calendar feature for personal adjustments. Please feel free to report discrepancies via [GitHub Issues](https://github.com/oirehm/schedulemonitor/issues).

## Contributing

Bug reports and feature requests: [open an issue](https://github.com/oirehm/schedulemonitor/issues). Pull requests are also welcome.

## License

[MIT License](LICENSE)

## Contact

[jrmmcapagal@gmail.com](mailto:jrmmcapagal@gmail.com)
