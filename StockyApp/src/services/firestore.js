import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'

// --- User profile -----------------------------------------------------

export async function getUserProfile(userId) {
  const snap = await getDoc(doc(db, 'users', userId))
  return snap.exists() ? snap.data() : null
}

export function saveUserProfile(userId, profile) {
  return setDoc(
    doc(db, 'users', userId),
    { ...profile, updatedAt: serverTimestamp() },
    { merge: true },
  )
}

export function createUserProfile(userId, profile) {
  return setDoc(doc(db, 'users', userId), { ...profile, createdAt: serverTimestamp() })
}

// --- Food library -------------------------------------------------------

export async function listFoodItems(userId) {
  const q = query(collection(db, 'users', userId, 'foodItems'), orderBy('name'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export function createFoodItem(userId, item) {
  return addDoc(collection(db, 'users', userId, 'foodItems'), {
    ...item,
    createdAt: serverTimestamp(),
  })
}

export function updateFoodItem(userId, foodItemId, item) {
  return updateDoc(doc(db, 'users', userId, 'foodItems', foodItemId), item)
}

export function deleteFoodItem(userId, foodItemId) {
  return deleteDoc(doc(db, 'users', userId, 'foodItems', foodItemId))
}

// --- Daily log entries ---------------------------------------------------

export async function listLogEntries(userId, date) {
  const q = query(collection(db, 'users', userId, 'logs', date, 'entries'), orderBy('createdAt'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export function createLogEntry(userId, date, entry) {
  return addDoc(collection(db, 'users', userId, 'logs', date, 'entries'), {
    ...entry,
    createdAt: serverTimestamp(),
  })
}

export function updateLogEntry(userId, date, entryId, entry) {
  return updateDoc(doc(db, 'users', userId, 'logs', date, 'entries', entryId), entry)
}

export function deleteLogEntry(userId, date, entryId) {
  return deleteDoc(doc(db, 'users', userId, 'logs', date, 'entries', entryId))
}
