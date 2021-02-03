<template>
  <v-stepper v-model="currentStep">
    <v-stepper-header>
      <template v-for="(stage, index) in currentRequisitionStages">
        <v-stepper-step
          :key="`${index}-step`"
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
        :key="`${index}-content`"
        :step="index + 1"
      >
        <v-btn
          :disabled="!havePermission"
          color="success"
          @click="accept(index + 1)"
        >
          Согласовать
        </v-btn>

        <v-btn
          :disabled="!havePermission"
          class="ml-2"
          color="error"
          @click="reject(index + 1)"
        >
          Отклонить
        </v-btn>

        <v-btn class="ml-2" text @click="$emit('closeRequisitionModalWindow')">
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
    lastComplitedStage: String,
    currentStageName: String,
  },
  data: () => ({}),
  computed: {
    ...mapGetters(["CURRENT_USER_PERMISSIONS"]),
    havePermission() {
      let result =
        this.CURRENT_USER_PERMISSIONS.indexOf(this.currentStageName) != -1;
      console.log(result, "isAvaliable");
      return result;
    },
  },
  methods: {
    accept(step) {
      let updatedRequisition = {
        id: this.editedItem.id,
        current_step: this.currentStep + 1,
        status: "",
        last_complited_stage: this.lastComplitedStage,
        current_stage: this.currentRequisitionStages[this.currentStep],
      };

      if (step < this.currentRequisitionStages.length - 1) {
        updatedRequisition.status = "Передана на визирование";
        this.$store.dispatch("CHANGE_STAGE", updatedRequisition);
      }
      // Утверждена (все сотрудники производящие визирование заявки утвердили ее)
      else if (step == this.currentRequisitionStages.length - 1) {
        (updatedRequisition.status = "Утверждена"),
          this.$store.dispatch("CHANGE_STAGE", updatedRequisition);
      }
      // Принята к исполнению (получена непосредственно в БП,
      // произведено действие, например выдан пропуск)
      else if (step == this.currentRequisitionStages.length) {
        (updatedRequisition.status = "Принята к исполнению"),
          this.$store.dispatch("CHANGE_STAGE", updatedRequisition);
      }
      this.$emit("closeRequisitionModalWindow");
      this.$emit("showInformativeMessage");
    },
    reject() {
      let updatedRequisition = {
        id: this.editedItem.id,
        current_step: this.currentStep,
        status: "Отклонена",
        last_complited_stage: this.lastComplitedStage,
        current_stage: this.currentStageName,
      };
      this.$store.dispatch("CHANGE_STAGE", updatedRequisition);
      this.$emit("closeRequisitionModalWindow");
      this.$emit("showInformativeMessage");
    },
  },
};
</script>
