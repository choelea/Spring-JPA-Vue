<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="security-card">
          <template #header>
            <div class="card-header">
              <span>安全设置</span>
            </div>
          </template>
          <div class="security-item">
            <div class="security-info">
              <div class="security-title">账户密码</div>
              <div class="security-desc">定期修改密码有助于保护账户安全</div>
            </div>
            <el-button type="primary" link @click="() => handleOpenDialog(DialogType.PASSWORD)">
              修改
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 弹窗 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" :width="500">
      <!-- 修改密码 -->
      <el-form
        v-if="dialog.type === DialogType.PASSWORD"
        ref="passwordChangeFormRef"
        :model="passwordChangeForm"
        :rules="passwordChangeRules"
        :label-width="100"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordChangeForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordChangeForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordChangeForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseDialog">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { updateClientPassword } from "@/api/user-server";

const enum DialogType {
  PASSWORD = "password",
}

export interface PasswordChangeForm {
  /** 原密码 */
  oldPassword?: string;
  /** 新密码 */
  newPassword?: string;
  /** 确认新密码 */
  confirmPassword?: string;
}
const passwordChangeForm = reactive<PasswordChangeForm>({});
const passwordChangeFormRef = ref();

const dialog = reactive({
  visible: false,
  title: "",
  type: "" as DialogType, // 修改账号资料,修改密码、绑定手机、绑定邮箱
});

// 修改密码校验规则
const passwordChangeRules = {
  oldPassword: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, message: "密码长度不能少于6位", trigger: "blur" },
    {
      validator: (_rule: unknown, value: string, callback: any) => {
        // 检查密码是否同时包含字母和数字
        const hasLetter = /[a-zA-Z]/.test(value);
        const hasNumber = /\d/.test(value);

        if (!hasLetter || !hasNumber) {
          callback(new Error("密码必须同时包含字母和数字"));
        } else {
          // 如果新密码变更，触发确认密码字段的验证
          if (passwordChangeForm.confirmPassword) {
            passwordChangeFormRef.value?.validateField("confirmPassword");
          }
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  confirmPassword: [
    { required: true, message: "请再次输入新密码", trigger: "blur" },
    {
      validator: (_rule: unknown, value: any, callback: any) => {
        if (value !== passwordChangeForm.newPassword) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};
/**
 * 重置密码表单
 */
const resetPasswordForm = () => {
  passwordChangeForm.oldPassword = "";
  passwordChangeForm.newPassword = "";
  passwordChangeForm.confirmPassword = "";
  passwordChangeFormRef.value?.resetFields();
};

/**
 * 打开弹窗
 * @param type 弹窗类型 ACCOUNT: 账号资料 PASSWORD: 修改密码 MOBILE: 绑定手机 EMAIL: 绑定邮箱
 */
const handleOpenDialog = (type: DialogType) => {
  dialog.type = type;
  dialog.visible = true;
  dialog.title = "修改密码";
};

/**
 * 关闭弹窗时清空表单
 */
const handleCloseDialog = () => {
  dialog.visible = false;
  resetPasswordForm();
};

/**
 * 提交表单
 */
const handleSubmit = async () => {
  passwordChangeFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      updateClientPassword(passwordChangeForm).then(() => {
        ElMessage.success("密码修改成功");
        handleCloseDialog();
      });
    }
  });
};
</script>

<style lang="scss" scoped>
.profile-container {
  min-height: calc(100vh - 84px);
  padding: 20px;
  background: var(--el-fill-color-blank);
}

.security-card {
  margin-bottom: 20px;

  .card-header {
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }
}

.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;

  .security-info {
    .security-title {
      margin-bottom: 4px;
      font-size: 16px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }

    .security-desc {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }
}

.el-dialog {
  .el-dialog__header {
    padding: 20px;
    margin: 0;
    border-bottom: 1px solid var(--el-border-color-light);
  }

  .el-dialog__body {
    padding: 30px 20px;
  }

  .el-dialog__footer {
    padding: 20px;
    border-top: 1px solid var(--el-border-color-light);
  }
}

// 响应式适配
@media (max-width: 768px) {
  .profile-container {
    padding: 10px;
  }

  .el-col {
    width: 100%;
  }
}
</style>
