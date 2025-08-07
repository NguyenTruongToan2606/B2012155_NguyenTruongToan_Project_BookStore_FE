<template>
  <div class="flex">
    <SideBar />

    <main class="flex-1 p-6">
      <div class="flex flex-col">
        <h1 class="text-2xl font-bold mb-4">Quản lý Sách</h1>

        <div class="flex justify-end gap-4 items-center w-1/4 ms-auto mb-4">
          <button
            class="bg-green-500 px-3 py-2 rounded-md flex items-center gap-1 text-white"
            @click="openAddBookModal"
          >
            <i class="pi pi-plus"></i> Thêm mới sách
          </button>
          <button
            class="bg-blue-500 px-3 py-2 rounded-md flex items-center gap-1 text-white"
            @click="openEditBookModal"
          >
            <i class="pi pi-pen-to-square"></i> Chỉnh sửa
          </button>
        </div>

        <DataTable
          :rows="filteredBooks"
          :columns="columns"
          :sortable="true"
          :filterable="true"
          :pagination="true"
          :rowsPerPage="5"
          v-model:selection="selectedBooks"
          :onView="handleView"
          :onDelete="handleDelete"
        />

        <!-- Modal chi tiết sách -->
        <CustomModal
          :visible="isDetailModalVisible"
          header="Chi tiết sách"
          :onCancel="closeDetailModal"
          @update:visible="isDetailModalVisible = $event"
        >
          <div class="flex flex-col gap-2 text-xl">
            <p><strong>Id:</strong> {{ detailedBook.id }}</p>
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

        <!-- Modal Thêm sách -->
        <CustomModal
          :visible="isModalVisible"
          :header="modalHeader"
          :onOk="handleModalOk"
          :onCancel="handleModalCancel"
          @update:visible="isModalVisible = $event"
        >
          <form>
            <div class="mb-4">
              <label class="block font-medium">Tiêu đề</label>
              <input
                type="text"
                v-model="currentBook.title"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label class="block font-medium">Tác giả</label>
              <input
                type="text"
                v-model="currentBook.author"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label class="block font-medium">Giá</label>
              <input
                type="number"
                v-model="currentBook.price"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label class="block font-medium">Số lượng</label>
              <input
                type="number"
                v-model="currentBook.quantity"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label class="block font-medium">Năm xuất bản</label>
              <input
                type="number"
                v-model="currentBook.publishYear"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label class="block font-medium">Nhà xuất bản</label>
              <select
                v-model="currentBook.publisherId"
                class="w-full p-2 border border-gray-300 rounded"
              >
                <option
                  v-for="publisher in publishers"
                  :key="publisher._id"
                  :value="publisher._id"
                >
                  {{ publisher.publisherName }}
                </option>
              </select>
            </div>
          </form>
        </CustomModal>
      </div>
    </main>
  </div>
</template>

<script>
import DataTable from "@/components/commons/DataTable.vue";
import SideBar from "@/components/commons/SideBar.vue";
import CustomModal from "@/components/commons/CustomModal.vue";
import { ToVietnamCurrencyFormat } from "@/utils/ConvertCurrency";
import bookService from "@/services/book.service";
import publisherService from "@/services/publisher.service"; // Import publisher service

export default {
  name: "BooksView",
  components: {
    DataTable,
    SideBar,
    CustomModal,
  },
  data() {
    return {
      searchQuery: "",
      selectedBooks: [],
      books: [],
      publishers: [],
      columns: [
        { field: "title", header: "Tên Sách", sortable: true, filter: true },
        { field: "author", header: "Tác Giả", sortable: true, filter: true },
        {
          field: "publisher",
          header: "Nhà Xuất Bản",
          sortable: true,
          filter: true,
        },
        { field: "price", header: "Đơn Giá", sortable: true },
        { field: "quantity", header: "Số Lượng", filter: true },
      ],
      isModalVisible: false,
      modalHeader: "",
      isDetailModalVisible: false,
      detailedBook: {},
      currentBook: this.createEmptyBook(),
      isEditing: false,
    };
  },
  computed: {
    filteredBooks() {
      const query = this.searchQuery.toLowerCase();
      return this.books.filter((book) => {
        return (
          book?.title?.toLowerCase()?.includes(query) ||
          book?.author?.toLowerCase()?.includes(query)
        );
      });
    },
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await bookService.getAll();
        const bookArray = response.map((item) => ({
          id: item?._id,
          title: item?.title,
          author: item?.author,
          publisher: item?.publisherId?.publisherName,
          price: ToVietnamCurrencyFormat(item?.price),
          quantity: item?.quantity,
        }));
        this.books = bookArray;
      } catch (error) {
        console.error("Error fetching books:", error);
        alert("Không thể tải danh sách sách. Vui lòng thử lại sau.");
      }
    },
    async fetchPublishers() {
      try {
        const response = await publisherService.getAll();
        this.publishers = response;
      } catch (error) {
        console.error("Error fetching publishers:", error);
        alert("Không thể tải danh sách nhà xuất bản. Vui lòng thử lại sau.");
      }
    },
    handleView(book) {
      this.fetchBookDetails(book.id);
    },
    async handleDelete(book) {
      try {
        const confirmDelete = confirm(
          `Bạn có chắc chắn muốn xóa sách "${book.title}" không?`
        );
        if (!confirmDelete) return;

        await bookService.delete(book.id);

        this.books = this.books.filter((b) => b.id !== book.id);

        alert("Xóa sách thành công!");
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Không thể xóa sách. Vui lòng thử lại sau.");
      }
    },
    async fetchBookDetails(id) {
      try {
        const book = await bookService.get(id);
        this.detailedBook = {
          id: book._id,
          title: book.title,
          price: ToVietnamCurrencyFormat(book.price),
          quantity: book.quantity,
          publishYear: book.publishYear,
          publisher: book.publisherId.publisherName,
          author: book.author,
        };
        this.isDetailModalVisible = true;
      } catch (error) {
        console.error("Error fetching book details:", error);
        alert("Không thể xem chi tiết sách. Vui lòng thử lại sau.");
      }
    },
    closeDetailModal() {
      this.isDetailModalVisible = false;
    },
    createEmptyBook() {
      return {
        title: "",
        author: "",
        price: null,
        quantity: null,
        publishYear: null,
        publisherId: null,
      };
    },
    openAddBookModal() {
      this.modalHeader = "Thêm mới sách";
      this.currentBook = this.createEmptyBook();
      this.isEditing = false;
      this.isModalVisible = true;
    },
    openEditBookModal() {
      if (this.selectedBooks.length !== 1) {
        alert("Vui lòng chọn một sách để chỉnh sửa.");
        return;
      }
      this.modalHeader = "Chỉnh sửa sách";

      const selectedBook = this.selectedBooks[0];
      const detailedBook = this.books.find(
        (book) => book.id === selectedBook.id
      );

      if (detailedBook) {
        this.currentBook = {
          title: detailedBook.title,
          author: detailedBook.author,
          price: Number(detailedBook.price.replace(/\D/g, "")), // Chuyển giá về số
          quantity: detailedBook.quantity,
          publishYear: detailedBook.publishYear,
          publisherId: this.getPublisherIdByName(detailedBook.publisher), // Chuyển publisherName thành publisherId
        };
      }

      this.isEditing = true;
      this.isModalVisible = true;
    },
    getPublisherIdByName(name) {
      const publisher = this.publishers.find((p) => p.publisherName === name);
      return publisher ? publisher._id : null;
    },
    async handleModalOk() {
      try {
        if (this.isEditing) {
          const { title, author, price, quantity, publishYear, publisherId } =
            this.currentBook;

          await bookService.update(this.selectedBooks[0].id, {
            title,
            author,
            price,
            quantity,
            publishYear,
            publisherId,
          });

          await this.fetchBooks();
        } else {
          const createdBook = await bookService.create(this.currentBook);
          this.books.push({
            ...createdBook,
            publisher: this.getPublisherNameById(createdBook.publisherId), // Đổi publisherId sang publisherName để hiển thị
            price: ToVietnamCurrencyFormat(createdBook.price),
          });
        }
        this.isModalVisible = false;
      } catch (error) {
        console.error("Error saving book:", error);
        alert("Đã xảy ra lỗi khi lưu sách. Vui lòng thử lại.");
      }
    },
    getPublisherNameById(id) {
      const publisher = this.publishers.find((p) => p._id === id);
      return publisher ? publisher.publisherName : "";
    },
    handleModalCancel() {
      this.isModalVisible = false;
    },
  },
  async created() {
    await this.fetchBooks();
    await this.fetchPublishers();
  },
};
</script>
