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
      @click="getRaceSummary(race)"
      :key="race.uid"
      :label="index + 1"
    />

    <a :href="paymentUrl">{{ paymentUrl }}</a>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import pointsClient from "@/api/pointsClient";
import { PointDTO } from "@/models/PointDTO";
import { FilterMatchMode } from "primevue/api";
import racesClient from "@/api/racesClient";
import { RaceDTO } from "@/models/RaceDTO";
import { SeatDTO } from "@/models/RaceSummaryDTO";
import authClient from "@/api/authClient";
import apiConfig from "@/api/apiConfig";
import paymentClient from "@/api/paymentClient";

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

    const freeSeat = ref<SeatDTO>();

    const paymentUrl = ref<string>("");

    onMounted(async () => {
      const token = (
        await authClient.login({
          username: "+7-906-961-25-31",
          password: "551274",
        })
      ).data.access_token;

      apiConfig.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      pointsOfDeparture.value = (
        await pointsClient.getPointsOfDeparture()
      ).data;

      selectedPointOfDeparture.value = pointsOfDeparture.value.find(
        (point) => point.name === "Барнаул"
      );

      await onChangeHandler();
    });

    const findRaces = async () => {
      races.value = [];

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

    const getRaceSummary = async (race: RaceDTO) => {
      freeSeat.value = (
        await racesClient.getRaceSummary(race.uid)
      ).data.seats[0];

      const orderId = (
        await racesClient.ticketReservation(race.uid, {
          birthday: "2022-04-13T15:51:45.360Z",
          citizenship: "Россия",
          docNum: "000000",
          docSeries: "1111",
          docTypeCode: "1",
          firstName: "Kostyan",
          gender: "M",
          lastName: "Konstantinov",
          middleName: "Konstantinovich",
          phone: "+7-906-961-25-31",
          seatCode: freeSeat.value?.code,
          ticketTypeCode: "1#1#0",
        })
      ).data.id;

      paymentUrl.value = (
        await paymentClient.getPaymentUrl({
          orderIds: [+orderId],
          paymentTypeId: 1,
        })
      ).data.url;
    };

    return {
      pointsOfDeparture,
      selectedPointOfDeparture,
      pointsOfArrival,
      selectedPointOfArrival,
      date,
      races,
      freeSeat,
      paymentUrl,

      FilterMatchMode,

      findRaces,
      onChangeHandler,
      getRaceSummary,
    };
  },
});
</script>

<style lang="less" scoped>
.main-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 40px;
  align-items: center;
  gap: 20px;

  .p-component {
    width: 400px;
  }
}
</style>
