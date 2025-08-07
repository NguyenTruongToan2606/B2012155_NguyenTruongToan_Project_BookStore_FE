<template>
  <p-dialog
    :visible="visible"
    :header="header"
    :modal="true"
    :closable="true"
    :style="{ width: '500px' }"
    :footer="null"
    @hide="closeDialog"
  >
    <div class="p-fluid">
      <slot></slot>
    </div>
    <div class="mt-4 flex justify-end gap-2">
      <p-button
        label="Cancel"
        class="p-button-outlined"
        @click="handleCancel"
      />
      <p-button label="OK" class="p-button-primary" @click="handleOk" />
    </div>
  </p-dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Button from "primevue/button";

export default {
  name: "ReusableModal",
  components: {
    "p-dialog": Dialog,
    "p-button": Button,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    header: {
      type: String,
      required: true,
    },
    onOk: {
      type: Function,
      required: true,
    },
    onCancel: {
      type: Function,
      required: true,
    },
  },
  methods: {
    handleOk() {
      this.onOk();
      this.closeDialog();
    },
    handleCancel() {
      this.onCancel();
      this.closeDialog();
    },
    closeDialog() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style scoped></style>
