import { Table } from "antd";
import { useEffect, useMemo } from "react";
import InputCustom from "../inputs/Input";

const SkuTable = ({ control, watch, setValue, skuList, type = "", valueToAllSku }) => {
  const variations = watch("variations") || [];

  const generateSkuData = () => {
    if (!variations.length && skuList && !skuList.length) return [];

    const headers = variations.map((v) => v.name).filter(Boolean);
    if (!headers.length) return [];

    const validVariations = variations.filter(
      (v) => v.name && v.options?.length
    );
    if (!validVariations.length) return [];

    // Tạo mảng các chỉ số cho mỗi biến thể
    const indices = validVariations.map((v) =>
      Array.from({ length: v.options.length }, (_, i) => i)
    );

    // Hàm tạo tổ hợp từ các chỉ số
    const generateCombinations = (arrays) => {
      if (arrays.length === 0) return [[]];

      const [first, ...rest] = arrays;
      const restCombinations = generateCombinations(rest);

      return first.flatMap((num) =>
        restCombinations.map((combination) => [num, ...combination])
      );
    };

    const combinations = generateCombinations(indices);

    return combinations.map((combination, index) => {
      const variationObj = {};
      combination.forEach((valueIndex, idx) => {
        const variation = validVariations[idx];
        if (variation) {
          variationObj[variation.name] = variation.options[valueIndex];
        }
      });
      return {
        key: index,
        ...variationObj,
        sku_price: "",
        sku_stock: "",
        sku_code: "",
        sku_tier_idx: combination,
        sku_name: combination
          .map((idx, i) => validVariations[i].options[idx])
          .join(", "),
      };
    });
  };
 
  // Sửa lại cách sử dụng useMemo
  const skuData = useMemo(() => generateSkuData(), [generateSkuData]);
  // Thêm useEffect để theo dõi variations\
  useEffect(() => {
    const newSkuData = generateSkuData();
    if (newSkuData.length > 0) {
      const data = newSkuData?.map((sku) => {
        const skuObj = skuList?.find(
          (s) => s.sku_name === `${sku["Màu sắc"]}, ${sku["Size"]}`
        );
        return {
          ...sku,
          sku_price: skuObj?.sku_price || "",
          sku_stock: skuObj?.sku_stock || "",
          sku_code: skuObj?.sku_code || "",
        };
      });
      setValue("sku_list", data);
    }
  }, [variations, generateSkuData]); // Theo dõi trực tiếp variations
  useEffect(() => {
    if (skuList && skuList.length > 0) {
      if (type === "import") {
        skuList.forEach((sku) => {
          sku.sku_stock = '';
        });
      }
      setValue("sku_list", skuList);
    }
  }, [skuList, setValue]);
   // apply to all sku
   useEffect(() => {
    if (valueToAllSku) {
      const newSkuData = generateSkuData();
      if (newSkuData.length > 0) {
        const data = newSkuData?.map((sku) => {
          return {
            ...sku,
            sku_price: parseInt(valueToAllSku.product_price),
            sku_stock: parseInt(valueToAllSku.product_quantity),
          };
        });
        setValue("sku_list", data);
      }
    }
  }, [valueToAllSku, setValue]);
  const columns = useMemo(
    () => [
      ...variations
        .filter((v) => v.name)
        .map((variation) => ({
          title: variation.name,
          dataIndex: variation.name,
          key: variation.name,
          render: (value) => {
            const option = variations
              .find((v) => v.name === variation.name)
              ?.options?.find((opt) => opt === value);
            return option || value;
          },
        })),
      {
        title: "Tier Index",
        dataIndex: "sku_tier_idx",
        key: "sku_tier_idx",
        render: (value) => `[${value.join(", ")}]`,
      },
      {
        title: "Giá",
        dataIndex: "sku_price",
        key: "sku_price",
        render: (_, record, index) => (
          <InputCustom
            control={control}
            name={`sku_list.${index}.sku_price`}
            type="number"
          />
        ),
      },
      {
        title: "Kho hàng",
        dataIndex: "sku_stock",
        key: "sku_stock",
        render: (_, record, index) => (
          <InputCustom
            control={control}
            name={`sku_list.${index}.sku_stock`}
            type="number"
          />
        ),
      },
      {
        title: "SKU",
        dataIndex: "sku_code",
        key: "sku_code",
        render: (_, record, index) => (
          <InputCustom control={control} name={`sku_list.${index}.sku_code`} />
        ),
      },
    ],
    [variations, control] // Đơn giản hóa dependencies
  );

  return skuData.length > 0 ? (
    <Table
      columns={columns}
      dataSource={skuData}
      pagination={false}
      className="mt-4"
    />
  ) : null;
};

export default SkuTable;
