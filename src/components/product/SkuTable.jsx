import { Table } from "antd";
import { useEffect, useMemo } from "react";
import InputCustom from "../inputs/Input";

const SkuTable = ({ control, watch, setValue, skuList }) => {
  const variations = watch("variations") || [];

  const generateSkuData = () => {
    if (!variations.length) return [];

    const headers = variations.map((v) => v.name).filter(Boolean);
    if (!headers.length) return [];

    const combine = (arr1, arr2) =>
      arr1.length === 0
        ? arr2.map((item) => [item])
        : arr1.flatMap((a) => arr2.map((b) => [...a, b]));

    const validVariations = variations.filter(
      (v) => v.name && v.options?.length
    );
    if (!validVariations.length) return [];

    const allCombinations = validVariations.reduce(
      (acc, variation) => combine(acc, variation.options || []),
      []
    );

    return allCombinations.map((combination, index) => {
      const variationObj = {};
      combination.forEach((value, idx) => {
        const variation = validVariations[idx];
        if (variation) {
          variationObj[variation.name] = value;
        }
      });
      return {
        key: index,
        ...variationObj,
        sku_price: "",
        sku_stock: "",
        sku_code: "",
        sku_name: combination.join(", "),
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
      setValue("sku_list", skuList);
    }
  }, [skuList, setValue]);
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
