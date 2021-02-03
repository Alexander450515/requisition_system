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
          Согласовать
        </v-btn>

        <v-btn text @click="$emit('closeRequisitionModalWindow')">
          Закрыть
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
    currentStageName: String,
  },
  data: () => ({}),
  computed: {
    ...mapGetters(["CURRENT_USER_PERMISSIONS"]),
    lastComplitedStage() {
      return this.currentRequisitionStages[this.currentStep - 1];
    },
  },
  methods: {
    nextStep(step) {
      let id = this.editedItem.id;
      if (step < this.currentRequisitionStages.length) {
        // console.log(`currentStep ${currentStep}`);
        console.log(`Этап "${this.lastComplitedStage}" пройден`);
        console.log(this.currentStageName, "- текущий этап");
        this.$store.dispatch("CHANGE_STAGE", {
          id: id,
          current_step: this.currentStep + 1,
          last_complited_stage: this.lastComplitedStage,
          current_stage: this.currentStageName,
        });
        this.$emit("closeRequisitionModalWindow");
        this.$emit("showInformativeMessage");
      }
      // else if (step == this.currentRequisitionStages.length) {
      //   this.$store.dispatch("CHANGE_STAGE", {
      // id: id,
      // current_step: this.currentStep + 1,
      // last_complited_stage: this.lastComplitedStage,
      // current_stage: this.currentStageName,
      //   });
      //   this.$emit("closeRequisitionModalWindow");
      //   this.$emit("showInformativeMessage");
      // }
    },
  },
};
</script>
