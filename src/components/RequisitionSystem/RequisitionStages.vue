<template>
  <v-stepper v-model="currentStep">
    <v-stepper-header>
      <template v-for="(stage, index) in currentRequisitionStages">
        <v-stepper-step
          :key="`${index + 1}-step`"
          :step="index + 1"
          :complete="currentStep > index + 1"
          color="success"
        >
          {{ stage }}
        </v-stepper-step>
        <v-divider
          v-if="index !== currentRequisitionStages.length - 1"
          :key="index"
        ></v-divider>
      </template>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content
        v-for="(stage, index) in currentRequisitionStages"
        :key="`${index + 1}-content`"
        :step="index + 1"
      >
        <v-btn color="success" @click="nextStep(index + 1)">
          Continue
        </v-btn>

        <v-btn text @click="$emit('closeRequisitionModalWindow')">
          Cancel
        </v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    editedItem: Object,
    currentRequisitionStages: Array,
    currentStep: Number,
  },
  data: () => ({}),
  computed: {
    ...mapGetters(["CURRENT_USER_PERMISSIONS"]),
  },
  methods: {
    nextStep(step) {
      if (step < this.currentRequisitionStages.length) {
        let currentStep = this.editedItem.current_step + 1;
        console.log(`currentStep ${currentStep}`);
        let id = this.editedItem.id;
        this.$store.dispatch("CHANGE_STAGE", {
          current_step: currentStep,
          id: id,
        });
        this.$emit("closeRequisitionModalWindow");
        this.$emit("showInformativeMessage");
        // Тут нужно добавить время и этап визирования в историю
      }
    },
  },
};
</script>
