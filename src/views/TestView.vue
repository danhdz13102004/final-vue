```vue
<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item
          prepend-icon="mdi-home"
          title="Home"
          value="home"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account"
          title="Profile"
          value="profile"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Test Vuetify App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-theme-light-dark" @click="toggleTheme"></v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <v-row>
          <!-- Welcome Card -->
          <v-col cols="12" md="6">
            <v-card class="pa-4" elevation="2">
              <v-card-title>Welcome to the Test Layout</v-card-title>
              <v-card-text>
                This is a simple layout to test Vuetify integration.
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="success"
                  prepend-icon="mdi-plus"
                  @click="showMessage"
                >
                  Test Action
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <!-- Sample Data Table -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Sample Departments</v-card-title>
              <v-data-table
                :headers="headers"
                :items="sampleData"
                :items-per-page="5"
                :mobile-breakpoint="0"
              >
                <!-- <template #item.actions="{ item }">
                  <v-btn
                    color="warning"
                    variant="text"
                    icon="mdi-pencil"
                    @click="editItem(item)"
                    class="mx-1"
                  ></v-btn>
                  <v-btn
                    color="error"
                    variant="text"
                    icon="mdi-delete"
                    @click="deleteItem(item)"
                    class="mx-1"
                  ></v-btn>
                </template> -->
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useTheme } from "vuetify";

// Theme
const theme = useTheme();
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
};

// Navigation Drawer
const drawer = ref(false);

// Fixed Data for Table
const sampleData = ref([
  { id: 1, name: "Marketing", description: "Handles promotions" },
  { id: 2, name: "Engineering", description: "Builds products" },
  { id: 3, name: "Sales", description: "Manages client relations" },
]);

// Fixed Headers for Table
const headers = [
  { title: "#", key: "id", sortable: false },
  { title: "Name", key: "name" },
  { title: "Description", key: "description" },
  { title: "Actions", key: "actions", sortable: false },
];

// Actions
const showMessage = () => {
  alert("Action button clicked!");
};

// const editItem = (item) => {
//   alert(`Editing ${item.name}`);
// };

// const deleteItem = (item) => {
//   alert(`Deleting ${item.name}`);
// };
</script>

<style scoped>
.pa-4 {
  padding: 16px;
}
</style>
```
