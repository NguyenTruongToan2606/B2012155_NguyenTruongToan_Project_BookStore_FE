<template>
  <aside
    class="bg-gray-800 text-white h-screen flex flex-col justify-between p-4 w-64"
  >
    <div
      class="text-2xl font-bold mb-4 w-full flex flex-col gap-6 justify-center items-center"
    >
      <router-link :to="'/'" class="flex justify-between items-center">
        <img alt="Vue logo" src="@/assets/logo.svg" class="w-1/4" />
        <h1 class="text-base">Book Management</h1>
      </router-link>
      <hr class="bg-slate-600 block w-full" />
    </div>

    <nav class="flex-1">
      <ul class="space-y-4">
        <li
          v-for="item in menuItems"
          :key="item.label"
          :class="[
            'hover:bg-gray-700 rounded',
            { 'bg-gray-600': isActive(item.to) },
          ]"
        >
          <router-link :to="item.to" class="flex items-center gap-2 p-2">
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <button
      @click="signOut"
      class="bg-red-500 hover:bg-red-600 text-white py-2 rounded text-center w-full flex justify-center gap-2 items-center"
    >
      Logout
      <i class="pi pi-sign-out"></i>
    </button>
  </aside>
</template>

<script>
export default {
  name: "SideBar",
  data() {
    return {
      menuItems: [
        { label: "Trang chủ", to: "/", icon: "pi pi-home" },
        { label: "Tra cứu sách", to: "/search", icon: "pi pi-search" },
        { label: "Quản lý sách", to: "/books", icon: "pi pi-book" },
        { label: "Quản lý độc giả", to: "/readers", icon: "pi pi-user" },
        { label: "Thống kê", to: "/statistic", icon: "pi pi-chart-line" },
      ],
    };
  },
  methods: {
    signOut() {
      console.log("Sign Out");
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
    isActive(route) {
      return this.$route.path === route;
    },
  },
};
</script>
