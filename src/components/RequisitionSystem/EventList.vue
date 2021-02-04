<template>
  <div>
    EventList
    <v-list three-line>
      <template v-for="event in this.allEventsOfSelectedRequisition">
        <!-- <v-subheader :key="event.id" v-text="item.user"></v-subheader> -->

        <!-- <v-divider :key="index" :inset="event.inset"></v-divider> -->
        <v-list-item :key="event.id">
          <v-list-item-content>
            <v-list-item-title v-html="item.title"></v-list-item-title>
            <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
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
