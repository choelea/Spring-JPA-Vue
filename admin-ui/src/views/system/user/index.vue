<!-- 用户管理 -->
<template>
  <div class="app-container">
    <el-row>
      <!-- 用户列表 -->
      <el-col :lg="24" :xs="24">
        <div class="search-bar">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="queryParams.username"
                placeholder="请输入"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="所属部门" prop="department">
              <el-input
                v-model="queryParams.department"
                placeholder="请输入"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="所属岗位" prop="position">
              <el-input
                v-model="queryParams.position"
                placeholder="请输入"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="角色" prop="role_id">
              <el-select
                v-model="queryParams.role_id"
                placeholder="请选择"
                style="width: 200px"
                clearable
                @change="handleQuery"
              >
                <el-option
                  v-for="item in roleOptions"
                  :key="item.role_id"
                  :label="item.name"
                  :value="item.role_id"
                />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
              <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never">
          <div class="flex-x-between mb-10px">
            <div>
              <el-button type="primary" icon="plus" @click="handleOpenDialog()">新增</el-button>
              <el-button
                type="danger"
                icon="delete"
                :disabled="selectIds.length === 0"
                @click="handleDeleteSelectIds()"
              >
                删除
              </el-button>
            </div>
          </div>

          <el-table
            v-loading="loading"
            :data="pageData"
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="排序" prop="rank" width="80" align="center" />
            <el-table-column label="姓名" prop="name" />
            <el-table-column label="用户名" align="center" prop="username" />
            <el-table-column label="所属部门" align="center" prop="department" />
            <el-table-column label="所属岗位" align="center" prop="position" />
            <el-table-column label="角色" align="center" prop="role_id">
              <template #default="scope">
                {{ roleOptions.find((item) => item.role_id === scope.row.role_id)?.name }}
              </template>
            </el-table-column>

            <el-table-column label="创建时间" align="center" prop="create_time" width="190" />
            <el-table-column label="操作" fixed="right" width="150">
              <template #default="scope">
                <el-button
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  icon="delete"
                  link
                  size="small"
                  @click="handleDelete(scope.row.user_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-if="total > 0"
            v-model:total="total"
            v-model:page="queryParams.page_number"
            v-model:limit="queryParams.limit"
            @pagination="handleQuery"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户表单 -->
    <el-dialog
      v-model="dialog.visible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="dialog.title"
      append-to-body
      @close="handleCloseDialog"
    >
      <el-form ref="userFormRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="排序" prop="rank">
          <el-input-number v-model="formData.rank" :min="1" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="formData.role_id" placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.role_id"
              :label="item.name"
              :value="item.role_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            show-password
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-input v-model="formData.department" placeholder="请输入所属部门" />
        </el-form-item>
        <el-form-item label="所属岗位" prop="position">
          <el-input v-model="formData.position" placeholder="请输入所属岗位" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleCloseDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { aesEncrypt } from "@/utils/tool.js";
import UserAPI, { UserForm, UserPageQuery, UserPageVO } from "@/api/system/user";

import RoleAPI from "@/api/system/role";
import { useUserStore } from "@/store";

const userStore = useUserStore();

defineOptions({
  name: "User",
  inheritAttrs: false,
});
const queryFormRef = ref();
const userFormRef = ref();

const queryParams = reactive<UserPageQuery>({
  page_number: 1,
  limit: 10,
});

const pageData = ref<UserPageVO[]>();
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: "新增用户",
});

const formData = reactive<UserForm>({});

const rules = reactive({
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  department: [{ required: true, message: "请输入部门", trigger: "blur" }],
  position: [{ required: true, message: "请输入职位", trigger: "blur" }],
  role_id: [{ required: true, message: "请选择角色", trigger: "change" }],
  rank: [{ required: true, message: "请输入排序", trigger: "blur" }],
});

// 选中的用户ID
const selectIds = ref<number[]>([]);

// 角色下拉数据源
const roleOptions = ref<any[]>([
  {
    name: "超级管理员",
    role_id: 1,
  },
]);

// 查询
function handleQuery() {
  loading.value = true;
  UserAPI.getPage({
    ...queryParams,
  })
    .then((data) => {
      pageData.value = data.users_list;
      total.value = data.total_users;
    })
    .finally(() => {
      loading.value = false;
    });
}

// 重置查询
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.page_number = 1;
  queryParams.department = undefined;
  handleQuery();
}

// 选中项发生变化
function handleSelectionChange(selection: any[]) {
  selectIds.value = selection.map((item) => item.user_id);
}

/**
 * 打开弹窗
 *
 * @param id 用户ID
 */
async function handleOpenDialog(userItem?: UserPageVO) {
  dialog.visible = true;
  // 加载角色下拉数据源
  roleOptions.value = await (
    await RoleAPI.getOptions()
  ).map((item) => ({
    name: item.roleName,
    role_id: item.roleId,
  }));

  if (userItem && userItem.user_id) {
    dialog.title = "修改用户";

    Object.assign(formData, { ...userItem });
  } else {
    dialog.title = "新增用户";
  }
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  userFormRef.value.resetFields();
  userFormRef.value.clearValidate();

  formData.user_id = undefined;
}

// 提交用户表单（防抖）
const handleSubmit = useDebounceFn(() => {
  userFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const userId = formData.user_id;
      loading.value = true;
      if (userId) {
        UserAPI.update({
          ...formData,
          password: aesEncrypt(formData.password),
        })
          .then(() => {
            ElMessage.success("修改用户成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        UserAPI.add({
          ...formData,
          password: aesEncrypt(formData.password),
        })
          .then(() => {
            ElMessage.success("新增用户成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}, 1000);

/**
 * 删除用户
 *
 * @param id  用户ID
 */
function handleDeleteSelectIds() {
  if (selectIds.value.length === 0) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除用户?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    function () {
      loading.value = true;
      UserAPI.deleteByBatch({
        user_ids: selectIds.value,
        update_by: userStore.userInfo.update_by,
      })
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    function () {
      ElMessage.info("已取消删除");
    }
  );
}
function handleDelete(user_id?: number) {
  ElMessageBox.confirm("确认删除用户?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    function () {
      loading.value = true;
      UserAPI.deleteByIds({
        user_id,
        update_by: userStore.userInfo.update_by,
      })
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    function () {
      ElMessage.info("已取消删除");
    }
  );
}

// 获取角色下拉数据源
onMounted(async () => {
  handleQuery();
  roleOptions.value = await (
    await RoleAPI.getOptions()
  ).map((item) => ({
    name: item.roleName,
    role_id: item.roleId,
  }));
});
</script>
