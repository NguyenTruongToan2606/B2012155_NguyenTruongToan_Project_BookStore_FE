<template>
  <div class="flex">
    <SideBar />

    <main class="flex-1 p-6">
      <div class="flex flex-col">
        <h1 class="text-2xl font-bold mb-4">Tra cứu Sách</h1>

        <div class="mb-6">
          <input
            v-model="searchQuery"
            @input="onSearch"
            type="text"
            placeholder="Nhập tên sách mà bạn muốn tìm..."
            class="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <DataTable
          :rows="filteredBooks"
          :columns="columns"
          :sortable="true"
          :filterable="true"
          :pagination="true"
          :rowsPerPage="5"
          :onView="handleView"
        >
          <template #status="slotProps">
            <span :class="slotProps.data.statusStyle">{{
              slotProps.data.status
            }}</span>
          </template>
        </DataTable>

        <CustomModal
          :visible="isModalVisible"
          header="Chi tiết sách"
          :onCancel="handleModalCancel"
          @update:visible="isModalVisible = $event"
        >
          <div class="flex flex-col gap-2 text-xl">
            <p><strong>Tiêu đề:</strong> {{ detailedBook.title }}</p>
            <p><strong>Giá:</strong> {{ detailedBook.price }}</p>
            <p><strong>Số lượng:</strong> {{ detailedBook.quantity }}</p>
            <p><strong>Năm xuất bản:</strong> {{ detailedBook.publishYear }}</p>
            <p><strong>Nhà xuất bản:</strong> {{ detailedBook.publisher }}</p>
            <p><strong>Tác giả:</strong> {{ detailedBook.author }}</p>
            <p>
              <strong>Trạng thái: </strong>
              <span
                :class="
                  detailedBook.quantity > 0 ? 'text-green-500' : 'text-red-500'
                "
              >
                {{ detailedBook.quantity > 0 ? "Còn sách" : "Hết sách" }}
              </span>
            </p>
          </div>
        </CustomModal>
      </div>
    </main>
  </div>
</template>

<script>
import CustomModal from "@/components/commons/CustomModal.vue";
import DataTable from "@/components/commons/DataTable.vue";
import SideBar from "@/components/commons/SideBar.vue";
import bookService from "@/services/book.service";
import { ToVietnamCurrencyFormat } from "@/utils/ConvertCurrency";

export default {
  name: "SearchView",
  components: {
    DataTable,
    SideBar,
    CustomModal,
  },
  data() {
    return {
      searchQuery: "",
      books: [],
      columns: [
        { field: "id", header: "ID", sortable: true },
        { field: "title", header: "Tên Sách", sortable: true, filter: true },
        { field: "author", header: "Tác Giả", sortable: true, filter: true },
        { field: "price", header: "Giá mượn", sortable: true, filter: true },
        { field: "status", header: "Trạng Thái", sortable: true },
      ],
      isModalVisible: false,
      detailedBook: {},
    };
  },
  computed: {
    filteredBooks() {
      const query = this.searchQuery.toLowerCase();
      return this.books.filter((book) => {
        return (
          book.title?.toLowerCase().includes(query) ||
          book.author?.toLowerCase().includes(query)
        );
      });
    },
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await bookService.getAll();

        const bookArray = response.map((item) => {
          const isAvailable = item.quantity > 0;

          return {
            id: item?._id,
            title: item?.title,
            author: item?.author,
            price: ToVietnamCurrencyFormat(item?.price),
            status: isAvailable ? "Còn sách" : "Hết sách",
            statusStyle: isAvailable
              ? "text-green-500 font-bold"
              : "text-red-500 font-bold",
          };
        });
        this.books = bookArray;
      } catch (error) {
        console.error("Error fetching books:", error);
        alert("Không thể tải danh sách sách. Vui lòng thử lại sau.");
      }
    },
    async fetchBookDetails(id) {
      try {
        const book = await bookService.get(id);
        this.detailedBook = {
          title: book.title,
          price: ToVietnamCurrencyFormat(book.price),
          quantity: book.quantity,
          publishYear: book.publishYear,
          publisher: book.publisherId.publisherName,
          author: book.author,
        };
      } catch (error) {
        console.error("Error fetching book details:", error);
        alert("Không thể xem chi tiết sách. Vui lòng thử lại sau.");
      }
    },
    onSearch() {
      console.log("Search query:", this.searchQuery);
    },
    handleView(book) {
      this.isModalVisible = true;
      this.fetchBookDetails(book.id);
    },
    handleModalCancel() {
      this.isModalVisible = false;
    },
  },
  async created() {
    await this.fetchBooks();
  },
};
</script>

<style scoped></style>
