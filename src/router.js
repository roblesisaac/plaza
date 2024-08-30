import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from './stores/userStore'
import { computed } from 'vue';

import Boxes from './pages/BoxesPage.vue';
import Cart from './pages/CartPage.vue';
import Checkout from './pages/CheckoutPage.vue';
import Home from './pages/Home.vue';
import InventoryPage from './pages/InventoryPage.vue';
import ListingPage from './pages/ListingsManagementPage.vue';
import Login from './pages/Login.vue';
import MyAccount from './pages/MyAccount.vue';
import Listings from './pages/ListingsPage.vue';
import ListingDetails from './pages/ListingDetailsPage.vue';
import Privacy from './pages/Privacy.vue';
import Terms from './pages/Terms.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/cart', 
    name: 'cart',
    component: Cart
  },
  {
    path: '/checkout', 
    name: 'checkout',
    component: Checkout,
    meta: { hide: true }
  },
  {
    path: '/my-account',
    name: 'My Account',
    component: MyAccount,
    meta: { requires: 'auth' },
    beforeEnter: handleAuthentication
  },
  {
    path: '/products',
    name: 'Products',
    component: Listings
  },
  {
    path: '/products/:title',
    name: 'Product',
    component: ListingDetails
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      hide: true
    }
  },
  {
    path: '/privacy', 
    name: 'privacy',
    component: Privacy,
    meta: { hide: true }
  },
  {
    path: '/terms', 
    name: 'terms',
    component: Terms,
    meta: {
      hide: true
    }
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: InventoryPage,
    meta: { requires: 'admin' },
    beforeEnter: handleAuthentication
  },
  {
    path: '/listings',
    name: 'listings',
    component: ListingPage,
    meta: { requires: 'admin' },
    beforeEnter: handleAuthentication
  },
  {
    path: '/boxes',
    name: 'boxes',
    component: Boxes,
    meta: { requires: 'admin' },
    beforeEnter: handleAuthentication
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 } )
});

async function handleAuthentication(to, from, next) {
  if(import.meta.env.DEV) {
    return next();
  }
  
  const userStore = useUserStore();
  
  if (await userStore.checkAuth()) {
    return next();
  }
  
  next({ name: 'login' });
}

export const userRoutes = computed(() => {
  return router.getRoutes().filter(route => !route.path.includes(':') && userHasAccess(route) && !routeIsHidden(route)); 
});

export function useFilteredRoutes(arrayOfRoutesToExclude) {
  return computed(() => {
    if (!Array.isArray(arrayOfRoutesToExclude)) {
      arrayOfRoutesToExclude = [arrayOfRoutesToExclude];
    }

    return userRoutes.value.filter(route => {
      const routeName = route.name || '';
      
      return !arrayOfRoutesToExclude.some(
        excludedRoute => excludedRoute.toLowerCase() === routeName.toLowerCase()
      );
    });
  });
}

function userHasAccess(route) {
  const userStore = useUserStore();
  const { requires } = route.meta;
  
  if(route.name === 'login') {
    if(userStore.isLoggedIn) return false;
  }
  
  if (!requires || import.meta.env.DEV) {
    return true;
  }
  
  if(!userStore.isLoggedIn) {
    return false;
  }
  
  const { userData } = userStore;
  const roleHierarchy = ['member', 'admin'];
  const requiresRole = roleHierarchy.indexOf(requires);
  const userRole = roleHierarchy.indexOf(userData.role);
  
  return userRole >= requiresRole;
}

function routeIsHidden(route) {
  return route?.meta?.hide;
}

export default router;