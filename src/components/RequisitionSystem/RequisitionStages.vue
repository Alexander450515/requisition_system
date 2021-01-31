<template>
  <v-stepper v-model="currentStep">
    <v-stepper-header>
      <template v-for="(stage, index) in currentRequisitionStages">
        <v-stepper-step
          :key="`${index + 1}-step`"
          :complete="currentStep > index"
          :step="index + 1"
        >
          {{ `${stage} ${index + 1}` }}
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
        <v-btn @click="nextStep(index + 1)">
          Continue
        </v-btn>

        <v-btn text>
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
  },
  data: () => ({
    currentStep: 1,
  }),
  computed: {
    ...mapGetters(["CURRENT_USER_PERMISSIONS", "REQUISITION_TYPES"]),
    currentRequisitionStages() {
      return this.REQUISITION_TYPES.find(
        (type) => type.requisition_type == this.editedItem.requisition_type
      ).stages;
    },
  },
  methods: {
    nextStep(step) {
      if (step < this.currentRequisitionStages.length) {
        this.currentStep = step + 1;
      }
    },
  },
};
</script>
