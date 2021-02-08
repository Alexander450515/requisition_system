<template>
  <v-stepper v-model="editedItem.current_step">
    <v-stepper-header>
      <template v-for="(stage, index) in currentRequisitionStages(editedItem)">
        <v-stepper-step
          :key="`${index}-step`"
          :step="index"
          :complete="editedItem.current_step > index"
          color="success"
        >
          {{ stage }}
        </v-stepper-step>
        <v-divider
          v-if="index !== currentRequisitionStages(editedItem).length - 1"
          :key="`${index}-divider`"
        ></v-divider>
      </template>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content
        v-for="(stage, index) in currentRequisitionStages(editedItem)"
        :key="`${index}-content`"
        :step="index"
      >
        <v-card class="mb-12" color="grey lighten-1" height="100px">{{
          stageInfo
        }}</v-card>
        <v-btn
          :disabled="!havePermission(editedItem)"
          color="success"
          @click="accept(index)"
          v-if="editedItem.status != 'Отклонена'"
        >
          Согласовать
        </v-btn>

        <v-btn
          :disabled="!havePermission(editedItem)"
          class="ml-2"
          color="error"
          @click="reject(index)"
          v-if="editedItem.status != 'Отклонена'"
        >
          Отклонить
        </v-btn>

        <v-btn
          :disabled="!havePermission(editedItem)"
          class="ml-2"
          color="success"
          @click="unReject(index)"
          v-if="editedItem.status == 'Отклонена'"
        >
          Вернуть на визирование
        </v-btn>

        <v-btn class="ml-2" text @click="$emit('closeRequisitionModalWindow')">
          Закрыть
        </v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: {
    editedItem: Object,
    currentRequisitionStages: Function,
    havePermission: Function,
  },
  data: () => ({}),
  computed: {
    stageInfo() {
      return `Информация о этапе визирования
            ${
              this.currentRequisitionStages(this.editedItem)[
                this.editedItem.current_step
              ]
            }
          `;
    },
  },
  methods: {
    ...mapActions(["CHANGE_STAGE"]),
    accept(step) {
      let updatedRequisition = {
        id: this.editedItem.id,
        current_step: this.editedItem.current_step + 1,
        status: "",
        last_complited_stage: this.currentRequisitionStages(this.editedItem)[
          this.editedItem.current_step
        ],
        current_stage: this.currentRequisitionStages(this.editedItem)[
          this.editedItem.current_step + 1
        ],
        requisition_type: this.editedItem.requisition_type,
      };

      if (step < this.currentRequisitionStages(this.editedItem).length - 2) {
        updatedRequisition.status = "Передана на визирование";
        this.$store.dispatch("CHANGE_STAGE", updatedRequisition);
      }
      // Утверждена (все сотрудники производящие визирование заявки утвердили ее)
      else if (
        step ==
        this.currentRequisitionStages(this.editedItem).length - 2
      ) {
        (updatedRequisition.status = "Утверждена"),
          this.$store.dispatch("CHANGE_STAGE", updatedRequisition);
      }
      // Принята к исполнению (получена непосредственно в БП,
      // произведено действие, например выдан пропуск)
      else if (
        step ==
        this.currentRequisitionStages(this.editedItem).length - 1
      ) {
        (updatedRequisition.status = "Принята к исполнению"),
          this.$store.dispatch("CHANGE_STAGE", updatedRequisition);
      }
      this.$emit("closeRequisitionModalWindow");
      this.$emit("showInformativeMessage");
    },
    reject() {
      let updatedRequisition = {
        id: this.editedItem.id,
        current_step: this.editedItem.current_step,
        status: "Отклонена",
        last_complited_stage: this.currentRequisitionStages(this.editedItem)[
          this.editedItem.current_step - 1
        ],
        current_stage: this.currentRequisitionStages(this.editedItem)[
          this.editedItem.current_step
        ],
      };
      this.$store.dispatch("CHANGE_STAGE", updatedRequisition);
      this.$emit("closeRequisitionModalWindow");
      this.$emit("showInformativeMessage");
    },
    unReject() {
      let updatedRequisition = {
        id: this.editedItem.id,
        current_step: this.editedItem.current_step,
        status: "Передана на визирование",
        last_complited_stage: this.currentRequisitionStages(this.editedItem)[
          this.editedItem.current_step - 1
        ],
        current_stage: this.currentRequisitionStages(this.editedItem)[
          this.editedItem.current_step
        ],
      };
      this.$store.dispatch("CHANGE_STAGE", updatedRequisition);
      this.$emit("closeRequisitionModalWindow");
      this.$emit("showInformativeMessage");
    },
  },
};
</script>
