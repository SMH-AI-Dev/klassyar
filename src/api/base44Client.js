// Mock Base44 Client - Replace with actual implementation when backend is ready
// This is a simulation of the Base44 SDK

const STORAGE_KEY = 'klassyar_data';

// Get data from localStorage
const getData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { activities: [], classes: [], results: [], user: null };
  } catch {
    return { activities: [], classes: [], results: [], user: null };
  }
};

// Save data to localStorage
const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Mock Base44 Client
export const base44 = {
  auth: {
    me: async () => {
      const data = getData();
      if (!data.user) {
        // Create a default user if none exists
        const user = {
          id: generateId(),
          email: 'demo@klassyar.com',
          name: 'کاربر آزمایشی',
          created_date: new Date().toISOString(),
        };
        data.user = user;
        saveData(data);
        return user;
      }
      return data.user;
    },
    signIn: async (email, password) => {
      const user = {
        id: generateId(),
        email,
        name: 'کاربر جدید',
        created_date: new Date().toISOString(),
      };
      const data = getData();
      data.user = user;
      saveData(data);
      return user;
    },
    signOut: async () => {
      const data = getData();
      data.user = null;
      saveData(data);
    },
  },
  entities: {
    Activity: {
      list: async (sortField = '-created_date', limit = 1000) => {
        const data = getData();
        return data.activities || [];
      },
      filter: async (filters, sortField = '-created_date') => {
        const data = getData();
        const activities = data.activities || [];
        return activities.filter(activity => {
          for (let key in filters) {
            if (activity[key] !== filters[key]) {
              return false;
            }
          }
          return true;
        });
      },
      get: async (id) => {
        const data = getData();
        const activity = data.activities.find(a => a.id === id);
        if (!activity) {
          throw new Error('Activity not found');
        }
        return activity;
      },
      create: async (activityData) => {
        const data = getData();
        const activity = {
          ...activityData,
          id: generateId(),
          created_date: new Date().toISOString(),
          created_by: data.user?.email || 'demo@klassyar.com',
          plays_count: 0,
        };
        data.activities.push(activity);
        saveData(data);
        return activity;
      },
      update: async (id, updates) => {
        const data = getData();
        const index = data.activities.findIndex(a => a.id === id);
        if (index !== -1) {
          data.activities[index] = { ...data.activities[index], ...updates };
          saveData(data);
          return data.activities[index];
        }
        throw new Error('Activity not found');
      },
      delete: async (id) => {
        const data = getData();
        data.activities = data.activities.filter(a => a.id !== id);
        saveData(data);
      },
    },
    Class: {
      list: async (sortField = '-created_date', limit = 1000) => {
        const data = getData();
        return data.classes || [];
      },
      filter: async (filters, sortField = '-created_date') => {
        const data = getData();
        const classes = data.classes || [];
        return classes.filter(cls => {
          for (let key in filters) {
            if (cls[key] !== filters[key]) {
              return false;
            }
          }
          return true;
        });
      },
      create: async (classData) => {
        const data = getData();
        const cls = {
          ...classData,
          id: generateId(),
          created_date: new Date().toISOString(),
          students: classData.students || [],
        };
        data.classes.push(cls);
        saveData(data);
        return cls;
      },
      update: async (id, updates) => {
        const data = getData();
        const index = data.classes.findIndex(c => c.id === id);
        if (index !== -1) {
          data.classes[index] = { ...data.classes[index], ...updates };
          saveData(data);
          return data.classes[index];
        }
        throw new Error('Class not found');
      },
      delete: async (id) => {
        const data = getData();
        data.classes = data.classes.filter(c => c.id !== id);
        saveData(data);
      },
    },
    GameResult: {
      list: async (sortField = '-created_date', limit = 1000) => {
        const data = getData();
        return data.results || [];
      },
      filter: async (filters, sortField = '-created_date') => {
        const data = getData();
        const results = data.results || [];
        return results.filter(result => {
          for (let key in filters) {
            if (result[key] !== filters[key]) {
              return false;
            }
          }
          return true;
        });
      },
      create: async (resultData) => {
        const data = getData();
        const result = {
          ...resultData,
          id: generateId(),
          created_date: new Date().toISOString(),
          created_by: data.user?.email || 'demo@klassyar.com',
        };
        data.results.push(result);
        saveData(data);
        return result;
      },
    },
  },
};
