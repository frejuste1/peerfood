<template>
  <Transition name="toast" appear>
    <div v-if="visible" :class="['toast', `toast--${type}`]">
      <div class="toast__icon">
        <span v-if="type === 'success'">✓</span>
        <span v-else-if="type === 'error'">✕</span>
        <span v-else-if="type === 'warning'">⚠</span>
        <span v-else>ℹ</span>
      </div>
      <div class="toast__content">
        <div class="toast__title" v-if="title">{{ title }}</div>
        <div class="toast__message">{{ message }}</div>
      </div>
      <button @click="close" class="toast__close">
        ✕
      </button>
    </div>
  </Transition>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'NotificationToast',
  props: {
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 5000
    },
    autoClose: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const visible = ref(true)
    
    const close = () => {
      visible.value = false
      setTimeout(() => {
        emit('close')
      }, 300) // Attendre la fin de l'animation
    }
    
    onMounted(() => {
      if (props.autoClose && props.duration > 0) {
        setTimeout(() => {
          close()
        }, props.duration)
      }
    })
    
    return {
      visible,
      close
    }
  }
}
</script>

<style scoped>
.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: white;
  border-left: 4px solid;
  max-width: 400px;
  position: relative;
}

.toast--success {
  border-left-color: #10b981;
  background-color: #f0fdf4;
}

.toast--error {
  border-left-color: #ef4444;
  background-color: #fef2f2;
}

.toast--warning {
  border-left-color: #f59e0b;
  background-color: #fffbeb;
}

.toast--info {
  border-left-color: #3b82f6;
  background-color: #eff6ff;
}

.toast__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
}

.toast--success .toast__icon {
  background-color: #10b981;
  color: white;
}

.toast--error .toast__icon {
  background-color: #ef4444;
  color: white;
}

.toast--warning .toast__icon {
  background-color: #f59e0b;
  color: white;
}

.toast--info .toast__icon {
  background-color: #3b82f6;
  color: white;
}

.toast__content {
  flex: 1;
  min-width: 0;
}

.toast__title {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #374151;
}

.toast__message {
  color: #6b7280;
  line-height: 1.4;
}

.toast--success .toast__title,
.toast--success .toast__message {
  color: #065f46;
}

.toast--error .toast__title,
.toast--error .toast__message {
  color: #991b1b;
}

.toast--warning .toast__title,
.toast--warning .toast__message {
  color: #92400e;
}

.toast--info .toast__title,
.toast--info .toast__message {
  color: #1e40af;
}

.toast__close {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.toast__close:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #374151;
}

/* Animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>