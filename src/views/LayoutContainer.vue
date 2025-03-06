<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Fold, Expand, Picture, ChatDotRound, Edit, Document, More, Clock } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'


// 响应式状态
const isCollapse = ref(false)
const historyList = ref([
  { id: 1, title: '走廊改造', time: '10:30' },
  { id: 2, title: '屋内家具选用', time: '11:45' },
  { id: 3, title: '卧室改造', time: '11:45' },
  { id: 4, title: '适老化改造怎么进行', time: '11:45' },
  { id: 5, title: '老年人家里应该注意什么', time: '11:45' },
  { id: 6, title: '厕所改造', time: '11:45' },
  { id: 7, title: '厨房改造', time: '11:45' },
  { id: 8, title: '对话记录8', time: '11:45' },
  { id: 9, title: '对话记录9', time: '11:45' },
  // 更多记录...
])



const hoveredIndex = ref(-1)
const isActive = ref(false)
// 对话框可视化
const deleteRecordDialog = ref(false)

// 查看“更多”的对话话
const showMoreMenu = (event) => {
  event.stopPropagation()

};

// 处理鼠标点击事件
const handleMouseEnter = (index) => {
  hoveredIndex.value = index;
};

const handleMouseLeave = () => {
  hoveredIndex.value = null;
};

const router = useRouter()
const handleUserInfo = () => {
  router.push('/usercenter')
}

// 修改路由跳转逻辑，改为 history + id 的形式
const navigateTo = (item) => {
    // 执行路由跳转并传递参数
    router.push(`/history${item.id}`);
};



// 切换折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}


// 处理设置操作
const handleCommand = (command) => {
  if (command === 'delete') {

  } else if (command === 'rename') {
    // 实现重命名逻辑

  }
}

// 处理删除所有历史对话操作
const handleHistoryRecord = () => {

}

// 退出登录
const handleLogout = () => {
    // 清除登录相关信息，例如 Cookie、LocalStorage 或 Vuex 状态
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // 删除 Cookie
    localStorage.removeItem("authToken"); // 如果有使用 LocalStorage 存储 Token
    sessionStorage.clear(); // 清除会话存储（如果有）

    // 跳转到登录页
    router.push('/login');
};


</script>

<template>

  <el-container class="main-container">
    <!-- 左侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '240px'" class="sidebar-container">
      <!-- 折叠按钮区域 -->
      <div class="header-section" :style="{ justifyContent: isCollapse ? 'center' : 'space-between' }">
        <div>
            <img style="margin-left: 5px;margin-top: 15px; width: 50px; height: 48px; mix-blend-mode: multiply;" src="../assets/smartlogo.png">
          </div>
        <transition name="fade">
          <span v-if="!isCollapse" class="project-name">smartabode</span>
        </transition>
        <div class="toggle-button" :style="{ marginLeft: isCollapse ? 0 : 'auto' }" @click="toggleCollapse">
          <el-icon :size="20" color="#4CAF50">
            <component :is="isCollapse ? Expand : Fold" />
          </el-icon>
        </div>
      </div>

      <!-- 功能菜单 -->
      <el-menu :default-active="$route.path" router text-color="#616161" active-text-color="#4CAF50">

        <el-menu-item index="vqa">
          <el-tooltip class="box-item" effect="dark" content="视觉问答" placement="right">
            <el-icon>
              <ChatDotRound />
            </el-icon>
          </el-tooltip>
          <transition name="fade">
            <span v-if="!isCollapse" class="menu-title">视觉问答</span>
          </transition>
        </el-menu-item>

        <el-menu-item index="reconstruction">
          <el-tooltip class="box-item" effect="dark" content="三维重建" placement="right">
            <el-icon>
              <Picture />
            </el-icon>
          </el-tooltip>

          <transition name="fade">
            <span v-if="!isCollapse" class="menu-title">三维重建</span>
          </transition>
        </el-menu-item>

        <el-menu-item index="image-edit">
          <el-tooltip class="box-item" effect="dark" content="图像编辑" placement="right">
            <el-icon>
              <Edit />
            </el-icon>
          </el-tooltip>
          <transition name="fade">
            <span v-if="!isCollapse" class="menu-title">图像编辑</span>
          </transition>
        </el-menu-item>


        <el-sub-menu v-if="!isCollapse">
          <template #title>
            <el-icon>
              <Clock />
            </el-icon>
            <transition name="fade">
              <span v-if="!isCollapse" class="menu-title">历史对话记录</span>
            </transition>
          </template>
          <div class="scrollable-menu">
            <el-menu-item-group>
              <template #title>今天</template>
            </el-menu-item-group>

              <el-menu-item-group title="7天内">
                <el-menu-item v-for="(item, index) in historyList" :key="index" @mouseenter="handleMouseEnter(index)"
                  @mouseleave="handleMouseLeave" @click="navigateTo(item)"
                  :class="{ 'menu-item-hover': hoveredIndex === index, 'menu-item-active': isActive}"
                  style="position: relative; padding-right: 20px;">
                  {{ item.title }}
                  <el-dropdown placement="bottom" trigger="click" style="position: absolute; right: 0;" :teleported="false">
                    <el-icon v-show="hoveredIndex === index" class="more-icon" @click.stop="showMoreMenu">
                      <More />
                    </el-icon>
                    <template #dropdown>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.stop><el-button text>重命名</el-button></el-dropdown-item>
                        <el-dropdown-item @click.stop><el-button text type="danger" @click="deleteRecordDialog = true">删除</el-button></el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </el-menu-item>
              </el-menu-item-group>

              <el-menu-item index="history">
                更多历史对话
              </el-menu-item>
          </div>


        </el-sub-menu>

        <el-menu-item v-else index="history">
          <el-tooltip class="box-item" effect="dark" content="历史对话记录" placement="right">
            <el-icon>
              <Clock />
            </el-icon>
          </el-tooltip>
        </el-menu-item>

      </el-menu>

      <el-dialog v-model="deleteRecordDialog" title="永久删除对话" width="500" :before-close="handleClose">
        <span>删除后，该对话将不可恢复。确认删除吗？</span>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="deleteRecordDialog = false">取消</el-button>
            <el-button type="danger" @click="handleCommand('delete')">
              删除
            </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 用户信息区域 -->
      <div class="user-profile-container">
        <el-dropdown trigger="click" placement="top">
          <div class="user-info">
            <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <div v-if="!isCollapse" class="user-details">
              <span class="username">个人信息</span>
              <el-icon class="dropdown-icon">
                <ArrowUp />
              </el-icon>
            </div>
          </div>
          <template #dropdown>
            <el-dropdown-menu :append-to-body="false">
              <el-dropdown-item @click="handleUserInfo">个人资料</el-dropdown-item>
              <el-dropdown-item divided @click="handleHistoryRecord">删除所有历史对话</el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-aside>
    <el-container>
      <el-main>
        <router-view :key="$route.fullPath"></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>


<style scoped>
.main-container {
  height: 100vh;
  display: flex;

}

.sidebar-container {

  border-right: 1px solid #EBEDF0;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: hidden
}

/* 侧边栏头部区域 */
.header-section {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 16px;
  border-bottom: 1px solid #EBEDF0;
  transition: all 0.3s;
}

.project-name {
  font-family: 'Arial Black', Gadget, sans-serif;
  font-weight: bold; /* 修改为加粗 */
  font-size: 18px;
  font-weight: 600;
  color: transparent; /* 文字颜色设为透明，使用背景渐变色 */
  background: linear-gradient(to right, #00ff00, #006400); /* 文字背景渐变 */
  -webkit-background-clip: text; /* 使背景渐变只应用于文本 */
  -webkit-text-fill-color: transparent; /* 让文字填充透明，背景渐变显示 */
}

.toggle-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  cursor: pointer;
  border-bottom: 1px solid #EBEDF0;
}



/* 菜单标题过渡效果 */
.menu-title {
  margin-left: 8px;
  transition: opacity 1s;
}

/* 折叠时的图标对齐 */
.el-menu--collapse .el-menu-item {
  display: flex;
  justify-content: center;
  padding: 0 !important;
}

.scrollable-menu {
  max-height: 400px;
  /* 设置最大高度 */
  overflow-y: auto;
  /* 超出部分显示滚动条 */
}

.scrollable-menu::-webkit-scrollbar {
  width: 0;
}

/* 当鼠标悬停在元素上时显示滚动条 */
.scrollable-menu:hover::-webkit-scrollbar {
  width: 6px;
  /* 滚动条的正常宽度 */
}

.scrollable-menu::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.3);
  border-radius: 3px;
}

.scrollable-menu::-webkit-scrollbar-track {
  background-color: transparent;
}


/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1ms;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


/* 点击历史记录框 */
.menu-item-hover {
  background-color: lightgreen;
  font-weight: bold;
}

.menu-item-active {
  background-color: lightgreen;
}

.more-icon {
  margin-right: 10px;
  cursor: pointer;
}


/*
  用户信息区域
*/
.user-profile-container {
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
}

.user-details {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.username {
  font-size: 14px;
  color: #616161;
}

.dropdown-icon {
  color: #9e9e9e;
  transform: rotate(180deg);
}

/* 收起状态下的用户信息 */
.el-menu--collapse+.user-profile-container {
  padding: 16px 0;
  text-align: center;
}


/* 文字提示类型 */
.tooltip-base-box {
  width: 600px;
}

.tooltip-base-box .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tooltip-base-box .center {
  justify-content: center;
}

.tooltip-base-box .box-item {
  width: 110px;
  margin-top: 10px;
}

</style>