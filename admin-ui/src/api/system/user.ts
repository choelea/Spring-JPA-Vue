import request from "@/utils/request";

const USER_BASE_URL = "/api/v1/users";

const UserAPI = {
  /**
   * 获取当前登录用户信息
   *
   * @returns 登录用户昵称、头像信息，包括角色和权限
   */
  getInfo() {
    // Set to true to use mock data
    const useMockData = true;

    if (useMockData) {
      return Promise.resolve<UserInfo>({
        user_id: "1",
        username: "admin",
        name: "Test User",
        department: "",
        position: "",
        role_id: "",
        status: 1,
        create_time: "",
        create_by: "",
        update_time: "",
        update_by: "",
      });
    }

    return request<any, UserInfo>({
      url: `/user_info`,
      method: "get",
    });
  },

  /**
   * 获取用户分页列表
   *
   * @param queryParams 查询参数
   */
  getPage(queryParams: UserPageQuery) {
    return request<any, PageResult<UserPageVO[], "users_list">>({
      url: `/user/get`,
      method: "post",
      data: queryParams,
    });
  },

  /**
   * 获取用户表单详情
   *
   * @param userId 用户ID
   * @returns 用户表单详情
   */
  getFormData(userId: number) {
    return request<any, UserForm>({
      url: `${USER_BASE_URL}/${userId}/form`,
      method: "get",
    });
  },

  /**
   * 添加用户
   *
   * @param data 用户表单数据
   */
  add(data: UserForm) {
    return request({
      url: `/user/add`,
      method: "post",
      data: data,
    });
  },

  /**
   * 修改用户
   *
   * @param id 用户ID
   * @param data 用户表单数据
   */
  update(data: UserForm) {
    return request({
      url: `/user/update`,
      method: "post",
      data: data,
    });
  },

  /**
   * 修改用户密码
   *
   * @param id 用户ID
   * @param password 新密码
   */
  resetPassword(id: number, password: string) {
    return request({
      url: `${USER_BASE_URL}/${id}/password/reset`,
      method: "put",
      params: { password: password },
    });
  },

  /**
   * 批量删除用户，多个以英文逗号(,)分割
   *
   * @param ids 用户ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(data: any) {
    return request({
      url: `/user/delete`,
      method: "post",
      data,
    });
  },
  /**
   * 批量删除用户，多个以英文逗号(,)分割
   *
   * @param ids 用户ID字符串，多个以英文逗号(,)分割
   */
  deleteByBatch(data: any) {
    return request({
      url: `/user/batch_delete`,
      method: "post",
      data,
    });
  },

  /** 下载用户导入模板 */
  downloadTemplate() {
    return request({
      url: `${USER_BASE_URL}/template`,
      method: "get",
      responseType: "blob",
    });
  },

  /**
   * 导出用户
   *
   * @param queryParams 查询参数
   */
  export(queryParams: UserPageQuery) {
    return request({
      url: `${USER_BASE_URL}/export`,
      method: "get",
      params: queryParams,
      responseType: "blob",
    });
  },

  /**
   * 导入用户
   *
   * @param deptId 部门ID
   * @param file 导入文件
   */
  import(deptId: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return request<any, ExcelResult>({
      url: `${USER_BASE_URL}/import`,
      method: "post",
      params: { deptId: deptId },
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /** 获取个人中心用户信息 */
  getProfile() {
    return request<any, UserProfileVO>({
      url: `${USER_BASE_URL}/profile`,
      method: "get",
    });
  },

  /** 修改个人中心用户信息 */
  updateProfile(data: UserProfileForm) {
    return request({
      url: `${USER_BASE_URL}/profile`,
      method: "put",
      data: data,
    });
  },

  /** 修改个人中心用户密码 */
  changePassword(data: PasswordChangeForm) {
    return request({
      url: `${USER_BASE_URL}/password`,
      method: "put",
      data: data,
    });
  },

  /** 发送短信验证码（绑定或更换手机号）*/
  sendMobileCode(mobile: string) {
    return request({
      url: `${USER_BASE_URL}/mobile/code`,
      method: "post",
      params: { mobile: mobile },
    });
  },

  /** 绑定或更换手机号 */
  bindOrChangeMobile(data: MobileUpdateForm) {
    return request({
      url: `${USER_BASE_URL}/mobile`,
      method: "put",
      data: data,
    });
  },

  /** 发送邮箱验证码（绑定或更换邮箱）*/
  sendEmailCode(email: string) {
    return request({
      url: `${USER_BASE_URL}/email/code`,
      method: "post",
      params: { email: email },
    });
  },

  /** 绑定或更换邮箱 */
  bindOrChangeEmail(data: EmailUpdateForm) {
    return request({
      url: `${USER_BASE_URL}/email`,
      method: "put",
      data: data,
    });
  },
};

export default UserAPI;

/** 登录用户信息 */
export interface UserInfo {
  /** 用户ID */
  user_id: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  name: string;
  /** 头像URL */
  avatar?: string;
  /** 性别 */
  gender?: number;
  /** 手机号 */
  mobile?: string;
  /** 邮箱 */
  email?: string;
  /** 部门 */
  department: string;
  /** 职位 */
  position: string;
  /** 角色ID */
  role_id: string;
  /** 用户状态(1:启用;0:禁用) */
  status: number;
  /** 创建时间 */
  create_time: string;
  /** 创建者 */
  create_by: string;
  /** 更新时间 */
  update_time: string;
  /** 更新者 */
  update_by: string;
  perms?: any;
  roles?: any;
}

/**
 * 用户分页查询对象
 */
export interface UserPageQuery {
  name?: string;
  /** 用户名 */
  username?: string;
  /** 部门 */
  department?: string;
  /** 职位 */
  position?: string;
  /** 角色ID */
  role_id?: string;
  /** 页码 */
  page_number: number;
  /** 每页数量 */
  limit: number;
}

/** 用户分页对象 */
export interface UserPageVO {
  /** 用户ID */
  user_id: string;
  /** 用户名 */
  name: string;
  /** 用户名 */
  username: string;
  /** 部门 */
  department: string;
  /** 职位 */
  position: string;
  /** 角色ID */
  role_id: string;
  /** 用户状态(1:启用;0:禁用) */
  status: number;
  /** 创建时间 */
  create_time: string;
  /** 创建者 */
  create_by: string;
  /** 更新时间 */
  update_time: string;
  /** 更新者 */
  update_by: string;
}

/** 用户表单类型 */
export interface UserForm {
  //姓名
  name?: string;
  /** 用户名 */
  username?: string;
  /** 密码 */
  password?: string;
  /** 部门 */
  department?: string;
  /** 职位 */
  position?: string;
  /** 角色ID */
  role_id?: string;
  /** 排名 */
  rank?: number;
  // 用户id
  user_id?: number;
}

/** 个人中心用户信息 */
export interface UserProfileVO {
  /** 用户ID */
  id?: number;

  /** 用户名 */
  username?: string;

  /** 昵称 */
  nickname?: string;

  /** 头像URL */
  avatar?: string;

  /** 性别 */
  gender?: number;

  /** 手机号 */
  mobile?: string;

  /** 邮箱 */
  email?: string;

  /** 部门名称 */
  deptName?: string;

  /** 角色名称，多个使用英文逗号(,)分割 */
  roleNames?: string;

  /** 创建时间 */
  createTime?: Date;
}

/** 个人中心用户信息表单 */
export interface UserProfileForm {
  /** 用户ID */
  id?: number;

  /** 用户名 */
  username?: string;

  /** 昵称 */
  nickname?: string;

  /** 头像URL */
  avatar?: string;

  /** 性别 */
  gender?: number;

  /** 手机号 */
  mobile?: string;

  /** 邮箱 */
  email?: string;
}

/** 修改密码表单 */
export interface PasswordChangeForm {
  /** 原密码 */
  oldPassword?: string;
  /** 新密码 */
  newPassword?: string;
  /** 确认新密码 */
  confirmPassword?: string;
}

/** 修改手机表单 */
export interface MobileUpdateForm {
  /** 手机号 */
  mobile?: string;
  /** 验证码 */
  code?: string;
}

/** 修改邮箱表单 */
export interface EmailUpdateForm {
  /** 邮箱 */
  email?: string;
  /** 验证码 */
  code?: string;
}
