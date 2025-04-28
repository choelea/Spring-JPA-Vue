import request from "@/utils/request";

const SceneAPI = {
  // 获取场景训练记录列表
  getSceneTrainingRecordList(data?: ScenePageQuery) {
    return request<any, SceneTrainingRecordListResponse>({
      url: `/qa/practice/list`,
      method: "post",
      data,
    });
  },
  // 获取位置树
  getLocationTree() {
    return request<any, LocationTreeNode[]>({
      url: `/scenario/location/tree`,
      method: "get",
    });
  },
  // 获取场景训练详情
  getSceneTrainingDetail(uid: string, sid: string) {
    return request<any, SceneTrainingDetailResponse>({
      url: `/qa/practice/detail`,
      method: "get",
      params: {
        uid,
        sid,
      },
    });
  },
};

export default SceneAPI;

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
  status?: string;
  salesName?: string;
  startDate?: string;
  endDate?: string;
  scenarioName?: string;
  dateRange?: [string, string];
}
export interface SceneTrainingRecordListResponse {
  list: SceneUserDataPageVO[];
  total: number;
}
// 场景训练记录列表
export interface SceneUserDataPageVO {
  analysis: string;
  beginTime: string;
  completeTime: string;
  create_by: string;
  create_time: string;
  dimensionScores: string;
  endTime: string;
  id: number;
  limit: number;
  page_number: number;
  params: Record<string, any>;
  region?: string[];
  province?: string[];
  city?: string[];
  store?: string[];
  remark: string;
  salesId: string;
  salesName: string;
  scenarioName: string;
  score: string;
  sid: string;
  status: string;
  uid: string;
  update_by: string;
  update_time: string;
}
// 场景详情
export interface SceneTrainingDetailResponse {
  analysis: string;
  createTime: string;
  dimensionScores: string;
  grade: string;
  qaList: SceneQAItem[];
  salesName: string;
  scenarioName: string;
}

// 场景问答项
export interface SceneQAItem {
  question: string;
  questionNo: number;
  standardAnswer: string;
  userAnswer: string;
}
