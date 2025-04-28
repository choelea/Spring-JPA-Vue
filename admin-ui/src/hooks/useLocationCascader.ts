import { ref, watch, Ref } from "vue";
import type { LocationTreeNode } from "@/api/practice/scene";

interface LocationOption {
  label: string;
  value: number;
}

/**
 * 位置级联选择器 Hook
 * @param positionTree 位置树数据
 * @param queryParams 查询参数
 */
export function useLocationCascader(positionTree: Ref<LocationTreeNode[]>, queryParams: any) {
  // 定义选项列表
  const regionList = ref<LocationOption[]>([]);
  const provinceList = ref<LocationOption[]>([]);
  const cityList = ref<LocationOption[]>([]);
  const storeList = ref<LocationOption[]>([]);

  // 初始化查询参数为数组形式，以支持多选
  if (!Array.isArray(queryParams.region)) queryParams.region = [];
  if (!Array.isArray(queryParams.province)) queryParams.province = [];
  if (!Array.isArray(queryParams.city)) queryParams.city = [];
  if (!Array.isArray(queryParams.store)) queryParams.store = [];

  // 初始化所有下拉选项函数 - 仅初始化大区选项
  const initAllOptions = () => {
    // 初始化大区选项
    if (positionTree.value && positionTree.value.length > 0) {
      regionList.value = positionTree.value.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    }

    // 清空其他选项
    provinceList.value = [];
    cityList.value = [];
    storeList.value = [];
  };

  // 监听位置树的变化，初始化所有下拉选项
  watch(
    () => positionTree.value,
    (newTree) => {
      if (newTree && newTree.length > 0) {
        initAllOptions();
      }
    },
    { immediate: true }
  );

  // 当大区选择变化时，更新省份列表
  watch(
    () => queryParams.region,
    (newRegionIds) => {
      // 当没有选择大区时，清空省份、城市、门店选择
      if (!newRegionIds || newRegionIds.length === 0) {
        // 重置省份、城市、门店选择
        queryParams.province = [];
        queryParams.city = [];
        queryParams.store = [];

        // 清空下级列表
        provinceList.value = [];
        cityList.value = [];
        storeList.value = [];
        return;
      }

      // 有选择大区时，根据选择的大区筛选省份
      queryParams.province = [];
      queryParams.city = [];
      queryParams.store = [];

      const selectedProvinces: LocationOption[] = [];
      newRegionIds.forEach((regionId: any) => {
        const selectedRegion = positionTree.value.find((r) => r.id === regionId);
        if (selectedRegion && selectedRegion.children) {
          selectedRegion.children.forEach((province) => {
            selectedProvinces.push({
              label: province.name,
              value: province.id,
            });
          });
        }
      });
      provinceList.value = selectedProvinces;

      // 清空城市和门店列表
      cityList.value = [];
      storeList.value = [];
    }
  );

  // 当省份选择变化时，更新城市列表
  watch(
    () => queryParams.province,
    (newProvinceIds) => {
      // 当没有选择省份时，清空城市、门店选择
      if (!newProvinceIds || newProvinceIds.length === 0) {
        queryParams.city = [];
        queryParams.store = [];

        // 清空下级列表
        cityList.value = [];
        storeList.value = [];
        return;
      }

      // 有选择省份时，根据选择的省份筛选城市
      queryParams.city = [];
      queryParams.store = [];

      const selectedCities: LocationOption[] = [];
      positionTree.value.forEach((region) => {
        if (region.children) {
          region.children.forEach((province) => {
            if (newProvinceIds.includes(province.id) && province.children) {
              province.children.forEach((city) => {
                selectedCities.push({
                  label: city.name,
                  value: city.id,
                });
              });
            }
          });
        }
      });
      cityList.value = selectedCities;

      // 清空门店列表
      storeList.value = [];
    }
  );

  // 当城市选择变化时，更新门店列表
  watch(
    () => queryParams.city,
    (newCityIds) => {
      // 当没有选择城市时，清空门店选择
      if (!newCityIds || newCityIds.length === 0) {
        queryParams.store = [];

        // 清空门店列表
        storeList.value = [];
        return;
      }

      // 有选择城市时，根据选择的城市筛选门店
      queryParams.store = [];

      const selectedStores: LocationOption[] = [];
      positionTree.value.forEach((region) => {
        if (region.children) {
          region.children.forEach((province) => {
            if (province.children) {
              province.children.forEach((city) => {
                if (newCityIds.includes(city.id) && city.children) {
                  city.children.forEach((store) => {
                    selectedStores.push({
                      label: store.name,
                      value: store.id,
                    });
                  });
                }
              });
            }
          });
        }
      });
      storeList.value = selectedStores;
    }
  );

  // 重置所有选择
  const resetLocationSelections = () => {
    queryParams.region = [];
    queryParams.province = [];
    queryParams.city = [];
    queryParams.store = [];
    // 在重置后，重新初始化所有选项
    initAllOptions();
  };

  return {
    regionList,
    provinceList,
    cityList,
    storeList,
    resetLocationSelections,
  };
}
