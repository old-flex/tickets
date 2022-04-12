<template>
  <div class="main-page">
    <Dropdown
      @change="onChangeHandler"
      v-model="selectedPointOfDeparture"
      :options="pointsOfDeparture"
      option-label="name"
      placeholder="Выберите точку отправления"
      :filter="true"
      filter-placeholder="Найти точку отправления"
      empty-filter-message="Точка не найдена"
      empty-message="Список пуст"
    />

    <Dropdown
      v-model="selectedPointOfArrival"
      :options="pointsOfArrival"
      option-label="name"
      placeholder="Выберите точку прибытия"
      :filter="true"
      filter-placeholder="Найти точку отправления"
      empty-filter-message="Точка не найдена"
      empty-message="Список пуст"
      :filter-match-mode="FilterMatchMode.CONTAINS"
    />

    <Calendar v-model="date" date-format="dd.mm.yy" />

    <Button @click="findRaces" label="Найти рейсы" />

    <Button
      v-for="(race, index) in races.slice(0, 5)"
      :key="race.uid"
      :label="index + 1"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import pointsClient from "@/api/pointsClient";
import { PointDTO } from "@/models/PointDTO";
import { FilterMatchMode } from "primevue/api";
import racesClient from "@/api/racesClient";
import { RaceDTO } from "@/models/RaceDTO";

export default defineComponent({
  name: "MainPage",

  setup() {
    const pointsOfDeparture = ref<PointDTO[]>([]);
    const selectedPointOfDeparture = ref<PointDTO>();

    const pointsOfArrival = ref<PointDTO[]>([]);
    const selectedPointOfArrival = ref<PointDTO>();

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = ref(tomorrow);

    const races = ref<RaceDTO[]>([]);

    onMounted(async () => {
      pointsOfDeparture.value = (
        await pointsClient.getPointsOfDeparture()
      ).data;

      selectedPointOfDeparture.value = pointsOfDeparture.value.find(
        (point) => point.name === "Барнаул"
      );

      await onChangeHandler();
    });

    const findRaces = async () => {
      races.value = (
        await racesClient.getRaces({
          from: selectedPointOfDeparture.value?.id ?? 1,
          to: selectedPointOfArrival.value?.id ?? 1,
          date: date.value.toLocaleDateString(),
          count: 1,
        })
      ).data;
    };

    const onChangeHandler = async () => {
      pointsOfArrival.value = [];

      if (selectedPointOfDeparture.value?.id) {
        pointsOfArrival.value = (
          await pointsClient.getPointsOfArrival(
            selectedPointOfDeparture.value.id
          )
        ).data;

        selectedPointOfArrival.value = pointsOfArrival.value.find(
          (point) => point.name === "Новосибирск"
        );
      }
    };

    return {
      pointsOfDeparture,
      selectedPointOfDeparture,
      pointsOfArrival,
      selectedPointOfArrival,
      date,
      races,

      FilterMatchMode,

      findRaces,
      onChangeHandler,
    };
  },
});
</script>

<style lang="less" scoped>
.main-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;

  .p-component {
    width: 400px;
  }
}
</style>
