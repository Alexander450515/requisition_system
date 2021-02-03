<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-select
          :items="USERS"
          label="Выбрать пользователя"
          dense
          outlined
          v-model="currentUser"
          @input="selectedUser"
          :error="!currentUser"
          :success="!!currentUser"
        ></v-select>
        <v-list-item-subtitle v-if="CURRENT_USER_PERMISSIONS">
          Доступные этапы визирования
        </v-list-item-subtitle>
        <v-list-item-subtitle v-else>
          Нет доступных этапов визирования
        </v-list-item-subtitle>
        <!-- <v-list-item-subtitle>
          {{ this.CURRENT_USER }}
        </v-list-item-subtitle> -->
        <div>
          <v-chip
            class="ma-2 "
            style="max-width: 210px;"
            v-for="permissions in CURRENT_USER_PERMISSIONS"
            :key="permissions.id"
          >
            {{ permissions }}
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
import { mapGetters } from "vuex";

export default {
  data: () => ({
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
    selectedUser() {
      let selectedUser = this.currentUser;
      this.$store.commit("SET_SELECTED_USER", selectedUser);
    },
  },
};
</script>
