<template>
  <div class="employee-list">
    <!-- Create Button -->
    <button @click="openCreateForm" class="btn btn-primary">
      {{ $t("employee.add") }}
    </button>

    <!-- Display global error message if present -->
    <div v-if="errorMessage" class="error-alert">
      <span>{{ errorMessage }}</span>
      <button class="close-btn" @click="clearError">&times;</button>
    </div>

    <!-- Employee Table (converts to cards on mobile) -->
    <div class="table-responsive">
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
            <td data-label="#">{{ index + 1 }}</td>
            <td data-label="Name">{{ employee.name }}</td>
            <td data-label="Email">{{ employee.email }}</td>
            <td data-label="Role">{{ employee.position }}</td>
            <td data-label="Department">
              {{
                employee.department ? employee.department.name : $t("common.na")
              }}
            </td>
            <td data-label="Actions">
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
    </div>

    <!-- Mobile cards view (visible only on small screens) -->
    <div class="employee-cards">
      <div
        class="card"
        v-for="(employee, index) in employees"
        :key="employee._id"
      >
        <div class="card-header">
          <span class="employee-number">{{ index + 1 }}</span>
          <h3 class="employee-name">{{ employee.name }}</h3>
        </div>
        <div class="card-body">
          <div class="employee-detail">
            <strong>{{ $t("employee.email") }}:</strong> {{ employee.email }}
          </div>
          <div class="employee-detail">
            <strong>{{ $t("employee.role") }}:</strong> {{ employee.position }}
          </div>
          <div class="employee-detail">
            <strong>{{ $t("employee.department") }}:</strong>
            {{
              employee.department ? employee.department.name : $t("common.na")
            }}
          </div>
        </div>
        <div class="card-footer">
          <button @click="openUpdateForm(employee)" class="btn btn-warning">
            {{ $t("employee.edit") }}
          </button>
          <button @click="confirmDelete(employee)" class="btn btn-danger">
            {{ $t("common.delete") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Create / Update Employee Form -->
    <div class="modal" :class="{ show: showForm }">
      <div class="modal-overlay" @click="closeForm"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ isEdit ? $t("employee.edit") : $t("employee.add") }}</h2>
          <button class="close-btn" @click="closeForm">&times;</button>
        </div>
        <div class="modal-body">
          <!-- Form Error Alert -->
          <div v-if="formError" class="form-error-alert">
            {{ formError }}
          </div>

          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="employee-name"
                >{{ $t("employee.firstName") }} *</label
              >
              <input
                type="text"
                id="employee-name"
                v-model="formData.name"
                required
                :placeholder="$t('employee.firstName')"
              />
              <span v-if="!formData.name && attemptedSubmit" class="error">
                {{ $t("validation.name_required") }}
              </span>
            </div>
            <div class="form-group">
              <label for="employee-email">{{ $t("employee.email") }} *</label>
              <input
                type="email"
                id="employee-email"
                v-model="formData.email"
                required
                :placeholder="$t('employee.email')"
              />
              <span v-if="!formData.email && attemptedSubmit" class="error">
                {{ $t("validation.email_required") }}
              </span>
              <span
                v-else-if="
                  formData.email &&
                  !validateEmail(formData.email) &&
                  attemptedSubmit
                "
                class="error"
              >
                {{ $t("validation.email_valid") }}
              </span>
            </div>
            <div class="form-group">
              <label for="employee-position">{{ $t("employee.role") }} *</label>
              <input
                type="text"
                id="employee-position"
                v-model="formData.position"
                required
                :placeholder="$t('employee.role')"
              />
              <span v-if="!formData.position && attemptedSubmit" class="error">
                {{ $t("validation.role_required") }}
              </span>
            </div>
            <div class="form-group">
              <label for="employee-department"
                >{{ $t("employee.department") }} *</label
              >
              <select
                id="employee-department"
                v-model="formData.department"
                required
              >
                <option value="" disabled selected>
                  {{ $t("employee.select_department") }}
                </option>
                <option
                  v-for="dept in departments"
                  :key="dept._id"
                  :value="dept._id"
                >
                  {{ dept.name }}
                </option>
              </select>
              <span
                v-if="!formData.department && attemptedSubmit"
                class="error"
              >
                {{ $t("validation.department_required") }}
              </span>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeForm" class="btn btn-secondary">
            {{ $t("common.cancel") }}
          </button>
          <button
            @click="submitForm"
            class="btn btn-success"
            :disabled="isSubmitting"
          >
            {{
              isSubmitting
                ? $t("common.updating")
                : isEdit
                ? $t("employee.edit")
                : $t("employee.add")
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog for Deleting -->
    <div class="modal" :class="{ show: showConfirmDelete }">
      <div class="modal-overlay" @click="closeConfirmDelete"></div>
      <div class="modal-container confirm-delete">
        <div class="modal-header">
          <h2>{{ $t("employee.delete_confirm") }}</h2>
          <button class="close-btn" @click="closeConfirmDelete">&times;</button>
        </div>
        <div class="modal-body">
          <p>{{ deleteMessage }}</p>
          <!-- Delete Error Display -->
          <p v-if="deleteError" class="error">{{ deleteError }}</p>
        </div>
        <div class="modal-footer">
          <button @click="closeConfirmDelete" class="btn btn-secondary">
            {{ $t("common.cancel") }}
          </button>
          <button
            @click="deleteEmployee"
            class="btn btn-danger"
            :disabled="isDeleting"
          >
            {{ isDeleting ? $t("common.deleting") : $t("common.delete") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import employeeService from "@/services/employee.service.js";
import departmentService from "@/services/department.service.js";

// Initialize i18n
const { t } = useI18n();

// Employee and department data
const employees = ref([]);
const departments = ref([]);

// Form data for create and edit
const formData = ref({
  name: "",
  email: "",
  position: "",
  department: null,
});
const showForm = ref(false);
const isEdit = ref(false);
const currentEmployee = ref(null);
const showConfirmDelete = ref(false);
const attemptedSubmit = ref(false);

// Error handling
const errorMessage = ref("");
const formError = ref("");
const deleteError = ref("");
const isSubmitting = ref(false);
const isDeleting = ref(false);

// Clear errors
const clearError = () => {
  errorMessage.value = "";
};

// Email validation function
const validateEmail = (email) => {
  return /.+@.+\..+/.test(email);
};

// Computed property for dynamic delete message
const deleteMessage = computed(() => {
  if (!currentEmployee.value) return "";
  return t("employee.delete_message", { name: currentEmployee.value.name });
});

// Fetch employees from API
const fetchEmployees = async () => {
  try {
    const response = await employeeService.getEmployees();
    employees.value = response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    errorMessage.value = t("errors.fetch_employees", {
      error:
        error.response?.data?.message || error.message || t("errors.unknown"),
    });
  }
};

// Fetch departments from API
const fetchDepartments = async () => {
  try {
    const response = await departmentService.getDepartments();
    departments.value = response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    errorMessage.value = t("errors.fetch_departments", {
      error:
        error.response?.data?.message || error.message || t("errors.unknown"),
    });
  }
};

// When component is mounted, fetch data
onMounted(() => {
  fetchDepartments();
  fetchEmployees();
});

// Open Create Form
const openCreateForm = () => {
  formData.value = { name: "", email: "", position: "", department: null };
  isEdit.value = false;
  showForm.value = true;
  attemptedSubmit.value = false;
  formError.value = "";
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
  attemptedSubmit.value = false;
  formError.value = "";
};

// Close the form
const closeForm = () => {
  showForm.value = false;
  formData.value = { name: "", email: "", position: "", department: null };
  formError.value = "";
};

// Submit Create or Update
const submitForm = async () => {
  attemptedSubmit.value = true;
  formError.value = "";

  if (
    !formData.value.name ||
    !formData.value.email ||
    !validateEmail(formData.value.email) ||
    !formData.value.position ||
    !formData.value.department
  ) {
    return;
  }

  const employeeData = {
    name: formData.value.name,
    email: formData.value.email,
    position: formData.value.position,
    department: formData.value.department,
  };

  try {
    isSubmitting.value = true;

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
    formError.value =
      error.response?.data?.message ||
      (isEdit.value
        ? t("errors.update_employee")
        : t("errors.create_employee"));

    // Check for specific error types
    if (error.response?.status === 409) {
      formError.value = t("errors.email_exists");
    } else if (error.response?.status === 400) {
      formError.value = t("errors.invalid_data");
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Open Confirmation Dialog to Delete
const confirmDelete = (employee) => {
  currentEmployee.value = employee;
  showConfirmDelete.value = true;
  deleteError.value = "";
};

// Close confirmation dialog
const closeConfirmDelete = () => {
  showConfirmDelete.value = false;
  currentEmployee.value = null;
  deleteError.value = "";
};

// Delete Employee
const deleteEmployee = async () => {
  try {
    isDeleting.value = true;
    await employeeService.deleteEmployee(currentEmployee.value._id);
    await fetchEmployees(); // Refresh employee list
    closeConfirmDelete();
  } catch (error) {
    console.error("Error deleting employee:", error);
    deleteError.value =
      error.response?.data?.message || t("errors.delete_employee");
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped>
/* General styles */
.employee-list {
  padding: 15px;
  max-width: 100%;
}

/* Error alerts */
.error-alert {
  background-color: #ffebee;
  border: 1px solid #ef5350;
  color: #d32f2f;
  padding: 10px 15px;
  border-radius: 4px;
  margin: 15px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-error-alert {
  background-color: #ffebee;
  border: 1px solid #ef5350;
  color: #d32f2f;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

/* Button styles */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-right: 10px;
  margin-bottom: 10px;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
}

.btn-warning {
  background-color: #ff9800;
  color: white;
}

.btn-danger {
  background-color: #f44336;
  color: white;
}

.btn-secondary {
  background-color: #9e9e9e;
  color: white;
}

.btn-success {
  background-color: #4caf50;
  color: white;
}

/* Table styles */
.table-responsive {
  overflow-x: auto;
  margin-top: 20px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

/* Card view (for mobile) */
.employee-cards {
  display: none;
}

.card {
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
}

.employee-number {
  display: inline-block;
  width: 25px;
  height: 25px;
  background-color: #4caf50;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 25px;
  margin-right: 10px;
}

.employee-name {
  margin: 0;
  font-size: 16px;
}

.card-body {
  padding: 15px;
}

.employee-detail {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.employee-detail:last-child {
  border-bottom: none;
}

.card-footer {
  padding: 15px;
  border-top: 1px solid #ddd;
  background-color: #f8f9fa;
}

/* Modal styles */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.modal.show {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
}

.modal-container {
  background-color: white;
  border-radius: 4px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1002;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.confirm-delete {
  max-width: 400px;
}

.modal-header {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 15px;
}

.modal-footer {
  padding: 15px;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: flex-end;
}

/* Form styles */
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group select {
  height: 38px;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.error {
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

/* Responsive styles */
@media screen and (max-width: 768px) {
  /* Hide table and show cards on mobile */
  .table-responsive {
    display: none;
  }

  .employee-cards {
    display: block;
  }

  /* Adjust button sizing */
  .btn {
    padding: 6px 12px;
    font-size: 14px;
  }

  /* Make modal full width on small screens */
  .modal-container {
    width: 95%;
    max-width: none;
  }
}

/* For very small screens */
@media screen and (max-width: 480px) {
  .card-footer {
    display: flex;
    flex-direction: column;
  }

  .card-footer .btn {
    margin-right: 0;
    margin-bottom: 10px;
    width: 100%;
  }

  .card-footer .btn:last-child {
    margin-bottom: 0;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-footer .btn {
    margin-right: 0;
    margin-bottom: 10px;
    width: 100%;
  }

  .modal-footer .btn:last-child {
    margin-bottom: 0;
  }
}
</style>
