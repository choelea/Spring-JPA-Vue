import { ref, watch, Ref } from "vue";
import type { LocationTreeNode } from "@/api/practice/scene";

interface LocationOption {
  label: string;
  value: any;
}

/**
 * 位置级联选择器 Hook
 * @param positionTree 位置树数据
 * @param formData 表单
 */
export function useFormLocationCascader(positionTree: Ref<LocationTreeNode[]>, formData: any) {
  // 定义选项列表
  const formRegionList = ref<LocationOption[]>([]);
  const formProvinceList = ref<LocationOption[]>([]);
  const formCityList = ref<LocationOption[]>([]);
  const formStoreList = ref<LocationOption[]>([]);
  // 添加一个标记，用于标识是否正在初始化数据
  const isInitializing = ref(false);
  // 初始化查询参数为数组形式，以支持多选
  if (!Array.isArray(formData.region)) formData.region = [];
  if (!Array.isArray(formData.province)) formData.province = [];
  if (!Array.isArray(formData.city)) formData.city = [];
  if (!Array.isArray(formData.store)) formData.store = [];

  // 初始化所有下拉选项函数
  const initAllOptions = () => {
    // 初始化大区选项
    if (positionTree.value && positionTree.value.length > 0) {
      formRegionList.value = positionTree.value.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    }
  };

  // 监听位置树的变化，初始化所有下拉选项
  watch(
    () => positionTree.value,
    (newTree) => {
      if (newTree && newTree.length > 0) {
        initAllOptions();
      }
    },
    { immediate: false }
  );

  // 当大区选择变化时，更新省份列表
  watch(
    () => formData.region,
    (newRegionIds) => {
      // 当没有选择大区时，显示所有省份
      if (!newRegionIds || newRegionIds.length === 0) {
        // 如果不是初始化状态，才清空下级选项

        if (!isInitializing.value) {
          formData.province = [];
          formData.city = [];
          formData.store = [];
        }

        // 显示所有省份
        initAllOptions();
        return;
      }

      // 有选择大区时，根据选择的大区筛选省份
      if (!isInitializing.value) {
        formData.province = [];
        formData.city = [];
        formData.store = [];
      }
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
      formProvinceList.value = selectedProvinces;

      // 重置城市和门店为全部选项
      // 城市选项 - 显示所有城市
      const allCities: LocationOption[] = [];
      positionTree.value.forEach((region) => {
        if (newRegionIds.includes(region.id) && region.children) {
          region.children.forEach((province) => {
            if (province.children) {
              province.children.forEach((city) => {
                allCities.push({
                  label: `${province.name}-${city.name}`,
                  value: city.id,
                });
              });
            }
          });
        }
      });
      formCityList.value = allCities;

      // 门店选项 - 显示所有门店
      const allStores: LocationOption[] = [];
      positionTree.value.forEach((region) => {
        if (newRegionIds.includes(region.id) && region.children) {
          region.children.forEach((province) => {
            if (province.children) {
              province.children.forEach((city) => {
                if (city.children) {
                  city.children.forEach((store) => {
                    allStores.push({
                      label: `${province.name}-${city.name}-${store.name}`,
                      value: store.id,
                    });
                  });
                }
              });
            }
          });
        }
      });
      formStoreList.value = allStores;
    },
    { immediate: false }
  );

  // 当省份选择变化时，更新城市列表
  watch(
    () => formData.province,
    (newProvinceIds) => {
      // 当没有选择省份时，显示所有城市
      if (!newProvinceIds || newProvinceIds.length === 0) {
        if (!isInitializing.value) {
          formData.city = [];
          formData.store = [];
        }

        // 显示基于已选大区的所有城市
        if (formData.region && formData.region.length > 0) {
          const allCities: LocationOption[] = [];
          positionTree.value.forEach((region) => {
            if (formData.region.includes(region.id) && region.children) {
              region.children.forEach((province) => {
                if (province.children) {
                  province.children.forEach((city) => {
                    allCities.push({
                      label: `${province.name}-${city.name}`,
                      value: city.id,
                    });
                  });
                }
              });
            }
          });
          formCityList.value = allCities;
        } else {
          // 没有选择大区时，显示所有城市
          const allCities: LocationOption[] = [];
          positionTree.value.forEach((region) => {
            if (region.children) {
              region.children.forEach((province) => {
                if (province.children) {
                  province.children.forEach((city) => {
                    allCities.push({
                      label: `${region.name}-${province.name}-${city.name}`,
                      value: city.id,
                    });
                  });
                }
              });
            }
          });
          formCityList.value = allCities;
        }

        // 同样处理门店列表
        return;
      }

      if (!isInitializing.value) {
        formData.city = [];
        formData.store = [];
      }

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
      formCityList.value = selectedCities;

      // 显示基于已选省份的所有门店
      const allStores: LocationOption[] = [];
      positionTree.value.forEach((region) => {
        if (region.children) {
          region.children.forEach((province) => {
            if (newProvinceIds.includes(province.id) && province.children) {
              province.children.forEach((city) => {
                if (city.children) {
                  city.children.forEach((store) => {
                    allStores.push({
                      label: `${city.name}-${store.name}`,
                      value: store.id,
                    });
                  });
                }
              });
            }
          });
        }
      });
      formStoreList.value = allStores;
    }
  );

  // 当城市选择变化时，更新门店列表
  watch(
    () => formData.city,
    (newCityIds) => {
      // 当没有选择城市时，显示所有门店
      if (!newCityIds || newCityIds.length === 0) {
        if (!isInitializing.value) {
          formData.store = [];
        }

        // 显示基于已选省份的所有门店
        if (formData.province && formData.province.length > 0) {
          const allStores: LocationOption[] = [];
          positionTree.value.forEach((region) => {
            if (region.children) {
              region.children.forEach((province) => {
                if (formData.province.includes(province.id) && province.children) {
                  province.children.forEach((city) => {
                    if (city.children) {
                      city.children.forEach((store) => {
                        allStores.push({
                          label: `${city.name}-${store.name}`,
                          value: store.id,
                        });
                      });
                    }
                  });
                }
              });
            }
          });
          formStoreList.value = allStores;
        } else {
          // 没有选择省份时，显示所有门店
          const allStores: LocationOption[] = [];
          positionTree.value.forEach((region) => {
            if (region.children) {
              region.children.forEach((province) => {
                if (province.children) {
                  province.children.forEach((city) => {
                    if (city.children) {
                      city.children.forEach((store) => {
                        allStores.push({
                          label: `${region.name}-${province.name}-${city.name}-${store.name}`,
                          value: store.id,
                        });
                      });
                    }
                  });
                }
              });
            }
          });
          formStoreList.value = allStores;
        }

        return;
      }

      if (!isInitializing.value) {
        formData.store = [];
      }

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
      formStoreList.value = selectedStores;
    }
  );
  // 初始化表单数据的方法
  const initFormData = (data: any) => {
    if (!data) return;

    try {
      isInitializing.value = true;

      // 设置区域值
      if (data.region && data.region.length > 0) {
        formData.region = [...data.region];
      }

      // 设置省份值
      if (data.province && data.province.length > 0) {
        formData.province = [...data.province];
      }

      // 设置城市值
      if (data.city && data.city.length > 0) {
        formData.city = [...data.city];
      }

      // 设置门店值
      if (data.store && data.store.length > 0) {
        formData.store = [...data.store];
      }
    } finally {
      // 确保无论如何都会将初始化标记设回false
      setTimeout(() => {
        isInitializing.value = false;
      }, 0);
    }
  };
  // 重置所有选择
  const resetLocationSelections = () => {
    formData.region = [];
    formData.province = [];
    formData.city = [];
    formData.store = [];
    // 在重置后，重新初始化所有选项
    initAllOptions();
  };

  return {
    formRegionList,
    formProvinceList,
    formCityList,
    formStoreList,
    resetLocationSelections,
    initFormData, // 新增此方法用于初始化表单数据
  };
}
