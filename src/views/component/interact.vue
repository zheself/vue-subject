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

    let currentSessionId = null; // 初始化会话id

    const onMessageSend = async (content, attachment) => {
      const userInput = content;
      const images = attachment;

      // 🌟 创建 FormData 确保格式正确
      const formData = new FormData();
      formData.append("user_input", userInput);

      // 🎯 确保图片按数组格式上传
      if (images && images.length > 0) {
          images.forEach((image, index) => {
              if (image.fileInstance instanceof File) {
                  console.log(`✅ 准备上传图片 (索引 ${index}):`, image.fileInstance.name);
                  formData.append('images', image.fileInstance);  // 使用 fileInstance
              } else {
                  console.error(`❌ 图片 (索引 ${index}) 没有有效的文件对象:`, image);
              }
          });
      } else {
          console.warn("⚠️ 未选择图片，仅上传文本");
      }

      // 🌟 确保带上 session_id（如果有的话）
      if (currentSessionId) {
          formData.append("session_id", currentSessionId);
      }

      try {
          // 🎯 第一步：上传文本和图片，获取/继续 session_id
          console.log("🚀 开始上传...");
          console.log("上传的 FormData 内容:", formData);
          try {
              const uploadResponse = await axios.post("http://127.0.0.1:8000/chat/stream", formData, {
                  headers: { "Content-Type": "multipart/form-data" },
              });
              console.log("上传响应状态码:", uploadResponse.status);
              console.log("上传响应数据:", uploadResponse.data);
              currentSessionId = uploadResponse.data.session_id;
              console.log("✅ 上传成功，session_id:", currentSessionId);

              // 🚀 第二步：建立 EventSource 连接，接收流式回复
              const eventSource = new EventSource(`http://127.0.0.1:8000/chat/stream?session_id=${currentSessionId}`);

              let accumulatedContent = ""; // 🌟 累积内容

              // 📥 接收数据
              eventSource.onmessage = (event) => {
                  try {
                      const data = JSON.parse(event.data.replace("data: ", ""));
                      accumulatedContent += data.content; // 👉 累积消息内容

                      // 🎯 实时显示最新累积内容（"正在回复中"效果）
                      const ongoingMessage = {
                          role: "assistant",
                          id: getId(),
                          createAt: Date.now(),
                          content: accumulatedContent,
                          avatar: roleInfo.assistant.avatar,
                          name: roleInfo.assistant.name,
                      };

                      // 更新正在生成的消息内容
                      message.value = [...message.value.slice(0, -1), ongoingMessage];
                  } catch (error) {
                      console.error("解析消息出错:", error, event.data);
                  }
              };

              // 🚀 连接成功，插入占位提示
              eventSource.onopen = () => {
                  console.log("✅ EventSource 连接成功");

                  // 插入一条空白提示
                  const placeholderMessage = {
                      role: "assistant",
                      id: getId(),
                      createAt: Date.now(),
                      content: "正在生成回复...",
                      avatar: roleInfo.assistant.avatar,
                      name: roleInfo.assistant.name,
                  };
                  message.value = [...message.value, placeholderMessage];
              };

              // 🛑 连接结束，确保最终保留完整回复
              eventSource.onerror = (error) => {
                  console.error("EventSource error:", error);
                  eventSource.close();

                  // 确保最后只保留一条完整消息
                  if (accumulatedContent) {
                      const finalMessage = {
                          role: "assistant",
                          id: getId(),
                          createAt: Date.now(),
                          content: accumulatedContent,
                          avatar: roleInfo.assistant.avatar,
                          name: roleInfo.assistant.name,
                      };
                      message.value = [...message.value.slice(0, -1), finalMessage];
                  }
              };
          } catch (error) {
              console.error("❌ axios 请求失败:", error);
              if (error.response) {
                  console.error("响应状态码:", error.response.status);
                  console.error("响应数据:", error.response.data);
                  if (error.response.data.detail) {
                      console.error("详细错误信息:", error.response.data.detail);
                  }
              } else if (error.request) {
                  console.error("没有收到响应:", error.request);
              } else {
                  console.error("请求设置出错:", error.message);
              }
          }
      } catch (error) {
          console.error("❌ 外层请求失败:", error);
      }
  };


    // ✨ 新增一个重置对话的功能
    const resetChat = () => {
      currentSessionId = null; // 清空 session
      message.value = [];
      console.log("🔄 已重置会话");
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