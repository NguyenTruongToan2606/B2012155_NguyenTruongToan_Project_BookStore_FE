import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import router from "./router";

import Aura from "@primevue/themes/aura";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";

const app = createApp(App);

app.use(router);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: "system",
      cssLayer: false,
    },
  },
});

app.mount("#app");
