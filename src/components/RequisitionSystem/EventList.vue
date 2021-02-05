<template>
  <div>
    <v-list three-line>
      <template v-for="(event, index) in this.allEventsOfSelectedRequisition">
        <!-- <v-subheader :key="event.id" v-text="item.user"></v-subheader> -->

        <v-list-item :key="event.id">
          <v-list-item-content>
            <v-list-item-title v-html="event.status"></v-list-item-title>
            <v-list-item-subtitle v-html="event.user"></v-list-item-subtitle>

            <v-list-item-subtitle
              v-html="event.current_stage"
            ></v-list-item-subtitle>
            <v-list-item-subtitle v-html="event.date"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="index"></v-divider>
      </template>
    </v-list>
  </div>
</template>

<script>
export default {
  props: {
    allEventsOfSelectedRequisition: Array,
  },
};
</script>
