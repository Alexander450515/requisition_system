<template>
  <div>
    <!-- Передать на визирование -->
    <v-btn
      v-if="item.status == 'Создана'"
      color="success"
      small
      rounded
      dark
      @click="$emit('sendToAgreement')"
    >
      Передать на визирование
    </v-btn>
    <!-- Открыть (для визирования)-->
    <v-btn
      v-if="item.status == 'Передана на визирование'"
      :color="color"
      small
      rounded
      dark
      @click="$emit('openRequisition')"
    >
      Открыть
    </v-btn>
    <!-- Передать к исполнению -->
    <v-btn
      v-if="item.status == 'Утверждена'"
      :color="color"
      small
      rounded
      dark
      @click="$emit('openRequisition')"
    >
      Передать к исполнению
    </v-btn>
    <!-- Вернуть на визирование -->
    <v-btn
      v-if="item.status == 'Отклонена'"
      :color="color"
      small
      rounded
      dark
      @click="$emit('openRequisition')"
    >
      Вернуть на визирование
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    havePermission: Function,
    editedItem: Object,
  },
  computed: {
    color() {
      return this.havePermission(this.item) ? "success" : "grey";
    },
  },
};
</script>
