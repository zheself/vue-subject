<script setup>
import { ref, watchEffect, h } from 'vue';
import { SendOutlined, CloudUploadOutlined, LinkOutlined } from '@ant-design/icons-vue';
import { Sender, Attachments } from 'ant-design-x-vue';
import { App, Space, Spin, Typography, message, Button } from 'ant-design-vue';

// 定义响应式变量
const loading = ref(false);
const value = ref('');
const open = ref(false);
const items = ref([]);
const attachmentsRef = ref(null);
const senderRef = ref(null);

// 监听 loading 状态并自动清空输入框
watchEffect(() => {
  if (loading.value) {
    setTimeout(() => {
      loading.value = false;
      value.value = '';
      items.value = [];
      message.success('Send message successfully!');
    }, 2000);
  }
});

// 处理提交
const handleSubmit = () => {
  loading.value = true;
};

// 处理取消
const handleCancel = () => {
  loading.value = false;
};

// 处理粘贴文件
const handlePasteFile = (_, files) => {
  for (const file of files) {
    attachmentsRef.value?.upload(file);
  }
  open.value = true;
};

// 处理文件上传
const handleUploadChange = ({fileList}) => {
  items.value = fileList;
};

// 渲染 actions 部分
const renderActions = (_, info) => {
  const {SendButton, LoadingButton, ClearButton, SpeechButton} = info.components;
  return h(Space, {size: 'small'}, [
    h(Typography.Text, {type: 'secondary'}, () => h('small', '`Shift + Enter` to submit')),
    h(ClearButton),
    h(SpeechButton),
    loading.value
        ? h(LoadingButton, {type: 'default', icon: h(Spin, {size: 'small'}), disabled: true})
        : h(SendButton, {type: 'primary', icon: h(SendOutlined), disabled: false}),
  ]);
};

// 生成 senderHeader
const senderHeader = h(Sender.Header, {
  title: 'Attachments',
  open: open.value,
  'onUpdate:open': (val) => (open.value = val),
  forceRender: true
}, {
  default: () => h(Attachments, {
    ref: attachmentsRef,
    beforeUpload: () => false, // 阻止默认上传行为
    items: items.value,
    onChange: handleUploadChange,
    placeholder: (type) => type === 'drop' ? {title: 'Drop file here'} : {
      icon: h(CloudUploadOutlined),
      title: 'Upload files',
      description: 'Click or drag files to this area to upload'
    },
    getDropContainer: () => senderRef.value?.nativeElement
  })
});
</script>

<template>
  <App>
    <Sender
        ref="senderRef"
        v-model:value="value"
        :loading="loading"
        :header="senderHeader"
        @submit="handleSubmit"
        @cancel="handleCancel"
        @paste-file="handlePasteFile"
        :actions="renderActions"
    >
      <template #prefix>
        <Button type="text" :icon="h(LinkOutlined)" @click="open = !open"/>
      </template>
    </Sender>
  </App>
</template>

<style scoped></style>