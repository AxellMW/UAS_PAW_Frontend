import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
function importComponent(path) {
    return () => import(`./components/${path}.vue`)
}
Vue.use(VueRouter);


const router = new VueRouter({
    mode: 'history',
    routes: [
        //register
        {
            path: '/register',
            name: 'Register',
            meta: { title: 'Register' },
            component: importComponent('Register'),
        },
        //login
        {
            path: '/login',
            name: 'Login',
            meta: { title: 'Login' },
            component: importComponent('Login'),
        },

        {
            path: '/',
            component: importComponent('DashboardLayout'),
            children: [
                //Dashboard
                {
                    path: '/',
                    name: 'Dashboard',
                    meta: {title : 'Dashboard'},
                    component: importComponent('Dashboard'),
                },
                //courses
                {
                    path: '/course',
                    name: 'Course',
                    meta: {title : 'Courses'},
                    component: importComponent('DataMaster/Courses'),
                },
                //users
                {
                    path: '/user',
                    name: 'User',
                    meta: {title : 'Users'},
                    component: importComponent('DataMaster/Users'),
                },
            ],
        },
        
        {
            path: '*',
            redirect: '/'
        },
    ]
});

//Set Judul
router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
});

export default router;