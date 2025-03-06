<template>
  <div class="center-container">
    <chat :defaultMessages="messages" v-if="messages.length > 0" />
  </div>
</template>

<style scoped>
.center-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  min-height: 100vh; /* 确保容器至少占满视口高度 */
}

chat {
  /* 固定聊天窗口的宽度和高度 */
  width: 600px;
  height: 800px;
  /* 可以根据需要添加其他样式，如边框、圆角等 */
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import chat from '@/views/component/chat.vue';

export default {
  components: {
    chat
  },
  setup() {
    const route = useRoute();
    const messages = ref([]);

    onMounted(async () => {
      try {
        const id = route.params.id;
        const filePath = `/src/history/history${id}.json`;
        const jsonModule = await import(filePath);
        console.log('Dynamic import completed successfully.');
        messages.value = jsonModule.default;
      } catch (error) {
        console.error('Failed to load JSON file:', error);
      }
    });

    return {
      messages
    };
  }
};
</script>