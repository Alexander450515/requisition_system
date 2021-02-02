<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="REQUISITIONS"
      :items-per-page="10"
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
    arrayOfAllEventsOfSelectedRequisition(requisition) {
      this.REQUISITIONS_HISTORY.filter((event) => {
        return event.requisition_id == requisition.id;
      });
    },
    // currentRequisitionStatus(requisition) {
    //   if (this.lastAndFirstRequisitionEvent(requisition).last != undefined) {
    //     return this.lastAndFirstRequisitionEvent(requisition).last.status;
    //   }
    // },
    lastAndFirstRequisitionEvent(requisition) {
      let lastAndFirstEvent = {};
      let arrayOfAllEventsOfSelectedRequisition = this.REQUISITIONS_HISTORY.filter(
        (event) => {
          return event.requisition_id == requisition.id;
        }
      );
      if (arrayOfAllEventsOfSelectedRequisition != undefined) {
        arrayOfAllEventsOfSelectedRequisition.forEach((event, index) => {
          const date = new Date(event.date);
          if (index === 0) {
            lastAndFirstEvent["first"] = lastAndFirstEvent["last"] = {
              id: event.id,
              date: date,
              status: event.status,
              requisition_id: event.requisition_id,
            };
            return;
          }
          if (date > lastAndFirstEvent["last"].date) {
            lastAndFirstEvent["last"] = {
              id: event.id,
              date: date,
              status: event.status,
              requisition_id: event.requisition_id,
            };
          }
          if (date < lastAndFirstEvent["first"].date) {
            lastAndFirstEvent["first"] = {
              id: event.id,
              date: date,
              status: event.status,
              requisition_id: event.requisition_id,
            };
          }
        });
      }
      console.log(lastAndFirstEvent, "lastAndFirstEvent");
      return lastAndFirstEvent;
    },
    //
    //
    openRequisition(requisition) {
      this.editedIndex = this.REQUISITIONS.indexOf(requisition);
      this.editedItem = Object.assign({}, requisition);
      this.dialogOpen = true;
    },
    closeRequisitionModalWindow() {
      this.dialogOpen = false;
    },
    sendToAgreement(requisition) {
      // console.log(requisition.id);
      return this.$store.dispatch("TO_AGREEMENT", requisition.id);
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
