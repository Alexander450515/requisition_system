<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <!--  -->
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn dark v-bind="attrs" v-on="on">
              Сменить пользователя
            </v-btn>
          </template>
          <div class="white">
            <AuthForm @closeModalWindow="closeModalWindow" />
          </div>
        </v-dialog>
        <div class="mt-2">
          <v-list-item-title class="my-2 font-weight-bold">
            {{ this.CURRENT_USER }}
          </v-list-item-title>
          <v-divider></v-divider>

          <v-list-item-subtitle v-if="CURRENT_USER_PERMISSIONS" class="mt-2">
            Доступные этапы визирования
          </v-list-item-subtitle>
          <v-list-item-subtitle v-else class="mt-2">
            Нет доступных этапов визирования
          </v-list-item-subtitle>
        </div>
        <div>
          <v-chip
            class="ma-2"
            style="max-width: 210px;"
            v-for="permissions in CURRENT_USER_PERMISSIONS"
            :key="permissions.id"
          >
            <p class="text-truncate my-auto">{{ permissions }}</p>
          </v-chip>
        </div>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item v-for="item in items" :key="item.title" :to="item.link" link>
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import AuthForm from "@/components/NavDrawer/AuthForm";
import { mapGetters } from "vuex";

export default {
  components: {
    AuthForm,
  },
  data: () => ({
    dialog: false,
    currentUser: "",
    permissions: [],
    items: [
      { title: "Система заявок", link: "/", icon: "mdi-view-dashboard" },
      { title: "Отчет", link: "/report", icon: "mdi-file-table" },
      { title: "Информация", link: "/info", icon: "mdi-help-box" },
    ],
  }),
  computed: {
    ...mapGetters(["USERS", "CURRENT_USER_PERMISSIONS", "CURRENT_USER"]),
  },

  methods: {
    closeModalWindow() {
      this.dialog = false;
    },
  },
};
</script>
