import request from "@/utils/request";

// 获取分类列表
export function getCategoryList() {
  return request({
    url: "/category/list",
    method: "GET",
  });
}

// 新增分类
export function addCategory(data: { name: string }) {
  return request({
    url: "/category/add",
    method: "POST",
    data,
  });
}

// 更新分类
export function updateCategory(data: { id: number; name: string }) {
  return request({
    url: "/category/update",
    method: "POST",
    data,
  });
}

// 删除分类
export function deleteCategory(data: { id: number }) {
  return request({
    url: "/category/delete",
    method: "POST",
    data,
  });
}
// 排序分类
export function sortCategory(data: { id: number; direction: string }) {
  return request({
    url: "/category/sort",
    method: "POST",
    data,
  });
}

// 获取问题列表
export function getQuestionList(params: {
  category_id: number;
  page_number: number;
  limit: number;
}) {
  return request({
    url: "/question/list",
    method: "GET",
    params,
  });
}

// 新增问题
export function addQuestion(data: any) {
  return request({
    url: "/question/add",
    method: "POST",
    data,
  });
}

// 编辑问题
export function updateQuestion(data: any) {
  return request({
    url: "/question/update",
    method: "POST",
    data,
  });
}

// 删除问题
export function deleteQuestion(data: { id: number }) {
  return request({
    url: "/question/delete",
    method: "POST",
    data,
  });
}

export function importExcell({ file, category_id }: { file: File; category_id: number }) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: `/question/import/${category_id}`,
    method: "post",
    data: formData,
  });
}

export function questionTemplateExcell() {
  return request({
    url: "/question/template",
    responseType: "blob",
    method: "get",
  });
}
