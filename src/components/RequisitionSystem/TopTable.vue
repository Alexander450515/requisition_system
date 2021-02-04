<template>
  <v-toolbar flat>
    <v-row>
      <!-- Search -->
      <v-col xs="6" sm="6" md="4" lg="3" class="d-flex">
        <v-text-field
          v-model="search.search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
      <v-spacer></v-spacer>

      <v-col class="d-flex justify-end">
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="success" dark v-bind="attrs" v-on="on">
              Создать заявку
            </v-btn>
          </template>
          <div class="white">
            <CreateForm @closeModalWindow="closeModalWindow" />
          </div>
        </v-dialog>
      </v-col>
    </v-row>
  </v-toolbar>
</template>

<script>
import CreateForm from "@/components/RequisitionSystem/CreateForm";
export default {
  components: {
    CreateForm,
  },
  props: {
    search: Object,
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    closeModalWindow() {
      this.dialog = false;
    },
  },
};
</script>

<style></style>
