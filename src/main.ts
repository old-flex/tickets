import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "primevue/resources/themes/lara-light-blue/theme.css";
import "primevue/resources/primevue.css";
import "primeicons/primeicons.css";

import PrimeVue from "primevue/config";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import Fieldset from "primevue/fieldset";
import Card from "primevue/card";
import Dialog from "primevue/dialog";

createApp(App)
  .use(store)
  .use(router)
  .use(PrimeVue)
  .component("Dropdown", Dropdown)
  .component("Calendar", Calendar)
  .component("Button", Button)
  .component("InputText", InputText)
  .component("InputMask", InputMask)
  .component("Fieldset", Fieldset)
  .component("Card", Card)
  .component("Dialog", Dialog)
  .mount("#app");
