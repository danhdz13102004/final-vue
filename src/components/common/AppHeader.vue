<template>
  <header class="header">
    <div></div>
    <div class="header-right">
      <select v-model="lang" @change="changeLang" class="lang-select">
        <option value="en">English</option>
        <option value="vi">Tiếng Việt</option>
      </select>
      <button @click="logout" class="logout-btn">
        {{ $t("header.logout") }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import axiosInstance from "../../axios";
import { useUserStore } from "@/stores/user";

// Khởi tạo i18n và router
const { locale } = useI18n();
const router = useRouter();

// Ngôn ngữ hiện tại, lấy từ localStorage hoặc mặc định là 'vi'
const lang = ref(localStorage.getItem("locale") || "vi");

// Hàm thay đổi ngôn ngữ
const changeLang = () => {
  locale.value = lang.value; // Cập nhật ngôn ngữ trong i18n
  localStorage.setItem("locale", lang.value); // Lưu vào localStorage
};

// Hàm đăng xuất
const logout = async () => {
  try {
    // Gọi API đăng xuất (nếu có)
    await axiosInstance.post("/auth/logout"); // Thay '/logout' bằng endpoint thực tế của bạn
    const userStore = useUserStore();
    userStore.logout();
    localStorage.removeItem("token");
    router.push("/login");
  } catch (error) {
    console.error("Error during logout:", error);
    // Vẫn xóa token và chuyển hướng nếu API thất bại
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.lang-select {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.logout-btn {
  background-color: #ef4444; /* Red-500 */
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #dc2626; /* Darker red */
}
</style>
