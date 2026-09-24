import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { createFoodItem, deleteFoodItem, listFoodItems, updateFoodItem } from '@/services/firestore'

const items = ref([])
const loaded = ref(false)

export function useFoodLibrary() {
  const { user } = useAuth()

  async function loadFoodItems() {
    items.value = await listFoodItems(user.value.uid)
    loaded.value = true
  }

  async function addFoodItem(item) {
    const docRef = await createFoodItem(user.value.uid, item)
    items.value.push({ id: docRef.id, ...item })
    items.value.sort((a, b) => a.name.localeCompare(b.name))
    return docRef.id
  }

  async function editFoodItem(foodItemId, item) {
    await updateFoodItem(user.value.uid, foodItemId, item)
    const index = items.value.findIndex((i) => i.id === foodItemId)
    if (index !== -1) items.value[index] = { ...items.value[index], ...item }
  }

  async function removeFoodItem(foodItemId) {
    await deleteFoodItem(user.value.uid, foodItemId)
    items.value = items.value.filter((i) => i.id !== foodItemId)
  }

  return { items, loaded, loadFoodItems, addFoodItem, editFoodItem, removeFoodItem }
}
