<template>
  <div class="flex h-screen">
    <SideBar />

    <main
      class="flex flex-col gap-16 p-6 h-full overflow-auto no-scrollbar w-[80%]"
    >
      <div
        class="bg-white p-4 rounded shadow-lg shadow-slate-400 w-full mt-6 h-[30rem]"
      >
        <h3 class="text-lg font-semibold mb-4">Thống kê sách</h3>
        <BarChartWrapper
          :chart-data="chartData"
          :chart-options="chartOptions"
        />
      </div>

      <div class="flex justify-between items-start pb-10">
        <div class="bg-white p-4 rounded shadow-lg shadow-slate-400 w-[47%]">
          <h3 class="text-lg font-semibold mb-4">Top Độc Giả</h3>
          <DataTable
            :rows="topReaders"
            :columns="topReaderColumns"
            :sortable="true"
            :pagination="true"
          />
        </div>

        <div class="bg-white p-4 rounded shadow-lg shadow-slate-400 w-[47%]">
          <h3 class="text-lg font-semibold mb-4">Top Sách Yêu Thích</h3>
          <DataTable
            :rows="topBooks"
            :columns="topBooksColumns"
            :sortable="true"
            :pagination="true"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import BarChartWrapper from "@/components/statistic/BarChartWrapper.vue";
import DataTable from "@/components/commons/DataTable.vue";
import SideBar from "@/components/commons/SideBar.vue";
import statisticService from "@/services/statistic.service";

export default {
  name: "StatisticView",
  components: {
    BarChartWrapper,
    DataTable,
    SideBar,
  },
  data() {
    return {
      borrowedBooks: 10,
      totalBooks: 10,
      chartData: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "Số sách đang được mượn",
            backgroundColor: "#42A5F5",
            data: this.borrowingBooks,
          },
          {
            label: "Tổng số sách hiện có",
            backgroundColor: "#FF6384",
            data: this.bookCount,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Thống kê mượn sách",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
      topReaders: [],
      topReaderColumns: [
        { field: "name", header: "Tên Người Dùng" },
        { field: "borrowCount", header: "Số Lần Mượn Sách" },
      ],
      topBooks: [],
      topBooksColumns: [
        { field: "title", header: "Tên Sách" },
        {
          field: "borrowCount",
          header: "Số Lần Được Mượn",
        },
      ],
    };
  },
  methods: {
    async getTopBooks() {
      try {
        const response = await statisticService.getTopBooks();

        this.topBooks = response;
      } catch (error) {
        console.log(error);
      }
    },

    async getTopReaders() {
      const response = await statisticService.getTopReaders();

      const readers = response.map((reader) => ({
        ...reader,
        name: `${reader.firstName} ${reader.lastName}`,
      }));

      this.topReaders = readers;
    },

    async getMonthlyStat() {
      const response = await statisticService.getMonthlyStat();

      const borrowingBooks = response.map((item) => item.borrowingBooks);
      const bookCount = response.map((item) => item.bookCount);

      this.chartData = {
        ...this.chartData,
        datasets: [
          {
            label: "Số sách đang được mượn",
            backgroundColor: "#42A5F5",
            data: borrowingBooks,
          },
          {
            label: "Tổng số sách hiện có",
            backgroundColor: "#FF6384",
            data: bookCount,
          },
        ],
      };
    },
  },
  async created() {
    await this.getTopBooks();
    await this.getTopReaders();
    await this.getMonthlyStat();
  },
};
</script>

<style scoped>
canvas#bar-chart {
  height: 100px !important;
}
</style>
