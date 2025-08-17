let starts = [];
let names = [];
let times = [];
let isEven = false;
let schedule = -1;
let randomChange = false;
let random = false;
let adjustseconds = 0;
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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
  testing: {
    displayName: "Testing Schedule",
    canToggleOddEven: true,
    odd: {
      times: ["08:30", "10:30", "10:39", "10:45", "11:45", "11:51", "12:51", "12:57", "13:57", "14:30", "14:36", "15:36"],
      names: ["Testing Block", "Snack", "Passing Period", "Period 1", "Passing Period", "Period 3", "Passing Period", "Period 5", "Lunch", "Passing Period", "Period 7", "End of School"]
    },
    even: {
      times: ["08:30", "10:30", "10:39", "10:45", "11:45", "11:51", "12:51", "12:57", "13:57", "14:30", "14:36", "15:36"],
      names: ["Testing Block", "Snack", "Passing Period", "Period 2", "Passing Period", "Period 4", "Passing Period", "Period 6", "Lunch", "Passing Period", "Period 8", "End of School"]
    }
  },
  noSchool: {
    displayName: "No School",
    canToggleOddEven: false,
    times: [],
    names: []
  }
};

const StorageManager = {
  STORAGE_KEY: 'scheduleMonitorData',
  VERSION: '2.0',

  init() {
    const stored = this.load();
    if (!stored || stored.version !== this.VERSION) {
      const oldTimeAdj = localStorage.getItem('timeAdjustment');
      
      this.migrate(stored);

      if (oldTimeAdj) {
        this.savePreference('timeAdjustment', oldTimeAdj);
      }
    }
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

  save(data) {
    try {
      const toSave = {
        version: this.VERSION,
        ...data,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toSave));
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        alert('Storage limit reached! Please delete some custom schedules.');
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
    const data = this.getData();
    const allSchedules = {
      ...scheduleTemplates
    };

    if (data.customSchedules) {
      Object.keys(data.customSchedules).forEach(id => {
        allSchedules[id] = data.customSchedules[id];
      });
    }

    if (data.scheduleOverrides) {
      Object.keys(data.scheduleOverrides).forEach(id => {
        if (allSchedules[id] && !allSchedules[id].isCustom) {
          allSchedules[id] = {
            ...allSchedules[id],
            ...data.scheduleOverrides[id]
          };
        }
      });
    }

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
let currentScheduleId = 'normal';
let currentScheduleData = null;
function loadPreferences() {
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
  }

  const updateFrequency = StorageManager.getPreference('updateFrequency');
  if (updateFrequency) {
    document.getElementById('updateFrequencies').value = updateFrequency;
  }
}

function savePreferenceToStorage(key, value) {
  StorageManager.savePreference(key, value);
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

    const mainSchedules = [];
    const specialSchedules = [];
    const customSchedules = [];

    Object.keys(allSchedules).forEach(id => {
      const schedule = allSchedules[id];
      const item = {
        id: id,
        name: schedule.displayName,
        schedule: schedule,
        isHidden: data.hiddenSchedules.includes(id),
        isCustom: schedule.isCustom
      };

      if (schedule.isCustom) {
        customSchedules.push(item);
      } else if (['normal', 'late', 'minimum', 'auto'].includes(id)) {
        mainSchedules.push(item);
      } else if (id !== 'noSchool') {
        specialSchedules.push(item);
      }
    });

    this.sortByOrder(mainSchedules, data.scheduleOrder);
    this.sortByOrder(specialSchedules, data.specialScheduleOrder);

    this.renderScheduleList('mainSchedulesList', mainSchedules, data.scheduleOrder, false);
    this.renderScheduleList('specialSchedulesList', specialSchedules, data.specialScheduleOrder, true);
    this.renderCustomScheduleList('customSchedulesList', customSchedules);
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

  renderScheduleList(containerId, schedules, order, isSpecial) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    schedules.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'schedule-item' + (item.isHidden ? ' hidden-schedule' : '');
      
      const canToggleOddEven = item.schedule.canToggleOddEven ? 'Odd/Even' : 'Single';
      
      const data = StorageManager.getData();
      const hasOverride = !item.isCustom && data.scheduleOverrides && data.scheduleOverrides[item.id];
      
      div.innerHTML = `
        <div class="schedule-info">
          <span class="schedule-name">${item.name}${hasOverride ? ' (Modified)' : ''}</span>
          <span class="schedule-type">${canToggleOddEven}</span>
        </div>
        <div class="schedule-actions">
          <button class="visibility-toggle" onclick="toggleScheduleVisibility('${item.id}')" title="${item.isHidden ? 'Show' : 'Hide'}">
            ${item.isHidden ? '○' : '●'}
          </button>
          <button onclick="editSchedule('${item.id}')">Edit</button>
          ${hasOverride ? `<button onclick="resetScheduleToDefault('${item.id}')" style="color: #ff9933;">Reset</button>` : ''}
          <div class="move-buttons">
            ${index > 0 ? `<button class="move-button" onclick="moveSchedule('${item.id}', -1, ${isSpecial})">↑</button>` : '<div style="height: 20px;"></div>'}
            ${index < schedules.length - 1 ? `<button class="move-button" onclick="moveSchedule('${item.id}', 1, ${isSpecial})">↓</button>` : '<div style="height: 20px;"></div>'}
          </div>
        </div>
      `;
      
      container.appendChild(div);
    });
  },

  renderCustomScheduleList(containerId, schedules) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (schedules.length === 0) {
      container.innerHTML = '<div style="color: #666; padding: 10px;">No custom schedules yet</div>';
      return;
    }

    schedules.forEach(item => {
      const div = document.createElement('div');
      div.className = 'schedule-item custom-schedule' + (item.isHidden ? ' hidden-schedule' : '');

      const canToggleOddEven = item.schedule.canToggleOddEven ? 'Odd/Even' : 'Single';

      div.innerHTML = `
                <div class="schedule-info">
                  <span class="schedule-name">${item.name}</span>
                  <span class="schedule-type">${canToggleOddEven}</span>
                </div>
                <div class="schedule-actions">
                  <button class="visibility-toggle" onclick="toggleScheduleVisibility('${item.id}')" title="${item.isHidden ? 'Show' : 'Hide'}">
                    ${item.isHidden ? '○' : '●'}
                  </button>
                  <button onclick="editCustomSchedule('${item.id}')">Edit</button>
                  <button class="delete-button" onclick="deleteCustomSchedule('${item.id}')">Delete</button>
                </div>
              `;

      container.appendChild(div);
    });
  }
};

function resetScheduleToDefault(scheduleId) {
  if (confirm('Reset this schedule to its default settings?')) {
    const data = StorageManager.getData();
    if (data.scheduleOverrides && data.scheduleOverrides[scheduleId]) {
      delete data.scheduleOverrides[scheduleId];
      StorageManager.save(data);
      
      regenerateScheduleButtons();
      ScheduleManagerUI.render();
      
      if (currentScheduleId === scheduleId) {
        loadSchedule(scheduleId);
      }
      
      alert('Schedule reset to default!');
    }
  }
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
  data.scheduleOrder.forEach(id => {
    if (data.hiddenSchedules.includes(id) || !allSchedules[id]) {
      return;
    }
    const button = document.createElement('button');
    button.id = `${id}-schedule`;
    button.className = 'schedule-button button';
    button.textContent = allSchedules[id].displayName;
    switch(id) {
      case 'normal':
        button.onclick = NormalSchedule;
        break;
      case 'late':
        button.onclick = LateSchedule;
        break;
      case 'minimum':
        button.onclick = MinimumSchedule;
        break;
      case 'auto':
        button.onclick = AutoSchedule;
        break;
      default:
        button.onclick = () => loadSchedule(id);
    }
    container.appendChild(button);
  });
}

function openScheduleManager() {
  ScheduleManagerUI.open();
}

function closeScheduleManager() {
  ScheduleManagerUI.close();
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
  ScheduleManagerUI.render();

  regenerateScheduleButtons();
}

function deleteCustomSchedule(scheduleId) {
  if (confirm(`Are you sure you want to delete this custom schedule?`)) {
    StorageManager.deleteCustomSchedule(scheduleId);
    ScheduleManagerUI.render();
    regenerateScheduleButtons();
  }
}

function editCustomSchedule(scheduleId) {
  alert('Schedule editor coming in Phase 4!');
}

function createNewSchedule() {
  alert('Schedule creator coming in Phase 4!');
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
      alert('Schedules imported successfully!');
      ScheduleManagerUI.render();
      regenerateScheduleButtons();
    } else {
      alert('Failed to import schedules. Please check the file format.');
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
    if (data.scheduleOrder.includes(scheduleId)) {
      document.getElementById('buttonLocation').value = 'main';
    } else {
      document.getElementById('buttonLocation').value = 'special';
    }

    this.scheduleData = JSON.parse(JSON.stringify(scheduleData));
    
    if (scheduleData.canToggleOddEven) {
      document.getElementById('scheduleTabs').classList.remove('hidden');
    }
    
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

  switchTab(tab) {
    this.currentTab = tab;

    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');

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

      periodDiv.addEventListener('dragstart', this.handleDragStart.bind(this));
      periodDiv.addEventListener('dragover', this.handleDragOver.bind(this));
      periodDiv.addEventListener('drop', this.handleDrop.bind(this));
      periodDiv.addEventListener('dragend', this.handleDragEnd.bind(this));

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
    const name = document.getElementById('scheduleName').value.trim();
    if (!name) {
      alert('Please enter a schedule name');
      return false;
    }

    const allSchedules = StorageManager.getAllSchedules();
    const nameExists = Object.keys(allSchedules).some(id => {
      return id !== this.currentScheduleId &&
        allSchedules[id].displayName.toLowerCase() === name.toLowerCase();
    });

    if (nameExists) {
      alert('A schedule with this name already exists');
      return false;
    }

    if (this.scheduleData.canToggleOddEven) {
      if (this.scheduleData.odd.times.length === 0 || this.scheduleData.even.times.length === 0) {
        alert('Please add at least one period to both Odd and Even days');
        return false;
      }
      const oddEmpty = this.scheduleData.odd.names.some(name => !name.trim());
      const evenEmpty = this.scheduleData.even.names.some(name => !name.trim());
      if (oddEmpty || evenEmpty) {
        if (!confirm('Some periods have no names. Continue anyway?')) {
          return false;
        }
      }
    } else {
      const hasEmpty = this.scheduleData.names.some(name => !name.trim());
      if (hasEmpty) {
        if (!confirm('Some periods have no names. Continue anyway?')) {
          return false;
        }
      }
      if (this.scheduleData.times.length === 0) {
        alert('Please add at least one period');
        return false;
      }
    }
    const times = this.scheduleData.canToggleOddEven ? 
      this.scheduleData[this.currentTab].times : 
      this.scheduleData.times;

    for (let i = 1; i < times.length; i++) {
      const prev = times[i-1].split(':').map(Number);
      const curr = times[i].split(':').map(Number);
      const prevMinutes = prev[0] * 60 + prev[1];
      const currMinutes = curr[0] * 60 + curr[1];
      
      if (currMinutes <= prevMinutes) {
        alert('Period times must be in chronological order');
        return false;
      }
    }
    const invalidTimes = document.querySelectorAll('.period-time.invalid');
    if (invalidTimes.length > 0) {
      alert('Please fix invalid time formats (HH:MM)');
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
      
      alert(`Schedule "${name}" updated successfully!`);
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
      
      alert(`Schedule "${name}" ${this.isEditing ? 'updated' : 'created'} successfully!`);
    }

    regenerateScheduleButtons();
    ScheduleManagerUI.render();
    
    this.close();
  },
};

function closeScheduleEditor() {
  ScheduleEditor.close();
}

function handleScheduleTypeChange() {
  ScheduleEditor.handleTypeChange();
}

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
  let periods;
  if (ScheduleEditor.scheduleData.canToggleOddEven) {
    periods = ScheduleEditor.scheduleData[ScheduleEditor.currentTab];
  } else {
    periods = ScheduleEditor.scheduleData;
  }

  periods.times.splice(index, 1);
  periods.names.splice(index, 1);

  ScheduleEditor.renderPeriods();
}

function addPeriod() {
  ScheduleEditor.addPeriod();
}

function validateTime(input) {
  if (input.value.match(/^\d:\d{2}$/)) {
    input.value = '0' + input.value;
  }
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(input.value)) {
    input.classList.add('invalid');
  } else {
    input.classList.remove('invalid');
  }
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

  alert('Preview loaded! It will revert to your previous schedule in 5 seconds.');
}

function saveSchedule() {
  ScheduleEditor.save();
}

function createNewSchedule() {
  ScheduleEditor.open();
}

function editCustomSchedule(scheduleId) {
  ScheduleEditor.open(scheduleId);
}

function resetToDefaults() {
  if (confirm('This will reset all schedules to defaults and remove custom schedules. Continue?')) {
    StorageManager.resetToDefaults();
    ScheduleManagerUI.render();
    regenerateScheduleButtons();
    alert('Reset to defaults complete!');
  }
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
  
  data.specialScheduleOrder.forEach(id => {
    if (!data.hiddenSchedules.includes(id) && allSchedules[id]) {
      const option = document.createElement('option');
      if (!allSchedules[id].isCustom) {
        switch(id) {
          case 'anchor':
            option.value = 'anchorSchedule';
            break;
          case 'rally':
            option.value = 'rallySchedule';
            break;
          case 'extendedSnack':
            option.value = 'ExtendedSnackSchedule';
            break;
          case 'testing':
            option.value = 'TestingSchedule';
            break;
          default:
            option.value = id;
        }
      } else {
        option.value = id;
      }
      
      option.textContent = allSchedules[id].displayName;
      dropdown.appendChild(option);
    }
  });

  if ([...dropdown.options].some(opt => opt.value === currentValue)) {
    dropdown.value = currentValue;
  }
}

function loadSchedule(scheduleId, forceOddEven = null) {
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
    clearAll();
    document.getElementById("timer_type").innerHTML = "No School";
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

  updateStarts();

  let displayTitle = "";
  if (template.canToggleOddEven) {
    displayTitle = isEven ? "EVEN " : "ODD ";
  }

  if (template.isCustom) {
    displayTitle += template.displayName.toUpperCase();
  } else {
    switch (scheduleId) {
      case 'normal':
        displayTitle += "NORMAL BLOCK";
        break;
      case 'late':
        displayTitle += "LATE BLOCK";
        break;
      case 'minimum':
        displayTitle += "MINIMUM BLOCK";
        break;
      case 'testing':
        displayTitle += "TESTING SCHEDULE";
        break;
      case 'rally':
        displayTitle += "RALLY DAY";
        break;
      case 'anchor':
        displayTitle = "ANCHOR DAY";
        break;
      case 'extendedSnack':
        displayTitle = "MINIMUM DAY";
        break;
      default:
        displayTitle += template.displayName.toUpperCase();
    }
  }

  document.getElementById("timer_type").innerHTML = displayTitle;

  if (template.subtitle) {
    document.getElementById("subtitle").innerHTML = template.subtitle;
  } else {
    ClearSubtitle();
  }

  updateButtonStates(scheduleId);
  showclock();
  StorageManager.savePreference('lastUsedSchedule', scheduleId);
}

function updateButtonStates(scheduleId) {
  clearSelectedStateButtons();

  const button = document.getElementById(`${scheduleId}-schedule`);
  if (button) {
    button.classList.add("selected-state");
  }

  const dropdown = document.getElementById("special-schedule");
  switch (scheduleId) {
    case 'anchor':
      dropdown.selectedIndex = Array.from(dropdown.options).findIndex(opt => opt.value === 'anchorSchedule');
      dropdown.classList.add("special-schedule-select");
      break;
    case 'rally':
      dropdown.selectedIndex = Array.from(dropdown.options).findIndex(opt => opt.value === 'rallySchedule');
      dropdown.classList.add("special-schedule-select");
      break;
    case 'extendedSnack':
      dropdown.selectedIndex = Array.from(dropdown.options).findIndex(opt => opt.value === 'ExtendedSnackSchedule');
      dropdown.classList.add("special-schedule-select");
      break;
    case 'testing':
      dropdown.selectedIndex = Array.from(dropdown.options).findIndex(opt => opt.value === 'TestingSchedule');
      dropdown.classList.add("special-schedule-select");
      break;
    default:
      const customIndex = Array.from(dropdown.options).findIndex(opt => opt.value === scheduleId);
      if (customIndex > 0) {
        dropdown.selectedIndex = customIndex;
        dropdown.classList.add("special-schedule-select");
      } else {
        dropdown.selectedIndex = 0;
        dropdown.classList.remove("special-schedule-select");
      }
  }

  updateOddEvenToggleButton()
}
var defaultDisplays = {};
var infoElements = document.querySelectorAll(".info");
infoElements.forEach(function(infoElement) {
  defaultDisplays[infoElement] = getComputedStyle(infoElement).display;
});

let timerInterval;
let isPaused = true;
let remainingTime = 0;
let isFinished = false;
let alarmStopped = false;

interact(".draggable").draggable({
  inertia: true,
  modifiers: [
    interact.modifiers.restrictRect({
      endOnly: true,
    }),
  ],
  autoScroll: true,
  listeners: {
    move: function(event) {
      var target = event.target;
      var x =
        (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
      var y =
        (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
      target.style.transform = "translate(" + x + "px, " + y + "px)";
      target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);
    },
  },
});

function startTimer() {
  if (isPaused) {
    let hours = parseInt(document.getElementById("hourTimer").textContent);
    let minutes = parseInt(document.getElementById("minuteTimer").textContent);
    let seconds = parseInt(document.getElementById("secondTimer").textContent);
    remainingTime = hours * 3600 + minutes * 60 + seconds;
    if (remainingTime <= 0) {
      document.getElementById("timerDisplay").classList.add("shake");
      setTimeout(() => {
        document.getElementById("timerDisplay").classList.remove("shake");
      }, 400);
      return;
    }
    updateTimerDisplay();
    timerInterval = setInterval(updateTimer, 1000);
    isPaused = false;
    toggleTimerButton();
  }
  document.getElementById("hourTimer").removeAttribute("contenteditable");
  document.getElementById("minuteTimer").removeAttribute("contenteditable");
  document.getElementById("secondTimer").removeAttribute("contenteditable");
}

function pauseTimer() {
  if (!isPaused) {
    isPaused = true;
    clearInterval(timerInterval);
    toggleTimerButton();
  }
  document.getElementById("hourTimer").setAttribute("contenteditable", "true");
  document.getElementById("minuteTimer").setAttribute("contenteditable", "true");
  document.getElementById("secondTimer").setAttribute("contenteditable", "true");
}

function toggleTimerButton() {
  document.getElementById("startButton").classList.toggle("hidden");
  document.getElementById("pauseButton").classList.toggle("hidden");
}

function updateTimer() {
  if (isPaused) return;
  remainingTime--;
  if (remainingTime < 0) {
    clearInterval(timerInterval);
    finishTimer();
    return;
  }
  updateTimerDisplay();
}

function finishTimer() {
  isFinished = true;
  alarmStopped = false;
  pauseTimer();
  finishInterval = setInterval(flash, 250);
  document.getElementById("startButton").classList.toggle("hidden");
  document.getElementById("stopAlarmButton").classList.toggle("hidden");
  document.getElementById("hintTimer").classList.toggle("hidden");
}

function flash() {
  document.getElementById("timerDisplay").classList.toggle("timerFinishedColor");
  document.getElementById("timerPanel").classList.toggle("timerFinishedBorder");
  document.getElementById("body").classList.toggle("timerFinishedBody");
  document.getElementById("timerPanel").classList.toggle("timerPanel");
  const audioContext = new(window.AudioContext ||
    window.webkitAudioContext)();
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.2;
  const oscillator = audioContext.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
  oscillator.connect(gainNode).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
}

function stopTimerAlarm() {
  alarmStopped = true;
  isFinished = false;
  clearInterval(finishInterval);
  const timerDisplay = document.getElementById("timerDisplay");
  const timerPanel = document.getElementById("timerPanel");
  const body = document.getElementById("body");
  if (timerDisplay.classList.contains("timerFinishedColor")) {
    timerDisplay.classList.remove("timerFinishedColor");
    timerPanel.classList.remove("timerFinishedBorder");
    body.classList.remove("timerFinishedBody");
    timerPanel.classList.add("timerPanel");
  }
  document.getElementById("startButton").classList.toggle("hidden");
}

function updateTimerDisplay() {
  let hours = Math.floor(remainingTime / 3600);
  let minutes = Math.floor((remainingTime % 3600) / 60);
  let seconds = remainingTime % 60;
  document.getElementById("hourTimer").textContent = hours
    .toString()
    .padStart(2, "0");
  document.getElementById("minuteTimer").textContent = minutes
    .toString()
    .padStart(2, "0");
  document.getElementById("secondTimer").textContent = seconds
    .toString()
    .padStart(2, "0");
}
const timers = document.querySelectorAll("[contenteditable=true]");
timers.forEach((timer) => {
  timer.addEventListener("input", function() {
    let value = this.textContent.trim();
    if (!isNaN(value)) {
      value = value.slice(0, 2);
      this.textContent = value.padStart(2, "0");
    } else {
      this.textContent = "00";
    }
  });
});
document.addEventListener("click", function() {
  if (isFinished) {
    stopTimerAlarm();
  }
});

document.getElementById("toggleButton").addEventListener("click", function() {
  let panel = document.getElementById("modifyContainer");
  panel.classList.toggle("hidden");
  let button = document.getElementById("toggleButton");
  button.classList.toggle("selected-bottom");
});
document.getElementById("closeEdit").addEventListener("click", function() {
  let panel = document.getElementById("modifyContainer");
  panel.classList.toggle("hidden");
  let button = document.getElementById("toggleButton");
  button.classList.remove("selected-bottom");
});

document.getElementById("showTimerButton").addEventListener("click", function() {
  let panel = document.getElementById("timerPanel");
  panel.classList.toggle("hidden");
  let button = document.getElementById("showTimerButton");
  button.classList.toggle("selected-bottom");
});

function updateAndCallAgain() {
  var selectedValue = document.getElementById("updateFrequencies").value;
  showclock();
  setTimeout(updateAndCallAgain, selectedValue);
  checkTimerType();
}

window.onload = function () {
  StorageManager.init();
  regenerateScheduleButtons();
  loadPreferences();

  const lastUsedSchedule = StorageManager.getPreference('lastUsedSchedule');
  if (lastUsedSchedule && lastUsedSchedule !== 'auto') {
    const allSchedules = StorageManager.getAllSchedules();
    if (allSchedules[lastUsedSchedule]) {
      loadSchedule(lastUsedSchedule);
    } else {
      NormalSchedule();
    }
  } else {
    NormalSchedule();
  }

  updateAndCallAgain();
  

  if (!lastUsedSchedule || lastUsedSchedule === 'auto') AutoSchedule();
  
  const link = document.getElementById("schoolSchedule");
  const urls = getSchoolScheduleLink();

  link.href = urls.main;
  if (urls.fallback) {
    link.title = `If schedule isn't posted yet, try: ${urls.fallback}`;
  }

};
function getSchoolScheduleLink() {
    const now = new Date();
    let year = now.getFullYear() % 100;
    let schoolYear;

  if (now.getMonth() > 5 || (now.getMonth() === 5 && now.getDate() >= 15)) {
    schoolYear = `${year}-${(year + 1).toString().padStart(2,'0')}`;
  } else {
    schoolYear = `${(year - 1).toString().padStart(2,'0')}-${year.toString().padStart(2,'0')}`;
  }

  const mainLink = `https://bellflowerhigh.org/${schoolYear}schedulescalendars`;

  let fallbackLink = null;
  if (now.getMonth() === 5 || now.getMonth() === 6) {
    const fallbackYear = `${(year - 1).toString().padStart(2,'0')}-${year.toString().padStart(2,'0')}`;
    fallbackLink = `https://bellflowerhigh.org/${fallbackYear}schedulescalendars`;
  }

  return { main: mainLink, fallback: fallbackLink };
}

document.getElementById("updateFrequencies").addEventListener("change", function() {
  var selectedValue = this.value;
  updateAndCallAgain();
  savePreferenceToStorage('updateFrequency', selectedValue);
});

function checkTimerType() {
  var timerType = document.getElementById("timer_type").textContent;
  if (timerType === "Loading...") {
    NormalSchedule();
  }
}

let timeAdjInput = document.querySelector("#timeadj");
timeAdjInput.addEventListener("wheel", function(event) {
  event.preventDefault();
  let currentVal = parseFloat(this.value) || 0;
  this.value = event.deltaY > 0 ? currentVal - 1 : currentVal + 1;
  timeadj();
});

let fastForwardInput = document.querySelector("#fastForward");
fastForwardInput.addEventListener("wheel", function(event) {
  event.preventDefault();
  if (event.deltaY > 0) {
    previousDay();
  } else {
    nextDay();
  }
});

function previousDay() {
  adjustseconds -= 86400;
  var inputBox = document.getElementById("timeadj");
  inputBox.value = adjustseconds;
  AutoSchedule();
  timeadj();
}

function nextDay() {
  adjustseconds += 86400;
  var inputBox = document.getElementById("timeadj");
  inputBox.value = adjustseconds;
  AutoSchedule();
  timeadj();
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

function timeadj() {
  const oldAdjustSeconds = adjustseconds;
  const inputValue = document.getElementById("timeadj").value.trim();
  const newAdjustSeconds = Number(inputValue);

  if (isNaN(newAdjustSeconds)) {
    ErrorTimeAdj();
  } else {
    adjustseconds = newAdjustSeconds;
    ValidTimeAdj();
  }

  evaluateMath();
  showclock();

  const currentTime = Date.now();
  const newDate = new Date(currentTime + adjustseconds * 1000);
  const oldDate = new Date(currentTime + oldAdjustSeconds * 1000);

  if (newDate.getDate() !== oldDate.getDate()) {
    AutoSchedule();
  }

  savePreferenceToStorage('timeAdjustment', adjustseconds);
}

function inputTimeAdj(input) {
  let oldAdjustSeconds = adjustseconds;
  adjustseconds = parseFloat(input);
  if (isNaN(adjustseconds)) {
    if (!isNaN(oldAdjustSeconds)) {
      adjustseconds = oldAdjustSeconds;
    } else {
      adjustseconds = 0;
    }
    ErrorTimeAdj();
  } else {
    ValidTimeAdj();
  }
  evaluateMath();
  showclock();
}

function evaluateMath() {
  const inputElement = document.getElementById("timeadj");
  const input = inputElement.value;
  const oldAdjustSeconds = adjustseconds;
  if (input === "") {
      adjustseconds = 0;
      formatMath(true, 0);
      secondsDisplay.textContent = "";
      resultDisplay.textContent = "";
      ValidTimeAdj();
      return;
  }

  let result;
  try {
    result = math.evaluate(input);
  } catch {
    adjustseconds = oldAdjustSeconds;
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

  const isIntegerInput = /^[0-9]+$/.test(input);

  if (!isNaN(result)) {
    if (!isIntegerInput) {
      formatMath(true, result);
    } else {
      adjustseconds = Number(input);
      if (Math.abs(adjustseconds) > 60) {
        formatMath(true, adjustseconds);
      } else {
        secondsDisplay.textContent = "";
        resultDisplay.textContent = "";
      }
    }
    adjustseconds = result;
    ValidTimeAdj();
  } else {
    formatMath(false);
    adjustseconds = oldAdjustSeconds;
  }
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

function adjustInputWidth(value) {
  var inputElement = document.getElementById("timeadj");
  var inputWidth = getTextWidth(value);
  inputElement.style.width = inputWidth + "px";
}

function getTextWidth(text) {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  context.font = getComputedStyle(document.body).fontSize + " Arial";
  var width = context.measureText(text).width;
  if (width < 30) width = 30;
  
  return width;
}

function formatTime(seconds) {
  let neg = seconds < 0;
  seconds = Math.abs(seconds) | 0;

  const units = [
    { label: "c", value: 3600 * 24 * 365 * 100 },
    { label: "y", value: 3600 * 24 * 365 },
    { label: "d", value: 3600 * 24 },
    { label: "h", value: 3600 },
    { label: "m", value: 60 },
    { label: "s", value: 1 }
  ];

  let str = neg ? "-" : "";
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    if (seconds >= unit.value) {
      const amt = (seconds / unit.value) | 0;
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

const predefinedColorSchemes = {
  gb: { text: "grey", background: "black", optionText: "black", optionBackground: "white" },
  wb: { text: "white", background: "black", optionText: "black", optionBackground: "white" },
  bw: { text: "black", background: "white", optionText: "black", optionBackground: "white" },
  dk: { text: "crimson", background: "black", optionText: "crimson", optionBackground: "black" },
  bg: { text: "#5077BE", background: "#D9FFB2", optionText: "#5077BE", optionBackground: "#D9FFB2" },
  py: { text: "#B44DE0", background: "#FFFF99", optionText: "#B44DE0", optionBackground: "#FFFF99" },
  sr: "random"
};

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

  savePreferenceToStorage("colorScheme", selected);
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

function formatDisplayedDate(date) {
  const parts = timePartsFromDate(date);
  return `${days[date.getDay()]} ${months[date.getMonth()]} ${padZero(date.getDate())} ${date.getFullYear()} ${parts.hh12Str}:${parts.mmStr}:${parts.ssStr} ${parts.meridiem}`;
}


function getCurrentSecondsFromDate(date) {
  return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
}

function formatScheduleTime(timeStr) {
  const hour24 = parseInt(timeStr.substring(0, 2), 10);
  const minutePart = timeStr.substring(2, 5);
  const meridiem = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return padZero(hour12) + minutePart + " " + meridiem;
}

function showclock() {
  const originalDate = new Date();
  const adjustedDate = new Date(originalDate.getTime() + (adjustseconds || 0) * 1000);

  const displayedDate = formatDisplayedDate(adjustedDate);
  const currentDateEl = document.getElementById("currentdate");
  if (currentDateEl) currentDateEl.innerHTML = displayedDate;

  const parts = timePartsFromDate(adjustedDate);
  if (random && parts.ss === 0 && !randomChange) {
    colorizerandom();
    randomChange = true;
  } else if (parts.ss !== 0) {
    randomChange = false;
  }

  const currentSeconds = getCurrentSecondsFromDate(adjustedDate);

  if (typeof starts === "undefined" || !Array.isArray(starts) || starts.length === 0) {
    const scheduleEl = document.getElementById("scheduledisplay");
    if (scheduleEl) scheduleEl.innerHTML = "No school today!";
    delete window.d;
    return;
  }

  const periodIndex = starts.length - 1;
  let currentPeriod = -1;

  const currentPeriodSubtitleEl = document.getElementById("currentperiodsubtitle");
  const currentScheduleEl = document.getElementById("currentschedule");
  const endOfScheduleSubtitleEl = document.getElementById("endofschedulesubtitle");
  const currentDurationEl = document.getElementById("currentduration");
  const currentLengthEl = document.getElementById("currentlengthofperiod");
  const nextPeriodSubtitleEl = document.getElementById("nextperiodsubtitle");
  const nextScheduleEl = document.getElementById("nextschedule");
  const nextDurationEl = document.getElementById("nextduration");

  if (currentPeriodSubtitleEl) currentPeriodSubtitleEl.innerHTML = "";
  if (currentScheduleEl) currentScheduleEl.innerHTML = "";
  if (endOfScheduleSubtitleEl) endOfScheduleSubtitleEl.innerHTML = "";
  if (currentDurationEl) currentDurationEl.innerHTML = "";
  if (currentLengthEl) currentLengthEl.innerHTML = "";
  if (nextPeriodSubtitleEl) nextPeriodSubtitleEl.innerHTML = "";
  if (nextScheduleEl) nextScheduleEl.innerHTML = "";
  if (nextDurationEl) nextDurationEl.innerHTML = "";

  if (currentSeconds < starts[0]) {
    if (currentPeriodSubtitleEl) currentPeriodSubtitleEl.innerHTML = "Countdown to";
    if (currentScheduleEl) currentScheduleEl.innerHTML = names[0];
    if (endOfScheduleSubtitleEl) endOfScheduleSubtitleEl.innerHTML = "";
    if (currentDurationEl) currentDurationEl.innerHTML = formatDisplayTimer(Math.abs(currentSeconds - starts[0]));
  }
  else if (currentSeconds > starts[periodIndex]) {
    if (currentPeriodSubtitleEl) currentPeriodSubtitleEl.innerHTML = "";
    if (currentScheduleEl) currentScheduleEl.innerHTML = names[periodIndex];
    if (currentLengthEl) currentLengthEl.innerHTML = "";
    if (endOfScheduleSubtitleEl) endOfScheduleSubtitleEl.innerHTML = "Time elapsed since end of schedule";
    if (currentDurationEl) currentDurationEl.innerHTML = formatDisplayTimer(currentSeconds - starts[periodIndex]);
  }
  else {
    for (let x = 0; x < periodIndex; x++) {
      if (starts[x] < currentSeconds && starts[x + 1] > currentSeconds) {
        currentPeriod = x;
        if (currentPeriodSubtitleEl) {
          let elapsed = currentSeconds - starts[x];
          let elapsedStr = formatDisplayTimer(elapsed);
          if (elapsed < 60) {
            elapsedStr += " seconds";
          }
          document.getElementById("currentperiodsubtitle").innerHTML =
            "We are now " + elapsedStr + " into:";

        }
        if (currentScheduleEl) currentScheduleEl.innerHTML = names[x];
        if (endOfScheduleSubtitleEl) endOfScheduleSubtitleEl.innerHTML = "";
        if (currentDurationEl) currentDurationEl.innerHTML = "";
        if (nextScheduleEl) nextScheduleEl.innerHTML = `<strong>${names[x + 1]}</strong> starts in:`;
        if (nextDurationEl) nextDurationEl.innerHTML = formatDisplayTimer(Math.abs(currentSeconds - starts[x + 1]));
        if (currentLengthEl) currentLengthEl.innerHTML = "";
        break;
      }
    }
  }

  const scheduleEl = document.getElementById("scheduledisplay");
  if (scheduleEl) {
    let scheduleDisplay = "No school today!";

    if (Array.isArray(times) && times.length > 0) {
      const lines = [];
      lines.push(`
        <div style="margin-top:30px; display:block; width:100%; text-align:center">
          <div style="display:inline-block; margin-left:auto; margin-right:auto; text-align:left; width:auto">
            Today's Schedule:<br />
      `);

      times.slice(0, periodIndex).forEach((startTimeRaw, x) => {
        const endTimeRaw = times[x + 1] || "";
        const startLabel = formatScheduleTime(startTimeRaw);
        const endLabel = formatScheduleTime(endTimeRaw);
        const periodLine = `${startLabel} - ${endLabel} ${names[x]}<br />`;

        if (x === currentPeriod) {
          lines.push(`<strong>${periodLine}</strong>`);
          if (currentLengthEl) currentLengthEl.innerHTML = `${startLabel} - ${endLabel}`;
        } else {
          lines.push(periodLine);
        }
      });

      lines.push("</div></div>");
      scheduleDisplay = lines.join("");
    }

    scheduleEl.innerHTML = scheduleDisplay;
  }


  delete window.d;
}

function padZero(n) {
  return n < 10 ? "0" + n : n;
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

/*
  0 = normal
  1 = late
  2 = minimum / finals
  3 = rally day
  4 = anchor day
  5 = extended snack schedule
  */
function AutoSchedule() {
  const currentDate = getAdjustedDate();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const currentWeekDay = currentDate.getDay();
  if (currentYear == 2024 && currentMonth <= 6) {
    let scheduleType = getScheduleType(
      currentMonth,
      currentDay,
      currentWeekDay,
      currentYear
    );
    handleScheduleType(scheduleType);
    let result = "";
    let isEvenSchedule = isEvenScheduleDay(currentMonth, currentDay);
    if (isEvenSchedule !== isEven) {
      ToggleScheduleOddEven();
    }
    const tomorrowDate = getTomorrow();
    const tomorrowDay = tomorrowDate.getDate();
    const tomorrowMonth = tomorrowDate.getMonth() + 1;
    const tomorrowYear = tomorrowDate.getFullYear();
    const tomorrowWeekDay = tomorrowDate.getDay();
    scheduleType = getScheduleType(
      tomorrowMonth,
      tomorrowDay,
      tomorrowWeekDay,
      tomorrowYear
    );
    isEvenSchedule = isEvenScheduleDay(tomorrowMonth, tomorrowDay);
    if (scheduleType != "No School") {
      if (isEvenSchedule) {
        result += "Even ";
      } else {
        result += "Odd ";
      }
      result += scheduleType + " Schedule";
    } else {
      result += scheduleType;
    }
    document.getElementById("tomorrowScheduleTitle").classList.remove("hidden");
    document.getElementById("tomorrowScheduleDisplay").classList.remove("hidden");
    document.getElementById("tomorrowScheduleDisplay").innerHTML = result;
    var button = document.querySelector("#auto-schedule");
    button.classList.add("selected-state");
  } else {
    document.getElementById("tomorrowScheduleTitle").classList.add("hidden");
    document.getElementById("tomorrowScheduleDisplay").classList.add("hidden");
  }
}

function removeElementById(id) {
  var element = document.getElementById(id);
  if (element) {
    element.parentNode.removeChild(element);
  }
}

function clearElementContentById(id) {
  var element = document.getElementById(id);
  if (element) {
    element.innerHTML = "";
  }
}

function getAdjustedDate() {
  const og = new Date();
  return new Date(og.getTime() + adjustseconds * 1000);
}

function getTomorrow() {
  const og = new Date();
  return new Date(og.getTime() + (adjustseconds + 86400) * 1000);
}
/* AUTO SCHEDULE, FIXED FOR 2024 2025
const scheduleList = {
  1: {
    late: [22, 29],
    noSchool: [1, 2, 3, 4, 5, 8, 15],
  },
  2: {
    late: [5, 12, 26],
    noSchool: [16, 19],
    rally: [29],
  },
  3: {
    late: [4, 11, 18, 25],
    noSchool: [8, 15, 29],
  },
  4: {
    late: [8, 15, 22, 29],
    noSchool: [1, 2, 3, 4, 5],
    testing: [16, 17, 18, 23, 24, 25],
  },
  5: {
    late: [6, 13, 20],
    noSchool: [3, 24, 27],
  },
  6: {
    final: [3, 4],
    extended: [5],
  },
};

function getScheduleType(
  currentMonth,
  currentDay,
  currentWeekDay,
  currentYear
) {
  const schedule = scheduleList;
  const dayOfWeek = new Date().getDay();
  if (
    (currentWeekDay === 0 || currentWeekDay === 6) &&
    !isNaN(currentYear) &&
    !isNaN(currentWeekDay)
  ) {
    return "No School";
  }
  if (currentYear == 2024 && currentMonth <= 6) {
    if (schedule[currentMonth]?.late?.includes(currentDay)) {
      return "Late";
    }
    if (schedule[currentMonth]?.rally?.includes(currentDay)) {
      return "Rally";
    }
    if (schedule[currentMonth]?.final?.includes(currentDay)) {
      return "Finals";
    }
    if (schedule[currentMonth]?.extended?.includes(currentDay)) {
      return "Extended Snack";
    }
    if (schedule[currentMonth]?.anchor?.includes(currentDay)) {
      return "Anchor";
    }
    if (schedule[currentMonth]?.noSchool?.includes(currentDay)) {
      return "No School";
    }
    if (schedule[currentMonth]?.testing?.includes(currentDay)) {
      return "Testing";
    }
  }
  return "Normal";
}

function handleScheduleType(scheduleType) {
  const allSchedules = StorageManager.getAllSchedules();
  if (allSchedules[scheduleType]) {
    loadSchedule(scheduleType);
    return;
  }
  switch (scheduleType) {
    case "Late":
      LateSchedule();
      break;
    case "Finals":
      MinimumSchedule();
      break;
    case "Extended Snack":
      ExtendedSnackSchedule();
      UpdateSpecialDropDown();
      break;
    case "No School":
      noSchool();
      break;
    case "Rally":
      RallySchedule();
      UpdateSpecialDropDown();
      break;
    case "Anchor":
      AnchorSchedule();
      UpdateSpecialDropDown();
      break;
    case "Testing":
      TestingSchedule();
      UpdateSpecialDropDown();
      break;
    default:
      NormalSchedule();
  }
}

function isEvenScheduleDay(currentMonth, currentDay) {
  const evenScheduleDates = {
    1: [22, 24, 26, 30],
    2: [1, 5, 7, 9, 13, 15, 21, 23, 27, 29],
    3: [4, 6, 11, 13, 18, 20, 22, 26, 28],
    4: [9, 11, 15, 17, 19, 23, 25, 29],
    5: [1, 6, 8, 10, 14, 16, 20, 22, 28, 30],
    6: [4],
  };
  return evenScheduleDates[currentMonth]?.includes(currentDay);
}

function UpdateSpecialDropDown() {
  var dropdownMenu = document.getElementById("special-schedule");
  let internal = schedule;
  switch (internal) {
    case 3:
      dropdownMenu.selectedIndex = 2;
      break;
    case 4:
      dropdownMenu.selectedIndex = 1;
      break;
    case 5:
      dropdownMenu.selectedIndex = 3;
      break;
    case 7:
      dropdownMenu.selectedIndex = 4;
      break;
    default:
      dropdownMenu.selectedIndex = 0;
  }
  HandleSpecialScheduleChange();
}
*/
function noSchool() {
  loadSchedule('noSchool');
}

function clearAll() {
  let divIds = [
    "timer_type",
    "subtitle",
    "currentdate",
    "currentperiodsubtitle",
    "currentschedule",
    "currentlengthofperiod",
    "endofschedulesubtitle",
    "currentduration",
    "nextperiodsubtitle",
    "nextschedule",
    "nextduration",
  ];

  divIds.forEach(function(id) {
    let div = document.getElementById(id);
    if (div) {
      div.innerHTML = "";
    }
  });
}

function NormalSchedule() {
  schedule = 0;
  loadSchedule('normal');
}

function clearSelectedStateButtons() {
  var buttons = document.querySelectorAll(".schedule-button");
  buttons.forEach(function(button) {
    button.classList.remove("selected-state");
  });
}

function LateSchedule() {
  schedule = 1;
  loadSchedule('late');
}

function MinimumSchedule() {
  schedule = 2;
  loadSchedule('minimum');
}

function AnchorSchedule() {
  schedule = 4;
  loadSchedule('anchor');
}

function updateStarts() {
  starts = times.map((time) => {
    let [hours, minutes] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60;
  });
}

function RallySchedule() {
  schedule = 3;
  loadSchedule('rally');
}

function ExtendedSnackSchedule() {
  schedule = 5;
  loadSchedule('extendedSnack');
}

function TestingSchedule() {
  schedule = 7;
  loadSchedule('testing');
}

function ToggleScheduleOddEven() {
  isEven = !isEven;

  if (currentScheduleId && scheduleTemplates[currentScheduleId]) {
    loadSchedule(currentScheduleId);
  }

  var button = document.getElementById("odd-even-toggle");
  if (isEven) {
    button.classList.remove("normal-state");
    button.classList.add("toggled-state");
  } else {
    button.classList.remove("toggled-state");
    button.classList.add("normal-state");
  }
}

function HandleSpecialScheduleChange() {
  var selectedOption = document.getElementById("special-schedule").value;

  const allSchedules = StorageManager.getAllSchedules();
  if (allSchedules[selectedOption]) {
    loadSchedule(selectedOption);
    return;
  }

  switch (selectedOption) {
    case "anchorSchedule":
      loadSchedule('anchor');
      break;
    case "rallySchedule":
      loadSchedule('rally');
      break;
    case "ExtendedSnackSchedule":
      loadSchedule('extendedSnack');
      break;
    case "TestingSchedule":
      loadSchedule('testing');
      break;
    default:
      loadSchedule('normal');
      break;
  }
}

function updateSpecialScheduleDropdown() {
  var dropdown = document.getElementById("special-schedule");
  var selectedIndex = dropdown.selectedIndex;
  if (selectedIndex !== 0) {
    dropdown.classList.add("special-schedule-select");
    dropdown.style.backgroundColor = "grey";
  } else {
    dropdown.classList.remove("special-schedule-select");
    dropdown.style.backgroundColor = "";
  }
}

function updateOddEvenToggleButton() {
  var oddEvenButton = document.getElementById("odd-even-toggle");
  oddEvenButton.disabled = !(currentScheduleData && currentScheduleData.canToggleOddEven);
}



function clearSelectedStateButtons() {
  var buttons = document.querySelectorAll(".selected-state");
  buttons.forEach(function(button) {
    button.classList.remove("selected-state");
  });
}

function handleSpecialScheduleSelection() {
  var selectedOption = document.getElementById("special-schedule").value;
  switch (selectedOption) {
    case "Nothing":
      NormalSchedule();
      ClearSubtitle();
      break;
    case "anchorSchedule":
      AnchorSchedule();
      ClearSubtitle();
      break;
    case "rallySchedule":
      RallySchedule();
      ClearSubtitle();
      break;
    case "ExtendedSnackSchedule":
      ExtendedSnackSchedule();
      break;
    case "TestingSchedule":
      TestingSchedule();
      break;
    case "MinimumSchedule":
    default:
      break;
  }
}

function ClearSubtitle() {
  document.getElementById("subtitle").innerHTML = "";
}