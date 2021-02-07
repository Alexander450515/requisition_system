<template>
  <v-form
    ref="form"
    v-model="valid"
    @submit.prevent="chooseUser"
    lazy-validation
  >
    <v-card>
      <v-card-title>
        <span class="headline">Выберите пользователя</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-select
                :items="USERS"
                :rules="[rules.required]"
                label="Выбрать пользователя"
                v-model="currentUser"
                @input="selectedUser"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-list-item-subtitle v-if="CURRENT_USER_PERMISSIONS">
                Доступные этапы визирования
              </v-list-item-subtitle>
              <v-list-item-subtitle v-else>
                Нет доступных этапов визирования
              </v-list-item-subtitle>
              <div>
                <v-chip
                  class="ma-2 "
                  v-for="permissions in CURRENT_USER_PERMISSIONS"
                  :key="permissions.id"
                >
                  {{ permissions }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('closeModalWindow')">
          Отмена
        </v-btn>
        <v-btn type="submit" text :disabled="!valid" :outlined="!valid">
          Выбрать
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "AuthForm",

  data: () => ({
    valid: true,
    currentUser: "",
    rules: {
      required: (value) => !!value || "Заполните поле",
    },
  }),
  computed: {
    ...mapGetters(["USERS", "CURRENT_USER_PERMISSIONS"]),
  },
  methods: {
    selectedUser() {
      this.$store.commit("SET_SELECTED_USER", this.currentUser);
    },
    chooseUser() {
      if (this.$refs.form.validate()) {
        this.$store.commit("SET_SELECTED_USER", this.currentUser);
        this.$emit("closeModalWindow");
      }
    },
  },
};
</script>
