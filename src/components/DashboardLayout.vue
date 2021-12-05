<template>
    <div class="dashboard">
        <v-navigation-drawer v-model="drawer" class="fullheight" width="256" app>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title"><v-icon size="125px">mdi-book-open-page-variant</v-icon></v-list-item-title>
                    <v-list-item-subtitle> Happy Reading! </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
            <v-list dense nav>
                <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to"
                >
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar app fixed height="75px">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <VSpacer />
            <v-toolbar-items>
                <v-btn @click="logout" text router><v-icon>mdi-power</v-icon></v-btn>
            </v-toolbar-items>
        </v-app-bar>
        <div class="fullheight pa-5">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    name: "Dashboard",
    data() {
        return {
            drawer: true,
            items: [
                { title: "Home", to:'/home' },
                { title: 'Profile', to: '/profile' },
                { title: 'Book', to: '/book' },
                { title: 'News', to: '/news' },
                { title: 'Staff', to: '/staff' },
            ],
        };
    },
    methods: {
        logout() {
            localStorage.removeItem('token');
            this.$router.push({
                name: 'Login',
            });
        }
    }
};
</script>
<style scoped>
.fullheight {
    min-height: 100vh !important;
}

.router{
    text-decoration: none;
    color: black;
}
</style>