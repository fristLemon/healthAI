import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const backendRouters: RouteRecordRaw[] = [
  {
    path: "/back",
    redirect: "/back/dashboard",
    component: () => import("@/components/BackendLayout.vue"),
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("@/views/dashboard.vue"),
        meta: {
          title: "数据分析",
          icon: 'PieChart',
        }
      },
      {
        path: "knowledge",
        name: "knowledge",
        component: () => import("@/views/knowledge.vue"),
        meta: {
          title: "知识文章",
          icon: 'ChatLineSquare',
        }
      },
      {
        path: "consultation",
        name: "consultation",
        component: () => import("@/views/consultation.vue"),
        meta: {
          title: "咨询记录",
          icon: 'ChatLineSquare',
        }
      },
      {
        path: "emotional",
        name: "emotional",
        component: () => import("@/views/emotional.vue"),
        meta: {
          title: "情感日志",
          icon: 'user',
        }
      },
    ],
  },
  {
    path: '/auth',
    component: () => import("@/components/AuthLayout.vue"),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import("@/views/login.vue"),
        meta: {
          title: "登录",
          icon: 'Login',
        }
      },
      {
        path: 'register',
        name: 'register',
        component: () => import("@/views/register.vue"),
        meta: {
          title: "注册",
          icon: 'Register',
        }
      },
    ] 
  }
];
const webRouters: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import("@/components/WebLayout.vue"),
    children: [
      {
        path: '',
        component: () => import("@/views/home.vue"),
      },
      {
        path: 'webConversation',
        name: 'webConversation',
        component: () => import("@/views/webConversation.vue"),
      },
      {
        path: 'webEmotion',
        name: 'webEmotion',
        component: () => import("@/views/webEmotion.vue"),
      },
      {
        path: 'webKnowledge',
        name: 'webKnowledge',
        component: () => import("@/views/webKnowledge.vue"),
      },
      {
        path: 'webKnowledge/article/:id',
        component: () => import("@/views/webKnowledgeArticle.vue"),
        props: true,
      },
    ]
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRouters, ...webRouters],
})
// 路由前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  // 是否登录
  if(token){
    const userInfo = JSON.parse(localStorage.getItem('userInfo') as string) as { userType: number }
    if(userInfo.userType === 2){
      if(to.path.startsWith('/back')){
        next()
      }else{
        next('/back/dashboard')
      }
    }else if(userInfo.userType === 1){
      // 前台用户
      if(to.path.startsWith('/back') || to.path.startsWith('/auth')){
        next('/')
      }else{
        next()
      }
    }
  }else{
    // 是否后台路由
    if(to.path.startsWith('/back')){
      next('/auth/login')
    }else{
      next()
    }
  }
})
export default router;