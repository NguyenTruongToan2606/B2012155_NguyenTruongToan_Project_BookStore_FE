<template>
  <div class="flex">
    <Sidebar />

    <main class="flex-1 p-6 w-full">
      <h1 class="text-2xl font-bold mb-6">Lịch Sử Mượn Sách</h1>

      <div class="flex justify-between items-center w-1/4 ms-auto">
        <button
          @click="openModal"
          class="bg-green-500 text-white py-3 px-6 rounded-md ms-auto mb-4 flex justify-between items-center gap-4"
        >
          <i class="pi pi-plus"></i> Thuê sách
        </button>

        <button
          @click="handleReturnBook"
          class="bg-blue-500 text-white py-3 px-6 rounded-md ms-auto mb-4 flex justify-between items-center gap-4"
        >
          <i class="pi pi-check"></i> Trả sách
        </button>
      </div>

      <DataTable
        :rows="records"
        :columns="columns"
        :sortable="true"
        :filterable="true"
        :pagination="true"
        :rowsPerPage="5"
        :selection="selectedRecords"
        @update:selection="updateSelection"
      />

      <div
        v-if="isModalOpen"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white rounded-lg p-6 w-96">
          <h2 class="text-xl font-bold mb-4">Thuê Sách</h2>
          <form @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label
                for="reader"
                class="block text-sm font-medium text-gray-700"
              >
                Độc giả
              </label>
              <select
                v-model="form.reader"
                id="reader"
                class="mt-1 block w-full border border-gray-300 rounded py-2 px-3 shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="" disabled>Chọn độc giả</option>
                <option
                  v-for="reader in readers"
                  :key="reader._id"
                  :value="reader._id"
                >
                  {{ reader.firstName + " " + reader.lastName }}
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label for="book" class="block text-sm font-medium text-gray-700">
                Sách
              </label>
              <select
                v-model="form.book"
                id="book"
                class="mt-1 block w-full border border-gray-300 rounded py-2 px-3 shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="" disabled>Chọn sách</option>
                <option v-for="book in books" :key="book._id" :value="book._id">
                  {{ book.title }}
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label
                for="borrowDate"
                class="block text-sm font-medium text-gray-700"
              >
                Ngày mượn
              </label>
              <input
                v-model="form.borrowDate"
                type="date"
                id="borrowDate"
                class="mt-1 block w-full border border-gray-300 rounded py-2 px-3 shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div class="flex justify-end gap-2">
              <button
                type="button"
                @click="closeModal"
                class="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Xác nhận
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Sidebar from "@/components/commons/SideBar.vue";
import DataTable from "@/components/commons/DataTable.vue";
import formatDate, { convertToISODate } from "@/utils/FormatDate";
import borrowingRecordService from "@/services/borrowingRecord.service";
import readerService from "@/services/reader.service.js";
import bookService from "@/services/book.service.js";
import { ToVietnamCurrencyFormat } from "@/utils/ConvertCurrency";

export default {
  name: "HomeView",
  components: {
    Sidebar,
    DataTable,
  },
  data() {
    return {
      isModalOpen: false,
      form: {
        reader: "",
        book: "",
        borrowDate: "",
      },
      readers: [],
      books: [],
      records: [],
      selectedRecords: [],
      columns: [
        { field: "title", header: "Tên Sách", sortable: true, filter: true },
        { field: "reader", header: "Người Mượn", sortable: true, filter: true },
        { field: "price", header: "Đơn Giá", sortable: true },
        { field: "borrowDate", header: "Ngày Mượn", sortable: true },
        { field: "returnDate", header: "Ngày Trả", sortable: true },
      ],
    };
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await borrowingRecordService.getAll();
        const bookArray = response
          .filter((item) => item?.bookId && item?.readerId)
          .map((item) => {
            const returnDate = formatDate(item?.returnDate)
              ? formatDate(item?.returnDate)
              : "Chưa trả";

            return {
              id: item?._id,
              title: item?.bookId?.title,
              reader: `${item?.readerId?.firstName} ${item?.readerId?.lastName}`,
              price: ToVietnamCurrencyFormat(item?.bookId?.price),
              borrowDate: formatDate(item?.borrowDate),
              returnDate,
            };
          });
        this.records = bookArray;
      } catch (error) {
        console.error("Error fetching books:", error);
        alert("Không thể tải danh sách sách. Vui lòng thử lại sau.");
      }
    },
    async fetchReadersAndBooks() {
      try {
        const [readers, books] = await Promise.all([
          readerService.getAll(),
          bookService.getAll(),
        ]);
        this.readers = readers;
        this.books = books;
      } catch (error) {
        console.error("Error fetching readers/books:", error);
        alert(
          "Không thể tải thông tin độc giả hoặc sách. Vui lòng thử lại sau."
        );
      }
    },
    async handleReturnBook() {
      if (!this.selectedRecords || this.selectedRecords.length === 0) {
        alert("Vui lòng chọn ít nhất một sách để trả.");
        return;
      }

      const confirmReturn = confirm(
        `Bạn có chắc chắn muốn trả các sách đã chọn không?`
      );

      if (!confirmReturn) return;

      try {
        const promises = this.selectedRecords.map((record) => {
          console.log(record);
          const formattedBorrowDate = convertToISODate(record.borrowDate);
          return borrowingRecordService.update(record.id, {
            borrowDate: formattedBorrowDate,
            returnDate: new Date().toISOString(),
          });
        });

        await Promise.all(promises);

        alert("Trả sách thành công!");
        await this.fetchBooks();
      } catch (error) {
        console.error("Error returning book:", error);
        alert("Không thể trả sách. Vui lòng thử lại.");
      }
    },
    async handleSubmit() {
      try {
        const payload = {
          readerId: this.form.reader,
          bookId: this.form.book,
          borrowDate: this.form.borrowDate,
        };

        await borrowingRecordService.create(payload);

        alert("Thuê sách thành công!");
        this.closeModal();
        await this.fetchBooks();
      } catch (error) {
        console.error("Error creating borrowing record:", error);
        alert("Thuê sách thất bại. Vui lòng thử lại.");
      }
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.resetForm();
    },
    updateSelection(newSelection) {
      console.log("Updated selection:", newSelection);
      this.selectedRecords = newSelection;
    },
    resetForm() {
      this.form = {
        reader: "",
        book: "",
        borrowDate: "",
      };
    },
  },
  async created() {
    await Promise.all([this.fetchBooks(), this.fetchReadersAndBooks()]);
  },
};
</script>
