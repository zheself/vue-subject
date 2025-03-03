<script setup>
import { Welcome } from 'ant-design-x-vue';
import { Button, Space } from 'ant-design-vue'; // 引入 Ant Design Vue 组件
import { EllipsisOutlined, ShareAltOutlined } from '@ant-design/icons-vue'; // 引入 Ant Design Vue 图标

// 定义组件的属性
const props = {
  variant: "borderless",
  icon: "https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp",
  title: "你好，我是你的智能适老化助手",
  description: "我可以根据用户的居住环境，结合适老化改造标准，智能分析并提出个性化的优化方案~",
};
</script>

<template>
  <Welcome v-bind="props">
    <!-- 使用 Vue 模板语法来传递 extra 插槽内容 -->
    <template #extra>
      <Space>
        <!-- 使用 Vue 组件语法传递图标 -->
        <Button>
          <ShareAltOutlined />
        </Button>
        <Button>
          <EllipsisOutlined />
        </Button>
      </Space>
    </template>
  </Welcome>
</template>

<style scoped></style>
