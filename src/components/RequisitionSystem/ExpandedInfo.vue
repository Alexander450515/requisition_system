<template>
  <div class="d-flex justify-space-between">
    <div class="d-inline pt-1">
      <strong>Последнее действие:</strong>
      {{
        `${lastEvent(item).user} изменил статус заявки на "${
          lastEvent(item).status
        }" ${lastEvent(item).date}. ${this.currentStageName}.`
      }}
    </div>
    <div class="d-inline mr-10">
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn small rounded text v-bind="attrs" v-on="on">
            Посмотреть список всех действий
          </v-btn>
        </template>
        <div class="white">
          <EventList
            @closeModalWindow="closeModalWindow"
            :allEventsOfSelectedRequisition="allEventsOfSelectedRequisition"
          />
        </div>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import EventList from "@/components/RequisitionSystem/EventList";

export default {
  components: { EventList },

  props: {
    item: Object,
    lastEvent: Function,
    allEventsOfSelectedRequisition: Array,
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    closeModalWindow() {
      this.dialog = false;
    },
  },
  computed: {
    currentStageName() {
      if (this.lastEvent(this.item).current_stage) {
        return `Текущий этап визирования: "${
          this.lastEvent(this.item).current_stage
        }"`;
      } else if (this.lastEvent(this.item).current_stage != undefined) {
        return "Визирование еще не началось";
      } else {
        return "Визирование закончено";
      }
    },
  },
};
</script>
