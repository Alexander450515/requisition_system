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
    <div class="d-inline">
      <!--  -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn class="mr-10" small rounded text>
          Посмотреть список всех действийявку
        </v-btn>
        <div class="white">
          <EventList />
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
    checkAllEvents() {
      this.dialog = true;
    },
  },
};
</script>
