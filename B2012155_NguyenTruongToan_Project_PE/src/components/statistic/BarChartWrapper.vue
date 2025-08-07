<template>
  <div class="h-full">
    <Bar
      :chartData="chartData"
      :chartOptions="chartOptions"
      class="max-h-full"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default defineComponent({
  name: "BarChartWrapper",
  components: {
    Bar,
  },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => ({}),
    },
  },
});
</script>
