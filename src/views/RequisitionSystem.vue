<template>
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
          <RequisitionStages :editedItem="editedItem" />
        </div>
      </v-dialog>
    </template>
  </v-data-table>
</template>

<script>
import TopTable from "@/components/RequisitionSystem/TopTable";
import RequisitionStages from "@/components/RequisitionSystem/RequisitionStages";
import { mapGetters } from "vuex";

export default {
  components: { TopTable, RequisitionStages },
  data: () => ({
    search: { search: "" },
    dialogOpen: false,
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
    openRequisition(requisition) {
      this.editedIndex = this.REQUISITIONS.indexOf(requisition);
      this.editedItem = Object.assign({}, requisition);
      this.dialogOpen = true;
    },
    sendToAgreement(requisition) {
      console.log(requisition.id);
      return this.$store.dispatch("CHANGE_STATUS_TO_AGREEMENT", requisition.id);
    },
  },
  computed: {
    ...mapGetters(["REQUISITIONS"]),
  },
};
</script>
