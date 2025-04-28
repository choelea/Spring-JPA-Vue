import request from "@/utils/request";

// ==================== 服务器相关接口 ====================

// 获取指定服务器信息
export function getServerById(id: string | number) {
  return request({
    url: `/api/servers/${id}`,
    method: "GET",
  });
}

// 更新指定服务器信息
export function updateServer(id: any, data: any) {
  return request({
    url: `/api/servers/${id}`,
    method: "PUT",
    data,
  });
}

// 删除指定服务器信息
export function deleteServer(id: string | number) {
  return request({
    url: `/api/servers/${id}`,
    method: "DELETE",
  });
}

// 获取所有服务列表
export function getServerList(params?: any) {
  return request({
    url: "/api/servers",
    method: "GET",
    params,
  });
}

// 创建服务器信息
export function createServer(data: any) {
  return request({
    url: "/api/servers",
    method: "POST",
    data,
  });
}

// 获取指定服务器下面所有数据库名字
export function getServerDatabases(id: string | number) {
  return request({
    url: `/api/servers/${id}/_databases`,
    method: "GET",
  });
}

// ==================== 客户相关接口 ====================

// 获取单个客户信息
export function getClientById(id: string | number) {
  return request({
    url: `/api/clients/${id}`,
    method: "GET",
  });
}

// 修改单个客户信息
export function updateClient(id: string | number, data: any) {
  return request({
    url: `/api/clients/${id}`,
    method: "PUT",
    data,
  });
}

// 删除单个客户信息
export function deleteClient(id: string | number) {
  return request({
    url: `/api/clients/${id}`,
    method: "DELETE",
  });
}

// 禁用和启用客户
export function updateClientStatus(id: string | number, status: "ENABLED" | "DISABLED") {
  return request({
    url: `/api/clients/${id}/status`,
    method: "PUT",
    params: { usageStatus: status },
  });
}

// 获取所有客户列表
export function getClientList(params?: any) {
  return request({
    url: "/api/clients",
    method: "GET",
    params,
  });
}

// 创建客户信息
export function createClient(data: any) {
  return request({
    url: "/api/clients",
    method: "POST",
    data,
  });
}
