<template>
  <InputText v-model="user.email" />
  <InputText v-model="user.firstName" />
  <InputText v-model="user.lastName" />
  <InputText v-model="user.middleName" />
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { BusUserDTO } from "@/models/BusUserDTO";

export default defineComponent({
  name: "EditUserModal",

  props: {
    userData: {
      type: Object as PropType<Partial<BusUserDTO>>,
      required: true,
    },
  },

  setup(props) {
    const user = ref(props.userData);
    return {
      user,
    };
  },
});
</script>

<style scoped></style>
