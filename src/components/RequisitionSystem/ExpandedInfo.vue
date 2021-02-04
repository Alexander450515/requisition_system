<template>
  <div class="d-flex justify-space-between">
    <div class="d-inline pt-1">
      <strong>Последнее действие:</strong>
      {{
        `${lastEvent(item).user} изменил статус заявки на "${
          lastEvent(item).status
        }" ${lastEvent(item).date}. Текущий этап визирования: "${
          lastEvent(item).current_stage != ""
            ? lastEvent(item).current_stage
            : "Визирование еще не началось"
        }".`
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
          <EventList @closeModalWindow="closeModalWindow" />
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
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    closeModalWindow() {
      this.dialog = false;
    },
  },
};
</script>
