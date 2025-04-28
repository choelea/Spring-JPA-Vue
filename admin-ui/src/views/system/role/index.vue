<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="search" label="关键字">
          <el-input
            v-model="queryParams.search"
            placeholder="角色名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
          <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <div class="mb-10px">
        <el-button type="primary" icon="plus" @click="handleOpenDialog()">新增</el-button>
        <el-button
          type="danger"
          :disabled="ids.length === 0"
          icon="delete"
          @click="handleDeleteSelectIds()"
        >
          删除
        </el-button>
      </div>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="roleList"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="角色名称" prop="name" min-width="100" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="创建时间" prop="create_time" />
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              icon="position"
              @click="handleOpenAssignPermDialog(scope.row)"
            >
              分配权限
            </el-button>
            <el-button
              type="primary"
              size="small"
              link
              icon="edit"
              @click="handleOpenDialog(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              icon="delete"
              @click="handleDelete(scope.row.role_id)"
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

    <!-- 角色表单弹窗 -->
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="roleFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleCloseDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配权限弹窗 -->
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="assignPermDialogVisible"
      :title="'【' + checkedRole.name + '】权限分配'"
      width="500px"
    >
      <el-tree
        ref="permTreeRef"
        show-checkbox
        node-key="type"
        :data="menuPermOptions"
        :default-expand-all="true"
        :check-strictly="!parentChildLinked"
      >
        <template #default="{ data }">
          {{ data.label }}
        </template>
      </el-tree>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleAssignPermSubmit">确 定</el-button>
          <el-button @click="assignPermDialogVisible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Role",
  inheritAttrs: false,
});

import RoleAPI, { RolePageVO, RoleForm, RolePageQuery } from "@/api/system/role";
import MenuAPI, { MenuVO } from "@/api/system/menu";

const queryFormRef = ref();
const roleFormRef = ref();
const permTreeRef = ref();

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<RolePageQuery>({
  page_number: 1,
  limit: 10,
});

// 角色表格数据
const roleList = ref<RolePageVO[]>();
// 菜单权限下拉
const menuPermOptions = ref<MenuVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});
// 角色表单
const formData = reactive<RoleForm>({});

const rules = reactive({
  name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  remark: [{ required: false, message: "请输入", trigger: "blur" }],
});

// 选中的角色
interface CheckedRole {
  id?: number;
  name?: string;
}
const checkedRole = ref<CheckedRole>({});
const assignPermDialogVisible = ref(false);

const permKeywords = ref("");

const parentChildLinked = ref(true);

// 查询
function handleQuery() {
  loading.value = true;
  RoleAPI.getPage(queryParams)
    .then((data) => {
      roleList.value = data.roles_list;
      total.value = data.total_roles;
    })
    .finally(() => {
      loading.value = false;
    });
}

// 重置查询
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.page_number = 1;
  handleQuery();
}

// 行复选框选中
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.role_id);
}

// 打开角色弹窗
function handleOpenDialog(roleItem?: RolePageVO) {
  dialog.visible = true;
  if (roleItem) {
    dialog.title = "修改角色";
    Object.assign(formData, roleItem);
  } else {
    dialog.title = "新增角色";
  }
}

// 提交角色表单
function handleSubmit() {
  roleFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const roleId = formData.role_id;
      if (roleId) {
        RoleAPI.update(formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        RoleAPI.add(formData)
          .then(() => {
            ElMessage.success("新增成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;

  roleFormRef.value.resetFields();
  roleFormRef.value.clearValidate();

  formData.role_id = undefined;
}

// 删除角色
function handleDeleteSelectIds() {
  if (ids.value.length === 0) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      RoleAPI.deleteByIds({
        role_ids: ids.value,
      })
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}
// 删除角色
function handleDelete(roleId?: number) {
  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      RoleAPI.deleteByIds({
        role_ids: [roleId],
      })
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}

// 打开分配菜单权限弹窗
async function handleOpenAssignPermDialog(row: RolePageVO) {
  const roleId = row.role_id;
  if (roleId) {
    assignPermDialogVisible.value = true;
    loading.value = true;

    checkedRole.value.id = roleId;
    checkedRole.value.name = row.name;

    // 获取所有的菜单
    menuPermOptions.value = await (
      await MenuAPI.getAll()
    ).menus.map((item) => {
      return {
        ...item,
        disabled: String(item.type) === "000",
      };
    });

    // 回显角色已拥有的菜单
    RoleAPI.getRoleMenuIds(roleId)
      .then((data) => {
        const checkedMenuIds = data.menu_list;
        checkedMenuIds.forEach((menuId) => {
          permTreeRef.value!.setChecked(menuId, true, false);
        });
      })
      .finally(() => {
        loading.value = false;
      });
  }
}

// 分配菜单权限提交
function handleAssignPermSubmit() {
  const roleId = checkedRole.value.id;
  if (roleId) {
    const checkedMenuIds: number[] = permTreeRef
      .value!.getCheckedNodes(false, true)
      .map((node: any) => node.type);

    loading.value = true;
    RoleAPI.updateRoleMenus({
      role_id: roleId,
      menu_list: checkedMenuIds,
    })
      .then(() => {
        ElMessage.success("分配权限成功");
        assignPermDialogVisible.value = false;
        handleResetQuery();
      })
      .finally(() => {
        loading.value = false;
      });
  }
}

// 权限筛选
watch(permKeywords, (val) => {
  permTreeRef.value!.filter(val);
});

onMounted(() => {
  handleQuery();
});
</script>
