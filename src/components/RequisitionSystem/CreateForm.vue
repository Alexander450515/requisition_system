<template>
  <v-form
    ref="form"
    v-model="valid"
    @submit.prevent="submitHandler"
    lazy-validation
  >
    <v-card>
      <v-card-title>
        <span class="headline">Создание заявки</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Заявитель"
                disabled
                :value="CURRENT_USER"
                :rules="[rules.requiredUser]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                :items="items"
                :rules="[rules.required]"
                label="Тип заявки"
                v-model="requisition_type"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('closeModalWindow')">
          Cancel
        </v-btn>
        <v-btn type="submit" text :disabled="!valid" :outlined="!valid">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "CreateForm",

  data: () => ({
    valid: true,
    requisition_type: "",
    rules: {
      required: (value) => !!value || "Заполните поле",
      requiredUser: (value) =>
        !!value || "Выберите пользователя в главном меню",
    },
    items: ["Временный", "Постоянный", "Одноразовый"],
  }),
  methods: {
    submitHandler() {
      let requisition = {
        requisition_creator: this.CURRENT_USER,
        requisition_type: this.requisition_type,
        current_step: 0,
        create_date: new Date().toLocaleString(),
        status: "Создана",
        last_complited_stage: "",
        current_stage: "",
      };
      if (this.$refs.form.validate()) {
        this.$store.dispatch("CREATE_REQUISITION", requisition);
        this.$emit("closeModalWindow");
      }
      console.log("submitHandler");
    },
    resetForm() {
      this.$refs.form.reset();
    },
  },
  computed: {
    ...mapGetters(["CURRENT_USER"]),
  },
};
</script>

<style></style>
