<script setup>
import { useRouter } from 'vue-router'
import Welcome from '@/views/component/Welcome.vue'
import tips from '@/views/component/tips.vue'
import { ElButton } from 'element-plus'

const router = useRouter()
const handleClick = () => {
  router.push('/interact')
}
</script>

<template>
  <div class="wrap">
    <div class="welcome-container">
      <Welcome />
    </div>
    <div class="tips-container">
      <tips />
    </div>
    <div class="button-container">
      <el-button type="success" @click="handleClick">开始使用！</el-button>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  padding: 20px; /* 内边距 */
  margin: 10px 0; /* 上下外边距 */
  background-color: transparent; /* 透明背景 */
}

.welcome-container {
  margin-right: 310px;
  margin-left: 250px;
  margin-top: 70px;
  padding: 20px; /* 内边距 */
  background-color: transparent; /* 透明背景 */
}

.tips-container {
  margin-right: 310px;
  margin-left: 250px;
  padding: 20px; /* 内边距 */
  background-color: transparent; /* 透明背景 */
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-right: 310px;
  margin-left: 250px;
  padding: 20px;
}
</style>