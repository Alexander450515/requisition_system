<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="REQUISITIONS"
      :items-per-page="10"
      :expanded.sync="expanded"
      show-expand
      :search="search.search"
    >
      <template v-slot:top>
        <TopTable :search="search" />
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <!-- Передать на визирование -->
        <v-btn
          v-if="item.status == 'Создана'"
          color="success"
          small
          rounded
          dark
          @click="sendToAgreement(item)"
        >
          Передать на визирование
        </v-btn>
        <!-- Открыть (для визирования)-->
        <v-btn
          v-if="item.status == 'Передана на визирование'"
          small
          rounded
          dark
          @click="openRequisition(item)"
        >
          Открыть
        </v-btn>
        <!-- Передать к исполнению -->
        <v-btn
          v-if="item.status == 'Утверждена'"
          color="success"
          small
          rounded
          dark
          @click="openRequisition(item)"
        >
          Передать к исполнению
        </v-btn>
        <v-dialog v-model="dialogOpen" max-width="1200px" :retain-focus="false">
          <div class="white">
            <RequisitionStages
              :editedItem="editedItem"
              :currentRequisitionStages="currentRequisitionStages"
              :currentStep="currentStep"
              :lastComplitedStage="lastComplitedStage"
              @closeRequisitionModalWindow="closeRequisitionModalWindow"
              @openRequisition="openRequisition"
              @showInformativeMessage="showInformativeMessage"
            />
          </div>
        </v-dialog>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <strong>Последнее действие:</strong>
          {{
            `${lastEvent(item).user} изменил статус заявки на "${
              lastEvent(item).status
            }" ${lastEvent(item).date}. Текущий этап визирования: ${
              lastEvent(item).current_stage != ""
                ? lastEvent(item).current_stage
                : '"Визирование еще не началось"'
            }`
          }}
        </td>
      </template>
    </v-data-table>
    <InformativeMessage
      :snackbar="snackbar"
      :currentRequisitionStages="currentRequisitionStages"
      :currentStep="currentStep"
      @closeInformativeMessage="closeInformativeMessage"
    />
  </div>
</template>

<script>
import TopTable from "@/components/RequisitionSystem/TopTable";
import RequisitionStages from "@/components/RequisitionSystem/RequisitionStages";
import InformativeMessage from "@/components/RequisitionSystem/InformativeMessage";
import { mapGetters } from "vuex";

export default {
  components: { TopTable, RequisitionStages, InformativeMessage },
  data: () => ({
    expanded: [],
    search: { search: "" },
    dialogOpen: false,
    snackbar: { snackbar: false },
    headers: [
      { text: "№", value: "id" },
      { text: "Статус", value: "status", width: 250 },
      { text: "Этап заявки", value: "current_stage", width: 300 },
      { text: "Время создания", value: "create_date" },
      { text: "Заявитель", value: "requisition_creator" },
      { text: "Тип заявки", value: "requisition_type" },
      { text: "", value: "actions", width: 260 },
    ],
    editedIndex: 0,
    editedItem: {},
  }),
  methods: {
    lastEvent(requisition) {
      let events = this.arrayOfAllEventsOfSelectedRequisition(requisition);
      let arrayOfIds = events.map((event) => event.id);
      let maxId = Math.max.apply(Math, arrayOfIds);
      let lastEvent = this.REQUISITIONS_HISTORY.find(
        (event) => event.id == maxId
      );
      if (lastEvent == undefined) {
        return {
          date: "",
          status: "",
          requisition_id: 0,
          user: "",
          id: 0,
          last_complited_stage: "",
          current_stage: "",
        };
      } else {
        return lastEvent;
      }
    },
    arrayOfAllEventsOfSelectedRequisition(requisition) {
      let arr = this.REQUISITIONS_HISTORY.filter((event) => {
        return event.requisition_id == requisition.id;
      });
      if (arr != undefined) {
        return arr;
      }
    },
    openRequisition(requisition) {
      this.editedIndex = this.REQUISITIONS.indexOf(requisition);
      this.editedItem = Object.assign({}, requisition);
      this.dialogOpen = true;
    },
    closeRequisitionModalWindow() {
      this.dialogOpen = false;
    },
    sendToAgreement(requisition) {
      this.editedItem = Object.assign({}, requisition);
      return this.$store.dispatch("CHANGE_STAGE", {
        id: requisition.id,
        current_stage: this.currentStageName,
        status: "Передана на визирование",
        last_complited_stage: "",
        current_step: this.currentStep,
      });
    },
    requisitionStages(requisition) {
      let requisition_types = requisition.requisition_type;
      if (requisition_types != undefined) {
        console.log(
          this.REQUISITION_TYPES.find(
            (type) => type.requisition_type == requisition_types
          ).stages,
          "requisitionStages"
        );
        return this.REQUISITION_TYPES.find(
          (type) => type.requisition_type == requisition_types
        ).stages;
      } else {
        return [];
      }
    },
    showInformativeMessage() {
      this.snackbar.snackbar = true;
    },
    closeInformativeMessage() {
      this.snackbar.snackbar = false;
    },
  },
  computed: {
    ...mapGetters([
      "REQUISITIONS",
      "REQUISITION_TYPES",
      "REQUISITIONS_HISTORY",
      "CURRENT_USER_PERMISSIONS",
    ]),
    currentRequisitionStages() {
      let editedItem = this.editedItem.requisition_type;
      if (editedItem != undefined) {
        return this.REQUISITION_TYPES.find(
          (type) => type.requisition_type == editedItem
        ).stages;
      } else {
        return [];
      }
    },
    currentStep() {
      return this.editedItem.current_step;
    },
    currentStageName() {
      return this.currentRequisitionStages[this.currentStep - 1];
    },
    lastComplitedStage() {
      return this.currentRequisitionStages[this.currentStep - 1];
    },
  },
};
</script>
