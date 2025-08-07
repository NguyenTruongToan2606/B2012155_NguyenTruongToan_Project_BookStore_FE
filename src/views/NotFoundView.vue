<template>
  <div
    class="not-found-page flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
    <h2 class="text-2xl text-gray-600 mb-6">Không tìm thấy trang!</h2>
    <p class="text-gray-500 mb-6">
      Không tìm thấy trang này, vui lòng kiểm tra đường dẫn
    </p>
    <router-link
      to="/"
      class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
    >
      Về trang chủ
    </router-link>
  </div>
</template>

<script>
export default {
  name: "NotFoundView",
};
</script>
