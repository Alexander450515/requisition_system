<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="REQUISITIONS"
      :items-per-page="10"
      :expanded.sync="expanded"
      show-expand
      single-expand
      :search="search.search"
    >
      <template v-slot:top>
        <TopTable :search="search" />
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <ActionButtons
          :item="item"
          :havePermission="havePermission"
          @sendToAgreement="sendToAgreement(item)"
          @openRequisition="openRequisition(item)"
        />
        <v-dialog v-model="dialogOpen" max-width="1200px" :retain-focus="false">
          <div class="white">
            <RequisitionStages
              :editedItem="editedItem"
              :currentRequisitionStages="currentRequisitionStages"
              :currentStep="currentStep"
              :lastComplitedStage="lastComplitedStage"
              :havePermission="havePermission"
              @closeRequisitionModalWindow="closeRequisitionModalWindow"
              @showInformativeMessage="showInformativeMessage"
            />
          </div>
        </v-dialog>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <ExpandedInfo
            :item="item"
            :lastEvent="lastEvent"
            :allEventsOfSelectedRequisition="
              allEventsOfSelectedRequisition(item)
            "
          />
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
import ActionButtons from "@/components/RequisitionSystem/ActionButtons";
import ExpandedInfo from "@/components/RequisitionSystem/ExpandedInfo";
import { mapGetters } from "vuex";

export default {
  components: {
    TopTable,
    RequisitionStages,
    InformativeMessage,
    ActionButtons,
    ExpandedInfo,
  },
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
      { text: "", value: "actions", width: 260, sortable: false },
    ],
    editedIndex: 0,
    editedItem: {},
  }),
  methods: {
    lastEvent(requisition) {
      let events = this.allEventsOfSelectedRequisition(requisition);
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
    allEventsOfSelectedRequisition(requisition) {
      let arr = this.REQUISITIONS_HISTORY.filter((event) => {
        return event.requisition_id == requisition.id;
      });
      if (arr != undefined) {
        // console.log(arr, "allEventsOfSelectedRequisition");
        return arr;
      }
    },
    sendToAgreement(requisition) {
      this.editedItem = Object.assign({}, requisition);
      return this.$store.dispatch("CHANGE_STAGE", {
        id: requisition.id,
        current_stage: this.lastComplitedStage,
        status: "Передана на визирование",
        last_complited_stage: "",
        current_step: 1,
        requisition_type: requisition.requisition_type,
      });
    },
    showInformativeMessage() {
      this.snackbar.snackbar = true;
    },
    closeInformativeMessage() {
      this.snackbar.snackbar = false;
    },
    openRequisition(requisition) {
      this.editedIndex = this.REQUISITIONS.indexOf(requisition);
      this.editedItem = Object.assign({}, requisition);
      this.dialogOpen = true;
    },
    closeRequisitionModalWindow() {
      this.dialogOpen = false;
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
    // currentStageName() {
    //   return this.currentRequisitionStages[this.currentStep - 1];
    // },
    lastComplitedStage() {
      return this.currentRequisitionStages[this.currentStep - 1];
    },
    havePermission() {
      let permissions = this.CURRENT_USER_PERMISSIONS;
      if (permissions != undefined) {
        return permissions.indexOf(this.lastComplitedStage) != -1;
      } else {
        return false;
      }
    },
  },
};
</script>
