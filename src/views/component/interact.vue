<template>
  <div class="center-container">
    <Chat
      :key="align + mode"
      :align="align"
      :mode="mode"
      :uploadProps="uploadProps"
      :style="commonOuterStyle"
      :chats="message"
      :roleConfig="roleInfo"
      @chatsChange="onChatsChange"
      @messageSend="onMessageSend"
      @messageReset="onMessageReset"
      :uploadTipProps="uploadTipProps"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import { Chat } from '@kousum/semi-ui-vue';
import axios from 'axios'; // 引入axios用于发送请求

const roleInfo = {
  user: {
    name: '我',
    avatar: 'src/assets/OIP-C.jfif'
  },
  system: {
    name: '适老化改造小助手',
    avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png'
  },
  assistant: {
    // 新增 assistant 角色的头像信息
    name: '适老化改造小助手',
    avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png'
  }
};

const commonOuterStyle = {
  border: '1px solid var(--semi-color-border)',
  borderRadius: '16px',
  margin: '8px 16px',
  height: '800px',
  width: "900px"
};

let id = 0;

function getId() {
  return `id-${id++}`;
}

const uploadProps = {
  // 修改为后端API地址
  action: 'http://127.0.0.1:8000/chat/stream',
  headers: {
    // 可以根据需要添加请求头
  },
  onSuccess: (response) => {
    // 处理上传成功后的响应
    console.log('Upload success:', response);
  },
  onError: (error) => {
    // 处理上传失败的情况
    console.error('Upload error:', error);
  }
};

const uploadTipProps = {
  content: '从文件夹中选择'
};

export default {
  components: {
    Chat
  },
  props: {
    defaultMessages: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const message = ref(props.defaultMessages);
    const mode = ref('bubble');
    const align = ref('leftRight');

    const onMessageSend = async (content, attachment) => {
      const userInput = content;
      const images = attachment;

      const formData = new FormData();
      formData.append("user_input", userInput);

      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }

      try {
        // 🎯 第一步：上传文本和图片，获取 session_id
        const uploadResponse = await axios.post("http://127.0.0.1:8000/chat/stream", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        const sessionId = uploadResponse.data.session_id;
        console.log("✅ 上传成功，session_id:", sessionId);

        // 🚀 第二步：建立 EventSource 连接，接收流式回复
        const eventSource = new EventSource(`http://127.0.0.1:8000/chat/stream?session_id=${sessionId}`);

        let accumulatedContent = ""; // 🌟 累积内容

        // 📥 接收数据
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data.replace("data: ", ""));
            accumulatedContent += data.content; // 👉 不创建新消息，直接累积

            // 🎯 实时显示最新累积内容（显示“正在回复中”效果）
            const ongoingMessage = {
              role: "assistant",
              id: getId(),
              createAt: Date.now(),
              content: accumulatedContent,
              avatar: roleInfo.assistant.avatar,
              name: roleInfo.assistant.name
            };

            // 更新正在生成的消息内容
            message.value = [...message.value.slice(0, -1), ongoingMessage];
          } catch (error) {
            console.error("解析消息出错:", error, event.data);
          }
        };

        // 🚀 连接完成，收尾
        eventSource.onopen = () => {
          console.log("✅ EventSource 连接成功");

          // 插入一条空的对话框，占位
          const placeholderMessage = {
            role: "assistant",
            id: getId(),
            createAt: Date.now(),
            content: "正在生成回复...",
            avatar: roleInfo.assistant.avatar,
            name: roleInfo.assistant.name
          };
          message.value = [...message.value, placeholderMessage];
        };

        // 🛑 连接结束，确保只保留一条完整回复
        eventSource.onerror = (error) => {
          console.error("EventSource error:", error);
          eventSource.close();

          // 确保最后保留完整消息
          if (accumulatedContent) {
            const finalMessage = {
              role: "assistant",
              id: getId(),
              createAt: Date.now(),
              content: accumulatedContent,
              avatar: roleInfo.assistant.avatar,
              name: roleInfo.assistant.name
            };
            message.value = [...message.value.slice(0, -1), finalMessage];
          }
        };
      } catch (error) {
        console.error("Request error:", error);
      }
    };



    const onChatsChange = (chats) => {
      message.value = chats;
    };

    const onMessageReset = (e) => {
      setTimeout(() => {
        const lastMessage = message.value[message.value.length - 1];
        const newLastMessage = {
          ...lastMessage,
          status: 'complete',
          content: 'This is a mock reset message.'
        };
        message.value = [...message.value.slice(0, -1), newLastMessage];
      }, 200);
    };

    return {
      message,
      mode,
      align,
      onMessageSend,
      onChatsChange,
      onMessageReset,
      uploadProps,
      commonOuterStyle,
      roleInfo,
      uploadTipProps
    };
  }
};
</script>

<style>
.center-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  min-height: 100vh; /* 确保容器至少占满视口高度 */
}
</style>