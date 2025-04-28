import request from "@/utils/request";

const SceneAPI = {
  /** 获取场景对练分页数据 */
  getPage(queryParams?: ScenePageQuery) {
    return request<any, PageResult<ScenePageVO[], "Scenes_list">>({
      url: `/scenario/list`,
      method: "post",
      data: queryParams,
    });
  },
  // 获取位置树
  getLocationTree() {
    return request<any, LocationTreeNode[]>({
      url: `/scenario/location/tree`,
      method: "get",
    });
  },

  // 切换场景状态
  toggleStatus(id: string) {
    return request<any, any>({
      url: `/scenario/toggleStatus/${id}`,
      method: "post",
    });
  },
  // 批量删除场景
  deleteScenes(ids: string[] | string[]) {
    return request<any, any>({
      url: `/scenario/delete/${ids.join(",")}`,
      method: "post",
    });
  },
  // 场景新增
  // Add function to SceneAPI object
  createScene(data: SceneCreateForm) {
    return request<any, any>({
      url: "/scenario/add",
      method: "post",
      data,
    });
  },
  // 根据场景对练信息AI 生成背景描述
  generateBackgroundAiInfo(data: generateBackgroundAiInfoSchema, config = {}) {
    return request<any, any>({
      url: "/scenario/generateDesc",
      method: "post",
      data,
      ...config, // 支持传入额外配置，包括signal
    });
  },
  //生成场景问答对
  generateSceneQA(data: SceneCreateForm, config = {}) {
    return request<any, any>({
      url: "/scenario/generateQuestions",
      method: "post",
      data,
      ...config, // 支持传入额外配置，包括signal
    });
  },
  // 批量替换场景问答对
  batchReplaceQuestions(scenarioId: number | string, questions: SceneQuestionAnswerVO[]) {
    return request<any, any>({
      url: `/scenario/question/batchReplace`,
      method: "post",
      data: { scenarioId, questions },
    });
  },
  // 获取场景详情
  getSceneDetail(id: number | string) {
    return request<any, SceneDetailVO>({
      url: `/scenario/get/${id}`,
      method: "get",
    });
  },
  // 修改场景
  updateScene(data: SceneCreateForm) {
    return request<any, any>({
      url: "/scenario/edit",
      method: "post",
      data,
    });
  },
};

export default SceneAPI;

export interface generateBackgroundAiInfoSchema {
  budgetAmount: string;
  competitorModels: string;
  concerns: string;
  currentVehicle: string;
  dislikes: string;
  expectedPurchaseDate: string;
  likes: string;
  loanType: string;
  preferenceType: string;
  primaryUser: string;
  purchasePurpose: string;
  testDriveModel: string;
}

// 新建场景
export interface SceneCreateForm {
  // 下发范围：
  region?: string[];
  province?: string[];
  city?: string[];
  store?: string[];
  area: string;
  backgroundInfo: string;
  budgetAmount: string;
  competitorModels: string;
  concerns: string;
  create_by?: string;
  create_time?: string;
  currentVehicle: string;
  dislikes: string;
  expiryDate: string;
  expectedPurchaseDate: string;
  id?: number;
  imageUrl: string;
  likes: string;
  loanType: string;
  name: string;
  preferenceType: string;
  primaryUser: string;
  purchasePurpose: string;
  questionCount: number;
  remark?: string;
  startDate: string;
  status: string;
  testDriveModel: string;
  type: string | number;
  update_by?: string;
  update_time?: string;
  qa_list: SceneQuestionAnswerVO[];
}

/** 位置树节点 */
export interface LocationTreeNode {
  remark: string | null;
  id: number;
  parentId: number;
  name: string;
  type: number;
  sort: number;
  status: number;
  extData: string | null;
  children: LocationTreeNode[] | null;
  create_by: string | null;
  create_time: string | null;
  update_by: string | null;
  update_time: string | null;
}

/** 场景对练分页查询参数 */
export interface ScenePageQuery extends PageQuery {
  region?: string[];
  province?: string[];
  city?: string[];
  store?: string[];
  salesId?: string;
  name?: string;
  status?: string;
  // 创建人/短 id
  createBy?: string;
  salesInfo?: string;
  startDate?: string;
  endDate?: string;
  dateRange?: [string, string];
}

export interface ScenePageVO {
  id?: string;
  name: string;
  region?: string[];
  province?: string[];
  city?: string[];
  store?: string[];
  status: "0" | "1";
  area?: string;
  expiryDate?: string;
  imageUrl?: string;
  purchasePurpose?: string;
  expectedPurchaseDate?: string;
  budgetAmount?: number;
  primaryUser?: string;
  preferenceType?: string;
  loanType?: string;
  testDriveModel?: string;
  competitorModels?: string;
  currentVehicle?: string;
  concerns?: string;
  dislikes?: string;
  likes?: string;
  backgroundInfo?: string;
  startDate?: string;
  endDate?: string;
  type?: string | number;
  questionCount?: number;
  create_by?: string;
  create_time?: string;
  update_by?: string;
  update_time?: string;
  remark?: string | null;
  qa_list?: SceneQuestionAnswerVO[];
  salesInfo?: string;
}

//问答对 OV
export interface SceneQuestionAnswerVO {
  question: string;
  answer: string;
  sortOrder: number;
}

// 场景详情
export interface SceneDetailVO {
  area: string;
  backgroundInfo: string;
  budgetAmount: number;
  city: string[];
  competitorModels: string;
  concerns: string;
  create_by: string;
  create_time: string;
  currentVehicle: string;
  dislikes: string;
  endDate: string;
  expectedPurchaseDate: string;
  expiryDate: string;
  id: number;
  imageUrl: string;
  likes: string;
  loanType: string;
  name: string;
  params: Record<string, any>;
  preferenceType: string;
  primaryUser: string;
  province: string[];
  purchasePurpose: string;
  questionCount: number;
  region: string[];
  remark: string;
  startDate: string;
  status: string;
  store: string[];
  testDriveModel: string;
  type: string | number;
  update_by: string;
  update_time: string;
  qa_list: SceneQuestionAnswerVO[];
}
