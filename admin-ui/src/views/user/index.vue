<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="filter-label">客户名:</span>
      <el-input
        v-model="searchQuery"
        placeholder="请输入客户名搜索"
        style="width: 200px"
        clearable
        @keyup.enter="handleSearch"
      />
      <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
      <el-button icon="Refresh" @click="resetTempList">重置</el-button>
      <el-button type="success" icon="Plus" @click="handleCreate">添加客户</el-button>
    </div>

    <el-card shadow="never">
      <div class="mb-10px"></div>
      <el-table
        v-loading="listLoading"
        :data="clientList"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="ID" prop="id" align="center" width="80" />
        <el-table-column label="客户名" prop="clientName" align="center" min-width="120" />
        <el-table-column label="服务器别名" prop="serverAlias" align="center" min-width="120" />
        <el-table-column label="数据库" prop="databaseName" align="center" min-width="120" />
        <el-table-column
          label="年费（元）"
          prop="annualFee"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column label="过期时间" prop="expiryTime" align="center" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.expiryTime) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'ENABLED' ? 'success' : 'danger'">
              {{ row.status === "ENABLED" ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="280"
          class-name="small-padding fixed-width"
        >
          <template #default="{ row }">
            <el-button
              size="small"
              :type="row.status === 'ENABLED' ? 'warning' : 'success'"
              @click="handleStatusChange(row)"
            >
              {{ row.status === "ENABLED" ? "禁用" : "启用" }}
            </el-button>
            <el-button type="primary" size="small" @click="handleUpdate(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑客户对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="dialogStatus === 'create' ? '添加客户' : '编辑客户'"
    >
      <el-form ref="dataFormRef" :rules="rules" :model="temp" label-width="120px">
        <el-form-item label="客户名" prop="clientName">
          <el-input v-model="temp.clientName" placeholder="请输入客户名" />
        </el-form-item>
        <el-form-item label="服务器与数据库" prop="server_database">
          <el-cascader
            v-model="temp.server_database"
            style="width: 100%"
            :options="serverOptions"
            :props="cascaderProps"
            placeholder="请选择服务器和数据库"
            @change="handleCascaderChange"
          />
        </el-form-item>
        <el-form-item label="年费（元）" prop="annualFee">
          <el-input-number v-model="temp.annualFee" :min="0" :step="100" style="width: 180px" />
        </el-form-item>
        <el-form-item label="过期时间" prop="expiryTime">
          <el-date-picker
            v-model="temp.expiryTime"
            type="datetime"
            placeholder="请选择过期时间"
            style="width: 100%"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
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
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { ref, reactive, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import {
  getClientList,
  createClient,
  updateClient,
  deleteClient,
  updateClientStatus,
  getServerList,
  getServerDatabases,
} from "@/api/user-server";

// 定义简单接口，避免过多使用 any
interface ServerOption {
  id: number | string;
  value: number | string;
  label: string;
  children?: DatabaseOption[];
}

interface DatabaseOption {
  id: string;
  value: string;
  label: string;
}

interface Client {
  id: number | string;
  clientName: string;
  serverId: number | string;
  server_name?: string;
  databaseName: string;
  annualFee: number;
  expiryTime: string | Date;
  status: "ENABLED" | "DISABLED";
  [key: string]: any;
}

// 搜索参数
const searchQuery = ref("");

// 列表数据
const clientList = ref<Client[]>([]);
const listLoading = ref(true);

// 服务器和数据库级联选择
const serverOptions = ref<ServerOption[]>([]);
const cascaderProps = {
  value: "value",
  label: "label",
  children: "children",
  checkStrictly: false,
  emitPath: true,
};

// 表单数据
const dialogFormVisible = ref(false);
const dialogStatus = ref("");
const dataFormRef = ref<FormInstance>();
const temp = reactive<{
  id?: number | string;
  clientName: string;
  serverId: number | string | null;
  databaseName: string;
  server_database: (string | number)[];
  annualFee: number;
  expiryTime: string | Date;
  status: "ENABLED" | "DISABLED";
}>({
  id: undefined,
  clientName: "",
  serverId: null,
  databaseName: "",
  server_database: [],
  annualFee: 0,
  expiryTime: "",
  status: "ENABLED",
});

// 表单验证规则
const rules = reactive<any>({
  clientName: [{ required: true, message: "客户名不能为空", trigger: "blur" }],
  annualFee: [
    { required: true, message: "年费不能为空", trigger: "blur" },
    { type: "number", min: 0, message: "年费必须大于等于0", trigger: "blur" },
  ],
  serverId: [{ required: true, message: "服务器不能为空", trigger: "change" }],
  server_database: [{ required: true, message: "服务器和数据库不能为空", trigger: "change" }],
  expiryTime: [{ required: true, message: "过期时间不能为空", trigger: "change" }],
  status: [{ required: true, message: "状态不能为空", trigger: "change" }],
});

// 搜索方法
const handleSearch = () => {
  getList();
};

const resetTempList = () => {
  searchQuery.value = "";
  getList();
};

// 获取客户列表
const getList = () => {
  listLoading.value = true;
  const params = searchQuery.value ? { clientName: searchQuery.value } : {};

  getClientList(params)
    .then((response) => {
      clientList.value = response as any;
      listLoading.value = false;
    })
    .catch(() => {
      listLoading.value = false;
    });
};

// 加载服务器和数据库选项
const loadServerWithDatabases = async () => {
  try {
    const serversResponse = await getServerList();

    const servers = serversResponse as any;

    // 创建选项并预加载每个服务器的数据库
    const options: ServerOption[] = [];

    for (const server of servers) {
      try {
        const databasesResponse = await getServerDatabases(server.id);

        const databases = databasesResponse as any;

        options.push({
          id: server.id,
          value: server.id,
          label: `${server.alias} (${server.address})`,
          children: databases.map((db: string) => ({
            id: db,
            value: db,
            label: db,
          })),
        });
      } catch (error) {
        console.log("error: ", error);
        // 如果获取某服务器数据库失败，仍添加服务器但无子选项
        options.push({
          id: server.id,
          value: server.id,
          label: `${server.alias} (${server.address})`,
          children: [],
        });
      }
    }

    serverOptions.value = options;
  } catch (error) {
    console.error("加载服务器和数据库选项失败", error);
    ElMessage({ message: "加载服务器数据失败", type: "error" });
  }
};

// 级联选择变更处理
const handleCascaderChange = (value: any) => {
  if (Array.isArray(value) && value.length > 0) {
    temp.serverId = value[0];
    temp.databaseName = value.length > 1 ? value[1].toString() : "";
  } else {
    temp.serverId = null;
    temp.databaseName = "";
  }
};

// 重置表单
const resetTemp = () => {
  Object.assign(temp, {
    id: undefined,
    clientName: "",
    serverId: null,
    databaseName: "",
    server_database: [],
    annualFee: 0,
    expiryTime: "",
    status: "ENABLED",
  });
};

// 格式化日期时间函数
const formatDateTime = (dateTime: string | Date | null | undefined) => {
  if (!dateTime) return "-";
  return dayjs(dateTime).format("YYYY-MM-DD HH:mm:ss");
};

// 新建客户
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
  if (!dataFormRef.value) return;

  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) return;

    const submitData = {
      clientName: temp.clientName,
      serverId: temp.serverId,
      databaseName: temp.databaseName,
      annualFee: temp.annualFee,
      expiryTime: temp.expiryTime,
    };

    createClient(submitData)
      .then(() => {
        dialogFormVisible.value = false;
        ElMessage({
          message: "创建成功",
          type: "success",
        });
        getList();
      })
      .catch((error) => {
        ElMessage({
          message: `创建失败: ${error.message || "未知错误"}`,
          type: "error",
        });
      });
  });
};

// 编辑客户
const handleUpdate = (row: Client) => {
  //
  resetTemp();
  Object.assign(temp, { ...row });

  // 设置级联选择器的值
  if (row.server.id && row.databaseName) {
    temp.server_database = [row.server.id, row.databaseName];
  }

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
  if (!dataFormRef.value) return;

  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) return;

    const tempData = {
      id: temp.id,
      clientName: temp.clientName,
      serverId: temp.server_database[0],
      databaseName: temp.server_database[1],
      annualFee: temp.annualFee,
      expiryTime: temp.expiryTime,
    };

    if (!tempData.id) {
      ElMessage({ message: "客户ID不能为空", type: "error" });
      return;
    }

    updateClient(tempData.id, tempData)
      .then(() => {
        const index = clientList.value.findIndex((v) => v.id === tempData.id);
        if (index !== -1) {
          Object.assign(clientList.value[index], tempData);
        }
        dialogFormVisible.value = false;
        ElMessage({ message: "更新成功", type: "success" });
        getList();
      })
      .catch((error) => {
        ElMessage({
          message: `更新失败: ${error.message || "未知错误"}`,
          type: "error",
        });
      });
  });
};

// 删除客户
const handleDelete = (row: Client) => {
  ElMessageBox.confirm("确认删除该客户吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteClient(row.id)
        .then(() => {
          ElMessage({ message: "删除成功", type: "success" });
          getList();
        })
        .catch((error) => {
          ElMessage({
            message: `删除失败: ${error.message || "未知错误"}`,
            type: "error",
          });
        });
    })
    .catch(() => {
      // 取消删除操作
    });
};

// 更改客户状态
const handleStatusChange = (row: Client) => {
  const newStatus = row.status === "ENABLED" ? "DISABLED" : "ENABLED";
  const statusText = newStatus === "ENABLED" ? "启用" : "禁用";

  ElMessageBox.confirm(`确认${statusText}该客户吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      updateClientStatus(row.id, newStatus)
        .then(() => {
          row.status = newStatus;
          ElMessage({ message: `${statusText}成功`, type: "success" });
        })
        .catch((error) => {
          ElMessage({
            message: `${statusText}失败: ${error.message || "未知错误"}`,
            type: "error",
          });
        });
    })
    .catch(() => {
      // 取消操作
    });
};

// 编辑或者创建时，获取 loadServerWithDatabases();
watch(dialogFormVisible, (val) => {
  if (val) {
    loadServerWithDatabases();
  }
});

onMounted(() => {
  getList();
});
</script>

<style scoped>
.filter-container {
  padding-bottom: 10px;
  display: flex;
  gap: 10px;
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
