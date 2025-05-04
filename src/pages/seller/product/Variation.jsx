import {
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Flex, message, Radio, Select, Table, Upload } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addVariation,
  changeVariant,
  changeVariantValue,
  deleteVariation,
  initializeVariation,
} from "~/stores/slices/seller/variationSlice";
import { apiOrigin } from "~/constants";

import InputCustom from "../../../components/inputs/Input";

const { Option } = Select;

const Variation = ({ variations, control, setValue, watch }) => {
  const dispatch = useDispatch();
  const { variants, selectedVariation, variationData, headers } = useSelector(
    (state) => state.variation
  );
  const [loading, setLoading] = useState(false);
  const sku_list = watch("sku_list") || [];
  useEffect(() => {
    dispatch(initializeVariation());
  }, [selectedVariation, dispatch]);

  const handleAddVariation = () => dispatch(addVariation());

  const handleChangeVariant = (id, index) => {
    dispatch(changeVariant({ id, index, variations }));
  };

  const handleChangeVariantValue = (value, variation_id, index) => {
    dispatch(changeVariantValue({ value, variation_id, index, variations }));
  };

  const handleDeleteVariation = (variant) => {
    dispatch(deleteVariation(variant));
  };
  const getBase64 = useCallback((img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }, []);

  const beforeUpload = useCallback((file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  }, []);
  const uploadButton = useMemo(
    () => (
      <button style={{ border: 0, background: "none" }} type="button">
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </button>
    ),
    [loading]
  );
  const handleChange = useCallback(
    (info, index) => {
      if (info.file.status === "uploading") {
        setLoading(true);
        return;
      }
      if (info.file.status === "done") {
        getBase64(info.file.originFileObj, () => {
          setLoading(false);
          const updatedSkuList = [...sku_list];
          updatedSkuList[index].image = info.file.response.metadata.thumb_url;
          setValue("sku_list", updatedSkuList);
          const variations = watch("product_variations");
          const productVariations = [...variations];
          productVariations[0] = {
            ...productVariations[0],
            images: [info.file.response.metadata.thumb_url],
          };
          setValue("product_variations", productVariations);
          // setValue(`product_variations.${index}.images`, [
          //   info.file.response.metadata.thumb_url,
          // ]);
        });
      }
    },
    [getBase64, sku_list, setValue]
  );
  // const columns = useMemo(
  //   () => [
  //     ...headers.map((header) => ({
  //       title: header,
  //       dataIndex: header,
  //       key: header,
  //     })),
  //     {
  //       title: "Giá",
  //       dataIndex: "price",
  //       key: "price",
  //     },
  //     {
  //       title: "Kho hàng",
  //       dataIndex: "stock",
  //       key: "stock",
  //     },
  //   ],
  //   [headers]
  // );
  const calculateRowSpan = (data, key) => {
    let rowSpanMap = {};
    let countMap = {};

    data.forEach((item, index) => {
      if (!countMap[item[key]]) {
        countMap[item[key]] = 1;
        rowSpanMap[index] = 1;
      } else {
        countMap[item[key]] += 1;
        rowSpanMap[index] = 0;
      }
    });

    Object.keys(rowSpanMap).forEach((index) => {
      if (rowSpanMap[index] === 1) {
        rowSpanMap[index] = countMap[data[index][key]];
      }
    });

    return rowSpanMap;
  };
  const rowSpanMaps = useMemo(
    () => calculateRowSpan(variationData, headers[0]),
    [variationData, headers]
  );
  const columns = useMemo(
    () => [
      ...headers.map((header) => ({
        title: header,
        dataIndex: header,
        key: header,
        render: (_, index) => ({
          children: _,
          props: { rowSpan: rowSpanMaps[index] },
        }),
      })),
      {
        title: "Hình ảnh",
        dataIndex: "image",
        key: "image",
        render: (_, record, index) => ({
          children: (
            <Upload
              name="file"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action={`${apiOrigin}/upload/avatar`}
              beforeUpload={beforeUpload}
              onChange={(info) => handleChange(info, index)}
            >
              {sku_list[index]?.image ? (
                <img
                  src={sku_list[index]?.image}
                  alt="avatar"
                  style={{ width: "100%" }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          ),
          props: { rowSpan: rowSpanMaps[index] },
        }),
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        render: (_, record, index) => (
          <InputCustom
            control={control}
            placeholder="Nhập giá"
            name={`sku_list.${index}.price`}
            value={sku_list[index]?.price}
            onChange={(e) => {
              const value = e.target.value;
              const updated = [...sku_list];
              updated[index].price = value;
              setValue("sku_list", updated);
            }}
          />
        ),
      },
      {
        title: "Kho hàng",
        dataIndex: "stock",
        key: "stock",
        render: (_, record, index) => (
          <InputCustom
            placeholder="Nhập số lượng"
            value={sku_list[index]?.stock}
            control={control}
            name={`sku_list.${index}.stock`}
            onChange={(e) => {
              const value = e.target.value;
              const updated = [...sku_list];
              updated[index].stock = value;
              setValue("sku_list", updated);
            }}
          />
        ),
      },
    ],
    [
      headers,
      beforeUpload,
      handleChange,
      sku_list,
      control,
      setValue,
      uploadButton,
      rowSpanMaps,
    ]
  );
  const [groupId, setGroupId] = useState();

  const handleChangeGroup = useCallback((e) => {
    setGroupId(e.target.value);
  }, []);
  return (
    <div>
      <Flex align="baseline" gap={20}>
        {variants.length > 0 && <p className="flex-1">Phân loại hàng:</p>}
        <div className="w-full flex-[2]">
          {variants.map((variant, index) => (
            <div
              key={variant.id}
              className="p-4 mb-4 border rounded-md relative bg-gray-100"
            >
              <table className="w-full">
                <tbody>
                  <tr className="mb-2 flex gap-x-4">
                    <td
                      colSpan={2}
                      className="flex justify-end flex-1 items-center"
                    >
                      <p className="font-medium flex-1 justify-end flex">
                        Phân loại {index + 1}:
                      </p>
                    </td>
                    <td className="flex gap-x-4 flex-[6]">
                      <Select
                        placeholder="Type or Select"
                        onChange={(id) => handleChangeVariant(id, index)}
                        style={{ width: "90%" }}
                      >
                        {variations.map((variation) => (
                          <Option
                            key={variation.variation_id}
                            value={variation.variation_id}
                            disabled={selectedVariation.find(
                              (v) =>
                                v.variation_id.toString() ===
                                variation.variation_id.toString()
                            )}
                          >
                            {variation.display_name}
                          </Option>
                        ))}
                      </Select>
                    </td>
                  </tr>
                  {variant.variation_id && (
                    <tr className="flex gap-2 items-center">
                      <td
                        colSpan={2}
                        className={`flex justify-end flex-1 ${
                          variant.group_list.length > 1
                            ? "items-baseline"
                            : "items-center"
                        }`}
                      >
                        <p className="font-medium flex-1 justify-end flex">
                          Tùy chọn:
                        </p>
                      </td>
                      <td className="flex flex-col gap-x-4 flex-[6]">
                        {variant.group_list.length > 1 && (
                          <Radio.Group
                            onChange={(value) =>
                              handleChangeGroup(value, index)
                            }
                          >
                            {variant.group_list.map((option) => (
                              <Radio
                                key={option.group_id}
                                value={option.group_id}
                              >
                                {option.group_name}
                              </Radio>
                            ))}
                          </Radio.Group>
                        )}
                        {/* <Controller
                        name={`product_variations.${index}.${variant.display_name}`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <> */}
                        <Select
                          mode="tags"
                          placeholder="e.g. Red, etc"
                          style={{ width: "90%" }}
                          className="ml-1.5"
                          onChange={(value) =>
                            handleChangeVariantValue(
                              value,
                              variant.variation_id,
                              index
                            )
                          }
                        >
                          {variant.group_list.length > 1
                            ? variant.group_list
                                .find((group) => group.group_id == groupId)
                                ?.value_list.map((option) => (
                                  <Option
                                    key={option.value_id}
                                    value={option.value_id}
                                  >
                                    {option.value_name}
                                  </Option>
                                ))
                            : variant.group_list[0]?.value_list.map(
                                (option) => (
                                  <Option
                                    key={option.value_id}
                                    value={option.value_id}
                                  >
                                    {option.value_name}
                                  </Option>
                                )
                              )}
                        </Select>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => handleDeleteVariation(variant)}
                className="absolute top-0 right-0"
              />
            </div>
          ))}
        </div>
      </Flex>
      <Button onClick={handleAddVariation}>+ Thêm phân loại</Button>
      <Table columns={columns} dataSource={variationData} pagination={false} />
    </div>
  );
};

export default Variation;
