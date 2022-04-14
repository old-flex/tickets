<template>
  <div class="main-page">
    <h2>Вход</h2>
    <InputMask v-model="credentials.username" mask="+7-999-999-99-99" />
    <InputText v-model="credentials.password" />
    <Button @click="login" label="Войти" />
    <Button @click="restorePassword" label="Восстановить пароль" />

    <Card>
      <template #title> Карточка пользователя </template>
      <template #content>
        <div>ID: {{ userInfo.id }}</div>
        <div>{{ userInfo.lastName }}</div>
        <div>{{ userInfo.firstName }}</div>
        <div>{{ userInfo.middleName }}</div>
        <div>{{ userInfo.phone }}</div>
        <div>{{ userInfo.email }}</div>
        <div>
          {{
            userInfo.confirmEmail
              ? "Почта подтверждена"
              : "Почта не подтверждена"
          }}
        </div>
      </template>
    </Card>
    <!--    <Button-->
    <!--      @click="showEditUserDialog = true"-->
    <!--      label="Редактировать пользователя"-->
    <!--    />-->
    <!--    <Dialog v-model:visible="showEditUserDialog">-->
    <!--      <EditUserModal :user-data="{ ...userInfo }" />-->
    <!--    </Dialog>-->

    <h2>Покупка билетов</h2>
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

    <Button @click="findRaces" label="Найти рейсы" :loading="isLoading" />

    <Button
      v-for="(race, index) in races.slice(0, 5)"
      @click="getRaceSummary(race)"
      :key="race.uid"
      :label="index + 1"
    />

    <a :href="paymentUrl">{{ paymentUrl }}</a>

    <h2>Получить заказы</h2>
    <Button @click="getUserOrders" label="Получить заказы" />
    <Fieldset
      v-for="order in userOrders"
      :key="order.id"
      :toggleable="true"
      :collapsed="true"
      :legend="`${order.id} ${order.status} ${order.created}`"
    >
      <div v-for="ticket in order.tickets" :key="ticket.id">
        {{ ticket.id }} {{ ticket.status }}
      </div>
    </Fieldset>

    <h2>Получить историю заказов</h2>
    <Button @click="getUserTrips" label="Получить историю заказов" />
    <div v-for="trip in userTrips" :key="trip.id">
      {{ trip.id }} {{ trip.status }} {{ trip.created }}
    </div>
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
import authClient, { LoginRequest } from "@/api/authClient";
import apiConfig from "@/api/apiConfig";
import paymentClient from "@/api/paymentClient";
import ordersClient from "@/api/ordersClient";
import { BusOrderDTO } from "@/models/BusOrderDTO";
import { BusUserDTO } from "@/models/BusUserDTO";
import userClient from "@/api/userClient";
import EditUserModal from "@/components/EditUserModal.vue";

export default defineComponent({
  name: "MainPage",
  components: { EditUserModal },
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

    const userOrders = ref<BusOrderDTO[]>([]);

    const userTrips = ref<BusOrderDTO[]>([]);

    const credentials = ref<LoginRequest>({
      username: "+7-906-961-25-31",
      password: "551274",
    });

    let isLoading = ref<boolean>(false);

    let userInfo = ref<Partial<BusUserDTO>>({});

    const showEditUserDialog = ref(false);

    onMounted(async () => {
      await login();

      pointsOfDeparture.value = (
        await pointsClient.getPointsOfDeparture()
      ).data;

      selectedPointOfDeparture.value = pointsOfDeparture.value.find(
        (point) => point.name === "Барнаул"
      );

      await onChangeHandler();
    });

    const findRaces = async () => {
      isLoading.value = true;
      races.value = [];

      races.value = (
        await racesClient.getRaces({
          from: selectedPointOfDeparture.value?.id ?? 1,
          to: selectedPointOfArrival.value?.id ?? 1,
          date: date.value.toLocaleDateString(),
          count: 1,
        })
      ).data;

      isLoading.value = false;
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

    const getUserOrders = async () => {
      userOrders.value = (await ordersClient.getUserOrders()).data;
    };

    const getUserTrips = async () => {
      userTrips.value = (await ordersClient.getUserTrips()).data;
    };

    const login = async () => {
      const token = (await authClient.login(credentials.value)).data
        .access_token;

      apiConfig.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await getUserMe();
    };

    const getUserMe = async () => {
      userInfo.value = {};

      userInfo.value = (await userClient.getUserMe()).data;
    };

    const restorePassword = () => {
      authClient.restorePassword(credentials.value.username);
    };

    const editUser = async () => {
      await userClient.editUser(userInfo.value);
      await getUserMe();
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
      userOrders,
      userTrips,
      credentials,
      isLoading,
      userInfo,
      showEditUserDialog,

      FilterMatchMode,

      findRaces,
      onChangeHandler,
      getRaceSummary,
      getUserOrders,
      getUserTrips,
      login,
      restorePassword,
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
