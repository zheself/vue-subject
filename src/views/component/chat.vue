<template>
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
</template>

<script>
import { ref } from 'vue';
import { Chat } from '@kousum/semi-ui-vue';

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
  width:"900px"
};

let id = 0;
function getId() {
  return `id-${id++}`;
}

const uploadProps = {
  action: 'https://api.semi.design/upload'
};

const uploadTipProps = {
  content: '自定义上传按钮提示信息'
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

    const onMessageSend = (content, attachment) => {
      const newAssistantMessage = {
        role: 'assistant',
        id: getId(),
        createAt: Date.now(),
        content: "这是一条 虚拟 回复信息",
        // 添加头像信息
        avatar: roleInfo.assistant.avatar,
        name: roleInfo.assistant.name
      };
      setTimeout(() => {
        message.value = [...message.value, newAssistantMessage];
      }, 200);
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