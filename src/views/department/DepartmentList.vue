<template>
  <div class="department-list">
    <!-- Create Button -->
    <v-btn @click="openCreateForm" color="primary">{{
      $t("department.add")
    }}</v-btn>

    <!-- Department Table -->
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>{{ $t("department.name") }}</th>
          <th>{{ $t("department.description") }}</th>
          <th>{{ $t("common.actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(department, index) in departments" :key="department._id">
          <td>{{ index + 1 }}</td>
          <td>{{ department.name }}</td>
          <td>{{ department.description }}</td>
          <td>
            <button @click="openUpdateForm(department)" class="btn btn-warning">
              {{ $t("department.edit") }}
            </button>
            <button @click="confirmDelete(department)" class="btn btn-danger">
              {{ $t("common.delete") }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Create / Update Department Form -->
    <v-dialog v-model="showForm" max-width="500px">
      <v-card>
        <v-card-title>{{
          isEdit ? $t("department.edit") : $t("department.add")
        }}</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="formData.name"
              :label="$t('department.name')"
              :rules="[
                () =>
                  !!formData.name || $t('validation.department_name_required'),
              ]"
              required
            />
            <v-textarea
              v-model="formData.description"
              :label="$t('department.description')"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeForm" color="red">{{
            $t("common.cancel")
          }}</v-btn>
          <v-btn @click="submitForm" color="green">{{
            isEdit ? $t("department.edit") : $t("department.add")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmation Dialog for Deleting -->
    <v-dialog v-model="showConfirmDelete" max-width="400px">
      <v-card>
        <v-card-title>{{ $t("department.delete_confirm") }}</v-card-title>
        <v-card-text>{{ deleteMessage }}</v-card-text>
        <v-card-actions>
          <v-btn @click="closeConfirmDelete" color="red">{{
            $t("common.cancel")
          }}</v-btn>
          <v-btn @click="deleteDepartment" color="green">{{
            $t("common.delete")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  VBtn,
  VDialog,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VTextField,
  VTextarea,
} from "vuetify/components";
import departmentService from "@/services/department.service.js";

// Initialize i18n
const { t } = useI18n();

// Khai báo biến dữ liệu phòng ban
const departments = ref([]);

// Dữ liệu của form tạo và chỉnh sửa
const formData = ref({
  name: "",
  description: "",
});
const showForm = ref(false);
const isEdit = ref(false);
const valid = ref(false);
const currentDepartment = ref(null);
const showConfirmDelete = ref(false);

// Computed property for dynamic delete message
const deleteMessage = computed(() => {
  if (!currentDepartment.value) return "";
  return t("department.delete_message", { name: currentDepartment.value.name });
});

// Hàm lấy danh sách phòng ban từ API
const fetchDepartments = async () => {
  try {
    const response = await departmentService.getDepartments();
    departments.value = response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
  }
};

// Khi component được render, lấy dữ liệu phòng ban
onMounted(() => {
  fetchDepartments();
});

// Open Create Form
const openCreateForm = () => {
  formData.value = { name: "", description: "" };
  isEdit.value = false;
  showForm.value = true;
};

// Open Update Form with pre-filled data
const openUpdateForm = (department) => {
  formData.value = { ...department };
  isEdit.value = true;
  currentDepartment.value = department;
  showForm.value = true;
};

// Close the form
const closeForm = () => {
  showForm.value = false;
  formData.value = { name: "", description: "" };
};

// Submit Create or Update
const submitForm = async () => {
  // if (!valid.value) return;
  const departmentData = {
    name: formData.value.name,
    description: formData.value.description,
  };
  try {
    if (isEdit.value) {
      await departmentService.updateDepartment(
        currentDepartment.value._id,
        departmentData
      );
    } else {
      await departmentService.addDepartment(departmentData);
    }
    await fetchDepartments(); // Refresh department list
    closeForm();
  } catch (error) {
    console.error("Error submitting department:", error);
  }
};

// Open Confirmation Dialog to Delete
const confirmDelete = (department) => {
  currentDepartment.value = department;
  showConfirmDelete.value = true;
};

// Close confirmation dialog
const closeConfirmDelete = () => {
  showConfirmDelete.value = false;
  currentDepartment.value = null;
};

// Delete Department
const deleteDepartment = async () => {
  try {
    await departmentService.deleteDepartment(currentDepartment.value._id);
    await fetchDepartments(); // Refresh department list
    closeConfirmDelete();
  } catch (error) {
    console.error("Error deleting department:", error);
  }
};
</script>

<style scoped>
.department-list {
  padding: 20px;
}

.department-list h1 {
  margin-bottom: 20px;
}

.table {
  margin-top: 20px;
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
}

button {
  margin-right: 10px;
  padding: 5px 10px;
  cursor: pointer;
}

.btn-warning {
  background-color: orange;
  color: white;
  border: none;
}

.btn-danger {
  background-color: red;
  color: white;
  border: none;
}
</style>
