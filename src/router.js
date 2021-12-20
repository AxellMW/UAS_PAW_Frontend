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
            path: '/',
            name: 'Login',
            meta: { title: 'Login' },
            component: importComponent('Login'),
        },

        {
            path: '/home',
            component: importComponent('DashboardLayout'),
            children: [
                //Dashboard
                {
                    path: '/home',
                    name: 'Home',
                    meta: {title : 'Home'},
                    component: importComponent('Home'),
                },
                //profile
                {
                    path: '/profile',
                    name: 'Profile',
                    meta: {title : 'Profile'},
                    component: importComponent('DataMaster/Profile'),
                },
                //book
                {
                    path: '/book',
                    name: 'Book',
                    meta: {title : 'Books'},
                    component: importComponent('DataMaster/Book'),
                },
                //news
                {
                    path: '/news',
                    name: 'News',
                    meta: {title : 'News'},
                    component: importComponent('DataMaster/News'),
                },
                //staff
                {
                    path: '/staff',
                    name: 'Staff',
                    meta: {title : 'Staffs'},
                    component: importComponent('DataMaster/Staff'),
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