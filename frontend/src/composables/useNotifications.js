import { ref, reactive } from 'vue'

const notifications = ref([])
let notificationId = 0

export function useNotifications() {
  const addNotification = (notification) => {
    const id = ++notificationId
    const newNotification = {
      id,
      type: 'info',
      title: '',
      message: '',
      duration: 5000,
      autoClose: true,
      ...notification,
      timestamp: new Date()
    }
    
    notifications.value.push(newNotification)
    
    // Auto-remove notification after duration
    if (newNotification.autoClose && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
    
    return id
  }
  
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  const clearAllNotifications = () => {
    notifications.value = []
  }
  
  // Méthodes de convenance pour différents types de notifications
  const success = (message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      ...options
    })
  }
  
  const error = (message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      duration: 8000, // Erreurs affichées plus longtemps
      ...options
    })
  }
  
  const warning = (message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      ...options
    })
  }
  
  const info = (message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      ...options
    })
  }
  
  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info
  }
}

// Instance globale pour utilisation dans toute l'application
export const globalNotifications = useNotifications()