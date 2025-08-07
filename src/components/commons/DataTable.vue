<template>
  <div>
    <p-dataTable
      :value="rows"
      :paginator="pagination"
      :rows="rowsPerPage"
      :rows-per-page-options="[5, 10, 20]"
      :sortable="sortable"
      :filterable="filterable"
      :striped-rows="true"
      :size="tableSize"
      :selection="selection"
      :selection-mode="selection !== null && 'checkbox'"
      @update:selection="handleSelectionUpdate"
    >
      <!-- Checkbox for selection -->
      <p-column
        v-if="selection !== null"
        selection-mode="multiple"
        headerStyle="width: 3rem"
      ></p-column>

      <!-- Render columns dynamically -->
      <template v-for="column in columns" :key="column.field">
        <p-column
          :field="column.field"
          :header="column.header"
          :sortable="column.sortable || false"
          :filter="column.filter || false"
        >
          <template #body="slotProps">
            <slot :name="column.field" :data="slotProps.data">
              {{ slotProps.data[column.field] }}
            </slot>
          </template>
        </p-column>
      </template>

      <!-- Add Action column if onView or onDelete are passed -->
      <p-column
        v-if="hasActions"
        header="Hành động"
        :style="{ width: '150px', textAlign: 'center' }"
      >
        <template #body="slotProps">
          <div
            :key="slotProps.data.id"
            class="flex gap-4 justify-center items-center w-full"
          >
            <!-- View Button -->
            <button
              v-if="onView"
              @click="() => handleAction('view', slotProps.data)"
              title="Xem"
            >
              <i class="pi pi-eye"></i>
            </button>

            <!-- Delete Button -->
            <button
              v-if="onDelete"
              @click="() => handleAction('delete', slotProps.data)"
              title="Xóa"
            >
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </template>
      </p-column>
    </p-dataTable>
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";

export default {
  name: "DataTable",
  components: {
    "p-dataTable": DataTable,
    "p-column": Column,
  },
  props: {
    rows: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    sortable: {
      type: Boolean,
      default: false,
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Boolean,
      default: false,
    },
    rowsPerPage: {
      type: Number,
      default: 5,
    },
    onView: {
      type: Function,
      default: null,
    },
    onDelete: {
      type: Function,
      default: null,
    },
    selection: {
      type: Array,
      default: null,
    },
  },
  computed: {
    hasActions() {
      return !!this.onView || !!this.onDelete;
    },
  },
  methods: {
    handleAction(action, rowData) {
      if (action === "view" && this.onView) {
        this.onView(rowData);
      } else if (action === "delete" && this.onDelete) {
        this.onDelete(rowData);
      }
    },
    handleSelectionUpdate(newSelection) {
      console.log("DataTable selection updated:", newSelection);
      this.$emit("update:selection", newSelection);
    },
  },
  data() {
    return {
      tableSize: "large",
    };
  },
};
</script>
