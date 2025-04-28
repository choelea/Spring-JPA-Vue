import { Ref } from "vue";
import type { LocationTreeNode } from "@/api/practice/scene";

/**
 * 位置标签格式化 Hook
 * @param positionTree 位置树数据
 */
export function useLocationLabelFormatter(positionTree: Ref<LocationTreeNode[]>) {
  /**
   * 格式化位置ID为对应的标签文本
   * @param locationData 位置ID数据
   */
  const formatLocationLabels = (locationData: {
    region?: number[];
    province?: number[];
    city?: number[];
    store?: number[];
  }) => {
    // 格式化大区标签
    const getRegionLabels = () => {
      if (!locationData.region || !locationData.region.length) return "";

      return locationData.region
        .map((id) => {
          const region = positionTree.value.find((r) => r.id === id);
          return region ? region.name : "";
        })
        .filter(Boolean)
        .join("、");
    };

    // 格式化省份标签
    const getProvinceLabels = () => {
      if (!locationData.province || !locationData.province.length) return "";

      const provinces: string[] = [];
      positionTree.value.forEach((region) => {
        if (region.children) {
          region.children.forEach((province) => {
            if (locationData.province?.includes(province.id)) {
              provinces.push(province.name);
            }
          });
        }
      });

      return provinces.join("、");
    };

    // 格式化城市标签
    const getCityLabels = () => {
      if (!locationData.city || !locationData.city.length) return "";

      const cities: string[] = [];
      positionTree.value.forEach((region) => {
        if (region.children) {
          region.children.forEach((province) => {
            if (province.children) {
              province.children.forEach((city) => {
                if (locationData.city?.includes(city.id)) {
                  cities.push(city.name);
                }
              });
            }
          });
        }
      });

      return cities.join("、");
    };

    // 格式化门店标签
    const getStoreLabels = () => {
      if (!locationData.store || !locationData.store.length) return "";

      const stores: string[] = [];
      positionTree.value.forEach((region) => {
        if (region.children) {
          region.children.forEach((province) => {
            if (province.children) {
              province.children.forEach((city) => {
                if (city.children) {
                  city.children.forEach((store) => {
                    if (locationData.store?.includes(store.id)) {
                      stores.push(store.name);
                    }
                  });
                }
              });
            }
          });
        }
      });

      return stores.join("、");
    };

    return {
      regionLabels: getRegionLabels(),
      provinceLabels: getProvinceLabels(),
      cityLabels: getCityLabels(),
      storeLabels: getStoreLabels(),
      // 完整的位置文本，用于整体展示
      fullAreaText: [getRegionLabels(), getProvinceLabels(), getCityLabels(), getStoreLabels()]
        .filter(Boolean)
        .join(" / "),
    };
  };

  return {
    formatLocationLabels,
  };
}
