<template>
  <div class="text-center">
    <!-- <v-snackbar
      v-model="snackbarBoolean"
      :timeout="timeout"
      right
      style="max-width: 650px;"
    >
      {{
        `Этап визирования "${
          currentRequisitionStages[currentStep - 1]
        }" успешно согласован. 
        Время согласования: ${date}`
      }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          v-bind="attrs"
          text
          @click="$emit('closeInformativeMessage')"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar> -->
  </div>
</template>

<script>
export default {
  props: {
    snackbar: Object,
    editedItem: Object,
    currentRequisitionStages: Array,
    currentStep: Number,
  },
  data: () => ({
    timeout: 3000,
    date: new Date().toLocaleString(),
  }),
  computed: {
    snackbarBoolean: {
      get() {
        return this.snackbar.snackbar;
      },
      set(value) {
        this.snackbar.snackbar = value;
      },
    },
  },
};
</script>
