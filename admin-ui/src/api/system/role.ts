import request from "@/utils/request";

const ROLE_BASE_URL = "/api/v1/roles";

const RoleAPI = {
  /** 获取角色分页数据 */
  getPage(queryParams?: RolePageQuery) {
    return request<any, PageResult<RolePageVO[], "roles_list">>({
      url: `/role/list`,
      method: "get",
      params: queryParams,
    });
  },

  /** 获取角色下拉数据源 */
  getOptions() {
    return request<any, any[]>({
      url: `/role/select`,
      method: "get",
    });
  },

  /**
   * 获取角色的菜单ID集合
   *
   * @param roleId 角色ID
   * @returns 角色的菜单ID集合
   */
  getRoleMenuIds(role_id: string | number) {
    return request<any, MenuListType>({
      url: `/menu/get_init`,
      method: "post",
      data: { role_id },
    });
  },

  /**
   * 分配菜单权限
   *
   * @param roleId 角色ID
   * @param data 菜单ID集合
   */
  updateRoleMenus({ role_id, menu_list }: { role_id: string | number; menu_list: number[] }) {
    return request({
      url: `/menu/confirm`,
      method: "post",
      data: { role_id, menu_list },
    });
  },

  /**
   * 获取角色表单数据
   *
   * @param id 角色ID
   * @returns 角色表单数据
   */
  getFormData(id: number) {
    return request<any, RoleForm>({
      url: `${ROLE_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 添加角色 */
  add(data: RoleForm) {
    return request({
      url: `/role/add`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新角色
   *
   * @param id 角色ID
   * @param data 角色表单数据
   */
  update(data: RoleForm) {
    return request({
      url: `/role/update`,
      method: "post",
      data: data,
    });
  },

  /**
   * 批量删除角色，多个以英文逗号(,)分割
   *
   * @param ids 角色ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(data: any) {
    return request({
      url: `/role/delete`,
      method: "post",
      data,
    });
  },
};

export default RoleAPI;

/** 角色分页查询参数 */
export interface RolePageQuery extends PageQuery {
  /** 搜索关键字 */
  search?: string;
}

/** 角色分页对象 */
export interface RolePageVO {
  /** 角色名称 */
  name: string;
  remark: string;
  role_id?: number;
  create_time: string;
}

/** 角色表单对象 */
export interface RoleForm {
  /** 角色ID */
  role_id?: number;
  /** 角色编码 */
  remark?: string;

  /** 角色名称 */
  name?: string;
}
/** 菜单列表类型 */
export interface MenuListType {
  menu_list: string[];
  role_id: string;
}
