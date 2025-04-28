<template>
  <div class="dashboard-container">
    <el-card shadow="never" class="mt-2">
      <el-row class="h-80px">
        <el-col :span="18" :xs="24">
          <div class="flex-x-start">
            <div class="ml-5">
              <p>{{ greetings }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Dashboard",
  inheritAttrs: false,
});

import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();

// 当前时间（用于计算问候语）
const currentDate = new Date();

// 问候语：根据当前小时返回不同问候语
const greetings = computed(() => {
  const hours = currentDate.getHours();
  const nickname = userStore.userInfo.username;
  if (hours >= 6 && hours < 8) {
    return "晨起披衣出草堂，轩窗已自喜微凉🌅！";
  } else if (hours >= 8 && hours < 12) {
    return `上午好，${nickname}！`;
  } else if (hours >= 12 && hours < 18) {
    return `下午好，${nickname}！`;
  } else if (hours >= 18 && hours < 24) {
    return `晚上好，${nickname}！`;
  } else {
    return "偷偷向银河要了一把碎星，只等你闭上眼睛撒入你的梦中，晚安🌛！";
  }
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  position: relative;
  padding: 24px;

  .github-corner {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    border: 0;
  }
}
</style>
