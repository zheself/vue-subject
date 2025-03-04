<script setup lang="ts">
import { h, ref } from 'vue';
import { Descriptions, Tag, Card, Avatar } from '@kousum/semi-ui-vue';
import user_list from '@/views/component/user_list.vue';
import avatarImage from '@/assets/OIP-C.jfif'; // 直接导入图片

const data = [
  { key: '用户名', value: '张三' },
  { key: '年龄', value: '68岁' },
  { key: '联系电话', value: '138-8888-8888' },
  { key: '居住地', value: '北京市海淀区' },
  { key: '改造偏好', value: h(Tag, { size:'small', shape: 'circle', color: 'green' }, () => '无障碍通道') },
  { key: '健康状况', value: '良好' },
  { key: '上次改造时间', value: '2023-12-15', span: 3 },
];

const avatarSize = 100;
</script>

<template>
  <div class="container">
    <!-- 外层框，包裹头像和信息 -->
    <div class="profile-container">
      <Avatar size="large" :src="avatarImage" class="avatar" />
      <Card class="info-card">
        <Descriptions align="center" :data="data" :bordered="false" :column="2" class="custom-descriptions">
        </Descriptions>
      </Card>
    </div>

    <div class="user_list">
      <user_list icon-class="task-icon"></user_list>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #e1f5e1; /* 浅绿色背景 */
}

.profile-container {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 650px;
  margin: 20px auto;
  gap: 20px; /* 控制头像与信息的间距 */
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.info-card {
  flex: 1; /* 让Card自适应剩余空间 */
  padding: 20px;
  border-radius: 10px;
}

.user_list {
  width: 80%;
  max-width: 6000px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.custom-descriptions.semi-descriptions-item {
  margin-bottom: 10px;
}

.custom-descriptions.semi-descriptions-item-label {
  font-weight: bold;
  color: #006400; /* 深绿色标题文字 */
}

.custom-descriptions.semi-descriptions-item-content {
  color: #32cd32; /* 亮绿色内容文字 */
}

/* 这里假设后续在user_list组件中会使用这个类名来添加图标样式 */
.task-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>