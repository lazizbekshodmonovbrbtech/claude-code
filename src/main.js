import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/main.css'

import LandingView  from './views/LandingView.vue'
import DocsView     from './views/DocsView.vue'
import NotFoundView from './views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',         component: LandingView },
    { path: '/docs',     component: DocsView },
    { path: '/docs/:id', component: DocsView },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
  ],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 80 }
    return { top: 0 }
  }
})

createApp(App).use(router).mount('#app')
