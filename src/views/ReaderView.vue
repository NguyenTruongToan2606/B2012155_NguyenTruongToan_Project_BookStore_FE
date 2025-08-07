<template>
  <div class="flex">
    <SideBar />

    <main class="flex-1 p-6">
      <div class="flex flex-col">
        <h1 class="text-2xl font-bold mb-4">Quản lý Độc giả</h1>

        <div class="flex justify-end gap-4 items-center w-1/4 ms-auto mb-4">
          <button
            class="bg-green-500 px-3 py-2 rounded-md flex items-center gap-1 text-white"
            @click="openAddReaderModal"
          >
            <i class="pi pi-plus"></i> Thêm mới độc giả
          </button>
          <button
            class="bg-blue-500 px-3 py-2 rounded-md flex items-center gap-1 text-white"
            @click="openEditReaderModal"
          >
            <i class="pi pi-pen-to-square"></i> Chỉnh sửa
          </button>
        </div>

        <DataTable
          :rows="filteredReaders"
          :columns="columns"
          :sortable="true"
          :filterable="true"
          :pagination="true"
          :rowsPerPage="5"
          v-model:selection="selectedReaders"
          :onView="handleView"
          :onDelete="handleDelete"
        />

        <!-- Modal chi tiết độc giả -->
        <CustomModal
          :visible="isDetailModalVisible"
          header="Chi tiết độc giả"
          :onCancel="closeDetailModal"
          @update:visible="isDetailModalVisible = $event"
        >
          <div class="flex flex-col gap-2 text-xl">
            <p><strong>Id:</strong> {{ detailedReader.id }}</p>
            <p><strong>Tên:</strong> {{ detailedReader.name }}</p>
            <p><strong>Ngày sinh:</strong> {{ detailedReader.dateOfBirth }}</p>
            <p><strong>Địa chỉ:</strong> {{ detailedReader.address }}</p>
            <p><strong>Số điện thoại:</strong> {{ detailedReader.phone }}</p>
          </div>
        </CustomModal>

        <!-- Modal Thêm/Sửa độc giả -->
        <CustomModal
          :visible="isModalVisible"
          :header="modalHeader"
          :onOk="handleModalOk"
          :onCancel="handleModalCancel"
          @update:visible="isModalVisible = $event"
        >
          <form>
            <div class="mb-4">
              <label class="block font-medium">Họ</label>
              <input
                type="text"
                v-model="currentReader.firstName"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label class="block font-medium">Tên</label>
              <input
                type="text"
                v-model="currentReader.lastName"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label class="block font-medium">Ngày sinh</label>
              <input
                type="date"
                v-model="currentReader.dateOfBirth"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label class="block font-medium">Giới tính</label>
              <select
                v-model="currentReader.gender"
                class="w-full p-2 border border-gray-300 rounded"
              >
                <option :value="'Male'">Nam</option>

                <option :value="'Female'">Nữ</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block font-medium">Địa chỉ</label>
              <input
                type="text"
                v-model="currentReader.address"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="mb-4">
              <label class="block font-medium">Số điện thoại</label>
              <input
                type="text"
                v-model="currentReader.phone"
                class="w-full p-2 border border-gray-300 rounded"
              />
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
import readerService from "@/services/reader.service";
import formatDate, { convertToISODate } from "@/utils/FormatDate";

export default {
  name: "ReadersView",
  components: {
    DataTable,
    SideBar,
    CustomModal,
  },
  data() {
    return {
      selectedReaders: [],
      readers: [],
      columns: [
        { field: "name", header: "Tên Độc Giả", sortable: true, filter: true },
        {
          field: "dateOfBirth",
          header: "Ngày sinh",
          sortable: true,
          filter: true,
        },
        { field: "address", header: "Địa Chỉ", sortable: true },
        { field: "phone", header: "Số Điện Thoại", filter: true },
      ],
      isModalVisible: false,
      modalHeader: "",
      isDetailModalVisible: false,
      detailedReader: {},
      currentReader: this.createEmptyReader(),
      isEditing: false,
    };
  },
  computed: {
    filteredReaders() {
      return this.readers;
    },
  },
  methods: {
    async fetchReaders() {
      try {
        const response = await readerService.getAll();
        this.readers = response.map((reader) => ({
          id: reader._id,
          name: reader.firstName + " " + reader.lastName,
          dateOfBirth: formatDate(reader.dateOfBirth),
          address: reader.address,
          phone: reader.phone,
        }));
      } catch (error) {
        console.error("Error fetching readers:", error);
        alert("Không thể tải danh sách độc giả. Vui lòng thử lại sau.");
      }
    },
    createEmptyReader() {
      return {
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        phone: "",
      };
    },
    openAddReaderModal() {
      this.modalHeader = "Thêm mới độc giả";
      this.currentReader = this.createEmptyReader();
      this.isEditing = false;
      this.isModalVisible = true;
    },
    openEditReaderModal() {
      if (this.selectedReaders.length !== 1) {
        alert("Vui lòng chọn một độc giả để chỉnh sửa.");
        return;
      }
      this.modalHeader = "Chỉnh sửa độc giả";
      const selectedReader = this.selectedReaders[0];
      this.currentReader = {
        ...selectedReader,
        firstName: selectedReader.name.split(" ")[0],
        lastName: selectedReader.name.split(" ")[1],
      };
      this.isEditing = true;
      this.isModalVisible = true;
    },
    async handleModalOk() {
      try {
        if (this.isEditing) {
          const payload = {
            firstName: this.currentReader.firstName,
            lastName: this.currentReader.lastName,
            dateOfBirth: convertToISODate(this.currentReader.dateOfBirth),
            gender: this.currentReader.gender,
            address: this.currentReader.address,
            phone: this.currentReader.phone,
          };
          await readerService.update(this.selectedReaders[0].id, payload);
        } else {
          console.log(this.currentReader);
          const payload = {
            firstName: this.currentReader.firstName,
            lastName: this.currentReader.lastName,
            dateOfBirth: convertToISODate(this.currentReader.dateOfBirth),
            gender: this.currentReader.gender,
            address: this.currentReader.address,
            phone: this.currentReader.phone,
          };
          const createdReader = await readerService.create(payload);
          this.readers.push(createdReader);
        }
        await this.fetchReaders();
        this.isModalVisible = false;
      } catch (error) {
        console.error("Error saving reader:", error);
        alert("Đã xảy ra lỗi khi lưu độc giả. Vui lòng thử lại.");
      }
    },
    async fetchReaderDetails(id) {
      try {
        const reader = await readerService.get(id);
        this.detailedReader = {
          id: reader._id,
          name: reader.firstName + " " + reader.lastName,
          dateOfBirth: formatDate(reader.dateOfBirth),
          address: reader.address,
          phone: reader.phone,
        };
        this.isDetailModalVisible = true;
      } catch (error) {
        console.error("Error fetching book details:", error);
        alert("Không thể xem chi tiết sách. Vui lòng thử lại sau.");
      }
    },
    handleView(book) {
      this.isDetailModalVisible = true;
      this.fetchReaderDetails(book.id);
    },
    async handleDelete(reader) {
      try {
        const confirmDelete = confirm(
          `Bạn có chắc chắn muốn xóa độc giả "${reader.name}" không?`
        );
        if (!confirmDelete) return;
        await readerService.delete(reader.id);
        this.readers = this.readers.filter((r) => r.id !== reader.id);
        alert("Xóa độc giả thành công!");
      } catch (error) {
        console.error("Error deleting reader:", error);
        alert("Không thể xóa độc giả. Vui lòng thử lại sau.");
      }
    },
    closeDetailModal() {
      this.isDetailModalVisible = false;
    },
    handleModalCancel() {
      this.isModalVisible = false;
    },
  },
  async created() {
    await this.fetchReaders();
  },
};
</script>
