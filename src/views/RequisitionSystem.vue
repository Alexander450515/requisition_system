<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="REQUISITIONS"
      :items-per-page="10"
      sort-by="requisitionNumber"
      :search="search.search"
      calculate-widths
    >
      <template v-slot:top>
        <TopTable :search="search" />
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <!-- Передать на визирование -->
        <v-btn
          v-if="item.requisition_history[0].status == 'Создана'"
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
    search: { search: "" },
    dialogOpen: false,
    snackbar: { snackbar: false },
    headers: [
      { text: "№", value: "id" },
      { text: "Статус", value: "requisition_history[0].status" },
      { text: "Время создания", value: "requisition_history[0].date" },
      { text: "Заявитель", value: "requisition_creator" },
      { text: "Тип заявки", value: "requisition_type" },
      { text: "", value: "actions", width: 260 },
    ],
    editedIndex: 0,
    editedItem: {},
  }),
  methods: {
    openRequisition(requisition) {
      this.editedIndex = this.REQUISITIONS.indexOf(requisition);
      this.editedItem = Object.assign({}, requisition);
      this.dialogOpen = true;
    },
    closeRequisitionModalWindow() {
      this.dialogOpen = false;
    },
    sendToAgreement(requisition) {
      console.log(requisition.id);
      return this.$store.dispatch("CHANGE_STATUS_TO_AGREEMENT", requisition.id);
      // Должен добавлять в [] requisition_history
    },
    showInformativeMessage() {
      this.snackbar.snackbar = true;
    },
    closeInformativeMessage() {
      this.snackbar.snackbar = false;
    },
  },
  computed: {
    ...mapGetters(["REQUISITIONS", "REQUISITION_TYPES"]),
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
