<script setup>
import Welcome from '@/views/component/Welcome.vue';
import tips from '@/views/component/tips.vue';
import sendmessage from '@/views/component/sendmessage.vue';
</script>

<template>
<div class="wrap">
          <div class="welcome-container">
            <Welcome/>
          </div>
          <div class="tips-container">
            <tips/>
          </div>
        </div>
        <div class="conversation-container">
            <sendmessage/>
        </div>
</template>

<style scoped>
.wrap {
  padding: 20px; /* 内边距 */
  margin: 10px 0; /* 上下外边距 */
  background-color: transparent; /* 透明背景 */
}

.welcome-container {
  margin-right: 250px;
  margin-left: 250px;
  margin-top: 70px;
  padding: 20px; /* 内边距 */
  background-color: transparent; /* 透明背景 */
}
.tips-container{
  margin-right: 250px;
  margin-left: 250px;
  padding: 20px; /* 内边距 */
  background-color: transparent; /* 透明背景 */
}
.conversation-container{
  margin-right: 250px;
  margin-left: 250px;
  margin-top: 70px;
  padding: 20px; /* 内边距 */
  background-color: transparent; /* 透明背景 */
}
</style>