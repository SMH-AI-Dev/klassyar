// سیستم ذخیره‌سازی هیبریدی: SQLite + LocalStorage

class StorageManager {
  constructor() {
    this.useSQL = false; // در مرورگر از LocalStorage استفاده می‌کنیم
    this.dbName = 'klassyar_db';
    this.version = 1;
  }

  // Initialize storage
  async init() {
    try {
      // Check if IndexedDB is available
      if (typeof indexedDB !== 'undefined') {
        await this.initIndexedDB();
      }
    } catch (error) {
      console.warn('IndexedDB not available, using localStorage', error);
    }
  }

  // IndexedDB initialization
  async initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores
        if (!db.objectStoreNames.contains('activities')) {
          const activityStore = db.createObjectStore('activities', { keyPath: 'id', autoIncrement: true });
          activityStore.createIndex('type', 'type', { unique: false });
          activityStore.createIndex('created_date', 'created_date', { unique: false });
        }

        if (!db.objectStoreNames.contains('classes')) {
          db.createObjectStore('classes', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('results')) {
          const resultStore = db.createObjectStore('results', { keyPath: 'id', autoIncrement: true });
          resultStore.createIndex('activity_id', 'activity_id', { unique: false });
        }
      };
    });
  }

  // Save to storage
  async save(storeName, data) {
    // Fallback to localStorage
    const key = `${storeName}_${data.id || Date.now()}`;
    const allData = this.getAll(storeName);
    
    if (data.id) {
      // Update existing
      const index = allData.findIndex(item => item.id === data.id);
      if (index !== -1) {
        allData[index] = { ...allData[index], ...data };
      } else {
        allData.push({ ...data, id: data.id });
      }
    } else {
      // Create new
      data.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      allData.push(data);
    }

    localStorage.setItem(storeName, JSON.stringify(allData));
    return data;
  }

  // Get all records
  getAll(storeName) {
    try {
      const data = localStorage.getItem(storeName);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  // Get by ID
  getById(storeName, id) {
    const allData = this.getAll(storeName);
    return allData.find(item => item.id === id);
  }

  // Delete record
  delete(storeName, id) {
    const allData = this.getAll(storeName);
    const filtered = allData.filter(item => item.id !== id);
    localStorage.setItem(storeName, JSON.stringify(filtered));
    return true;
  }

  // Clear all data
  clearAll() {
    localStorage.clear();
  }

  // Export data as JSON
  exportData() {
    const data = {
      activities: this.getAll('activities'),
      classes: this.getAll('classes'),
      results: this.getAll('results'),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  // Import data from JSON
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.activities) {
        localStorage.setItem('activities', JSON.stringify(data.activities));
      }
      if (data.classes) {
        localStorage.setItem('classes', JSON.stringify(data.classes));
      }
      if (data.results) {
        localStorage.setItem('results', JSON.stringify(data.results));
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Get statistics
  getStats() {
    return {
      activities: this.getAll('activities').length,
      classes: this.getAll('classes').length,
      results: this.getAll('results').length,
      totalSize: this.getTotalSize()
    };
  }

  // Calculate total storage size
  getTotalSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return (total / 1024).toFixed(2) + ' KB';
  }
}

// Create singleton instance
const storage = new StorageManager();

// Initialize storage
storage.init().catch(console.error);

export default storage;
