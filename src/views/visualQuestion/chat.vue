<template>
  <div class="chat-container">
    <a-row :gutter="20" style="max-height: 300px;">
      <a-col :span="24">
        <BubbleList
          :roles="roles"
          :items="messages.map(item => ({
            key: item.id,
            role: item.status === 'local' ? 'local' : 'ai',
            content: item.message
          }))"
        />
      </a-col>
    </a-row>
    <a-row :gutter="20">
      <a-col :span="24">
        <Sender
          :loading="isRequesting"
          v-model="content"
          @submit="handleSubmit"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { Bubble, Sender, useXAgent, useXChat } from 'ant-design-x-vue';
import { Row, Col } from 'ant-design-vue';

export default {
  components: {
    BubbleList: Bubble.List,
    Sender,
    Row,
    Col,
    UserOutlined,
  },
  setup() {
    const content = ref('');
    const isRequesting = ref(false);
    const roles = reactive({
      ai: {
        placement: 'start',
        avatar: {
          icon: UserOutlined,
          style: {
            background: '#fde3cf',
          },
        },
      },
      local: {
        placement: 'end',
        avatar: {
          icon: UserOutlined,
          style: {
            background: '#87d068',
          },
        },
      },
    });

    // 请求代理
    const [agent] = useXAgent({
      request: async ({ message }, { onSuccess, onUpdate }) => {
        const fullContent = `Streaming output instead of Bubble typing effect. You typed: ${message}`;
        let currentContent = '';
        const id = setInterval(() => {
          currentContent = fullContent.slice(0, currentContent.length + 2);
          onUpdate(currentContent);
          if (currentContent === fullContent) {
            clearInterval(id);
            onSuccess(fullContent);
          }
        }, 100);
      },
    });

    // 使用 useXChat 获取聊天消息和请求函数
    const { onRequest, messages } = useXChat({
      agent,
    });

    console.log(onRequest); // 打印 onRequest 确保它是一个函数
    console.log(messages);   // 打印 messages 以检查聊天消息

    // 提交处理函数
    const handleSubmit = async (nextContent) => {
      if (typeof onRequest === 'function') {
        try {
          await onRequest(nextContent);
          content.value = ''; // 清空输入框
        } catch (error) {
          console.error('Request failed:', error);
        }
      } else {
        console.error('onRequest is not a function');
      }
    };

    return {
      content,
      isRequesting: agent.isRequesting,
      roles,
      messages,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.chat-container {
  padding: 20px;
}
</style>
