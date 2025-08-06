import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/payment/success',
      name: 'payment-success',
      component: () => import('../views/PaymentSuccessView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/payment/error',
      name: 'payment-error',
      component: () => import('../views/PaymentErrorView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Auth/LoginView.vue'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/ResetPasswordView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Auth/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/edit',
      name: 'edit-profile',
      component: () => import('../views/EditProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrderHistoryView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/order/:id/review',
      name: 'order-review',
      component: () => import('../views/OrderReviewView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/Admin/DashboardView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],

})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  // Si la route nécessite une authentification
  if (requiresAuth) {
    // Vérifier si l'utilisateur est authentifié
    if (!authStore.isAuthenticated) {
      next({ name: 'login', query: { redirect: to.fullPath } });
      return;
    }

    // Vérifier les permissions admin si nécessaire
    if (requiresAdmin && !authStore.isAdmin) {
      next({ name: 'home' });
      return;
    }
  }

  // Si l'utilisateur est déjà connecté et essaie d'accéder à login/register
  if (authStore.isAuthenticated && (to.name === 'login' || to.name === 'register')) {
    next({ name: 'home' });
    return;
  }

  next();
});

export default router
