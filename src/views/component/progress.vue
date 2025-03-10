<template>
  <div class="demo-progress">
    <el-progress type="dashboard" :percentage="percentage2" :color="colors" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const percentage2 = ref(0)

const colors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
]

onMounted(() => {
  const interval = setInterval(() => {
    if (percentage2.value < 100) {
      percentage2.value += 1
    } else {
      clearInterval(interval) // 达到 100% 时停止增长
    }
  }, 600) // 60s / 100 = 600ms
})
</script>

<style scoped>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}
.demo-progress .el-progress--circle {
  margin-right: 15px;
}
</style>
