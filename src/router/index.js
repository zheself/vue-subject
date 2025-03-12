import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/login',
        component: () => import('@/views/Login1.vue')
    },
    {
        path: '/register',
        component: () => import('@/views/register.vue')
    },
    {
        path: '/usercenter',
        component: () => import('@/views/usercenter.vue')
    },
    {
        path: '/',
        component: () => import('@/views/LayoutContainer.vue'),
        redirect: '/vqa',
        children: [
            {
                path: '/reconstruction',
                component: () => import('@/views/reconstruction/ReconstructionList.vue')
            },
            {
                path: '/image-edit',
                component: () => import('@/views/imageEdit/ImageEdit.vue')
            },
            {
                path: '/vqa',
                component: () => import('@/views/visualQuestion/show.vue'),
            },
            {
                path: '/history:id',
                component: () => import('@/views/visualQuestion/AllHistoryRecord.vue')
            },
            {
                path: '/interact',
                component: () => import('@/views/component/interact.vue')
            },

        ]
    },
    {
        path: '/reconstruction/edit',
        component: () => import('@/views/reconstruction/VideoProcessing.vue')
    },
    {
        path: '/test',
        component: () => import('@/views/Test.vue')
    },
    {
        path: '/reconstruction/view',
        component: () => import('@/views/reconstruction/ModelView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

export default router