let version = ''
let starts = [];
let names = [];
let times = [];
let Els = {};
let isEven = false;
let settingsPanelPosition = 'right';
let randomChange = false;
let random = false;
let adjustseconds = 0;
let currentScheduleId = 'normal';
let currentScheduleData = null;
let sharedAudioContext = null;
let displayUpdateFrequency = 100;
let lastDisplayState = {
  displayedDate: '',
  currentPeriodSubtitle: '',
  currentSchedule: '',
  endOfScheduleSubtitle: '',
  currentDuration: '',
  currentLength: '',
  nextSchedule: '',
  nextDuration: '',
  scheduleHTML: '',
  currentPeriod: -1,
  lastScheduleId: null,
  lastIsEven: null,
  lastDayOfMonth: null,
  lastScheduleTimes: null
};
let cachedStorageLimit = null;
let isCalculatingLimit = false;
let pendingDOMUpdates = {};
let hasScheduledDOMUpdate = false;
let settingsPanelOpen = false;
let settingsPanelMinimized = false;
let currentSettingsTab = 'general';
const DAY_NAMES = {
  long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
};
const MONTH_NAMES = {
  long: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};

const scheduleTemplates = {
  normal: {
    displayName: "Normal Schedule",
    canToggleOddEven: true,
    odd: {
      times: ["08:30", "10:02", "10:11", "10:17", "11:49", "11:55", "13:27", "13:58", "14:04", "15:36"],
      names: ["Period 1", "Snack", "Passing Period", "Period 3", "Passing Period", "Period 5", "Lunch", "Passing Period", "Period 7", "End of School"]
    },
    even: {
      times: ["08:30", "10:02", "10:11", "10:17", "11:49", "11:55", "13:27", "13:58", "14:04", "15:36"],
      names: ["Period 2", "Snack", "Passing Period", "Period 4", "Passing Period", "Period 6", "Lunch", "Passing Period", "Period 8", "End of School"]
    }
  },
  late: {
    displayName: "Late Start Schedule",
    canToggleOddEven: true,
    odd: {
      times: ["10:00", "11:09", "11:18", "11:24", "12:35", "12:41", "13:50", "14:21", "14:27", "15:36"],
      names: ["Period 1", "Snack", "Passing Period", "Period 3", "Passing Period", "Period 5", "Lunch", "Passing Period", "Period 7", "End of School"]
    },
    even: {
      times: ["10:00", "11:09", "11:18", "11:24", "12:35", "12:41", "13:50", "14:21", "14:27", "15:36"],
      names: ["Period 2", "Snack", "Passing Period", "Period 4", "Passing Period", "Period 6", "Lunch", "Passing Period", "Period 8", "End of School"]
    }
  },
  minimum: {
    displayName: "Minimum Day Schedule",
    canToggleOddEven: true,
    odd: {
      times: ["08:30", "09:34", "09:43", "09:49", "10:56", "11:02", "12:06", "12:12", "13:16"],
      names: ["Period 1", "Snack", "Passing Period", "Period 3", "Passing Period", "Period 5", "Passing Period", "Period 7", "End of School"]
    },
    even: {
      times: ["08:30", "09:34", "09:43", "09:49", "10:56", "11:02", "12:06", "12:12", "13:16"],
      names: ["Period 2", "Snack", "Passing Period", "Period 4", "Passing Period", "Period 6", "Passing Period", "Period 8", "End of School"]
    }
  },
  anchor: {
    displayName: "Anchor Day",
    canToggleOddEven: false,
    times: ["10:00", "10:31", "10:37", "11:14", "11:23", "11:29", "12:00", "12:06", "12:37", "13:08", "13:14", "13:45", "13:51", "14:22", "14:28", "14:59", "15:05", "15:36"],
    names: ["Period 1", "Snack", "Period 2", "Snack", "Passing Period", "Period 3", "Passing Period", "Period 4", "Lunch", "Passing Period", "Period 5", "Passing Period", "Period 6", "Passing Period", "Period 7", "Passing Period", "Period 8", "End of School"]
  },
  rally: {
    displayName: "Rally Day",
    canToggleOddEven: true,
    odd: {
      times: ["08:30", "09:50", "10:00", "10:06", "11:04", "12:13", "12:19", "13:39", "14:10", "14:16", "15:36"],
      names: ["Period 1", "Snack", "Passing Period", "Rally A (P3)", "Rally B (P3)", "Passing Period", "Period 5", "Lunch", "Passing Period", "Period 7", "End of School"]
    },
    even: {
      times: ["08:30", "09:50", "10:00", "10:06", "11:04", "12:13", "12:19", "13:39", "14:10", "14:16", "15:36"],
      names: ["Period 2", "Snack", "Passing Period", "Rally A (P4)", "Rally B (P4)", "Passing Period", "Period 6", "Lunch", "Passing Period", "Period 8", "End of School"]
    }
  },
  extendedSnack: {
    displayName: "Minimum Day (Extended Snack)",
    canToggleOddEven: false,
    subtitle: "(Extended Snack)",
    times: ["08:30", "08:58", "09:04", "09:32", "09:38", "10:06", "10:12", "10:40", "11:00", "11:06", "11:34", "11:40", "12:08", "12:14", "12:42", "12:48", "13:16"],
    names: ["Period 1", "Passing Period", "Period 2", "Passing Period", "Period 3", "Passing Period", "Period 4", "Extended Snack", "Passing Period", "Period 5", "Passing Period", "Period 6", "Passing Period", "Period 7", "Passing Period", "Period 8", "End of School"]
  },
  noSchool: {
    displayName: "No School",
    canToggleOddEven: false,
    times: [],
    names: []
  }
};

const predefinedColorSchemes = {
  gb: {
    text: "grey",
    background: "black",
    optionText: "black",
    optionBackground: "white"
  },
  wb: {
    text: "white",
    background: "black",
    optionText: "black",
    optionBackground: "white"
  },
  bw: {
    text: "black",
    background: "white",
    optionText: "black",
    optionBackground: "white"
  },
  dk: {
    text: "crimson",
    background: "black",
    optionText: "crimson",
    optionBackground: "black"
  },
  bg: {
    text: "#5077BE",
    background: "#D9FFB2",
    optionText: "#5077BE",
    optionBackground: "#D9FFB2"
  },
  py: {
    text: "#B44DE0",
    background: "#FFFF99",
    optionText: "#B44DE0",
    optionBackground: "#FFFF99"
  },
  sr: "random"
};

const UserManager = {
  ONBOARDING_KEY: 'scheduleMonitor_onboarding',
  VERSION_KEY: 'scheduleMonitor_userVersion',
  CURRENT_VERSION: '',

  init(loadedVersion) {
    this.CURRENT_VERSION = loadedVersion;
  },

  getUserStatus() {
    const onboardingStatus = localStorage.getItem(this.ONBOARDING_KEY);
    const storedVersion = localStorage.getItem(this.VERSION_KEY);

    const status = {
      type: 'returning-same',
      showWelcome: false,
      showWhatsNew: false
    };

    if (!onboardingStatus) {
      status.type = 'first-time';
      status.showWelcome = true;
    }

    if (storedVersion !== this.CURRENT_VERSION) {
      status.showWhatsNew = true;
      status.previousVersion = storedVersion;
      status.currentVersion = this.CURRENT_VERSION;
      if (status.type !== 'first-time') {
        status.type = 'returning-upgrade';
      }
    }
    return status;
  },

  completeOnboarding() {
    localStorage.setItem(this.ONBOARDING_KEY, 'completed');
    localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION);
  },

  updateVersion() {
    localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION);
  },

  resetOnboarding() {
    localStorage.removeItem(this.ONBOARDING_KEY);
    localStorage.removeItem(this.VERSION_KEY);
  },

  simulateUpgrade(fromVersion) {
    localStorage.setItem(this.ONBOARDING_KEY, 'completed');
    localStorage.setItem(this.VERSION_KEY, fromVersion);
  }
};

const StorageManager = {
  STORAGE_KEY: 'scheduleMonitorData',
  VERSION: '2.0',
  _scheduleCache: null,
  _cacheVersion: null,

  init() {
    const stored = this.load();
    if (!stored || stored.version !== this.VERSION) {
      const oldTimeAdj = localStorage.getItem('timeAdjustment');
      this.migrate(stored);
      if (oldTimeAdj) {
        this.savePreference('timeAdjustment', oldTimeAdj);
      }
    }
    this.invalidateScheduleCache();
  },

  invalidateScheduleCache() {
    this._scheduleCache = null;
    this._cacheVersion = null;
  },
  load() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  },

  _getCacheKey() {
    const data = this.getData();
    return JSON.stringify({
      customSchedules: Object.keys(data.customSchedules || {}),
      scheduleOverrides: Object.keys(data.scheduleOverrides || {}),
      lastUpdated: data.lastUpdated
    });
  },

  save(data) {
    try {
      const toSave = {
        version: this.VERSION,
        ...data,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toSave));

      this.invalidateScheduleCache();
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        NotificationManager.showAlert('Storage Full', 'Storage limit reached! Please delete some custom schedules.', 'error');
        return false;
      }
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  getData() {
    const stored = this.load();
    if (!stored) {
      return this.getDefaultData();
    }
    return stored;
  },

  getDefaultData() {
    return {
      version: this.VERSION,
      customSchedules: {},
      hiddenSchedules: [],
      scheduleOrder: ['normal', 'late', 'minimum'],
      specialScheduleOrder: ['anchor', 'rally', 'extendedSnack', 'testing'],
      preferences: {
        defaultSchedule: 'auto',
        timeAdjustment: 0,
        colorScheme: 'gb',
        updateFrequency: '100'
      },
      scheduleOverrides: {},
      lastUpdated: new Date().toISOString()
    };
  },

  migrate(oldData) {
    console.log('Migrating storage to version', this.VERSION);
    const newData = this.getDefaultData();
    if (oldData) {
      if (oldData.preferences) {
        newData.preferences = {
          ...newData.preferences,
          ...oldData.preferences
        };
      }
      if (oldData.customSchedules) {
        newData.customSchedules = oldData.customSchedules;
      }
      if (oldData.hiddenSchedules) {
        newData.hiddenSchedules = oldData.hiddenSchedules;
      }
      if (oldData.scheduleOrder) {
        newData.scheduleOrder = oldData.scheduleOrder;
      }
      if (oldData.specialScheduleOrder) {
        newData.specialScheduleOrder = oldData.specialScheduleOrder;
      }
      if (oldData.scheduleOverrides) {
        newData.scheduleOverrides = oldData.scheduleOverrides;
      }
    }
    this.save(newData);
  },

  saveCustomSchedule(scheduleId, scheduleData) {
    const data = this.getData();
    data.customSchedules[scheduleId] = {
      ...scheduleData,
      isCustom: true,
      createdAt: new Date().toISOString()
    };
    return this.save(data);
  },

  deleteCustomSchedule(scheduleId) {
    const data = this.getData();
    if (data.customSchedules[scheduleId]) {
      delete data.customSchedules[scheduleId];
      data.hiddenSchedules = data.hiddenSchedules.filter(id => id !== scheduleId);
      data.scheduleOrder = data.scheduleOrder.filter(id => id !== scheduleId);
      data.specialScheduleOrder = data.specialScheduleOrder.filter(id => id !== scheduleId);
      return this.save(data);
    }
    return false;
  },

  getAllSchedules() {
    const currentCacheKey = this._getCacheKey();

    if (this._scheduleCache && this._cacheVersion === currentCacheKey) {
      return this._scheduleCache;
    }

    const data = this.getData();
    const allSchedules = { ...scheduleTemplates };

    if (data.customSchedules) {
      Object.assign(allSchedules, data.customSchedules);
    }

    if (data.scheduleOverrides) {
      for (const [id, override] of Object.entries(data.scheduleOverrides)) {
        if (allSchedules[id] && !allSchedules[id].isCustom) {
          allSchedules[id] = { ...allSchedules[id], ...override };
        }
      }
    }

    this._scheduleCache = allSchedules;
    this._cacheVersion = currentCacheKey;
    
    return allSchedules;
  },

  savePreference(key, value) {
    const data = this.getData();
    data.preferences[key] = value;
    return this.save(data);
  },

  getPreference(key) {
    const data = this.getData();
    return data.preferences[key];
  },
  toggleScheduleVisibility(scheduleId) {
    const data = this.getData();
    const index = data.hiddenSchedules.indexOf(scheduleId);
    if (index > -1) {
      data.hiddenSchedules.splice(index, 1);
    } else {
      data.hiddenSchedules.push(scheduleId);
    }
    return this.save(data);
  },

  updateScheduleOrder(newOrder, isSpecial = false) {
    const data = this.getData();
    if (isSpecial) {
      data.specialScheduleOrder = newOrder;
    } else {
      data.scheduleOrder = newOrder;
    }
    return this.save(data);
  },

  exportData() {
    const data = this.getData();
    const exportData = {
      ...data,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(exportData, null, 2);
  },

  importData(jsonString) {
    try {
      const importedData = JSON.parse(jsonString);
      if (!importedData.version || !importedData.customSchedules) {
        throw new Error('Invalid import data format');
      }
      const currentData = this.getData();
      const mergedData = {
        ...currentData,
        customSchedules: {
          ...currentData.customSchedules,
          ...importedData.customSchedules
        },
        scheduleOverrides: {
          ...currentData.scheduleOverrides,
          ...importedData.scheduleOverrides
        }
      };
      return this.save(mergedData);
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },

  resetToDefaults() {
    const defaultData = this.getDefaultData();
    return this.save(defaultData);
  }
};

const CalendarManager = {
  STORAGE_KEY: 'calendarConfigData',
  async loadDefaultCalendar() {
    try {
      const response = await fetch('./default-calendar.json');
      if (response.ok) {
        const defaultData = await response.json();
        defaultData.isDefaultCalendar = true;
        defaultData.defaultCalendarVersion = "2025-2026";
        return defaultData;
      }
    } catch (error) {
      console.warn('Could not load default calendar:', error);
    }
    return null;
  },

  getConfig() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading calendar config:', error);
    }
    const defaultConfig = this.getDefaultConfig();
    this.saveConfig(defaultConfig);
    return defaultConfig;
  },

  async getConfigWithDefault() {
    const stored = this.getConfig();

    if (!stored) {
      const defaultCalendar = await this.loadDefaultCalendar();
      if (defaultCalendar) {
        this.saveConfig(defaultCalendar);
        return defaultCalendar;
      }
      return this.getDefaultConfig();
    }

    if (stored.isDefaultCalendar && !stored.hasUserModifications) {
      const defaultCalendar = await this.loadDefaultCalendar();
      if (defaultCalendar && defaultCalendar.defaultCalendarVersion !== stored.defaultCalendarVersion) {
        defaultCalendar.hasUserModifications = false;
        this.saveConfig(defaultCalendar);
        return defaultCalendar;
      }
    }

    return stored;
  },

  getDefaultConfig() {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    return {
      schoolYear: `${currentYear}-${nextYear}`,
      startDate: `${currentYear}-08-01`,
      endDate: `${nextYear}-06-30`,
      dates: {},
      isDefaultCalendar: false,
      hasUserModifications: false
    };
  },

  saveConfig(config) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
      return true;
    } catch (error) {
      console.error('Error saving calendar config:', error);
      return false;
    }
  },

  getScheduleForDate(dateString) {
    const config = this.getConfig();
    return config.dates[dateString] || null;
  },

  setScheduleForDate(dateString, scheduleId, isEven = null) {
    const config = this.getConfig();
    config.dates[dateString] = {
      schedule: scheduleId,
      isEven: isEven
    };
    if (config.isDefaultCalendar) {
      config.hasUserModifications = true;
    }
    return this.saveConfig(config);
  },

  setScheduleForDates(dateStrings, scheduleId, isEven = null) {
    const config = this.getConfig();
    dateStrings.forEach(dateString => {
      config.dates[dateString] = {
        schedule: scheduleId,
        isEven: isEven
      };
    });
    if (config.isDefaultCalendar) {
      config.hasUserModifications = true;
    }
    return this.saveConfig(config);
  },

  isFirstTimeUser() {
    return !localStorage.getItem(this.STORAGE_KEY);
  },

  markUserAsReturning() {
    const config = this.getConfig();
    config.hasSeenWelcome = true;
    this.saveConfig(config);
  },

  async handleVersionUpdate(version) {
    if (version === '2.2.1') {
      const currentConfig = this.getConfig();
      if (currentConfig && currentConfig.isDefaultCalendar && !currentConfig.hasUserModifications) {
        try {
          const defaultCalendar = await this.loadDefaultCalendar();
          if (defaultCalendar) {
            this.saveConfig(defaultCalendar);
            localStorage.setItem('autoUpdateAttempted_2.2.1', 'true');
            NotificationManager.showAlert('', 'Default Bellflower calendar automatically updated for v2.2.1!', 'success');
          } else {
            NotificationManager.showAlert('', 'Could not update default calendar. Please check your internet connection.', 'error');
          }
        } catch (error) {
          console.warn('Auto-load default calendar failed:', error);
          NotificationManager.showAlert('', 'Could not auto-load default calendar. ' + error, 'error');
        }
      }
    }
  }
};

const CalendarUI = {
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  selectedDates: new Set(),
  isSelecting: false,
  selectionStart: null,
  lastClickedDate: null,
  hoveredDate: null,
  isDragging: false,
  eventListeners: [],

  addEventListener(element, event, handler, options) {
    element.addEventListener(event, handler, options);
    this.eventListeners.push({
      element,
      event,
      handler,
      options
    });
  },

  cleanupAllEventListeners() {
    this.eventListeners.forEach(({
      element,
      event,
      handler,
      options
    }) => {
      element.removeEventListener(event, handler, options);
    });
    this.eventListeners = [];
  },

  open() {
    document.getElementById('calendarModal').classList.remove('hidden');
    this.render();
    this.addEventListener(document, 'mouseup', this.handleGlobalMouseUp);
    this.addEventListener(document, 'keydown', this.handleKeyboard);
  },

  close() {
    this.cleanupAllEventListeners();
    document.getElementById('calendarModal').classList.add('hidden');
    this.selectedDates.clear();
    this.isDragging = false;
    this.cleanupCalendar();
  },

  cleanup() {
    document.removeEventListener('mouseup', this.handleGlobalMouseUp);
    document.removeEventListener('keydown', this.handleKeyboard);
    const daysContainer = document.querySelector('.calendar-days');
    if (daysContainer) {
      const newContainer = daysContainer.cloneNode(false);
      daysContainer.parentNode.replaceChild(newContainer, daysContainer);
    }
  },

  handleKeyboard(e) {
    if (document.getElementById('calendarModal').classList.contains('hidden')) return;
    if (document.activeElement.tagName === 'INPUT') return;

    const hasSelection = CalendarUI.selectedDates.size > 0;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        CalendarUI.previousMonth();
        break;
      case 'ArrowRight':
        e.preventDefault();
        CalendarUI.nextMonth();
        break;
      case 'n':
        if (!hasSelection) return;
        e.preventDefault();
        CalendarUI.setSelectedSchedule('normal', false);
        break;
      case 'l':
        if (!hasSelection) return;
        e.preventDefault();
        CalendarUI.setSelectedSchedule('late', false);
        break;
      case 'm':
        if (!hasSelection) return;
        e.preventDefault();
        CalendarUI.setSelectedSchedule('minimum', false);
        break;
      case 'x':
        if (!hasSelection) return;
        e.preventDefault();
        CalendarUI.setSelectedSchedule('noSchool', false);
        break;
      case 'Delete':
        if (!hasSelection) return;
        e.preventDefault();
        CalendarUI.clearSelectedDates();
        break;
      case 'o':
        if (!hasSelection) return;
        e.preventDefault();
        CalendarUI.toggleSelectedOddEven(e.shiftKey);
        break;
      case 'Escape':
        e.preventDefault();
        CalendarUI.selectedDates.clear();
        CalendarUI.render();
        break;
    }
  },
  toggleSelectedOddEvenAlternating() {
    const dates = Array.from(this.selectedDates).sort((a, b) => new Date(a) - new Date(b));
    let isEven = false;
    dates.forEach(dateString => {
      const existing = CalendarManager.getScheduleForDate(dateString);
      if (existing && existing.schedule !== 'noSchool') {
        const allSchedules = StorageManager.getAllSchedules();
        const schedule = allSchedules[existing.schedule];
        if (schedule && schedule.canToggleOddEven) {
          CalendarManager.setScheduleForDate(dateString, existing.schedule, isEven);
          isEven = !isEven;
        }
      }
    });
    this.render();
  },

  render() {
    const monthYearElement = document.getElementById('currentMonthYear');
    monthYearElement.textContent = `${MONTH_NAMES.short[this.currentMonth]} ${this.currentYear}`;
    this.renderWeekdays();
    this.renderDays();
    this.updateLegend();
  },

  renderWeekdays() {
    const weekdaysContainer = document.querySelector('.calendar-weekdays');
    weekdaysContainer.innerHTML = '';
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekNumHeader = document.createElement('div');
    weekNumHeader.className = 'calendar-weekday week-number-header';
    // weekNumHeader.textContent = 'Week';
    weekdaysContainer.appendChild(weekNumHeader);
    weekdays.forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-weekday';
      dayElement.textContent = day;
      weekdaysContainer.appendChild(dayElement);
    });
  },
  initializeWeekends() {
    const config = CalendarManager.getConfig();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        const dateString = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
        if (!config.dates[dateString]) {
          CalendarManager.setScheduleForDate(dateString, 'noSchool', null);
        }
      }
    }
  },

  cleanupCalendar() {
    const daysContainer = document.querySelector('.calendar-days');
    if (daysContainer) {
      const dayElements = daysContainer.querySelectorAll('.calendar-day');
      dayElements.forEach(dayElement => {
        const cleanElement = dayElement.cloneNode(true);
        dayElement.parentNode.replaceChild(cleanElement, dayElement);
      });

      daysContainer.innerHTML = '';
    }

    this.hoveredDate = null;
    this.selectionStart = null;
  },

  renderDays() {
    this.cleanupCalendar();
    this.cleanupAllEventListeners();
    const daysContainer = document.querySelector('.calendar-days');
    daysContainer.innerHTML = '';
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const config = CalendarManager.getConfig();
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const firstDate = new Date(this.currentYear, this.currentMonth, 1);
    let currentWeek = this.getWeekNumber(firstDate);
    let lastWeek = currentWeek - 1;

    if (firstDay > 0 || currentWeek !== lastWeek) {
      const weekNumElement = document.createElement('div');
      weekNumElement.className = 'week-number';
      weekNumElement.textContent = currentWeek;
      daysContainer.appendChild(weekNumElement);
      lastWeek = currentWeek;
    }

    for (let i = 0; i < firstDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day-empty';
      daysContainer.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(this.currentYear, this.currentMonth, day);
      currentWeek = this.getWeekNumber(currentDate);
      if (currentDate.getDay() === 0 && currentWeek !== lastWeek) {
        const weekNumElement = document.createElement('div');
        weekNumElement.className = 'week-number';
        weekNumElement.textContent = currentWeek;
        daysContainer.appendChild(weekNumElement);
        lastWeek = currentWeek;
      }

      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';

      const dateString = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayConfig = config.dates[dateString];

      if (dateString === todayString) {
        dayElement.classList.add('day-today');
      }

      const dayNumber = document.createElement('div');
      dayNumber.className = 'day-number';
      dayNumber.textContent = day;
      dayElement.appendChild(dayNumber);

      if (dayConfig) {
        const scheduleName = document.createElement('div');
        const allSchedules = StorageManager.getAllSchedules();
        const schedule = allSchedules[dayConfig.schedule];
        const displayName = schedule ? schedule.displayName : dayConfig.schedule;
        scheduleName.className = 'day-schedule';
        scheduleName.title = '';
        scheduleName.textContent = displayName;
        dayElement.appendChild(scheduleName);

        if (dayConfig.schedule === 'noSchool') {
          dayElement.classList.add('day-noSchool');
        } else if (dayConfig.isEven !== null) {
          dayElement.classList.add(dayConfig.isEven ? 'day-even' : 'day-odd');
        }

        if (dayConfig && dayConfig.schedule) {
          const regularSchedules = ['normal', 'late', 'minimum', 'noSchool'];
          if (!regularSchedules.includes(dayConfig.schedule)) {
            dayElement.classList.add('day-special');
          }
        }
      }

      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        dayElement.classList.add('day-weekend');

        if (!dayConfig) {
          CalendarManager.setScheduleForDate(dateString, 'noSchool', null);
        }
      }

      dayElement.dataset.date = dateString;
      dayElement.addEventListener('mousedown', (e) => this.handleMouseDown(e, dateString));
      dayElement.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, dateString));
      dayElement.addEventListener('mouseup', () => this.handleMouseUp());
      dayElement.addEventListener('contextmenu', (e) => this.handleRightClick(e, dateString));


      if (this.selectedDates.has(dateString)) {
        dayElement.classList.add('day-selected');
      }

      daysContainer.appendChild(dayElement);
    }
  },

  getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  },

  handleMouseDown(e, dateString) {
    if (e.button === 0) {
      e.preventDefault();
      if (e.shiftKey && this.lastClickedDate) {
        this.selectRange(this.lastClickedDate, dateString);
      } else if (e.ctrlKey || e.metaKey) {
        if (this.selectedDates.has(dateString)) {
          this.selectedDates.delete(dateString);
        } else {
          this.selectedDates.add(dateString);
        }
      } else {
        this.isDragging = true;
        this.selectionStart = dateString;
        this.selectedDates.clear();
        this.selectedDates.add(dateString);
      }

      this.lastClickedDate = dateString;
      this.render();
    }
  },

  handleGlobalMouseUp: function(e) {
    if (CalendarUI.isDragging) {
      CalendarUI.isDragging = false;
    }
  },

  handleMouseEnter(e, dateString) {
    if (this.isDragging && this.selectionStart && e.buttons === 1) {
      this.selectRange(this.selectionStart, dateString);
    }
  },

  handleMouseUp(e) {
    if (this.isDragging) {
      this.isDragging = false;
    }
  },

  handleRightClick(e, dateString) {
    e.preventDefault();
    if (!this.selectedDates.has(dateString)) {
      this.selectedDates.clear();
      this.selectedDates.add(dateString);
      this.render();
    }
    this.showQuickEditMenu(e.pageX, e.pageY);
  },
  activeContextMenuCleanup: null,
  showQuickEditMenu(mouseX, mouseY) {
    if (this.activeContextMenuCleanup) {
      document.removeEventListener('click', this.activeContextMenuCleanup);
      this.activeContextMenuCleanup = null;
    }
    const menu = document.getElementById('calendarContextMenu');
    menu.classList.remove('hidden');
    const offset = 8;
    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = mouseX + offset;
    let top = mouseY + offset;

    if (left + menuRect.width > viewportWidth) left = mouseX - menuRect.width - offset;
    if (top + menuRect.height > viewportHeight) top = mouseY - menuRect.height - offset;

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;

    const handleClickOutside = (e) => {
      if (!menu.contains(e.target)) {
        menu.classList.add('hidden');
        document.removeEventListener('click', handleClickOutside);
        this.activeContextMenuCleanup = null;
      }
    };

    this.activeContextMenuCleanup = handleClickOutside;
    document.addEventListener('click', handleClickOutside);
  },


  selectRange(startDate, endDate) {
    this.selectedDates.clear();
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);
    const minDate = start < end ? start : end;
    const maxDate = start < end ? end : start;

    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      this.selectedDates.add(dateString);
    }

    this.render();
  },

  setSelectedSchedule(scheduleId, defaultIsEven = false) {
    const dates = Array.from(this.selectedDates);
    const allSchedules = StorageManager.getAllSchedules();
    const schedule = allSchedules[scheduleId];

    dates.forEach(dateString => {
      if (scheduleId === 'noSchool') {
        CalendarManager.setScheduleForDate(dateString, scheduleId, null);
      } else if (schedule && schedule.canToggleOddEven) {
        const existing = CalendarManager.getScheduleForDate(dateString);
        const isEven = existing && existing.isEven !== null ? existing.isEven : defaultIsEven;
        CalendarManager.setScheduleForDate(dateString, scheduleId, isEven);
      } else {
        CalendarManager.setScheduleForDate(dateString, scheduleId, null);
      }
    });

    this.render();
  },

  toggleSelectedOddEven() {
    const dates = Array.from(this.selectedDates);

    dates.forEach(dateString => {
      const existing = CalendarManager.getScheduleForDate(dateString);
      if (existing && existing.schedule !== 'noSchool') {
        const allSchedules = StorageManager.getAllSchedules();
        const schedule = allSchedules[existing.schedule];

        if (schedule && schedule.canToggleOddEven) {
          const newIsEven = existing.isEven === null ? false : !existing.isEven;
          CalendarManager.setScheduleForDate(dateString, existing.schedule, newIsEven);
        }
      }
    });

    this.render();
  },

  updateLegend() {
    const legendElement = document.getElementById('calendarLegend');
    legendElement.innerHTML = `
      <span class="legend-item"><span class="legend-color day-odd"></span> Odd</span>
      <span class="legend-item"><span class="legend-color day-even"></span> Even</span>
      <span class="legend-item"><span class="legend-color day-noSchool"></span> No School</span>
      <span class="legend-item">◆ Special/Custom</span>
      <span class="legend-shortcuts">
        <strong>Schedule Shortcuts:</strong>
        (N) Normal, (L) Late, (M) Minimum, (X) No School, (O) Toggle Odd/Even, (DEL) Clear
      </span>
    `;
  },

  previousMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.selectedDates.clear();
    this.render();
  },

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.selectedDates.clear();
    this.render();
  },

  goToToday() {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.selectedDates.clear();
    this.render();
  },
  clearSelectedDates() {
    const dates = Array.from(this.selectedDates);
    dates.forEach(dateString => {
      CalendarManager.setScheduleForDate(dateString, '', null);
    });
    this.render();
  }
};
async function resetToDefaultCalendar() {
  NotificationManager.showConfirm(
    'Load Default Calendar',
    'Load the Bellflower High School default calendar? This will replace all your current calendar data.',
    'Load Default',
    'Cancel',
    async function() {
      const defaultCalendar = await CalendarManager.loadDefaultCalendar();
      if (defaultCalendar) {
        CalendarManager.saveConfig(defaultCalendar);
        CalendarUI.render();
        NotificationManager.showAlert('', 'Default Bellflower calendar loaded!', 'success');
      } else {
        NotificationManager.showAlert('', 'Could not load default calendar. Please check your internet connection.', 'error');
      }
    }
  );
}

function clearAllCalendarData() {
  NotificationManager.showConfirm(
    'Clear All Calendar Data',
    'Are you sure you want to clear ALL calendar data? This will remove all schedules and return to a completely empty calendar.',
    'Clear All',
    'Cancel',
    function() {

      const emptyConfig = CalendarManager.getDefaultConfig();
      CalendarManager.saveConfig(emptyConfig);
      CalendarUI.initializeWeekends();
      if (CalendarUI.isYearView) {
        CalendarUI.renderYearView();
      } else {
        CalendarUI.render();
      }

      NotificationManager.showAlert('', 'Calendar data cleared!', 'success');
    }
  );
}

function populateScheduleMenus() {
  const allSchedules = StorageManager.getAllSchedules();
  const specialMenu = document.getElementById('specialSchedulesMenu');
  const customMenu = document.getElementById('customSchedulesMenu');

  specialMenu.innerHTML = '';
  customMenu.innerHTML = '';

  Object.keys(allSchedules).forEach(id => {
    const schedule = allSchedules[id];
    if (['normal', 'late', 'minimum', 'noSchool'].includes(id)) return;

    const menuItem = document.createElement('div');
    menuItem.className = 'context-menu-item';
    menuItem.textContent = schedule.displayName;
    menuItem.onclick = () => setSelectedSchedule(id);

    if (schedule.isCustom) {
      customMenu.appendChild(menuItem);
    } else {
      specialMenu.appendChild(menuItem);
    }
  });
  if (customMenu.innerHTML === '') {
    customMenu.innerHTML = '<div class="context-menu-disabled">No custom schedules</div>';
  }
}

function openCalendar() {
  populateScheduleMenus();
  CalendarUI.open();
}

function closeCalendar() {
  CalendarUI.close();
}

function previousMonth() {
  CalendarUI.previousMonth();
}

function nextMonth() {
  CalendarUI.nextMonth();
}

function goToToday() {
  CalendarUI.goToToday();
}

function setSelectedSchedule(scheduleId) {
  CalendarUI.setSelectedSchedule(scheduleId, false);
}

function toggleSelectedOddEven() {
  const dates = Array.from(CalendarUI.selectedDates);

  dates.forEach(dateString => {
    const existing = CalendarManager.getScheduleForDate(dateString);
    if (existing && existing.schedule !== 'noSchool') {
      const newIsEven = existing.isEven === null ? false : !existing.isEven;
      CalendarManager.setScheduleForDate(dateString, existing.schedule, newIsEven);
    }
  });

  CalendarUI.render();

}

function clearSelectedDates() {
  const dates = Array.from(CalendarUI.selectedDates);
  const config = CalendarManager.getConfig();

  dates.forEach(dateString => {
    delete config.dates[dateString];
  });

  CalendarManager.saveConfig(config);
  CalendarUI.render();
}

function exportCalendar() {
  const config = CalendarManager.getConfig();
  const blob = new Blob([JSON.stringify(config, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const [startYear, endYear] = config.schoolYear.split('-');
  const shortYear = `${startYear.slice(-2)}-${endYear.slice(-2)}`;
  const date = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `(${shortYear}) Calendar.${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importCalendar() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const config = JSON.parse(event.target.result);
        CalendarManager.saveConfig(config);
        CalendarUI.render();
        NotificationManager.showAlert('', 'Calendar imported successfully!', 'success');
      } catch (error) {
        NotificationManager.showAlert('Import Error', 'Error importing calendar file', 'error');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

const YearOverviewUI = {
  currentYear: new Date().getFullYear(),

  open() {
    document.getElementById('yearOverviewModal').classList.remove('hidden');
    this.render();
  },

  close() {
    document.getElementById('yearOverviewModal').classList.add('hidden');
  },

  render() {
    const config = CalendarManager.getConfig();
    document.getElementById('overviewYearDisplay').textContent =
      `${this.currentYear} - ${this.currentYear + 1} School Year`;
    document.getElementById('yearOverviewTitle').textContent =
      `${this.currentYear} - ${this.currentYear + 1}`;

    const gridContainer = document.getElementById('yearOverviewGrid');
    gridContainer.innerHTML = '';
    const startMonth = 7;

    for (let i = 0; i < 12; i++) {
      const monthIndex = (startMonth + i) % 12;
      const yearForMonth = i < 5 ? this.currentYear : this.currentYear + 1;

      const monthContainer = document.createElement('div');
      monthContainer.className = 'year-month-container';

      const monthHeader = document.createElement('div');
      monthHeader.className = 'year-month-header';
      monthHeader.textContent = `${MONTH_NAMES.short[monthIndex]} ${yearForMonth}`;
      monthContainer.appendChild(monthHeader);

      const miniCalendar = this.renderMiniMonth(yearForMonth, monthIndex, config);
      monthContainer.appendChild(miniCalendar);

      monthContainer.addEventListener('click', () => {
        this.close();
        CalendarUI.currentMonth = monthIndex;
        CalendarUI.currentYear = yearForMonth;
        CalendarUI.render();
      });

      gridContainer.appendChild(monthContainer);
    }
  },

  renderMiniMonth(year, month, config) {
    const container = document.createElement('div');
    container.className = 'mini-calendar';
    const weekdaysContainer = document.createElement('div');
    weekdaysContainer.className = 'mini-weekdays';
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'mini-weekday';
      dayHeader.textContent = day;
      weekdaysContainer.appendChild(dayHeader);
    });
    container.appendChild(weekdaysContainer);
    const daysContainer = document.createElement('div');
    daysContainer.className = 'mini-days';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    for (let i = 0; i < firstDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'mini-day-empty';
      daysContainer.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'mini-day';

      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayConfig = config.dates[dateString];

      if (dateString === todayString) {
        dayElement.classList.add('mini-day-today');
      }

      if (dayConfig && dayConfig.schedule !== '') {
        const cls =
          dayConfig.schedule === 'noSchool' ? 'mini-day-noSchool' :
          dayConfig.isEven === true ? 'mini-day-even' :
          dayConfig.isEven === false ? 'mini-day-odd' :
          'mini-day-scheduled';

        dayElement.classList.add(cls);
      } else {
        const dayOfWeek = new Date(year, month, day).getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          dayElement.classList.add('mini-day-noSchool');
        }
      }

      dayElement.textContent = day;
      dayElement.title = dateString;
      daysContainer.appendChild(dayElement);
    }

    container.appendChild(daysContainer);
    return container;
  },

  previousYear() {
    this.currentYear--;
    this.render();
  },

  nextYear() {
    this.currentYear++;
    this.render();
  }
};

function openYearOverview() {
  YearOverviewUI.open();
}

function closeYearOverview() {
  YearOverviewUI.close();
}

function previousYear() {
  YearOverviewUI.previousYear();
}

function nextYear() {
  YearOverviewUI.nextYear();
}

function loadPreferences() {
  loadSettingsPanelPosition();
  const colorScheme = StorageManager.getPreference('colorScheme');
  if (colorScheme) {
    document.getElementById('colorscheme').value = colorScheme;
    colorBackground();
  }

  const timeAdjustment = StorageManager.getPreference('timeAdjustment');
  if (timeAdjustment !== null && timeAdjustment !== undefined) {
    document.getElementById('timeadj').value = timeAdjustment;
    adjustseconds = timeAdjustment;
    evaluateMath();
    adjustTimeAdjustmentWidth();
  }

  const updateFrequencyPref = StorageManager.getPreference('updateFrequency');
  if (updateFrequencyPref) {
    document.getElementById('displayupdatefrequency').value = updateFrequencyPref;
    displayUpdateFrequency = Math.max(16, parseInt(updateFrequencyPref));
  }

  let autoUpdate = StorageManager.getPreference('autoUpdateEnabled');
  if (autoUpdate === null || autoUpdate === undefined) {
    autoUpdate = '1';
    StorageManager.savePreference('autoUpdateEnabled', autoUpdate);
  }
  const autoToggle = document.getElementById('autoUpdateToggle');
  autoToggle.checked = autoUpdate === '1';
}

const ScheduleManagerUI = {
  isOpen: false,
  draggedScheduleId: null,
  draggedFromList: null,

  open() {
    this.isOpen = true;
    document.getElementById('scheduleManagerModal').classList.remove('hidden');
    this.render();
  },

  close() {
    this.isOpen = false;
    document.getElementById('scheduleManagerModal').classList.add('hidden');
  },

  render() {
    const data = StorageManager.getData();
    const allSchedules = StorageManager.getAllSchedules();
    const allScheduleItems = [];

    Object.keys(allSchedules).forEach(id => {
      if (id === 'noSchool') return;

      const schedule = allSchedules[id];
      const item = {
        id: id,
        name: schedule.displayName,
        schedule: schedule,
        isHidden: data.hiddenSchedules.includes(id),
        isCustom: schedule.isCustom,
        isSpecial: !data.scheduleOrder.includes(id),
        hasOverride: !schedule.isCustom && data.scheduleOverrides && data.scheduleOverrides[id]
      };
      allScheduleItems.push(item);
    });

    allScheduleItems.sort((a, b) => {
      const aIsMain = data.scheduleOrder.includes(a.id);
      const bIsMain = data.scheduleOrder.includes(b.id);

      if (aIsMain && !bIsMain) return -1;
      if (!aIsMain && bIsMain) return 1;

      if (aIsMain && bIsMain) {
        const aIndex = data.scheduleOrder.indexOf(a.id);
        const bIndex = data.scheduleOrder.indexOf(b.id);
        return aIndex - bIndex;
      } else {
        const aIndex = data.specialScheduleOrder.indexOf(a.id);
        const bIndex = data.specialScheduleOrder.indexOf(b.id);
        return aIndex - bIndex;
      }
    });

    this.renderUnifiedScheduleList('scheduleManagerBody', allScheduleItems);
  },
  renderUnifiedScheduleList(containerId, schedules) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
      <div class="schedule-section">
        <h3>All Schedules</h3>
        <div class="schedule-list"></div>
      </div>
    `;

    const listContainer = container.querySelector('.schedule-list');

    schedules.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'schedule-item' + (item.isHidden ? ' hidden-schedule' : '');
      if (item.isCustom) div.classList.add('custom-schedule');

      const data = StorageManager.getData();
      const isMainCategory = data.scheduleOrder.includes(item.id);
      const category = isMainCategory ? 'main' : 'special';

      const tags = [];
      if (item.schedule.canToggleOddEven) tags.push('<span class="schedule-tag odd-even-tag">Odd/Even</span>');
      else tags.push('<span class="schedule-tag single-tag">Single</span>');
      if (item.isCustom) tags.push('<span class="schedule-tag custom-tag">Custom</span>');
      else if (item.isSpecial) tags.push('<span class="schedule-tag special-tag">Special</span>');

      const canMoveUp = this.canMoveInCategory(schedules, index, -1, category);
      const canMoveDown = this.canMoveInCategory(schedules, index, 1, category);
      div.innerHTML = `
        <div class="schedule-info">
          <span class="schedule-name">${item.name}${item.hasOverride ? ' (Modified)' : ''}</span>
          <div class="schedule-tags">${tags.join('')}</div>
        </div>
        <div class="schedule-actions">
          <button class="visibility-toggle" onclick="toggleScheduleVisibility('${item.id}')" title="${item.isHidden ? 'Show' : 'Hide'}">
            ${item.isHidden ? '○' : '●'}
          </button>
          <button onclick="editSchedule('${item.id}')">Edit</button>
          ${item.hasOverride ? `<button onclick="resetScheduleToDefault('${item.id}')" style="color: #ff9933;">Reset</button>` : ''}
          ${item.isCustom ? `<button class="delete-button" onclick="deleteCustomSchedule('${item.id}')">Delete</button>` : ''}
          <div class="move-buttons">
            ${canMoveUp ? `<button class="move-button" onclick="moveSchedule('${item.id}', -1, ${category === 'special'})">↑</button>` : '<div style="height: 20px;"></div>'}
            ${canMoveDown ? `<button class="move-button" onclick="moveSchedule('${item.id}', 1, ${category === 'special'})">↓</button>` : '<div style="height: 20px;"></div>'}
          </div>
        </div>
      `;
      listContainer.appendChild(div);
    });
    const createButton = document.createElement('button');
    createButton.className = 'button action-button';
    createButton.textContent = '+ Add Custom Schedule';
    createButton.onclick = () => ScheduleEditor.open();;
    listContainer.appendChild(createButton);
  },

  canMoveInCategory(schedules, currentIndex, direction, category) {
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= schedules.length) return false;

    const data = StorageManager.getData();
    const currentItem = schedules[currentIndex];
    const targetItem = schedules[targetIndex];
    const currentIsMain = data.scheduleOrder.includes(currentItem.id);
    const targetIsMain = data.scheduleOrder.includes(targetItem.id);

    return currentIsMain === targetIsMain;
  },

  sortByOrder(schedules, order) {
    schedules.sort((a, b) => {
      const indexA = order.indexOf(a.id);
      const indexB = order.indexOf(b.id);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  },
};

function resetScheduleToDefault(scheduleId) {
  NotificationManager.showConfirm(
    'Reset Schedule',
    'Reset this schedule to its default settings?',
    'Reset',
    'Cancel',
    function() {
      const data = StorageManager.getData();
      if (data.scheduleOverrides && data.scheduleOverrides[scheduleId]) {
        delete data.scheduleOverrides[scheduleId];
        data.scheduleOrder = data.scheduleOrder.filter(id => id !== scheduleId);
        data.specialScheduleOrder = data.specialScheduleOrder.filter(id => id !== scheduleId);

        const defaultMainSchedules = ['normal', 'late', 'minimum'];
        const defaultSpecialSchedules = ['anchor', 'rally', 'extendedSnack', 'testing'];

        if (defaultMainSchedules.includes(scheduleId)) {
          if (!data.scheduleOrder.includes(scheduleId)) {
            data.scheduleOrder.push(scheduleId);
          }
        } else if (defaultSpecialSchedules.includes(scheduleId)) {
          if (!data.specialScheduleOrder.includes(scheduleId)) {
            data.specialScheduleOrder.push(scheduleId);
          }
        }

        StorageManager.save(data);

        regenerateScheduleButtons();
        ScheduleManagerUI.render();

        if (currentScheduleId === scheduleId) {
          loadSchedule(scheduleId);
        }
      }
      NotificationManager.showAlert('', 'Schedule reset to default!', 'success');
    }
  );
}

function editSchedule(scheduleId) {
  const allSchedules = StorageManager.getAllSchedules();
  const schedule = allSchedules[scheduleId];

  if (!schedule) return;

  if (!schedule.isCustom) {
    const data = StorageManager.getData();
    if (data.scheduleOverrides && data.scheduleOverrides[scheduleId]) {
      ScheduleEditor.openForOverride(scheduleId, data.scheduleOverrides[scheduleId]);
    } else {
      ScheduleEditor.openForOverride(scheduleId, schedule);
    }
  } else {
    ScheduleEditor.open(scheduleId);
  }
}

function generateMainScheduleButtons() {
  const data = StorageManager.getData();
  const allSchedules = StorageManager.getAllSchedules();
  const container = document.getElementById('mainScheduleButtons');
  container.innerHTML = '';

  const handlers = {
    normal: () => loadSchedule('normal'),
    late: () => loadSchedule('late'),
    minimum: () => loadSchedule('minimum'),
    auto: AutoSchedule
  };

  for (const id of data.scheduleOrder) {
    if (data.hiddenSchedules.includes(id) || !allSchedules[id]) continue;
    const button = document.createElement('button');
    button.id = `${id}-schedule`;
    button.className = 'schedule-button button';
    button.textContent = allSchedules[id].displayName;
    button.onclick = handlers[id] || (() => loadSchedule(id));
    container.appendChild(button);
  }
}

function toggleScheduleVisibility(scheduleId) {
  StorageManager.toggleScheduleVisibility(scheduleId);
  ScheduleManagerUI.render();
  regenerateScheduleButtons();
}

function moveSchedule(scheduleId, direction, isSpecial) {
  const data = StorageManager.getData();
  const orderArray = isSpecial ? data.specialScheduleOrder : data.scheduleOrder;
  const currentIndex = orderArray.indexOf(scheduleId);

  if (currentIndex === -1) return;

  const newIndex = currentIndex + direction;
  if (newIndex < 0 || newIndex >= orderArray.length) return;

  [orderArray[currentIndex], orderArray[newIndex]] = [orderArray[newIndex], orderArray[currentIndex]];

  StorageManager.updateScheduleOrder(orderArray, isSpecial);

  if (ScheduleManagerUI.isOpen) {
    ScheduleManagerUI.render();
  }
  regenerateScheduleButtons();
}

function deleteCustomSchedule(scheduleId) {
  NotificationManager.showConfirm(
    'Delete Schedule',
    'Are you sure you want to delete this custom schedule?',
    'Delete',
    'Cancel',
    function() {

      StorageManager.deleteCustomSchedule(scheduleId);
      ScheduleManagerUI.render();
      regenerateScheduleButtons();
    }
  );
}

function exportSchedules() {
  const data = StorageManager.exportData();
  const blob = new Blob([data], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'schedule-monitor-backup.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importSchedules() {
  document.getElementById('importFileInput').click();
}

function handleImportFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const success = StorageManager.importData(e.target.result);
    if (success) {
      NotificationManager.showAlert('', 'Schedules imported successfully!', 'success');
    } else {
      NotificationManager.showAlert('Error', 'Failed to import schedules. Please check the file format.', 'error');
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}

const ScheduleEditor = {
  currentScheduleId: null,
  isEditing: false,
  isOverride: false,
  currentTab: 'odd',
  scheduleData: {
    displayName: '',
    canToggleOddEven: false,
    times: [],
    names: [],
    odd: {
      times: [],
      names: []
    },
    even: {
      times: [],
      names: []
    }
  },
  boundHandleDragStart: null,
  boundHandleDragOver: null,
  boundHandleDrop: null,
  boundHandleDragEnd: null,
  init() {
    this.boundHandleDragStart = this.handleDragStart.bind(this);
    this.boundHandleDragOver = this.handleDragOver.bind(this);
    this.boundHandleDrop = this.handleDrop.bind(this);
    this.boundHandleDragEnd = this.handleDragEnd.bind(this);
  },

  open(scheduleId = null) {
    this.currentScheduleId = scheduleId;
    this.isEditing = !!scheduleId;
    this.isOverride = false;
    this.currentTab = 'odd';

    document.getElementById('scheduleEditorModal').classList.remove('hidden');
    if (this.isEditing) {
      document.getElementById('editorTitle').textContent = 'Edit Custom Schedule';
      this.loadScheduleForEditing(scheduleId);
    } else {
      document.getElementById('editorTitle').textContent = 'Create New Schedule';
      this.resetEditor();
    }
  },

  openForOverride(scheduleId, scheduleData) {
    this.currentScheduleId = scheduleId;
    this.isEditing = true;
    this.isOverride = true;
    this.currentTab = 'odd';
    document.getElementById('scheduleEditorModal').classList.remove('hidden');
    document.getElementById('editorTitle').textContent = `Edit ${scheduleData.displayName}`;
    document.getElementById('scheduleName').value = scheduleData.displayName;
    document.getElementById('scheduleType').value = scheduleData.canToggleOddEven ? 'oddeven' : 'single';

    const data = StorageManager.getData();
    document.getElementById('buttonLocation').value =
      data.scheduleOrder.includes(scheduleId) ? 'main' : 'special';
    this.scheduleData = JSON.parse(JSON.stringify(scheduleData));
    if (scheduleData.canToggleOddEven) document.getElementById('scheduleTabs').classList.remove('hidden');
    this.renderPeriods();
  },

  close() {
    document.getElementById('scheduleEditorModal').classList.add('hidden');
    this.currentScheduleId = null;
    this.isEditing = false;
    this.isOverride = false;
  },

  resetEditor() {
    document.getElementById('scheduleName').value = '';
    document.getElementById('scheduleType').value = 'single';
    document.getElementById('buttonLocation').value = 'main';
    document.getElementById('cloneFrom').value = '';
    document.getElementById('scheduleTabs').classList.add('hidden');

    this.scheduleData = {
      displayName: '',
      canToggleOddEven: false,
      times: [],
      names: [],
      odd: {
        times: [],
        names: []
      },
      even: {
        times: [],
        names: []
      }
    };

    this.renderPeriods();
  },

  loadScheduleForEditing(scheduleId) {
    const allSchedules = StorageManager.getAllSchedules();
    const schedule = allSchedules[scheduleId];

    if (!schedule) return;

    document.getElementById('scheduleName').value = schedule.displayName;
    document.getElementById('scheduleType').value = schedule.canToggleOddEven ? 'oddeven' : 'single';

    const data = StorageManager.getData();
    if (data.scheduleOrder.includes(scheduleId)) {
      document.getElementById('buttonLocation').value = 'main';
    } else {
      document.getElementById('buttonLocation').value = 'special';
    }

    this.scheduleData = JSON.parse(JSON.stringify(schedule));

    if (schedule.canToggleOddEven) {
      document.getElementById('scheduleTabs').classList.remove('hidden');
    }

    this.renderPeriods();
  },

  handleTypeChange() {
    const type = document.getElementById('scheduleType').value;

    if (type === 'oddeven') {
      document.getElementById('scheduleTabs').classList.remove('hidden');
      this.scheduleData.canToggleOddEven = true;

      if (this.scheduleData.times.length > 0) {
        this.scheduleData.odd = {
          times: [...this.scheduleData.times],
          names: [...this.scheduleData.names]
        };
        this.scheduleData.times = [];
        this.scheduleData.names = [];
      }
    } else {
      document.getElementById('scheduleTabs').classList.add('hidden');
      this.scheduleData.canToggleOddEven = false;
      this.currentTab = 'odd';

      if (this.scheduleData.odd.times.length > 0) {
        this.scheduleData.times = [...this.scheduleData.odd.times];
        this.scheduleData.names = [...this.scheduleData.odd.names];
      }
    }

    this.renderPeriods();
  },

  switchTab(tab, event) {
    this.currentTab = tab;
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
    });
    if (event) event.target.classList.add('active');
    document.getElementById('currentTabLabel').textContent = `(${tab === 'odd' ? 'Odd Days' : 'Even Days'})`;
    this.renderPeriods();
  },

  renderPeriods() {
    const container = document.getElementById('periodsContainer');
    container.innerHTML = '';

    let periods;
    if (this.scheduleData.canToggleOddEven) {
      periods = this.scheduleData[this.currentTab];
      document.getElementById('currentTabLabel').textContent = `(${this.currentTab === 'odd' ? 'Odd Days' : 'Even Days'})`;
    } else {
      periods = this.scheduleData;
      document.getElementById('currentTabLabel').textContent = '';
    }

    if (!periods.times || periods.times.length === 0) {
      container.innerHTML = '<div style="color: #666; padding: 10px;">No periods yet. Click "Add Period" to start.</div>';
      return;
    }

    periods.times.forEach((time, index) => {
      const periodDiv = document.createElement('div');
      periodDiv.className = 'period-item';
      periodDiv.draggable = true;
      periodDiv.dataset.index = index;
      periodDiv.innerHTML = `
        <span class="period-handle">≡</span>
        <input type="text" class="period-time" value="${time}"
          placeholder="HH:MM" maxlength="5"
          onchange="updatePeriodTime(${index})"
          onblur="validateTime(this)">
        <input type="text" class="period-name" value="${periods.names[index]}"
          placeholder="Period name"
          onchange="updatePeriodName(${index})">
        <button class="period-delete" onclick="deletePeriod(${index})">×</button>
      `;

      periodDiv.addEventListener('dragstart', this.boundHandleDragStart);
      periodDiv.addEventListener('dragover', this.boundHandleDragOver);
      periodDiv.addEventListener('drop', this.boundHandleDrop);
      periodDiv.addEventListener('dragend', this.boundHandleDragEnd);
      container.appendChild(periodDiv);
    });
  },

  handleDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
    e.target.classList.add('dragging');
  },

  handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';

    const draggingItem = document.querySelector('.dragging');
    const afterElement = this.getDragAfterElement(e.currentTarget.parentNode, e.clientY);

    if (afterElement == null) {
      e.currentTarget.parentNode.appendChild(draggingItem);
    } else {
      e.currentTarget.parentNode.insertBefore(draggingItem, afterElement);
    }

    return false;
  },

  handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const toIndex = parseInt(e.target.closest('.period-item').dataset.index);

    if (fromIndex !== toIndex) {
      this.reorderPeriods(fromIndex, toIndex);
    }

    return false;
  },

  handleDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.period-item').forEach(item => {
      item.classList.remove('drag-over');
    });
  },

  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.period-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return {
          offset: offset,
          element: child
        };
      } else {
        return closest;
      }
    }, {
      offset: Number.NEGATIVE_INFINITY
    }).element;
  },

  reorderPeriods(fromIndex, toIndex) {
    let periods;
    if (this.scheduleData.canToggleOddEven) {
      periods = this.scheduleData[this.currentTab];
    } else {
      periods = this.scheduleData;
    }

    const time = periods.times.splice(fromIndex, 1)[0];
    const name = periods.names.splice(fromIndex, 1)[0];

    periods.times.splice(toIndex, 0, time);
    periods.names.splice(toIndex, 0, name);

    this.renderPeriods();
  },

  addPeriod() {
    let periods;
    if (this.scheduleData.canToggleOddEven) {
      periods = this.scheduleData[this.currentTab];
    } else {
      periods = this.scheduleData;
    }

    let nextTime = "08:00";
    if (periods.times.length > 0) {
      const lastTime = periods.times[periods.times.length - 1];
      const [hours, minutes] = lastTime.split(':').map(Number);
      let nextHours = hours;
      let nextMinutes = minutes + 30;

      if (nextMinutes >= 60) {
        nextHours += Math.floor(nextMinutes / 60);
        nextMinutes = nextMinutes % 60;
      }

      nextTime = `${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`;
    }

    periods.times.push(nextTime);
    periods.names.push('');

    this.renderPeriods();
  },

  clone(templateId) {
    const allSchedules = StorageManager.getAllSchedules();
    const template = allSchedules[templateId] || scheduleTemplates[templateId];

    if (!template) return;
    this.currentTab = 'odd';
    if (template.canToggleOddEven) {
      this.scheduleData.canToggleOddEven = true;
      this.scheduleData.odd = JSON.parse(JSON.stringify(template.odd || {
        times: [],
        names: []
      }));
      this.scheduleData.even = JSON.parse(JSON.stringify(template.even || {
        times: [],
        names: []
      }));
      document.getElementById('scheduleType').value = 'oddeven';
      document.getElementById('scheduleTabs').classList.remove('hidden');
    } else {
      this.scheduleData.canToggleOddEven = false;
      this.scheduleData.times = [...(template.times || [])];
      this.scheduleData.names = [...(template.names || [])];
      document.getElementById('scheduleType').value = 'single';
      document.getElementById('scheduleTabs').classList.add('hidden');
    }

    this.renderPeriods();
  },

  validate() {
    const scheduleInput = document.getElementById('scheduleName');
    const name = scheduleInput.value.trim();

    if (!name) {
      NotificationManager.showAlert('Error Saving Schedule', 'Please enter a schedule name', 'error');
      scheduleInput.classList.add('invalid');
      return false;
    }

    const allSchedules = StorageManager.getAllSchedules();
    const nameExists = Object.keys(allSchedules).some(id => {
      return id !== this.currentScheduleId &&
        allSchedules[id].displayName.toLowerCase() === name.toLowerCase();
    });

    if (nameExists) {
      NotificationManager.showAlert('Error Saving Schedule', 'A schedule with this name already exists', 'error');
      return false;
    }

    if (this.scheduleData.canToggleOddEven) {
      if (this.scheduleData.odd.times.length === 0 || this.scheduleData.even.times.length === 0) {
        NotificationManager.showAlert('Error Saving Schedule', 'Please add at least one period to both Odd and Even days', 'error');
        return false;
      }
      const oddEmpty = this.scheduleData.odd.names.some(name => !name.trim());
      const evenEmpty = this.scheduleData.even.names.some(name => !name.trim());
      if (oddEmpty || evenEmpty) {
        NotificationManager.showAlert('Error Saving Schedule', 'Some periods have no names', 'error');
      }
    } else {
      const hasEmpty = this.scheduleData.names.some(name => !name.trim());
      if (hasEmpty) {
        NotificationManager.showAlert('Error Saving Schedule', 'Some periods have no names', 'error');
      }
      if (this.scheduleData.times.length = 0) {
        NotificationManager.showAlert('Error Saving Schedule', 'Please add at least one period', 'error');
        return false;
      }
    }
    const times = this.scheduleData.canToggleOddEven ?
      this.scheduleData[this.currentTab].times :
      this.scheduleData.times;

    for (let i = 1; i < times.length; i++) {
      const prev = times[i - 1].split(':').map(Number);
      const curr = times[i].split(':').map(Number);
      const prevMinutes = prev[0] * 60 + prev[1];
      const currMinutes = curr[0] * 60 + curr[1];

      if (currMinutes <= prevMinutes) {
        NotificationManager.showAlert('Error Saving Schedule', 'Period times must be in chronological order', 'error');
        return false;
      }
    }
    const invalidTimes = document.querySelectorAll('.period-time.invalid');
    if (invalidTimes.length > 0) {
      NotificationManager.showAlert('Error Saving Schedule', 'Period times are not formatted properly (HH:mm)', 'error');
      return false;
    }

    return true;
  },

  save() {
    if (!this.validate()) return;

    const name = document.getElementById('scheduleName').value.trim();
    const location = document.getElementById('buttonLocation').value;

    if (this.isOverride) {
      const data = StorageManager.getData();
      if (!data.scheduleOverrides) {
        data.scheduleOverrides = {};
      }

      const overrideData = {
        displayName: name,
        canToggleOddEven: this.scheduleData.canToggleOddEven
      };

      if (this.scheduleData.canToggleOddEven) {
        overrideData.odd = this.scheduleData.odd;
        overrideData.even = this.scheduleData.even;
      } else {
        overrideData.times = this.scheduleData.times;
        overrideData.names = this.scheduleData.names;
      }

      data.scheduleOverrides[this.currentScheduleId] = overrideData;

      data.scheduleOrder = data.scheduleOrder.filter(id => id !== this.currentScheduleId);
      data.specialScheduleOrder = data.specialScheduleOrder.filter(id => id !== this.currentScheduleId);

      if (location === 'main') {
        if (!data.scheduleOrder.includes(this.currentScheduleId)) {
          data.scheduleOrder.push(this.currentScheduleId);
        }
      } else {
        if (!data.specialScheduleOrder.includes(this.currentScheduleId)) {
          data.specialScheduleOrder.push(this.currentScheduleId);
        }
      }

      StorageManager.save(data);

      NotificationManager.showAlert('', `Schedule "${name}" updated successfully!`, 'success');
    } else {
      let scheduleId = this.currentScheduleId;
      if (!this.isEditing) {
        scheduleId = name.toLowerCase().replace(/[^a-z0-9]/g, '_');

        const allSchedules = StorageManager.getAllSchedules();
        let counter = 1;
        let testId = scheduleId;
        while (allSchedules[testId]) {
          testId = `${scheduleId}_${counter}`;
          counter++;
        }
        scheduleId = testId;
      }

      const scheduleToSave = {
        displayName: name,
        canToggleOddEven: this.scheduleData.canToggleOddEven,
        isCustom: true
      };

      if (this.scheduleData.canToggleOddEven) {
        scheduleToSave.odd = this.scheduleData.odd;
        scheduleToSave.even = this.scheduleData.even;
      } else {
        scheduleToSave.times = this.scheduleData.times;
        scheduleToSave.names = this.scheduleData.names;
      }

      StorageManager.saveCustomSchedule(scheduleId, scheduleToSave);
      const data = StorageManager.getData();
      data.scheduleOrder = data.scheduleOrder.filter(id => id !== scheduleId);
      data.specialScheduleOrder = data.specialScheduleOrder.filter(id => id !== scheduleId);

      if (location === 'main') {
        data.scheduleOrder.push(scheduleId);
      } else {
        data.specialScheduleOrder.push(scheduleId);
      }

      StorageManager.save(data);
      NotificationManager.showAlert('', `Schedule "${name}" ${this.isEditing ? 'updated' : 'created'} successfully!`, 'success');
    }

    regenerateScheduleButtons();
    ScheduleManagerUI.render();
    this.close();
  },
};

function handleCloneSelection() {
  const templateId = document.getElementById('cloneFrom').value;
  if (templateId) {
    ScheduleEditor.clone(templateId);
  }
}

function switchTab(tab) {
  ScheduleEditor.currentTab = tab;
  ScheduleEditor.renderPeriods();
}

function updatePeriodTime(index) {
  let periods;
  if (ScheduleEditor.scheduleData.canToggleOddEven) {
    periods = ScheduleEditor.scheduleData[ScheduleEditor.currentTab];
  } else {
    periods = ScheduleEditor.scheduleData;
  }

  const input = event.target;
  periods.times[index] = input.value;
}

function updatePeriodName(index) {
  let periods;
  if (ScheduleEditor.scheduleData.canToggleOddEven) {
    periods = ScheduleEditor.scheduleData[ScheduleEditor.currentTab];
  } else {
    periods = ScheduleEditor.scheduleData;
  }

  periods.names[index] = event.target.value;
}

function deletePeriod(index) {
  const periods = ScheduleEditor.scheduleData.canToggleOddEven ?
    ScheduleEditor.scheduleData[ScheduleEditor.currentTab] :
    ScheduleEditor.scheduleData;

  periods.times.splice(index, 1);
  periods.names.splice(index, 1);
  ScheduleEditor.renderPeriods();
}

function validateTime(input) {
  input.value = input.value.replace(/^(\d):(\d{2})$/, '0$1:$2');
  const isValid = /^([01]?\d|2[0-3]):[0-5]\d$/.test(input.value);
  input.classList.toggle('invalid', !isValid);
}

function validateScheduleName(input) {
  const isValid = input.value.trim() !== '';
  input.classList.toggle('invalid', !isValid);
}

function testSchedule() {
  if (!ScheduleEditor.validate()) return;

  const previousScheduleId = currentScheduleId;
  const previousIsEven = isEven;
  const tempSchedule = {
    displayName: document.getElementById('scheduleName').value || 'Preview Schedule',
    canToggleOddEven: ScheduleEditor.scheduleData.canToggleOddEven
  };

  if (ScheduleEditor.scheduleData.canToggleOddEven) {
    tempSchedule.odd = ScheduleEditor.scheduleData.odd;
    tempSchedule.even = ScheduleEditor.scheduleData.even;
  } else {
    tempSchedule.times = ScheduleEditor.scheduleData.times;
    tempSchedule.names = ScheduleEditor.scheduleData.names;
  }

  scheduleTemplates['__preview__'] = tempSchedule;
  loadSchedule('__preview__');
  setTimeout(() => {
    delete scheduleTemplates['__preview__'];
    if (currentScheduleId === '__preview__') {
      loadSchedule(previousScheduleId);
      if (previousIsEven !== isEven) {
        ToggleScheduleOddEven();
      }
    }
  }, 5000);

  NotificationManager.showAlert('Preview Mode', 'Preview loaded! It will revert to your previous schedule in 5 seconds.', 'info');
}

function resetToDefaults() {
  NotificationManager.showConfirm(
    'Reset All Schedules',
    'This will reset all schedules to their default configuration and remove custom schedules. Continue?',
    'Reset All',
    'Cancel',
    () => {
      StorageManager.resetToDefaults();
      ScheduleManagerUI.render();
      regenerateScheduleButtons();
      NotificationManager.showAlert('', 'All schedules cleared!', 'success');
    }
  );
}

function regenerateScheduleButtons() {
  const data = StorageManager.getData();
  const allSchedules = StorageManager.getAllSchedules();
  const buttonPanel = document.querySelector('.button-panel');
  buttonPanel.classList.add('button-updating');

  generateMainScheduleButtons();

  const dropdown = document.getElementById('special-schedule');
  const currentValue = dropdown.value;

  dropdown.innerHTML = '<option value="Nothing">Special Schedules</option>';

  const valueMap = {
    anchor: 'anchorSchedule',
    rally: 'rallySchedule',
    extendedSnack: 'ExtendedSnackSchedule',
    testing: 'TestingSchedule'
  };

  const frag = document.createDocumentFragment();

  const hidden = new Set(data.hiddenSchedules);
  for (let i = 0, order = data.specialScheduleOrder; i < order.length; i++) {
    const id = order[i];
    if (hidden.has(id)) continue;

    const sched = allSchedules[id];
    if (!sched) continue;

    const option = document.createElement('option');
    option.value = sched.isCustom ? id : (valueMap[id] || id);
    option.textContent = sched.displayName;
    frag.appendChild(option);
  }

  dropdown.appendChild(frag);

  if (dropdown.querySelector(`option[value="${CSS.escape(currentValue)}"]`)) {
    dropdown.value = currentValue;
  }
}

const largeScheduleMap = {};
largeScheduleMap.normal = {
  schedule: 0,
  baseTitle: "NORMAL BLOCK"
};
largeScheduleMap.late = {
  schedule: 1,
  baseTitle: "LATE BLOCK"
};
largeScheduleMap.minimum = {
  schedule: 2,
  baseTitle: "MINIMUM BLOCK"
};
largeScheduleMap.rally = {
  schedule: 3,
  baseTitle: "RALLY DAY"
};
largeScheduleMap.anchor = {
  schedule: 4,
  baseTitle: "ANCHOR DAY"
};
largeScheduleMap.extendedSnack = {
  schedule: 5,
  baseTitle: "MINIMUM DAY"
};
largeScheduleMap.testing = {
  schedule: 7,
  baseTitle: "TESTING SCHEDULE"
};

function loadSchedule(scheduleId, forceOddEven = null) {
  lastDisplayState.lastScheduleId = null;
  lastDisplayState.currentPeriod = -1;
  times.length = 0;
  starts.length = 0;
  names.length = 0;

  clearSelectedStateButtons();

  const allSchedules = StorageManager.getAllSchedules();
  const template = allSchedules[scheduleId];

  if (!template) {
    console.error(`Schedule ${scheduleId} not found`);
    return;
  }

  currentScheduleId = scheduleId;
  currentScheduleData = template;

  if (scheduleId === 'noSchool') {
    times.length = 0;
    names.length = 0;
    starts.length = 0;
    document.getElementById("timer_type").innerHTML = "No School";
    lastDisplayState.scheduleHTML = "No school today!";
    document.getElementById("scheduledisplay").innerHTML = "No school today!";
    updateButtonStates(scheduleId);
    return;
  }

  let scheduleData;
  if (template.canToggleOddEven) {
    const useEven = forceOddEven !== null ? forceOddEven : isEven;
    scheduleData = useEven && template.even ? template.even : template.odd || template;
  } else {
    scheduleData = template;
  }

  times.push(...(scheduleData.times || template.times));
  names.push(...(scheduleData.names || template.names));

  starts = times.map((time) => {
    let [hours, minutes] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60;
  });

  const entry = largeScheduleMap[scheduleId];
  displayTitle = entry ? entry.baseTitle : "UNKNOWN";

  document.getElementById("timer_type").textContent = displayTitle;

  if (template.subtitle) {
    document.getElementById("subtitle").textContent = template.subtitle;
  } else {
    document.getElementById("subtitle").textContent = '';
  }

  updateButtonStates(scheduleId);
  updateMainDisplay();
  StorageManager.savePreference('lastUsedSchedule', scheduleId);
}

const scheduleMapping = {
  anchor: 'anchorSchedule',
  rally: 'rallySchedule',
  extendedSnack: 'ExtendedSnackSchedule',
  testing: 'TestingSchedule'
};

function updateButtonStates(scheduleId) {
  clearSelectedStateButtons();

  document.getElementById(`${scheduleId}-schedule`)?.classList.add("selected-state");

  const dropdown = document.getElementById("special-schedule");
  const targetValue = scheduleMapping[scheduleId] || scheduleId;

  let foundIndex = 0;
  const options = dropdown.options;
  for (let i = 0, len = options.length; i < len; i++) {
    if (options[i].value === targetValue) {
      foundIndex = i;
      break;
    }
  }

  dropdown.selectedIndex = foundIndex;
  dropdown.classList.toggle("special-schedule-select", foundIndex > 0);

  updateOddEvenToggleButton();
}

let defaultDisplays = {};
let infoElements = document.querySelectorAll(".info");
infoElements.forEach(function(infoElement) {
  defaultDisplays[infoElement] = getComputedStyle(infoElement).display;
});


function updateAndCallAgain() {
  updateMainDisplay();
  setTimeout(updateAndCallAgain, displayUpdateFrequency);
}

function getSchoolScheduleLink() {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  const year = now.getFullYear() % 100;
  const prevYear = (year - 1).toString().padStart(2, '0');
  const nextYear = (year + 1).toString().padStart(2, '0');
  const currentYearStr = year.toString().padStart(2, '0');

  const mainSchoolYear = (month > 5 || (month === 5 && day >= 15)) ?
    `${currentYearStr}-${nextYear}` :
    `${prevYear}-${currentYearStr}`;

  const mainLink = `https://bellflowerhigh.org/${mainSchoolYear}schedulescalendars`;
  const fallbackLink = (month === 5 || month === 6) ?
    `https://bellflowerhigh.org/${prevYear}-${currentYearStr}schedulescalendars` :
    null;

  return {
    main: mainLink,
    fallback: fallbackLink
  };
}

document.getElementById("displayupdatefrequency").addEventListener("change", function() {
  updateMainDisplay();
  displayUpdateFrequency = Math.max(16, parseInt(this.value));
  StorageManager.savePreference('updateFrequency', this.value);
});

let timeAdjInput = document.querySelector("#timeadj");
timeAdjInput.addEventListener("wheel", function(event) {
  event.preventDefault();
  let currentVal = parseFloat(this.value) || 0;
  this.value = event.deltaY > 0 ? currentVal - 1 : currentVal + 1;
  timeadj();
});

function bindWheelAdjust(selector, unit) {
  const el = document.querySelector(selector);
  el.addEventListener("wheel", (event) => {
    event.preventDefault();
    quickAdjust(unit, event.deltaY < 0);
  });
}

function quickAdjust(type, forward = true) {
  let inputBox = document.getElementById("timeadj");
  switch (type) {
    case 'day':
      adjustseconds += forward ? 86400 : -86400;
      break;
    case 'hour':
      adjustseconds += forward ? 3600 : -3600;
      break;
    case 'minute':
      adjustseconds += forward ? 60 : -60;
      break;
  }
  inputBox.value = adjustseconds;
  AutoSchedule();
  timeadj();
}

function timeadj() {
  const oldAdjustSeconds = adjustseconds;
  const inputValue = document.getElementById("timeadj").value.trim();
  const newAdjustSeconds = Number(inputValue);

  if (isNaN(newAdjustSeconds)) {
    ErrorTimeAdj();
  } else {
    const maxSeconds = 100000 * 365 * 24 * 3600;
    adjustseconds = Math.max(-maxSeconds, Math.min(maxSeconds, newAdjustSeconds));
    if (Math.abs(newAdjustSeconds) > maxSeconds) {
      document.getElementById("timeadj").value = adjustseconds;
      NotificationManager.showAlert('', 'Time adjustment clamped to 100,000 years maximum', 'warning');
    }
    ValidTimeAdj();
  }

  evaluateMath();
  updateMainDisplay();

  const currentTime = Date.now();
  const newDate = new Date(currentTime + adjustseconds * 1000);
  const oldDate = new Date(currentTime + oldAdjustSeconds * 1000);
  if (newDate.getDate() !== oldDate.getDate()) AutoSchedule();
  StorageManager.savePreference('timeAdjustment', adjustseconds);
}

function inputTimeAdj(input) {
  const old = adjustseconds;
  const next = parseFloat(input);
  const valid = !isNaN(next);
  adjustseconds = valid ? next : (!isNaN(old) ? old : 0);
  (valid ? ValidTimeAdj : ErrorTimeAdj)();
  evaluateMath();
  updateMainDisplay();
}
const timeAdjustmentInput = document.getElementById("timeadj");

function evaluateMath() {
  const input = timeAdjustmentInput.value;
  const previousAdjustSeconds = adjustseconds;

  if (input === "") {
    adjustseconds = 0;
    formatMath(true, 0);
    secondsDisplay.textContent = "";
    resultDisplay.textContent = "";
    ValidTimeAdj();
    return;
  }

  let isIntegerInput = true;
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    if (charCode < 48 || charCode > 57) {
      isIntegerInput = false;
      break;
    }
  }

  let result;
  try {
    result = evaluateMathExpression(input);
  } catch {
    adjustseconds = previousAdjustSeconds;
    ErrorTimeAdj();
    formatMath(false);
    return;
  }

  if (!isFinite(result)) {
    adjustseconds = 0;
    secondsDisplay.textContent = "and the universe is now dead because of you";
    resultDisplay.textContent = "Infinity";
    return;
  }

  const absoluteResult = Math.abs(result);
  if (absoluteResult > 1e12) {
    adjustseconds = previousAdjustSeconds;
    ErrorTimeAdj();
    formatMath(false);
    return;
  }

  adjustseconds = result;

  if (isIntegerInput) {
    if (absoluteResult > 60) {
      formatMath(true, result);
    } else {
      secondsDisplay.textContent = "";
      resultDisplay.textContent = "";
    }
  } else {
    formatMath(true, result);
  }

  ValidTimeAdj();
}

function ErrorTimeAdj() {
  document.getElementById("timeadj").style.backgroundColor = "SandyBrown";
  adjustseconds = 0;
  secondsDisplay.textContent = "";
  resultDisplay.textContent = "";
}

function ValidTimeAdj() {
  document.getElementById("timeadj").style.backgroundColor = "White";
}

function formatMath(isMathExpression, result) {
  const resultDisplay = document.getElementById("resultDisplay");
  const secondsDisplay = document.getElementById("secondsDisplay");

  if (!isMathExpression) {
    resultDisplay.textContent = "";
    secondsDisplay.textContent = "";
    return;
  }

  const formattedResult = formatTime(result);
  resultDisplay.textContent = result === 0 ? "= 0s" : "= " + formattedResult;
  secondsDisplay.textContent = "= " + result + " seconds";
}

function adjustTimeAdjustmentWidth(value) {
  let inputElement = document.getElementById("timeadj");
  let inputWidth = getTextWidth(value) + 20;
  inputElement.style.width = inputWidth + "px";
}

function getTextWidth(text) {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  context.font = getComputedStyle(document.body).fontSize + " Arial";
  let width = context.measureText(text).width;
  if (width < 30) width = 30;
  return width;
}

function formatTime(seconds) {
  let neg = seconds < 0;
  seconds = Math.floor(Math.abs(seconds));

  const units = [{
      label: "c",
      value: 3600 * 24 * 365 * 100
    },
    {
      label: "y",
      value: 3600 * 24 * 365
    },
    {
      label: "d",
      value: 3600 * 24
    },
    {
      label: "h",
      value: 3600
    },
    {
      label: "m",
      value: 60
    },
    {
      label: "s",
      value: 1
    }
  ];

  let str = neg ? "-" : "";
  for (const unit of units) {
    if (seconds >= unit.value) {
      const amt = Math.floor(seconds / unit.value);
      str += amt + unit.label + " ";
      seconds -= amt * unit.value;
    }
  }

  if (str === "" || str === "-") str += "0s";
  return str.trim();
}

function getRandomColor() {
  const red = Math.floor(Math.random() * 254 + 1);
  const green = Math.floor(Math.random() * 254 + 1);
  const blue = Math.floor(Math.random() * 254 + 1);
  return `rgb(${red},${green},${blue})`;
}

function colorizeRandom() {
  document.body.style.color = getRandomColor();
  document.body.style.backgroundColor = getRandomColor();
}

function colorBackground() {
  const optionElement = document.getElementById("colorscheme");
  const selected = optionElement.value;

  if (selected === "sr") {
    random = true;
    colorizeRandom();
  } else {
    random = false;
    const scheme = predefinedColorSchemes[selected];
    optionElement.style.color = scheme.optionText;
    optionElement.style.backgroundColor = scheme.optionBackground;
    document.body.style.color = scheme.text;
    document.body.style.backgroundColor = scheme.background;
  }

  StorageManager.savePreference("colorScheme", selected);
}

function padZero(number) {
  return (number < 10 ? "0" : "") + number;
}

function timePartsFromDate(date) {
  const hh24 = date.getHours();
  const mm = date.getMinutes();
  const ss = date.getSeconds();
  const meridiem = hh24 >= 12 ? "PM" : "AM";
  let hh12 = hh24 % 12;
  if (hh12 === 0) hh12 = 12;
  return {
    hh24,
    hh12,
    mm,
    ss,
    meridiem,
    hh12Str: padZero(hh12),
    mmStr: padZero(mm),
    ssStr: padZero(ss)
  };
}

function getCurrentSecondsFromDate(date) {
  return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
}

function formatScheduleTime(timeStr) {
  const hour24 = (timeStr.charCodeAt(0) - 48) * 10 + (timeStr.charCodeAt(1) - 48);
  const minutePart = timeStr.slice(2, 5);
  const meridiem = ["AM", "PM"][(hour24 / 12) | 0];
  const hour12 = ((hour24 + 11) % 12) + 1;
  const hourStr = (hour12 < 10 ? "0" : "") + hour12;
  return hourStr + minutePart + " " + meridiem;
}

function arraysEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++)
    if (a[i] !== b[i]) return false;
  return true;
}

function queueDOMUpdate(elementKey, content, stateKey, isHTML = false) {
  pendingDOMUpdates[elementKey] = {
    content,
    stateKey,
    isHTML
  };

  if (!hasScheduledDOMUpdate) {
    hasScheduledDOMUpdate = true;
    requestAnimationFrame(applyBatchedDOMUpdates);
  }
}

function applyBatchedDOMUpdates() {
  Object.entries(pendingDOMUpdates).forEach(([elementKey, update]) => {
    const el = Els[elementKey];
    if (el && lastDisplayState[update.stateKey] !== update.content) {
      if (update.isHTML) {
        el.innerHTML = update.content;
      } else {
        el.textContent = update.content;
      }
      lastDisplayState[update.stateKey] = update.content;
    }
  });
  pendingDOMUpdates = {};
  hasScheduledDOMUpdate = false;
}

function updateText(el, content, stateKey) {
  if (lastDisplayState[stateKey] !== content) {
    const elementKey = getElementKey(el);
    if (elementKey) {
      queueDOMUpdate(elementKey, content, stateKey, false);
    }
  }
}

function updateHTML(el, content, stateKey) {
  if (lastDisplayState[stateKey] !== content) {
    const elementKey = getElementKey(el);
    if (elementKey) {
      queueDOMUpdate(elementKey, content, stateKey, true);
    }
  }
}

function getElementKey(el) {
  return Object.keys(Els).find(key => Els[key] === el);
}

let cachedTimeComponents = null;
let lastCalculatedTimestamp = -1;

function getOptimizedTimeComponents(adjustedDate) {
  const timestamp = adjustedDate.getTime();
  const secondTimestamp = Math.floor(timestamp / 1000) * 1000;

  if (secondTimestamp !== lastCalculatedTimestamp) {
    cachedTimeComponents = {
      dayOfMonth: adjustedDate.getDate(),
      hour: adjustedDate.getHours(),
      minute: adjustedDate.getMinutes(),
      second: adjustedDate.getSeconds(),
      currentSeconds: getCurrentSecondsFromDate(adjustedDate),
      timestamp: timestamp
    };
    lastCalculatedTimestamp = secondTimestamp;
  }
  return cachedTimeComponents;
}

function updateDisplayedDate(adjustedDate) {
  const timeComponents = getOptimizedTimeComponents(adjustedDate);
  const lastDay = lastDisplayState.lastDayOfMonth;
  const lastHour = lastDisplayState.lastHour;
  const lastMinute = lastDisplayState.lastMinute;
  const lastSecond = lastDisplayState.lastSecond;

  if (timeComponents.dayOfMonth !== lastDay ||
    timeComponents.hour !== lastHour ||
    timeComponents.minute !== lastMinute ||
    timeComponents.second !== lastSecond ||
    dateFormatUpdated) {

    const displayedDate = formatDisplayedDate(adjustedDate);
    const currentDateEl = Els["currentdate"];
    if (currentDateEl) updateText(currentDateEl, displayedDate, "displayedDate");

    lastDisplayState.lastDayOfMonth = timeComponents.dayOfMonth;
    lastDisplayState.lastHour = timeComponents.hour;
    lastDisplayState.lastMinute = timeComponents.minute;
    lastDisplayState.lastSecond = timeComponents.second;
    dateFormatUpdated = false;
  }

  return timeComponents;
}


function updateMainDisplay() {
  const now = Date.now() + ((adjustseconds || 0) * 1000);
  const adjustedDate = new Date(now);
  const timeComponents = updateDisplayedDate(adjustedDate);
  const dayChanged = lastDisplayState.lastDayOfMonth !== timeComponents.dayOfMonth;

  if (dayChanged) {
    AutoSchedule();
  }

  const scheduleChanged =
    lastDisplayState.lastScheduleId !== currentScheduleId ||
    lastDisplayState.lastIsEven !== isEven ||
    !arraysEqual(lastDisplayState.lastScheduleTimes, times);

  if (scheduleChanged) {
    lastDisplayState.lastScheduleId = currentScheduleId;
    lastDisplayState.lastIsEven = isEven;
    lastDisplayState.lastScheduleTimes = [...times];
    lastDisplayState.currentPeriod = -1;
  }

  if (random) {
    if (timeComponents.second === 0 && !randomChange) {
      colorizeRandom();
      randomChange = true;
    } else if (timeComponents.second !== 0) {
      randomChange = false;
    }
  }

  if (starts.length === 0) {
    updateHTML(Els["scheduledisplay"], "No school today!", "scheduleHTML");
    updateText(Els["currentduration"], "", "currentDuration");
    updateText(Els["nextduration"], "", "nextDuration");
    updateText(Els["endofschedulesubtitle"], "", "endOfScheduleSubtitle");
    updateText(Els["currentschedule"], "", "currentSchedule");
    updateText(Els["nextschedule"], "", "nextSchedule");
    updateText(Els["currentlengthofperiod"], "", "currentLength");
    updateText(Els["currentperiodsubtitle"], "", "currentPeriodSubtitle");
    return;
  }

  const currentSeconds = timeComponents.currentSeconds;
  const periodIndex = starts.length - 1;
  let currentPeriod = -1;
  if (currentSeconds < starts[0]) {
    currentPeriod = -1;
  } else if (currentSeconds >= starts[periodIndex]) {
    currentPeriod = periodIndex;
  } else {
    let left = 0,
      right = periodIndex;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (starts[mid] <= currentSeconds && currentSeconds < starts[mid + 1]) {
        currentPeriod = mid;
        break;
      } else if (currentSeconds < starts[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
  }

  if (currentPeriod === -1) {
    updateText(Els["currentduration"], formatDisplayTimer(starts[0] - currentSeconds), "currentDuration");
  } else if (currentPeriod >= 0 && currentPeriod < periodIndex) {
    updateText(Els["nextduration"], formatDisplayTimer(starts[currentPeriod + 1] - currentSeconds), "nextDuration");
  } else {
    updateText(Els["currentduration"], formatDisplayTimer(currentSeconds - starts[periodIndex]), "currentDuration");
  }

  if (currentPeriod >= 0 && currentPeriod < periodIndex) {
    const elapsed = currentSeconds - starts[currentPeriod];
    let elapsedStr = formatDisplayTimer(elapsed);
    if (elapsed < 60) elapsedStr += " seconds";
    updateText(Els["currentperiodsubtitle"], `We are now ${elapsedStr} into:`, "currentPeriodSubtitle");
  }

  const lastPeriod = lastDisplayState.currentPeriod;
  const periodChanged = lastDisplayState.currentPeriod !== currentPeriod;
  if (lastPeriod !== currentPeriod || scheduleChanged || dayChanged) {
    lastDisplayState.currentPeriod = currentPeriod;

    if (currentPeriod === -1) {
      updateText(Els["currentperiodsubtitle"], "Countdown to", "currentPeriodSubtitle");
      updateText(Els["currentschedule"], names[0], "currentSchedule");
      updateText(Els["endofschedulesubtitle"], "", "endOfScheduleSubtitle");
      updateText(Els["currentlengthofperiod"], "", "currentLength");
      updateText(Els["nextschedule"], "", "nextSchedule");
      updateText(Els["nextduration"], "", "nextDuration");
    } else if (currentPeriod === periodIndex) {
      updateText(Els["currentperiodsubtitle"], "", "currentPeriodSubtitle");
      updateText(Els["currentschedule"], names[periodIndex], "currentSchedule");
      updateText(Els["endofschedulesubtitle"], "Time elapsed since end of schedule", "endOfScheduleSubtitle");
      updateText(Els["currentlengthofperiod"], "", "currentLength");
      updateText(Els["nextschedule"], "", "nextSchedule");
      updateText(Els["nextduration"], "", "nextDuration");

    } else {
      updateText(Els["currentschedule"], names[currentPeriod], "currentSchedule");
      updateText(Els["endofschedulesubtitle"], "", "endOfScheduleSubtitle");
      updateText(Els["currentduration"], "", "currentDuration");
      updateHTML(Els["nextschedule"], `<strong>${names[currentPeriod + 1]}</strong> starts in:`, "nextSchedule");
    }

    if (currentPeriod >= 0 && currentPeriod < periodIndex) {
      updateText(Els["currentlengthofperiod"],
        `${formatScheduleTime(times[currentPeriod])} - ${formatScheduleTime(times[currentPeriod + 1])}`,
        "currentLength");
    } else {
      updateText(Els["currentlengthofperiod"], "", "currentLength");
    }

    if (scheduleChanged || periodChanged) {
      const scheduleEl = Els["scheduledisplay"] || document.getElementById("scheduledisplay");
      if (scheduleEl) {
        const lines = [];
        lines.push(
          '<div style="margin-top:30px; display:block; width:100%; text-align:center">' +
          '<div style="display:inline-block; margin-left:auto; margin-right:auto; text-align:left; width:auto">' +
          "Today's Schedule:<br />"
        );

        for (let x = 0; x < periodIndex; x++) {
          const startLabel = formatScheduleTime(times[x]);
          const endLabel = formatScheduleTime(times[x + 1] || "");
          let line = `${startLabel} - ${endLabel} ${names[x]}<br />`;
          if (x === currentPeriod) line = `<strong>${line}</strong>`;

          lines.push(line);
        }
        lines.push('</div></div>');
        const html = lines.join("");
        if (scheduleEl.innerHTML !== html) {
          updateHTML(scheduleEl, html, "scheduleHTML");
        }
      }
    }
  }
}

function formatDisplayTimer(totalSeconds) {
  totalSeconds = Math.floor(totalSeconds);
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  if (minutes > 0) return `${padZero(minutes)}:${padZero(seconds)}`;
  return padZero(seconds);
}

function formatDateString(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function AutoSchedule() {
  document.querySelector("#auto-schedule").classList.remove("selected-state");
  const now = new Date();
  const currentDate = new Date(now.getTime() + adjustseconds * 1000);
  const dateString = formatDateString(currentDate);
  const scheduleConfig = CalendarManager.getScheduleForDate(dateString);
  StorageManager.savePreference('lastUsedSchedule', 'auto');
  let foundScheduleData = !!scheduleConfig;
  if (foundScheduleData) {
    if (scheduleConfig.isEven !== null && scheduleConfig.isEven !== isEven) {
      isEven = scheduleConfig.isEven;
      updateOddEvenToggleButton();
    }
    loadSchedule(scheduleConfig.schedule);
  } else {
    loadSchedule('normal');
  }

  const tomorrowDate = new Date(currentDate.getTime() + 86400 * 1000);
  const tomorrowString = formatDateString(tomorrowDate);
  const tomorrowConfig = CalendarManager.getScheduleForDate(tomorrowString);

  if (tomorrowConfig && tomorrowConfig.schedule) {
    const parts = [];
    if (tomorrowConfig.schedule === "noSchool") {
      parts.push("No School");
    } else {
      if (tomorrowConfig.isEven !== null) {
        parts.push(tomorrowConfig.isEven ? "Even" : "Odd");
      }
      const allSchedules = StorageManager.getAllSchedules();
      const schedule = allSchedules[tomorrowConfig.schedule];
      parts.push(schedule?.displayName || tomorrowConfig.schedule);
    }
    const result = parts.join(" ");
    document.getElementById("tomorrowScheduleTitle").classList.remove("hidden");
    document.getElementById("tomorrowScheduleDisplay").classList.remove("hidden");
    document.getElementById("tomorrowScheduleDisplay").textContent = result;
  } else {
    document.getElementById("tomorrowScheduleTitle").classList.add("hidden");
    document.getElementById("tomorrowScheduleDisplay").classList.add("hidden");
  }
  if (foundScheduleData) {
    document.querySelector("#auto-schedule").classList.add("selected-state");
  }
}

function HandleSpecialScheduleChange() {
  const selectedOption = document.getElementById("special-schedule").value;
  const allSchedules = StorageManager.getAllSchedules();

  if (allSchedules[selectedOption]) {
    loadSchedule(selectedOption);
    return;
  }

  const remap = {
    anchorSchedule: "anchor",
    rallySchedule: "rally",
    ExtendedSnackSchedule: "extendedSnack",
    TestingSchedule: "testing"
  };

  loadSchedule(remap[selectedOption] || "normal");
}

function ToggleScheduleOddEven() {
  isEven = !isEven;

  if (currentScheduleId) {
    const schedule = StorageManager.getAllSchedules()[currentScheduleId];
    if (schedule) loadSchedule(currentScheduleId);
  }

  updateOddEvenToggleButton();
}

function updateOddEvenToggleButton() {
  const button = document.getElementById("odd-even-toggle");
  button.disabled = !(currentScheduleData && currentScheduleData.canToggleOddEven);
  button.classList.toggle("toggled-state", isEven);
  button.classList.toggle("normal-state", !isEven);
}

function clearSelectedStateButtons() {
  document.querySelectorAll(".selected-state").forEach(button => {
    button.classList.remove("selected-state");
  });
}

window.onload = async function() {
  await loadVersion();
  UserManager.init(version);
  StorageManager.init();
  DateFormatter.init();
  initializeSettingsHandlers();
  regenerateScheduleButtons();
  loadPreferences();
  detectStorageLimitAsync();
  await NotificationManager.loadChangelogData();
  Els = {
    currentdate: document.getElementById('currentdate'),
    timer_type: document.getElementById('timer_type'),
    subtitle: document.getElementById('subtitle'),
    currentperiodsubtitle: document.getElementById('currentperiodsubtitle'),
    currentschedule: document.getElementById('currentschedule'),
    currentlengthofperiod: document.getElementById('currentlengthofperiod'),
    endofschedulesubtitle: document.getElementById('endofschedulesubtitle'),
    currentduration: document.getElementById('currentduration'),
    nextperiodsubtitle: document.getElementById('nextperiodsubtitle'),
    nextschedule: document.getElementById('nextschedule'),
    nextduration: document.getElementById('nextduration'),
    scheduledisplay: document.getElementById('scheduledisplay'),
    autoUpdateToggle: document.getElementById('autoUpdateToggle'),
    updateFrequencies: document.getElementById('updateFrequencies'),
  };
  ScheduleEditor.init();

  document.getElementById('versionSpan').textContent = 'v' + version;
  const userStatus = UserManager.getUserStatus();
  await CalendarManager.handleVersionUpdate(userStatus.currentVersion);

  if (userStatus.showWelcome) {
    NotificationManager.showWelcome(
      async function() {
          const defaultCalendar = await CalendarManager.loadDefaultCalendar();
          if (defaultCalendar) {
            CalendarManager.saveConfig(defaultCalendar);
            AutoSchedule();
          }
          UserManager.completeOnboarding();
          if (userStatus.showWhatsNew) {
            setTimeout(() => {
              NotificationManager.showWhatsNew(
                userStatus.currentVersion,
                function() {
                  UserManager.updateVersion();
                }
              );
            }, 800);
          }
        },
        function() {
          CalendarUI.initializeWeekends();
          UserManager.completeOnboarding();

          if (userStatus.showWhatsNew) {
            setTimeout(() => {
              NotificationManager.showWhatsNew(
                userStatus.currentVersion,
                function() {
                  UserManager.updateVersion();
                }
              );
            }, 300);
          }
        }
    );
  } else if (userStatus.showWhatsNew) {
    NotificationManager.showWhatsNew(
      userStatus.currentVersion,
      function() {
        UserManager.updateVersion();
      }
    );
  }

  const lastUsedSchedule = StorageManager.getPreference('lastUsedSchedule');
  if (lastUsedSchedule && lastUsedSchedule !== 'auto') {
    const allSchedules = StorageManager.getAllSchedules();
    if (allSchedules[lastUsedSchedule]) {
      loadSchedule(lastUsedSchedule);
    } else {
      loadSchedule('normal');
    }
  } else {
    loadSchedule('normal');
  }

  updateAndCallAgain();
  if (!lastUsedSchedule || lastUsedSchedule === 'auto') AutoSchedule();
  const link = document.getElementById("schoolSchedule");
  const urls = getSchoolScheduleLink();
  link.href = urls.main;
  if (urls.fallback) link.title = `If schedule isn't posted yet, try: ${urls.fallback}`;

  setTimeout(() => {
    UpdateChecker.checkForUpdate(false, true);
    UpdateChecker.startAutoCheck();
  }, 100);
};

function clearAllLocalStorage() {
  NotificationManager.showConfirm(
    'Clear All Data',
    'This will permanently delete ALL stored data including schedules, settings, and calendar data. This cannot be undone!\n\nAre you absolutely sure you want to continue?',
    'Yes, Continue',
    'Cancel',
    function() {
      setTimeout(() => {
        NotificationManager.showConfirm(
          'Final Warning',
          'Last chance! This will delete everything and reload the page.\n\nClick "Delete Everything" to proceed.',
          'Delete Everything',
          'Cancel',
          function() {
            try {
              localStorage.clear();
              cachedStorageLimit = null;
              localStorage.removeItem('__cachedStorageLimit__');
              NotificationManager.showAlert('', 'All localStorage data has been cleared. The page will now reload in 3 seconds.', 'success');
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            } catch (error) {
              console.error('Error clearing localStorage:', error);
              NotificationManager.showAlert('Error clearing localStorage. Please try again.', 'error');
            }
          }
        );
      }, 50);
    }
  );
}
const NotificationManager = {
  notificationQueue: [],
  isShowingNotification: false,
  toastId: 0,
  currentModalType: null,

  showAlert(title, message, type = 'info', duration = 5000) {
    if (arguments.length === 3 && ['success', 'error', 'warning', 'info'].includes(message)) {
      this.showToast(null, title, message, duration);
    } else {
      this.showToast(title, message, type, duration);
    }
  },

  showConfirm(title, message, confirmText, cancelText, confirmCallback, cancelCallback = null) {
    this.show(
      title,
      message,
      confirmText,
      cancelText,
      confirmCallback,
      cancelCallback || function() {}
    );
  },
  showToast(title, message, type = 'info', duration = 5000) {
    const toastId = ++this.toastId;
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.id = `toast-${toastId}`;

    let toastContent = `<button class="toast-close" onclick="NotificationManager.removeToast(${toastId})">&times;</button>`;
    if (title) {
      toastContent += `<div class="toast-title">${title}</div>`;
      toastContent += `<div class="toast-message">${message}</div>`;
    } else {
      toastContent += `<div class="toast-message-only">${message}</div>`;
    }

    toast.innerHTML = toastContent;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      this.removeToast(toastId);
    }, duration);
  },

  removeToast(toastId) {
    const toast = document.getElementById(`toast-${toastId}`);
    if (toast) {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
        const container = document.getElementById('toastContainer');
        if (container && container.children.length === 0) {
          this.toastId = 0;
        }
      }, 300);
    }
  },

  clearAllToasts() {
    const container = document.getElementById('toastContainer');
    if (container) {
      container.innerHTML = '';
      this.toastId = 0;
    }
  },

  showWelcome(primaryCallback, secondaryCallback) {
    this.show(
      'Welcome to Schedule Monitor',
      'Would you like to load the Bellflower High School calendar with the school schedules pre-configured?',
      'Load Bellflower Calendar',
      'Start with Empty Calendar',
      primaryCallback,
      secondaryCallback
    );
  },

  showWhatsNew(version, primaryCallback) {
    const features = this.getVersionFeatures(version);
    const tertiaryConfig = this.getTertiaryButtonConfig(version);
    let tertiaryText = null;
    let tertiaryCallback = null;

    if (tertiaryConfig && this.shouldShowTertiaryButton(version, tertiaryConfig)) {
      tertiaryText = tertiaryConfig.text;
      tertiaryCallback = () => {
        tertiaryConfig.callback();
        primaryCallback();
      };
    }

    this.currentModalType = 'changelog';

    this.show(
      `What's New in v${version}`,
      features,
      'Got it!',
      'View Full Changelog',
      primaryCallback,
      function() {
        window.open('https://github.com/oirehm/schedulemonitor/blob/main/Changelog.md', '_blank');
        primaryCallback();
      },
      false,
      'left',
      tertiaryText,
      tertiaryCallback
    );
  },

  shouldShowTertiaryButton(version, tertiaryConfig) {
    if (tertiaryConfig.condition) {
      return tertiaryConfig.condition();
    }
    return true;
  },

  getVersionFeatures(version) {
    if (!this.changelogData) {
      return 'Loading version information...';
    }

    const userStatus = UserManager.getUserStatus();
    const previousVersion = userStatus.previousVersion;

    if (!previousVersion) {
      const changes = this.changelogData[version] || ['Error: Version not found'];
      return changes.join('');
    }

    const allVersions = Object.keys(this.changelogData).sort((a, b) => compareVersions(b, a));
    const currentIndex = allVersions.indexOf(version);
    const previousIndex = allVersions.indexOf(previousVersion);

    if (currentIndex === -1 || previousIndex === -1 || currentIndex >= previousIndex) {
      const changes = this.changelogData[version] || ['Error: Version not found'];
      return changes.join('');
    }

    const missedVersions = allVersions.slice(currentIndex, previousIndex);

    if (missedVersions.length === 1) {
      const changes = this.changelogData[missedVersions[0]] || [];
      return changes.join('');
    }

    let allChanges = '';
    missedVersions.forEach(ver => {
      const changes = this.changelogData[ver] || [];
      if (changes.length > 0) {
        allChanges += `<div class="version-header">v${ver} Changes:</div>${changes.join('')}\n`;
      }
    });

    return allChanges.trim();
  },

  async loadChangelogData() {
    try {
      const response = await fetch('./Changelog.md');
      const text = await response.text();
      this.changelogData = this.parseChangelog(text);
    } catch (error) {
      console.error('Failed to load changelog:', error);
    }
  },

  parseChangelog(text) {
    const versions = {};
    const lines = text.split('\n');
    let currentVersion = null;
    let currentChanges = [];

    for (const line of lines) {
      const versionMatch = line.match(/^##\s+Version\s+([\d.]+)(?:\s+-\s+(.+))?/);

      if (versionMatch) {
        if (currentVersion && currentChanges.length > 0) {
          versions[currentVersion] = currentChanges;
        }

        currentVersion = versionMatch[1];
        currentChanges = [];

        if (versionMatch[2]) {
          currentChanges.push(`<div class="version-subtitle">${versionMatch[2]}</div>`);
        }
      }
      else if (line.match(/^-\s+/) && currentVersion) {
        const change = line
          .replace(/^-\s+/, '• ')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        currentChanges.push(`<div class="bullet-item">${change}</div>`);
      }
    }

    if (currentVersion && currentChanges.length > 0) {
      versions[currentVersion] = currentChanges;
    }

    return versions;
  },

  getTertiaryButtonConfig(version) {
    const tertiaryConfigs = {
      '2.2.1': {
        text: 'Load Default Calendar',
        condition: () => localStorage.getItem('autoUpdateAttempted_2.2.1') !== 'true',
        callback: async function() {
          const defaultCalendar = await CalendarManager.loadDefaultCalendar();
          if (defaultCalendar) {
            CalendarManager.saveConfig(defaultCalendar);
            CalendarUI.render();
            NotificationManager.showAlert('', 'Default Bellflower calendar loaded!', 'success');
          } else {
            NotificationManager.showAlert('', 'Could not load default calendar. Please check your internet connection.', 'error');
          }
        }
      },
    };

    return tertiaryConfigs[version] || null;
  },

  showPersist(title, message, primaryText, secondaryText, primaryCallback = null, secondaryCallback = null) {
    this.show(
      title,
      message,
      primaryText,
      secondaryText,
      primaryCallback || function() {},
      secondaryCallback || function() {},
      false,
      'left'
    );
  },

  show(title, message, primaryText, secondaryText, primaryCallback, secondaryCallback, isBlocking = true, textAlign = '', tertiaryText = null, tertiaryCallback = null) {
    if (this.notificationQueue.length > 10) {
      this.notificationQueue.shift();
    }
    const notification = {
      title,
      message,
      primaryText,
      secondaryText,
      primaryCallback,
      secondaryCallback,
      isBlocking,
      textAlign,
      tertiaryText,
      tertiaryCallback
    };

    this.notificationQueue.push(notification);
    this.processQueue();
  },

  processQueue() {
    if (this.isShowingNotification || this.notificationQueue.length === 0) {
      return;
    }

    const notification = this.notificationQueue.shift();
    this.isShowingNotification = true;
    this.displayNotification(notification);

    if (this.notificationQueue.length === 0) {
      this.notificationQueue = [];
    }
  },

  displayNotification(notification) {
    const { title, message, primaryText, secondaryText, primaryCallback, secondaryCallback, isBlocking, textAlign, tertiaryText, tertiaryCallback } = notification;
    if (window.currentNotificationPrimary) {
      window.currentNotificationPrimary = null;
    }
    if (window.currentNotificationSecondary) {
      window.currentNotificationSecondary = null;
    }
    if (window.currentNotificationTertiary) {
      window.currentNotificationTertiary = null;
    }
    document.getElementById('notificationTitle').textContent = title;
    document.getElementById('notificationMessage').innerHTML = message.replace(/\n/g, '<br>');
    document.getElementById('notificationPrimaryButton').textContent = primaryText;

    const modal = document.getElementById('notificationModal');
    const messageElement = document.getElementById('notificationMessage');

    if (textAlign) {
      messageElement.style.textAlign = textAlign;
    } else {
      messageElement.style.textAlign = 'center';
    }

    if (!isBlocking) {
      modal.style.backgroundColor = 'transparent';
      modal.style.top = '80px';
      modal.style.right = '20px';
      modal.style.left = 'auto';
      modal.style.bottom = 'auto';
    } else {
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      modal.style.top = '0';
      modal.style.right = '0';
      modal.style.left = '0';
      modal.style.bottom = '0';
    }

    const secondaryButton = document.getElementById('notificationSecondaryButton');
    if (secondaryText) {
      secondaryButton.textContent = secondaryText;
      secondaryButton.style.display = 'block';
    } else {
      secondaryButton.style.display = 'none';
    }

    const tertiaryButton = document.getElementById('notificationTertiaryButton');
    if (tertiaryText && tertiaryCallback) {
      tertiaryButton.textContent = tertiaryText;
      tertiaryButton.style.display = 'block';
      window.currentNotificationTertiary = tertiaryCallback;
    } else {
      tertiaryButton.style.display = 'none';
      window.currentNotificationTertiary = null;
    }

    window.currentNotificationPrimary = () => {
      if (primaryCallback) primaryCallback();
      this.onNotificationClosed();
    };

    window.currentNotificationSecondary = () => {
      if (secondaryCallback) secondaryCallback();
      this.onNotificationClosed();
    };

    if (tertiaryCallback) {
      window.currentNotificationTertiary = () => {
        tertiaryCallback();
        this.onNotificationClosed();
      };
    }

    document.getElementById('notificationModal').classList.remove('hidden');
  },

  onNotificationClosed() {
    this.isShowingNotification = false;
    if (this.currentModalType === 'changelog' && this.changelogData) {
      this.changelogData = null;
    }
    setTimeout(() => {
      this.processQueue();
    }, 100);
  },

  hide() {
    document.getElementById('notificationModal').classList.add('hidden');
    window.currentNotificationPrimary = null;
    window.currentNotificationSecondary = null;
    window.currentNotificationTertiary = null;
    this.onNotificationClosed();
  }
};

function handleNotificationPrimary() {
  if (window.currentNotificationPrimary) {
    window.currentNotificationPrimary();
  }
  NotificationManager.hide();
}

function handleNotificationSecondary() {
  if (window.currentNotificationSecondary) {
    window.currentNotificationSecondary();
  }
  NotificationManager.hide();
}

function handleNotificationTertiary() {
  if (window.currentNotificationTertiary) {
    window.currentNotificationTertiary();
  }
  NotificationManager.hide();
}

document.getElementById("toggleButton").addEventListener("click", function() {
  toggleSettings();
});

function toggleSettings() {
  if (settingsPanelOpen) {
    closeSettings();
  } else {
    openSettings();
  }
}

function openSettings() {
  const panel = document.getElementById('settingsPanel');
  const button = document.getElementById('toggleButton');
  panel.classList.remove('hidden');
  panel.classList.add('open');
  button.classList.add('selected-bottom');
  settingsPanelOpen = true;

  if (settingsPanelMinimized) {
    panel.classList.remove('minimized');
    settingsPanelMinimized = false;
  }
  updateStorageDisplay();
}

function closeSettings() {
  cleanupSettingsEventListeners();
  const panel = document.getElementById('settingsPanel');
  const button = document.getElementById('toggleButton');
  settingsPanelOpen = false;
  settingsPanelMinimized = false;
  panel.classList.remove('minimized');
  panel.classList.remove('open');
  button.classList.remove('selected-bottom');
}

function minimizeSettings() {
  const panel = document.getElementById('settingsPanel');

  if (settingsPanelMinimized) {
    panel.classList.remove('minimized');
    settingsPanelMinimized = false;
  } else {
    panel.classList.add('minimized');
    settingsPanelMinimized = true;
  }
}
document.addEventListener('DOMContentLoaded', function() {
  bindWheelAdjust("#fastForwardDay", "day");
  bindWheelAdjust("#fastForwardHour", "hour");
  const header = document.querySelector('.settings-panel-header');
  if (header) {
    header.addEventListener('click', function(e) {
      if (e.target === header || e.target.tagName === 'H2') {
        minimizeSettings();
      }
    });
  }
});

function minimizeSettings() {
  const panel = document.getElementById('settingsPanel');

  if (settingsPanelMinimized) {
    panel.classList.remove('minimized');
    document.body.classList.remove('settings-panel-minimized');
    settingsPanelMinimized = false;
  } else {
    panel.classList.add('minimized');
    document.body.classList.add('settings-panel-minimized');
    settingsPanelMinimized = true;
  }
}

function switchSettingsTab(tabName, event) {
  document.querySelectorAll('.settings-tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  document.querySelectorAll('#settingsTabs .tab-button').forEach(btn => {
    btn.classList.remove('active');
  });

  document.getElementById(tabName + 'Tab').classList.add('active');
  event.target.classList.add('active');
  currentSettingsTab = tabName;
}

function setSettingsPanelPosition(position) {
  const panel = document.getElementById('settingsPanel');
  const validPositions = ["left", "center", "right"];
  const finalPosition = validPositions.includes(position) ? position : "right";
  panel.classList.remove("position-left", "position-center", "position-right");
  panel.classList.add(`position-${finalPosition}`);
  settingsPanelPosition = finalPosition;
  StorageManager.savePreference("settingsPanelPosition", finalPosition);
}

function loadSettingsPanelPosition() {
  const savedPosition = StorageManager.getPreference('settingsPanelPosition') || 'right';
  setSettingsPanelPosition(savedPosition);
}

function getLocalStorageUsage() {
  let totalSize = 0;

  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalSize += new Blob([localStorage[key]]).size + new Blob([key]).size;
    }
  }

  const maxSize = cachedStorageLimit || 5242880;

  const usedKB = (totalSize / 1024).toFixed(2);
  const usedMB = (totalSize / 1048576).toFixed(2);
  const maxMB = (maxSize / 1048576).toFixed(1);
  const percentUsed = ((totalSize / maxSize) * 100).toFixed(1);

  return {
    bytes: totalSize,
    kilobytes: usedKB,
    megabytes: usedMB,
    maxMegabytes: maxMB,
    percentUsed: Math.min(percentUsed, 100),
    isEstimate: cachedStorageLimit === null
  };
}

async function detectStorageLimitAsync() {
  if (isCalculatingLimit || cachedStorageLimit !== null) {
    return cachedStorageLimit;
  }
  isCalculatingLimit = true;
  const savedLimit = localStorage.getItem('__cachedStorageLimit__');
  if (savedLimit) {
    cachedStorageLimit = parseInt(savedLimit);
    isCalculatingLimit = false;
    return cachedStorageLimit;
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    let low = 0;
    let high = 10485760;
    let lastGood = 0;
    const testKey = '__test__';
    const chunkSize = 32768;

    localStorage.removeItem(testKey);

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      let testString;
      try {
        testString = 'x'.repeat(mid);
        localStorage.setItem(testKey, testString);
        lastGood = mid;
        low = mid + chunkSize;
        localStorage.removeItem(testKey);

        testString = null;
        if (mid > 1000000 && window.gc) {
          window.gc();
        }
      } catch (e) {
        testString = null;
        high = mid - 1;
      }

      await new Promise(resolve => setTimeout(resolve, 0));
    }

    const currentUsage = getCurrentStorageSize();
    cachedStorageLimit = lastGood + currentUsage;
    localStorage.setItem('__cachedStorageLimit__', cachedStorageLimit.toString());
    updateStorageDisplay();
  } catch (e) {
    console.error('Could not determine storage limit:', e);
    cachedStorageLimit = 5242880;
  }
  isCalculatingLimit = false;
  return cachedStorageLimit;
}

function getCurrentStorageSize() {
  let size = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key) &&
      key !== '__test__' &&
      key !== '__cachedStorageLimit__') {
      size += (localStorage[key].length + key.length) * 2;
    }
  }
  return size;
}

function updateStorageDisplay() {
  const usage = getLocalStorageUsage();
  const storageDisplay = document.getElementById('storageUsageDisplay');

  if (storageDisplay) {
    let displayText = '';
    if (usage.bytes < 1024) {
      displayText = `${usage.bytes} bytes`;
    } else if (usage.bytes < 1048576) {
      displayText = `${usage.kilobytes} KB`;
    } else {
      displayText = `${usage.megabytes} MB`;
    }

    displayText += ` / ${usage.isEstimate ? '~' : ''}${usage.maxMegabytes} MB (${usage.percentUsed}%)`;

    if (isCalculatingLimit) {
      displayText += ' (calculating...)';
    }

    storageDisplay.textContent = displayText;

    const storageBar = document.getElementById('storageUsageBar');
    if (storageBar) {
      storageBar.style.width = `${usage.percentUsed}%`;
      if (usage.percentUsed > 90) {
        storageBar.style.backgroundColor = '#ff6666';
      } else if (usage.percentUsed > 70) {
        storageBar.style.backgroundColor = '#ffaa44';
      } else {
        storageBar.style.backgroundColor = '#44aa44';
      }
    }
  }
}

const DateFormatter = {
  preset: 'default',
  settings: {
    monthStyle: 'short',
    dayStyle: 'numeric',
    yearStyle: 'full',
    weekdayStyle: 'short',

    hourFormat: '12',
    showSeconds: true,
    ampmStyle: 'upper',

    dateOrder: 'mdy',
    dateSeparator: ' ',
    timeSeparator: ':',
    dateTimeSeparator: ' '
  },

  defaultSettings: {
    monthStyle: 'short',
    dayStyle: 'numeric',
    yearStyle: 'full',
    weekdayStyle: 'short',
    hourFormat: '12',
    showSeconds: true,
    ampmStyle: 'upper',
    dateOrder: 'mdy',
    dateSeparator: ' ',
    timeSeparator: ':',
    dateTimeSeparator: ' '
  },

  init() {
    const saved = StorageManager.getPreference('dateFormatSettings');
    if (saved) {
      this.settings = {
        ...this.settings,
        ...saved
      };
    }
    this.updateUI();
  },

  updateUI() {
    const presetSelect = document.getElementById('datePreset');
    if (presetSelect) presetSelect.value = this.preset;
    Object.keys(this.settings).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = this.settings[key];
        } else {
          element.value = this.settings[key];
        }
      }
    });
  },

  formatDate(date) {
    if (this.preset === 'default') return this.formatOriginal(date);

    const components = this.getDateComponents(date);
    const settings = this.settings;
    const buffer = [];

    if (settings.weekdayStyle !== 'none') {
      buffer.push(components.weekday, ' ');
    }

    const order = settings.dateOrder.split('');
    order.forEach((part, i) => {
      switch (part) {
        case 'm':
          buffer.push(components.month);
          break;
        case 'd':
          buffer.push(components.day);
          break;
        case 'y':
          buffer.push(components.year);
          break;
      }
      if (i < order.length - 1) {
        buffer.push(settings.dateSeparator);
      }
    });

    buffer.push(settings.dateTimeSeparator);

    buffer.push(components.hour, settings.timeSeparator, components.minute);

    if (settings.showSeconds) {
      buffer.push(settings.timeSeparator, components.second);
    }

    if (settings.hourFormat === '12') {
      buffer.push(' ', components.ampm);
    }

    return buffer.join('');
  },

  formatOriginal(date) {
    const parts = timePartsFromDate(date);
    return `${DAY_NAMES.short[date.getDay()]} ${MONTH_NAMES.short[date.getMonth()]} ${padZero(date.getDate())} ${date.getFullYear()} ${parts.hh12Str}:${parts.mmStr}:${parts.ssStr} ${parts.meridiem}`;
  },

  getDateComponents(date) {
    const components = {};
    if (this.settings.weekdayStyle !== 'none') {
      components.weekday = DAY_NAMES[this.settings.weekdayStyle][date.getDay()];
    }

    const monthIndex = date.getMonth();
    const monthStyle = this.settings.monthStyle;
    if (monthStyle === 'long') {
      components.month = MONTH_NAMES.long[monthIndex];
    } else if (monthStyle === 'short') {
      components.month = MONTH_NAMES.short[monthIndex];
    } else if (monthStyle === 'numeric') {
      components.month = monthIndex + 1;
    } else {
      components.month = padZero(monthIndex + 1);
    }

    const dayOfMonth = date.getDate();
    const dayStyle = this.settings.dayStyle;
    if (dayStyle === 'numeric') {
      components.day = dayOfMonth;
    } else if (dayStyle === 'padded') {
      components.day = padZero(dayOfMonth);
    } else {
      components.day = dayOfMonth + this.getOrdinalSuffix(dayOfMonth);
    }

    if (this.settings.yearStyle === 'full') {
      components.year = date.getFullYear();
    } else {
      components.year = String(date.getFullYear()).slice(-2);
    }

    const hours24 = date.getHours();

    if (this.settings.hourFormat === '24') {
      components.hour = padZero(hours24);
    } else {
      const hours12 = hours24 % 12 || 12;
      components.hour = padZero(hours12);
    }

    components.minute = padZero(date.getMinutes());
    components.second = padZero(date.getSeconds());

    if (this.settings.hourFormat === '12') {
      const ampmStyle = this.settings.ampmStyle;
      const base = hours24 >= 12 ? 'PM' : 'AM';
      if (ampmStyle === 'upper') {
        components.ampm = base;
      } else if (ampmStyle === 'lower') {
        components.ampm = base.toLowerCase();
      } else {
        components.ampm = base.split('').join('.') + '.';
      }
    }

    return components;
  },

  getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  },

  save() {
    StorageManager.savePreference('dateFormatSettings', {
      preset: this.preset,
      settings: this.settings
    });
  },
};
let dateFormatUpdated = false;

function updateDateFormat() {
  const presetSelect = document.getElementById('datePreset');
  if (presetSelect && DateFormatter.preset !== 'custom') {
    DateFormatter.preset = 'custom';
    presetSelect.value = 'custom';
  }

  Object.keys(DateFormatter.settings).forEach(key => {
    const element = document.getElementById(key);
    if (element) {
      if (element.type === 'checkbox') {
        DateFormatter.settings[key] = element.checked;
      } else {
        DateFormatter.settings[key] = element.value;
      }
    }
  });
  dateFormatUpdated = true;
  DateFormatter.save();
}

function applyDatePreset() {
  const preset = document.getElementById('datePreset').value;
  DateFormatter.preset = preset;

  const presets = {
    'default': DateFormatter.defaultSettings,
    'us-standard': {
      monthStyle: 'padded',
      dayStyle: 'padded',
      yearStyle: 'full',
      weekdayStyle: 'none',
      hourFormat: '12',
      showSeconds: true,
      ampmStyle: 'upper',
      dateOrder: 'mdy',
      dateSeparator: '/',
      timeSeparator: ':',
      dateTimeSeparator: ' '
    },
    'international': {
      monthStyle: 'padded',
      dayStyle: 'padded',
      yearStyle: 'full',
      weekdayStyle: 'none',
      hourFormat: '24',
      showSeconds: true,
      dateOrder: 'dmy',
      dateSeparator: '/',
      timeSeparator: ':',
      dateTimeSeparator: ' '
    },
    'iso': {
      monthStyle: 'padded',
      dayStyle: 'padded',
      yearStyle: 'full',
      weekdayStyle: 'none',
      hourFormat: '24',
      showSeconds: true,
      dateOrder: 'ymd',
      dateSeparator: '-',
      timeSeparator: ':',
      dateTimeSeparator: 'T'
    }
  };

  if (preset === 'custom') {
    DateFormatter.updateUI();
  } else if (presets[preset]) {
    DateFormatter.settings = {
      ...presets[preset]
    };
    DateFormatter.updateUI();
  }
  dateFormatUpdated = true;
  DateFormatter.save();
}

function formatDisplayedDate(date) {
  return DateFormatter.formatDate(date);
}

const UpdateChecker = {
  VERSION_URL: 'https://oirehm.github.io/schedulemonitor/version.txt',
  REPO_VERSION_URL: 'https://raw.githubusercontent.com/oirehm/schedulemonitor/main/version.txt',
  CHECK_INTERVAL: 1000 * 60 * 60,
  DEPLOYMENT_CHECK_INTERVAL: 1000 * 30,
  STORAGE_KEY: 'lastUpdateCheck',
  intervalId: null,

  getCurrentInterval() {
    const savedInterval = StorageManager.getPreference('autoUpdateInterval');
    return savedInterval ? parseInt(savedInterval) * 1000 : this.CHECK_INTERVAL;
  },

  async checkForUpdate(isManual = false, isStartup = false) {
    const autoEnabled = localStorage.getItem('autoUpdateEnabled') === '1';
    const lastCheck = localStorage.getItem(this.STORAGE_KEY);
    const now = Date.now();
    const interval = this.getCurrentInterval();

    if (!(isManual || isStartup) && (!autoEnabled || (lastCheck && (now - parseInt(lastCheck)) < interval))) {
        return;
    }
    const lastCheckEl = document.querySelector('.last-check');
    if (lastCheckEl && lastCheck) {
      lastCheckEl.textContent = `Last checked: ${new Date(parseInt(lastCheck)).toLocaleString()}`;
    }
    try {
      const repoResponse = await fetch(this.REPO_VERSION_URL + '?t=' + Date.now());
      if (!repoResponse.ok) return;

      const repoVersion = (await repoResponse.text()).trim();
      const currentVersion = version;

      if (compareVersions(currentVersion, repoVersion) < 0) {

        const deployedResponse = await fetch(this.VERSION_URL + '?t=' + Date.now());
        if (!deployedResponse.ok) return;

        const deployedVersion = (await deployedResponse.text()).trim();

        if (compareVersions(currentVersion, deployedVersion) < 0) {
          this.showUpdateAvailable(deployedVersion);
        } else {
          this.pendingVersion = repoVersion;
          this.showUpdatePending(repoVersion);
          this.startDeploymentCheck();
        }
      } else if (compareVersions(currentVersion, repoVersion) === 0 && isManual) {
        NotificationManager.showAlert('', 'Schedule Monitor is up to date', 'success');
      }

      localStorage.setItem(this.STORAGE_KEY, now.toString());
    } catch (error) {
      console.log('Update check failed:', error);
    }
  },

  startDeploymentCheck() {
    if (this.deploymentCheckId) {
      clearInterval(this.deploymentCheckId);
    }

    this.deploymentCheckId = setInterval(async () => {
      try {
        const deployedResponse = await fetch(this.VERSION_URL + '?t=' + Date.now());
        if (deployedResponse.ok) {
          const deployedVersion = (await deployedResponse.text()).trim();

          if (compareVersions(version, deployedVersion) < 0) {
            clearInterval(this.deploymentCheckId);
            this.deploymentCheckId = null;
            this.pendingVersion = null;
            this.showUpdateAvailable(deployedVersion);
          }
        }
      } catch (error) {
        console.log('Deployment check failed:', error);
      } finally {
        deployedResponse = null;
      }
    }, this.DEPLOYMENT_CHECK_INTERVAL);
  },

  showUpdatePending(pendingVersion) {
    NotificationManager.showPersist(
      'Update Detected!',
      `Version ${pendingVersion} is being prepared for deployment. You'll be notified when it's ready to install.`,
      'Dismiss',
      null,
      function() {}
    );
  },

  showUpdateAvailable(availableVersion) {
    NotificationManager.showPersist(
      'Update Available!',
      `Version ${availableVersion} is available! Would you like to refresh the page?`,
      'Refresh to update',
      'Dismiss',
      function() {
        window.location.reload();
      }
    );
  },

  startAutoCheck() {
    const autoEnabled = StorageManager.getPreference('autoUpdateEnabled') === '1';
    if (!autoEnabled) {
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    const interval = this.getCurrentInterval();
    this.intervalId = setInterval(() => {
      this.checkForUpdate(false, false);
    }, interval);
  },

  stopAutoCheck() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
};

function compareVersions(v1, v2) {
  const a = v1.split('.').map(Number);
  const b = v2.split('.').map(Number);
  for (let i = 0; i < a.length || i < b.length; i++) {
    const diff = (a[i] || 0) - (b[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

let settingsEventListeners = [];

function addSettingsEventListener(element, event, handler) {
  element.addEventListener(event, handler);
  settingsEventListeners.push({
    element,
    event,
    handler
  });
}

function cleanupSettingsEventListeners() {
  settingsEventListeners.forEach(({
    element,
    event,
    handler
  }) => {
    element.removeEventListener(event, handler);
  });
  settingsEventListeners = [];
}

function initializeSettingsHandlers() {
  const autoToggle = document.getElementById('autoUpdateToggle');
  const updateFrequencies = document.getElementById('updateFrequencies');

  if (autoToggle) {
    addSettingsEventListener(autoToggle, 'change', () => {
      const enabled = autoToggle.checked;
      StorageManager.savePreference('autoUpdateEnabled', enabled ? '1' : '0');
      if (enabled) {
        UpdateChecker.startAutoCheck();
      } else {
        UpdateChecker.stopAutoCheck();
      }
    });
  }

  if (updateFrequencies) {
    addSettingsEventListener(updateFrequencies, 'change', () => {
      const selectedValue = updateFrequencies.value;
      StorageManager.savePreference('autoUpdateInterval', selectedValue);

      UpdateChecker.stopAutoCheck();
      if (StorageManager.getPreference('autoUpdateEnabled') === '1') {
        UpdateChecker.startAutoCheck();
      }
    });
  }
}

function evaluateMathExpression(expression) {
  const constants = {
    'pi': Math.PI,
    'e': Math.E,
    'phi': (1 + Math.sqrt(5)) / 2,
    'tau': 2 * Math.PI,
    'infinity': Infinity,
    'inf': Infinity,
    'nan': NaN,
    'true': true,
    'false': false,
    'null': null
  };

  const functions = {
    'sin': Math.sin,
    'cos': Math.cos,
    'tan': Math.tan,
    'asin': Math.asin,
    'acos': Math.acos,
    'atan': Math.atan,
    'atan2': Math.atan2,

    'sinh': Math.sinh,
    'cosh': Math.cosh,
    'tanh': Math.tanh,
    'asinh': Math.asinh,
    'acosh': Math.acosh,
    'atanh': Math.atanh,

    'arcsin': Math.asin,
    'arccos': Math.acos,
    'arctan': Math.atan,

    'sec': (x) => 1 / Math.cos(x),
    'csc': (x) => 1 / Math.sin(x),
    'cot': (x) => 1 / Math.tan(x),
    'asec': (x) => Math.acos(1 / x),
    'acsc': (x) => Math.asin(1 / x),
    'acot': (x) => Math.atan(1 / x),

    'log': Math.log,
    'ln': Math.log,
    'log10': Math.log10,
    'log2': Math.log2,
    'lb': Math.log2,
    'lg': Math.log10,

    'exp': Math.exp,
    'exp2': (x) => Math.pow(2, x),
    'exp10': (x) => Math.pow(10, x),
    'expm1': Math.expm1,
    'log1p': Math.log1p,

    'pow': Math.pow,
    'sqrt': Math.sqrt,
    'cbrt': Math.cbrt,
    'square': (x) => x * x,
    'cube': (x) => x * x * x,
    'nthRoot': (x, n) => Math.pow(x, 1 / n),

    'round': Math.round,
    'floor': Math.floor,
    'ceil': Math.ceil,
    'trunc': Math.trunc,
    'fix': Math.trunc,

    'abs': Math.abs,
    'sign': Math.sign,
    'signum': Math.sign,

    'min': Math.min,
    'max': Math.max,
    'clip': (x, min, max) => Math.min(Math.max(x, min), max),
    'clamp': (x, min, max) => Math.min(Math.max(x, min), max),

    'random': (min = 0, max = 1) => Math.random() * (max - min) + min,
    'randomInt': (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    'factorial': (n) => {
      if (n < 0) return NaN;
      if (n === 0 || n === 1) return 1;
      let result = 1;
      for (let i = 2; i <= n; i++) result *= i;
      return result;
    },
    'fac': function(n) {
      return this.factorial(n);
    },
    'gamma': (x) => functions.factorial(x - 1),

    'permutation': (n, k) => functions.factorial(n) / functions.factorial(n - k),
    'combination': (n, k) => functions.factorial(n) / (functions.factorial(k) * functions.factorial(n - k)),
    'nPr': function(n, k) {
      return this.permutation(n, k);
    },
    'nCr': function(n, k) {
      return this.combination(n, k);
    },

    'hypot': Math.hypot,
    'pythagoras': Math.hypot,
    'pyt': Math.hypot,

    'deg': (x) => x * Math.PI / 180,
    'rad': (x) => x * 180 / Math.PI,
    'degToRad': (x) => x * Math.PI / 180,
    'radToDeg': (x) => x * 180 / Math.PI,

    'sum': (...args) => args.reduce((a, b) => a + b, 0),
    'mean': (...args) => args.reduce((a, b) => a + b, 0) / args.length,
    'average': function(...args) {
      return this.mean(...args);
    },
    'median': (...args) => {
      const sorted = args.sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    },

    'mod': (a, b) => ((a % b) + b) % b,
    'gcd': (a, b) => b === 0 ? Math.abs(a) : functions.gcd(b, a % b),
    'lcm': (a, b) => Math.abs(a * b) / functions.gcd(a, b),

    'complex': (real, imag = 0) => ({
      real,
      imag
    }),
    're': (complex) => typeof complex === 'object' ? complex.real : complex,
    'im': (complex) => typeof complex === 'object' ? complex.imag : 0,

    'and': (a, b) => a && b,
    'or': (a, b) => a || b,
    'not': (a) => !a,
    'xor': (a, b) => !!(a ^ b),

    'equal': (a, b) => a === b,
    'unequal': (a, b) => a !== b,
    'smaller': (a, b) => a < b,
    'larger': (a, b) => a > b,
    'smallerEq': (a, b) => a <= b,
    'largerEq': (a, b) => a >= b,

    'isNaN': isNaN,
    'isFinite': isFinite,
    'isInteger': Number.isInteger,

    'size': (arr) => Array.isArray(arr) ? arr.length : 1,
    'length': function(arr) {
      return this.size(arr);
    }
  };

  let expr = expression.toLowerCase().trim();

  if (!expr) return 0;

  Object.keys(constants).forEach(name => {
    const regex = new RegExp(`\\b${name}\\b`, 'g');
    expr = expr.replace(regex, constants[name]);
  });

  Object.keys(functions).forEach(name => {
    const regex = new RegExp(`\\b${name}\\s*\\(`, 'g');
    expr = expr.replace(regex, `functions.${name}(`);
  });

  expr = expr
    .replace(/(\d+\.?\d*)\s*([a-z_])/g, '$1*$2')
    .replace(/(\d+\.?\d*)\s*\(/g, '$1*(')
    .replace(/\)\s*(\d+\.?\d*)/g, ')*$1')
    .replace(/\)\s*([a-z_])/g, ')*$1')
    .replace(/\)\s*\(/g, ')*(')
    .replace(/([a-z_])\s*\(/g, '$1*(');

  expr = expr.replace(/(\d+\.?\d*|\))\s*!/g, 'functions.factorial($1)');
  expr = expr.replace(/\^/g, '**');
  expr = expr.replace(/(\d+\.?\d*)\s*%/g, '($1/100)');

  const context = {
    functions,
    Math,

    ...functions
  };

  try {
    return Function('functions', 'Math', ...Object.keys(functions), `return ${expr}`)
      (functions, Math, ...Object.values(functions));
  } catch (error) {
    throw new Error(`Invalid expression: ${error.message}`);
  }
}

function showRecentChanges(event) {
  event.preventDefault();

  if (NotificationManager.isShowingNotification) {
    return;
  }

  NotificationManager.showWhatsNew(
    version,
    function() {}
  );
}

async function loadVersion() {
  try {
    const response = await fetch('./version.txt?t=' + Date.now());
    if (response.ok) {
      const fetchedVersion = (await response.text()).trim();
      if (fetchedVersion) {
        version = fetchedVersion;
        const versionSpan = document.getElementById('versionSpan');
        if (versionSpan) {
          versionSpan.textContent = 'v' + version;
        }
      }
    }
  } catch (error) {
    console.log('Failed to load version, using fallback:', version);
  }
}

function forceHardRefresh() {
  NotificationManager.showConfirm(
    'Force Hard Refresh',
    'This will reload the page and clear cached files. This will NOT affect your local storage. Any unsaved changes will be lost.',
    'Hard Refresh',
    'Cancel',
    function() {
      window.location.reload(true);
    }
  );
}

function showCacheTroubleshooting() {
  const isWindows = navigator.platform.toLowerCase().includes('win');
  const isMac = navigator.platform.toLowerCase().includes('mac');
  let refreshKey = isWindows ? 'Ctrl+Shift+R (or Ctrl+F5)' : (isMac ? 'Cmd+Shift+R' : 'Ctrl+Shift+R');
  
  const troubleshootingText = 
    `If Schedule Monitor seems outdated or broken after an update:\n\n` +
    `1. <strong>Hard Refresh</strong>: ${refreshKey}\n` +
    `2. <strong>Private Window</strong> Open in incognito/private browsing\n` +
    `3. <strong>Clear Cache</strong> Browser Settings → Clear browsing data\n` +
    `4. <strong>Check Version</strong> Look at version number in footer\n\n` +
    `Most issues are solved with a hard refresh!`;
  
  NotificationManager.show(
    'Cache Troubleshooting',
    troubleshootingText,
    'Got it!',
    'Hard Refresh Now',
    function() {},
    function() {
      window.location.reload(true);
    },
    false,
    'left'
  );
}
