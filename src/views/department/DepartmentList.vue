<template>
  <div class="department-list">
    <!-- Create Button -->
    <button @click="openCreateForm" class="btn btn-primary">
      {{ $t("department.add") }}
    </button>

    <!-- Department Table (converts to cards on mobile) -->
    <div class="table-responsive">
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
            <td data-label="#">{{ index + 1 }}</td>
            <td data-label="Name">{{ department.name }}</td>
            <td data-label="Description">{{ department.description }}</td>
            <td data-label="Actions">
              <button
                @click="openUpdateForm(department)"
                class="btn btn-warning"
              >
                {{ $t("department.edit") }}
              </button>
              <button @click="confirmDelete(department)" class="btn btn-danger">
                {{ $t("common.delete") }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile cards view (visible only on small screens) -->
    <div class="department-cards">
      <div
        class="card"
        v-for="(department, index) in departments"
        :key="department._id"
      >
        <div class="card-header">
          <span class="department-number">{{ index + 1 }}</span>
          <h3 class="department-name">{{ department.name }}</h3>
        </div>
        <div class="card-body">
          <p class="department-description">{{ department.description }}</p>
        </div>
        <div class="card-footer">
          <button @click="openUpdateForm(department)" class="btn btn-warning">
            {{ $t("department.edit") }}
          </button>
          <button @click="confirmDelete(department)" class="btn btn-danger">
            {{ $t("common.delete") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Create / Update Department Form -->
    <div class="modal" :class="{ show: showForm }">
      <div class="modal-overlay" @click="closeForm"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ isEdit ? $t("department.edit") : $t("department.add") }}</h2>
          <button class="close-btn" @click="closeForm">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="department-name">{{ $t("department.name") }} *</label>
              <input
                type="text"
                id="department-name"
                v-model="formData.name"
                required
                :placeholder="$t('department.name')"
              />
              <span v-if="!formData.name && attemptedSubmit" class="error">
                {{ $t("validation.department_name_required") }}
              </span>
            </div>
            <div class="form-group">
              <label for="department-description">{{
                $t("department.description")
              }}</label>
              <textarea
                id="department-description"
                v-model="formData.description"
                :placeholder="$t('department.description')"
              ></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeForm" class="btn btn-secondary">
            {{ $t("common.cancel") }}
          </button>
          <button @click="submitForm" class="btn btn-success">
            {{ isEdit ? $t("department.edit") : $t("department.add") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog for Deleting -->
    <div class="modal" :class="{ show: showConfirmDelete }">
      <div class="modal-overlay" @click="closeConfirmDelete"></div>
      <div class="modal-container confirm-delete">
        <div class="modal-header">
          <h2>{{ $t("department.delete_confirm") }}</h2>
          <button class="close-btn" @click="closeConfirmDelete">&times;</button>
        </div>
        <div class="modal-body">
          <p>{{ deleteMessage }}</p>
        </div>
        <div class="modal-footer">
          <button @click="closeConfirmDelete" class="btn btn-secondary">
            {{ $t("common.cancel") }}
          </button>
          <button @click="deleteDepartment" class="btn btn-danger">
            {{ $t("common.delete") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import departmentService from "@/services/department.service.js";

// Initialize i18n
const { t } = useI18n();

// Department data
const departments = ref([]);

// Form data for create and edit
const formData = ref({
  name: "",
  description: "",
});
const showForm = ref(false);
const isEdit = ref(false);
const currentDepartment = ref(null);
const showConfirmDelete = ref(false);
const attemptedSubmit = ref(false);

// Computed property for dynamic delete message
const deleteMessage = computed(() => {
  if (!currentDepartment.value) return "";
  return t("department.delete_message", { name: currentDepartment.value.name });
});

// Fetch departments from API
const fetchDepartments = async () => {
  try {
    const response = await departmentService.getDepartments();
    departments.value = response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
  }
};

// When component is mounted, fetch department data
onMounted(() => {
  fetchDepartments();
});

// Open Create Form
const openCreateForm = () => {
  formData.value = { name: "", description: "" };
  isEdit.value = false;
  showForm.value = true;
  attemptedSubmit.value = false;
};

// Open Update Form with pre-filled data
const openUpdateForm = (department) => {
  formData.value = { ...department };
  isEdit.value = true;
  currentDepartment.value = department;
  showForm.value = true;
  attemptedSubmit.value = false;
};

// Close the form
const closeForm = () => {
  showForm.value = false;
  formData.value = { name: "", description: "" };
};

// Submit Create or Update
const submitForm = async () => {
  attemptedSubmit.value = true;

  if (!formData.value.name) return;

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
/* General styles */
.department-list {
  padding: 15px;
  max-width: 100%;
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
.department-cards {
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

.department-number {
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

.department-name {
  margin: 0;
  font-size: 16px;
}

.card-body {
  padding: 15px;
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
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
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

  .department-cards {
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
