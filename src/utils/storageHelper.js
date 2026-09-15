// Robust storage helper using IndexedDB with fallback to localStorage
// This prevents QuotaExceededError when saving large audio files and images.

const DB_NAME = 'DormePreciosoDB';
const DB_VERSION = 1;
const STORE_NAME = 'appData';

function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = () => resolve(null);
  });
}

export async function idbGet(key, defaultVal) {
  try {
    const db = await openDB();
    if (!db) {
      const local = localStorage.getItem(key);
      return local ? JSON.parse(local) : defaultVal;
    }
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        if (req.result !== undefined && req.result !== null) {
          resolve(req.result);
        } else {
          // Check localStorage as fallback
          try {
            const local = localStorage.getItem(key);
            resolve(local ? JSON.parse(local) : defaultVal);
          } catch {
            resolve(defaultVal);
          }
        }
      };
      req.onerror = () => resolve(defaultVal);
    });
  } catch (err) {
    console.warn("Storage read error, using default", err);
    return defaultVal;
  }
}

export async function idbSet(key, value) {
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(value, key);
    }
    // Also try saving to localStorage if small, safely ignoring QuotaExceededError
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Ignored: Data is safely stored in IndexedDB!
    }
  } catch (err) {
    console.warn("Storage write warning:", err);
  }
}

export async function idbRemove(key) {
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(key);
    }
    localStorage.removeItem(key);
  } catch (err) {
    console.warn("Storage remove warning:", err);
  }
}
