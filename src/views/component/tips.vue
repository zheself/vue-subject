<script setup>
import { h, ref } from 'vue';
import {
  CommentOutlined,
  FireOutlined,
  HeartOutlined,
  ReadOutlined,
  RocketOutlined,
  SmileOutlined,
} from '@ant-design/icons-vue';
import { Prompts } from 'ant-design-x-vue';
import { App, Card, ConfigProvider, Space, message, theme} from 'ant-design-vue';

// 生成带颜色的标题
const renderTitle = (icon, color, title) => h(Space, {align: 'start'}, () => [
  h(icon, {style: {color}}), // 添加颜色
  h('span', title),
]);

// 定义 `items` 数据
const items = ref([
  {
    key: '1',
    label: renderTitle(FireOutlined, '#FF4D4F', '热门话题'),
    description: '你也许对这些感兴趣',
    children: [
      {key: '1-1', description: `适老化改造有哪些新趋势？`},
      {key: '1-2', description: `人工智能如何助力适老化？`},
      {key: '1-3', description: `哪里可以找到相关标准和文档？`},
    ],
  },
  {
    key: '2',
    label: renderTitle(ReadOutlined, '#1890FF', '设计指导'),
    description: '如何设计一个好的项目?',
    children: [
      {key: '2-1', icon: h(HeartOutlined, {style: {color: '#FF4D4F'}}), description: `如何评估家庭适老化需求?`},
      {key: '2-2', icon: h(SmileOutlined, {style: {color: '#FAAD14'}}), description: `AI如何制定个性化改造方案?`},
      {key: '2-3', icon: h(CommentOutlined, {style: {color: '#722ED1'}}), description: `提升老年人居住体验的关键点`},
    ],
  },
  {
    key: '3',
    label: renderTitle(RocketOutlined, '#722ED1', '开始创造'),
    description: '如何开始一个新项目?',
    children: [
      {key: '3-1', label: '快速开始', description: `快速生成适老化改造方案`},
      {key: '3-2', label: '在线体验', description: `在线体验智能适老助手`},
    ],
  },
]);

// 处理点击事件
const handleItemClick = (info) => {
  message.success(`You clicked a prompt: ${info.data.key}`);
};
</script>

<template>
  <ConfigProvider :theme="{ algorithm: theme.defaultAlgorithm }">
    <Card :style="{ borderRadius: 0, border: 0 }">
      <Prompts
          title="你想要?"
          :items="items"
          wrap
          :styles="{
          item: {
            flex: 'none',
            width: 'calc(30% - 6px)',
            backgroundImage: 'linear-gradient(137deg, #e5f4ff 0%, #efe7ff 100%)',
            border: 0,
          },
          subItem: {
            background: 'rgba(255,255,255,0.45)',
            border: '1px solid #FFF',
          },
        }"
          @item-click="handleItemClick"
      />
    </Card>
  </ConfigProvider>
</template>

<style scoped></style>
