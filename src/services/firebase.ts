import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  query,
  where,
  Firestore, 
  Unsubscribe 
} from 'firebase/firestore';
import { TrackedAnimal } from '../types';

const LOCAL_STORAGE_KEY = 'barnyard_buddies_animals';
const PURGE_FLAG_KEY = 'barnyard_purged_fed_fresh_start_v2';
const COLLECTION_NAME = 'tracked_animals';

/**
 * 🔒 HARDCODED FIREBASE CONFIGURATION
 */
export const hardcodedFirebaseConfig = {
  apiKey: "AIzaSyBTSsEIQJ9oeR1bcVuvPXoottDOojZyLe8",
  authDomain: "barnyard-buddies-59a4a.firebaseapp.com",
  projectId: "barnyard-buddies-59a4a",
  storageBucket: "barnyard-buddies-59a4a.firebasestorage.app",
  messagingSenderId: "786231343615",
  appId: "1:786231343615:web:531eb5c1a31303e130cfca"
};

function getActiveFirebaseConfig() {
  if (hardcodedFirebaseConfig.apiKey && hardcodedFirebaseConfig.projectId) {
    return hardcodedFirebaseConfig;
  }
  return null;
}

// LocalStorage Helper functions
function getLocalAnimals(): TrackedAnimal[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed: TrackedAnimal[] = JSON.parse(raw);
      // Clean start: Remove any unlocked "fed" animals so user starts fresh
      if (Array.isArray(parsed)) {
        return parsed.filter(a => a.status !== 'fed');
      }
    }
  } catch (e) {
    console.error('Error reading localStorage animals', e);
  }
  return [];
}

function saveLocalAnimals(animals: TrackedAnimal[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(animals));
    window.dispatchEvent(new CustomEvent('barnyard_local_sync', { detail: animals }));
  } catch (e) {
    console.error('Error writing to localStorage', e);
  }
}

// Global Firebase instance state
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
const activeConfig = getActiveFirebaseConfig();

if (activeConfig) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(activeConfig);
    db = getFirestore(app);
  } catch (err) {
    console.warn('Could not initialize Firebase Firestore with hardcoded credentials.', err);
    db = null;
  }
}

export function isFirestoreActive(): boolean {
  return db !== null;
}

// Function to clear all full tummies (fed status) in Firestore & local
export async function clearAllFedAnimals(): Promise<void> {
  if (db) {
    try {
      const q = query(collection(db, COLLECTION_NAME), where('status', '==', 'fed'));
      const snapshot = await getDocs(q);
      snapshot.forEach(async (d) => {
        await deleteDoc(d.ref);
      });
    } catch (e) {
      console.warn('Error clearing fed animals in firestore', e);
    }
  }
  const local = getLocalAnimals().filter(a => a.status !== 'fed');
  saveLocalAnimals(local);
}

// Real-time synchronization subscription
export function subscribeToTrackedAnimals(
  onUpdate: (animals: TrackedAnimal[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  // One-time auto purge of old unlocked full tummies if requested
  const hasPurged = localStorage.getItem(PURGE_FLAG_KEY);
  if (!hasPurged) {
    clearAllFedAnimals();
    localStorage.setItem(PURGE_FLAG_KEY, 'true');
  }

  // If Firestore is available, bind onSnapshot
  if (db) {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          if (snapshot.empty) {
            onUpdate([]);
          } else {
            const list: TrackedAnimal[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as TrackedAnimal;
              list.push(data);
            });
            list.sort((a, b) => {
              if (a.status === 'pending' && b.status !== 'pending') return -1;
              if (a.status !== 'pending' && b.status === 'pending') return 1;
              if (a.fedAt && b.fedAt) return new Date(b.fedAt).getTime() - new Date(a.fedAt).getTime();
              return 0;
            });
            onUpdate(list);
          }
        },
        (error) => {
          console.warn('Firestore subscription error, reverting to local data:', error);
          if (onError) onError(error);
          onUpdate(getLocalAnimals());
        }
      );
      return unsubscribe;
    } catch (e) {
      console.warn('Error starting Firestore listener, falling back to local:', e);
    }
  }

  // Fallback: LocalStorage event listener
  const emitLocal = () => {
    const list = getLocalAnimals();
    onUpdate(list);
  };

  const handleCustomSync = (e: Event) => {
    const customEvent = e as CustomEvent<TrackedAnimal[]>;
    if (customEvent.detail) {
      onUpdate(customEvent.detail);
    } else {
      emitLocal();
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_KEY) {
      emitLocal();
    }
  };

  window.addEventListener('barnyard_local_sync', handleCustomSync);
  window.addEventListener('storage', handleStorageEvent);

  emitLocal();

  return () => {
    window.removeEventListener('barnyard_local_sync', handleCustomSync);
    window.removeEventListener('storage', handleStorageEvent);
  };
}

// Add Animal (to wishlist)
export async function addTrackedAnimal(animal: TrackedAnimal): Promise<void> {
  if (db) {
    try {
      await setDoc(doc(db, COLLECTION_NAME, animal.id), animal);
      return;
    } catch (err) {
      console.warn('Firestore write failed, writing locally instead', err);
    }
  }
  const list = getLocalAnimals();
  const updated = [animal, ...list];
  saveLocalAnimals(updated);
}

// Update Animal (e.g. Wishlist item -> Full Tummy fed/pet)
export async function updateTrackedAnimal(id: string, updates: Partial<TrackedAnimal>): Promise<void> {
  if (db) {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), updates);
      return;
    } catch (err) {
      console.warn('Firestore update failed, updating locally instead', err);
    }
  }
  const list = getLocalAnimals();
  const updated = list.map((a) => (a.id === id ? { ...a, ...updates } : a));
  saveLocalAnimals(updated);
}

// Delete Animal
export async function deleteTrackedAnimal(id: string): Promise<void> {
  if (db) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return;
    } catch (err) {
      console.warn('Firestore delete failed, deleting locally instead', err);
    }
  }
  const list = getLocalAnimals();
  const updated = list.filter((a) => a.id !== id);
  saveLocalAnimals(updated);
}
