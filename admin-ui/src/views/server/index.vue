<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="Plus" @click="handleCreate">添加服务器</el-button>
    </div>

    <el-card shadow="never">
      <div class="mb-10px"></div>
      <el-table
        v-loading="listLoading"
        :data="serverList"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="ID" prop="id" align="center" width="80" />
        <el-table-column label="服务器别名" prop="alias" align="center" min-width="150" />
        <el-table-column label="服务器地址" prop="address" align="center" min-width="150" />
        <el-table-column label="端口号" prop="port" align="center" width="100" />
        <el-table-column label="用户名" prop="username" align="center" width="120" />
        <el-table-column label="密码" prop="password" align="center" />
        <el-table-column
          label="操作"
          align="center"
          width="250"
          class-name="small-padding fixed-width"
        >
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleViewDatabases(row)">
              查看数据库
            </el-button>
            <el-button type="success" size="small" @click="handleUpdate(row)">编辑</el-button>
            <el-button
              v-if="row.status != 'deleted'"
              size="small"
              type="danger"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加/编辑服务器对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="dialogStatus === 'create' ? '添加服务器' : '编辑服务器'"
    >
      <el-form ref="dataFormRef" :rules="rules" :model="temp" label-width="120px">
        <el-form-item label="服务器别名" prop="alias">
          <el-input v-model="temp.alias" placeholder="请输入服务器别名" />
        </el-form-item>
        <el-form-item label="服务器地址" prop="address">
          <el-input v-model="temp.address" placeholder="请输入服务器地址" />
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model.number="temp.port" type="number" placeholder="请输入端口号" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="temp.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="dialogStatus === 'create' ? createData() : updateData()"
          >
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看数据库对话框 -->
    <el-dialog v-model="databasesDialogVisible" title="服务器数据库列表" width="30%">
      <div v-loading="databasesLoading">
        <el-empty v-if="databases.length === 0" description="暂无数据库" />
        <div v-else class="database-list">
          <ul>
            <li v-for="(item, index) in databases" :key="index" class="database-item">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="databasesDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import {
  getServerList,
  createServer,
  updateServer,
  deleteServer,
  getServerDatabases,
} from "@/api/user-server";

// 列表数据
const serverList = ref([]);
const listLoading = ref(true);

// 表单数据
const dialogFormVisible = ref(false);
const dialogStatus = ref("");
const dataFormRef = ref<FormInstance>();
const temp = reactive({
  id: undefined,
  alias: "",
  address: "",
  port: 1433,
  username: "",
  password: "",
});

// 表单验证规则
const rules = reactive<any>({
  alias: [{ required: true, message: "服务器别名不能为空", trigger: "blur" }],
  address: [{ required: true, message: "服务器地址不能为空", trigger: "blur" }],
  port: [
    { required: true, message: "端口号不能为空", trigger: "blur" },
    { type: "number", message: "端口号必须为数字", trigger: "blur" },
  ],
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
});

// 数据库列表
const databasesDialogVisible = ref(false);
const databasesLoading = ref(false);
const databases = ref([]);
const currentServerId = ref();

// 获取服务器列表
const getList = () => {
  listLoading.value = true;
  getServerList()
    .then((response) => {
      serverList.value = response as any;
      listLoading.value = false;
    })
    .catch(() => {
      listLoading.value = false;
    });
};

// 重置表单
const resetTemp = () => {
  Object.assign(temp, {
    id: undefined,
    alias: "",
    address: "",
    port: 1433,
    username: "",
    password: "",
  });
};

// 新建服务器
const handleCreate = () => {
  resetTemp();
  dialogStatus.value = "create";
  dialogFormVisible.value = true;
  nextTick(() => {
    if (dataFormRef.value) {
      dataFormRef.value.clearValidate();
    }
  });
};

// 创建数据提交
const createData = () => {
  if (dataFormRef.value) {
    dataFormRef.value.validate((valid: boolean) => {
      if (valid) {
        createServer(temp).then(() => {
          dialogFormVisible.value = false;
          ElMessage({
            message: "创建成功",
            type: "success",
          });
          getList();
        });
      }
    });
  }
};

// 编辑服务器
const handleUpdate = (row: any) => {
  console.log("row: ", row);
  Object.assign(temp, row);
  // temp.password = ""; // 出于安全考虑，不回显密码
  dialogStatus.value = "update";
  dialogFormVisible.value = true;
  nextTick(() => {
    if (dataFormRef.value) {
      dataFormRef.value.clearValidate();
    }
  });
};

// 更新数据提交
const updateData = () => {
  if (dataFormRef.value) {
    dataFormRef.value.validate((valid: boolean) => {
      if (valid) {
        const tempData = Object.assign({}, temp);
        if (!tempData.id) {
          ElMessage({
            message: "服务器ID不能为空",
            type: "error",
          });
          return;
        }
        updateServer(tempData.id, tempData).then(() => {
          const index = serverList.value.findIndex((v: any) => v.id === tempData.id);
          Object.assign(serverList.value[index], tempData);
          dialogFormVisible.value = false;
          ElMessage({
            message: "更新成功",
            type: "success",
          });
        });
      }
    });
  }
};

// 删除服务器
const handleDelete = (row: any) => {
  ElMessageBox.confirm("确认删除该服务器吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteServer(row.id).then(() => {
        ElMessage({
          message: "删除成功",
          type: "success",
        });
        getList();
      });
    })
    .catch(() => {
      // 取消删除操作
    });
};

// 查看服务器数据库
const handleViewDatabases = (row: any) => {
  databasesLoading.value = true;
  currentServerId.value = row.id;
  databases.value = [];
  databasesDialogVisible.value = true;

  getServerDatabases(row.id)
    .then((response) => {
      databases.value = response as any;
      databasesLoading.value = false;
    })
    .catch(() => {
      databasesLoading.value = false;
    });
};

onMounted(() => {
  getList();
});
</script>

<style scoped>
.filter-container {
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-container {
  padding: 20px;
}

.dialog-footer {
  text-align: right;
  padding-top: 0;
  margin-right: 0px;
}

.el-table .fixed-width .el-button--mini {
  padding-left: 0;
  padding-right: 0;
  width: inherit;
}

.small-padding .el-button {
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 0;
}
</style>
