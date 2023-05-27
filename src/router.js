// router.js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/server',
        component: () => import('@/server/App.vue')
    },
    {
        path: '/client',
        component: () => import('@/client/App.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router;
