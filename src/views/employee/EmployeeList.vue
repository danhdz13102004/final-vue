<template>
  <div class="employee-list">
    <!-- Create Button -->
    <v-btn @click="openCreateForm" color="primary">{{
      $t("employee.add")
    }}</v-btn>

    <!-- Employee Table -->
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>{{ $t("employee.firstName") }}</th>
          <th>{{ $t("employee.email") }}</th>
          <th>{{ $t("employee.role") }}</th>
          <th>{{ $t("employee.department") }}</th>
          <th>{{ $t("common.actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(employee, index) in employees" :key="employee._id">
          <td>{{ index + 1 }}</td>
          <td>{{ employee.name }}</td>
          <td>{{ employee.email }}</td>
          <td>{{ employee.position }}</td>
          <td>
            {{
              employee.department ? employee.department.name : $t("common.na")
            }}
          </td>
          <td>
            <button @click="openUpdateForm(employee)" class="btn btn-warning">
              {{ $t("employee.edit") }}
            </button>
            <button @click="confirmDelete(employee)" class="btn btn-danger">
              {{ $t("common.delete") }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Create / Update Employee Form -->
    <v-dialog v-model="showForm" max-width="500px">
      <v-card>
        <v-card-title>{{
          isEdit ? $t("employee.edit") : $t("employee.add")
        }}</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="formData.name"
              :label="$t('employee.firstName')"
              :rules="[() => !!formData.name || $t('validation.name_required')]"
              required
            />
            <v-text-field
              v-model="formData.email"
              :label="$t('employee.email')"
              type="email"
              :rules="[
                () => !!formData.email || $t('validation.email_required'),
                () =>
                  /.+@.+\..+/.test(formData.email) ||
                  $t('validation.email_valid'),
              ]"
              required
            />
            <v-text-field
              v-model="formData.position"
              :label="$t('employee.role')"
              :rules="[
                () => !!formData.position || $t('validation.role_required'),
              ]"
              required
            />
            <v-select
              v-model="formData.department"
              :items="departments"
              :return-object="false"
              item-title="name"
              item-value="_id"
              :label="$t('employee.department')"
              :rules="[
                () =>
                  !!formData.department || $t('validation.department_required'),
              ]"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeForm" color="red">{{
            $t("common.cancel")
          }}</v-btn>
          <v-btn @click="submitForm" color="green">{{
            isEdit ? $t("employee.edit") : $t("employee.add")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmation Dialog for Deleting -->
    <v-dialog v-model="showConfirmDelete" max-width="400px">
      <v-card>
        <v-card-title>{{ $t("employee.delete_confirm") }}</v-card-title>
        <v-card-text>{{ deleteMessage }}</v-card-text>
        <v-card-actions>
          <v-btn @click="closeConfirmDelete" color="red">{{
            $t("common.cancel")
          }}</v-btn>
          <v-btn @click="deleteEmployee" color="green">{{
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
  VSelect,
} from "vuetify/components";
import employeeService from "@/services/employee.service.js";
import departmentService from "@/services/department.service.js";

// Initialize i18n
const { t } = useI18n();

// Khai báo biến dữ liệu nhân viên và phòng ban
const employees = ref([]);
const departments = ref([]);

// Dữ liệu của form tạo và chỉnh sửa
const formData = ref({
  name: "",
  email: "",
  position: "",
  department: null,
});
const showForm = ref(false);
const isEdit = ref(false);
const valid = ref(false);
const currentEmployee = ref(null);
const showConfirmDelete = ref(false);

// Computed property for dynamic delete message
const deleteMessage = computed(() => {
  if (!currentEmployee.value) return "";
  return t("employee.delete_message", { name: currentEmployee.value.name });
});

// Hàm lấy danh sách nhân viên từ API
const fetchEmployees = async () => {
  try {
    const response = await employeeService.getEmployees();
    employees.value = response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
};

// Hàm lấy danh sách phòng ban từ API
const fetchDepartments = async () => {
  try {
    const response = await departmentService.getDepartments();
    departments.value = response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
  }
};

// Khi component được render, lấy dữ liệu
onMounted(() => {
  fetchDepartments();
  fetchEmployees();
});

// Open Create Form
const openCreateForm = () => {
  formData.value = { name: "", email: "", position: "", department: null };
  isEdit.value = false;
  showForm.value = true;
};

// Open Update Form with pre-filled data
const openUpdateForm = (employee) => {
  formData.value = {
    name: employee.name,
    email: employee.email,
    position: employee.position,
    department: employee.department ? employee.department._id : null,
  };
  isEdit.value = true;
  currentEmployee.value = employee;
  showForm.value = true;
};

// Close the form
const closeForm = () => {
  showForm.value = false;
  formData.value = { name: "", email: "", position: "", department: null };
};

// Submit Create or Update
const submitForm = async () => {
  // if (!valid.value) return;
  const employeeData = {
    name: formData.value.name,
    email: formData.value.email,
    position: formData.value.position,
    department: formData.value.department,
  };
  try {
    if (isEdit.value) {
      await employeeService.updateEmployee(
        currentEmployee.value._id,
        employeeData
      );
    } else {
      await employeeService.addEmployee(employeeData);
    }
    await fetchEmployees(); // Refresh employee list
    closeForm();
  } catch (error) {
    console.error("Error submitting employee:", error);
  }
};

// Open Confirmation Dialog to Delete
const confirmDelete = (employee) => {
  currentEmployee.value = employee;
  showConfirmDelete.value = true;
};

// Close confirmation dialog
const closeConfirmDelete = () => {
  showConfirmDelete.value = false;
  currentEmployee.value = null;
};

// Delete Employee
const deleteEmployee = async () => {
  try {
    await employeeService.deleteEmployee(currentEmployee.value._id);
    await fetchEmployees(); // Refresh employee list
    closeConfirmDelete();
  } catch (error) {
    console.error("Error deleting employee:", error);
  }
};
</script>

<style scoped>
.employee-list {
  padding: 20px;
}

.employee-list h1 {
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
