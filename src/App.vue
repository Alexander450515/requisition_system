<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <NavDrawer />
    </v-navigation-drawer>
    <v-app-bar app flat dense color="white">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class=" mx-auto font-weight-medium display-1"
        >Система заявок</v-toolbar-title
      >
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavDrawer from "@/components/NavDrawer";
import { mapActions } from "vuex";

export default {
  name: "App",

  components: {
    NavDrawer,
  },

  data: () => ({
    drawer: null,
  }),
  methods: {
    ...mapActions(["GET_REQUISITIONS", "GET_USERS", "GET_REQUISITION_TYPES"]),
  },
  created() {
    this.GET_REQUISITIONS();
    this.GET_USERS();
    this.GET_REQUISITION_TYPES();
  },
};
</script>
