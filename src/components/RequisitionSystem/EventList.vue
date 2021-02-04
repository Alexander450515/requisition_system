<template>
  <div>
    EventList
    <!-- <v-list three-line>
      <template v-for="(item, index) in items">
        <v-subheader
          v-if="item.header"
          :key="item.header"
          v-text="item.header"
        ></v-subheader>

        <v-divider :key="index" :inset="item.inset"></v-divider>

        <v-list-item :key="item.title">
          <v-list-item-avatar>
            <v-img :src="item.avatar"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-html="item.title"></v-list-item-title>
            <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list> -->
  </div>
</template>

<script>
export default {
  props: {
    allEventsOfSelectedRequisition: Function,
  },
  computed: {
    test() {
      console.log(this.allEventsOfSelectedRequisition, "allEvents");
      return this.allEventsOfSelectedRequisition;
    },
  },
};
</script>
