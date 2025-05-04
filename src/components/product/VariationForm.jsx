import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Radio, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";

const { Option } = Select;

const VariationForm = ({
  variations = [],
  control,
  watch,
  setValue,
  getValues,
}) => {
  // const {} = useForm();
  const [selectedGroups, setSelectedGroups] = useState({});

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "variations",
  });

  const handleAddVariation = useCallback(() => {
    append({
      name: "",
      options: [],
      images: [],
    });
  }, [append]);

  const handleChangeGroup = useCallback((index, groupId) => {
    setSelectedGroups((prev) => ({
      ...prev,
      [index]: groupId,
    }));
  }, []);

  const handleVariationChange = useCallback(
    (index, value) => {
      const currentValues = getValues();
      const updatedVariation = {
        ...currentValues.variations[index],
        name: value,
        options: [],
      };

      setValue(`variations.${index}.name`, value);
      setValue(`variations.${index}.options`, []);

      setSelectedGroups((prev) => ({
        ...prev,
        [index]: undefined,
      }));

      update(index, updatedVariation);
    },
    [setValue, update, getValues]
  );

  const getVariationOptions = useCallback(
    (field, fieldName, index) => {
      // console.log(field);
      const variation = variations?.find((v) => v.display_name === fieldName);
      if (!variation) return [];

      if (variation.group_list.length > 1 && selectedGroups[index]) {
        const group = variation.group_list.find(
          (g) => g.group_id === selectedGroups[index]
        );
        return group?.value_list || [];
      }

      return variation.group_list[0]?.value_list || [];
    },
    [selectedGroups, variations]
  );

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name?.startsWith("variations.") && name?.endsWith(".name")) {
        const index = parseInt(name.split(".")[1]);
        const variationName = value.variations[index]?.name;
        if (variationName) {
          const variation = variations?.find(
            (v) => v.display_name === variationName
          );
          if (variation?.group_list.length === 1) {
            setValue(`variations.${index}.options`, []);
            const currentValues = getValues();
            const updatedVariation = {
              ...currentValues.variations[index],
              options: [],
            };
            update(index, updatedVariation);
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, variations, update, getValues]);

  return (
    <div>
      <Button
        type="default"
        className="border-gray-600 w-fit my-4"
        onClick={handleAddVariation}
        icon={<PlusOutlined />}
      >
        Thêm phân loại hàng
      </Button>
      <Flex align="baseline" gap={20}>
        {fields.length > 0 && <p className="flex-1">Phân loại hàng:</p>}
        <div className="w-full flex-[2]">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 mb-4 border rounded-md relative bg-gray-100"
            >
              <div className="w-full">
                <div className="mb-2 flex gap-x-4">
                  <div className="flex justify-end flex-1 items-center">
                    <p className="font-medium flex-1 justify-end flex">
                      Phân loại {index + 1}:
                    </p>
                  </div>
                  <div className="flex gap-x-4 flex-[6]">
                    <Controller
                      name={`variations.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Chọn phân loại"
                          style={{ width: "90%" }}
                          onChange={(value) =>
                            handleVariationChange(index, value)
                          }
                        >
                          {variations?.map((variation) => (
                            <Option
                              key={variation.variation_id}
                              value={variation.display_name}
                              disabled={watch("variations")?.some(
                                (v, i) =>
                                  i !== index &&
                                  v.name === variation.display_name
                              )}
                            >
                              {variation.display_name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    />
                  </div>
                </div>
                {field.name && (
                  <div className="flex gap-2 items-center">
                    <div className="flex justify-end flex-1 items-center">
                      <p className="font-medium flex-1 justify-end flex">
                        Tùy chọn:
                      </p>
                    </div>
                    <div className="flex flex-col gap-x-4 flex-[6]">
                      {variations?.find((v) => v.display_name === field.name)
                        ?.group_list.length > 1 && (
                        <Radio.Group
                          onChange={(e) =>
                            handleChangeGroup(index, e.target.value)
                          }
                          value={selectedGroups[index]}
                        >
                          {variations
                            ?.find((v) => v.display_name === field.name)
                            ?.group_list.map((option) => (
                              <Radio
                                key={option.group_id}
                                value={option.group_id}
                              >
                                {option.group_name}
                              </Radio>
                            ))}
                        </Radio.Group>
                      )}
                      <Controller
                        name={`variations.${index}.options`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Select
                            mode="multiple"
                            value={value}
                            onChange={onChange}
                            style={{ width: "90%" }}
                            className="ml-1.5"
                          >
                            {getVariationOptions(field, field.name, index).map(
                              (option) => (
                                <Option
                                  key={option.value_id}
                                  value={option.value_name.toString()}
                                >
                                  {option.value_name}
                                </Option>
                              )
                            )}
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => remove(index)}
                className="absolute top-0 right-0"
              />
            </div>
          ))}
        </div>
      </Flex>
    </div>
  );
};

export default VariationForm;
