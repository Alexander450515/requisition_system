<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="REQUISITIONS"
      :items-per-page="10"
      :expanded.sync="expanded"
      show-expand
      sort-by="id"
      :search="search.search"
      calculate-widths
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
        <!-- open -->
        <v-btn
          v-if="item.status == 'Передана на визирование'"
          color="success"
          small
          rounded
          dark
          @click="openRequisition(item)"
        >
          Открыть
        </v-btn>
        <v-dialog v-model="dialogOpen" max-width="1200px" :retain-focus="false">
          <div class="white">
            <RequisitionStages
              :editedItem="editedItem"
              :currentRequisitionStages="currentRequisitionStages"
              :currentStep="currentStep"
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
          <!-- {{ lastEvent(item) }} -->
          {{
            `${lastEvent(item).user} изменил статус заявки на "${
              lastEvent(item).status
            }" ${lastEvent(item).date}`
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
    <v-btn @click="showInformativeMessage">showInformativeMessage</v-btn>
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
      { text: "Статус", value: "status" },
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
        // console.log(arr, "arr");
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
      let currentStep = this.editedItem.current_step + 1;
      let currentStage = this.currentRequisitionStages[currentStep - 2];
      console.log(this.editedItem, "editedItem");
      console.log(currentStep, "currentStep");
      console.log(currentStage, "currentStage");
      return this.$store.dispatch("TO_AGREEMENT", {
        id: requisition.id,
        current_stage: currentStage,
        // currentStage отправляет не то. Здесь нужно поправить
      });
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
    ]),
    currentRequisitionStages() {
      let editedItem = this.editedItem.requisition_type;
      if (editedItem != undefined) {
        return this.REQUISITION_TYPES.find(
          (type) => type.requisition_type == this.editedItem.requisition_type
        ).stages;
      } else {
        return [];
      }
    },
    currentStep() {
      return this.editedItem.current_step;
    },
  },
};
</script>
