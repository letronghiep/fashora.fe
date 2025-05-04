import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Flex, Select } from "antd";
import { useState, useCallback, useEffect } from "react";
import { Controller } from "react-hook-form";
import SelectCustom from "../../../components/inputs/Select";

const { Option } = Select;

const styles = {
  formContainer: {
    width: "90%",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    columnGap: 10,
  },
  labelStyle: {
    whiteSpace: "normal",
    wordWrap: "break-word",
  },
  toggleButton: "ml-[200px] text-blue-400 cursor-pointer hover:underline",
  formItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
  },
  label: {
    width: "33.33%",
    textAlign: "right",
    paddingRight: "8px",
  },
  input: {
    width: "66.67%",
  }
};

const INITIAL_MAX_SIZE = 9;

const AttributeItem = ({ attr, control, name, onChange }) => (
  <div style={styles.formItem}>
    <div style={styles.label}>
      <span style={styles.labelStyle}>{attr.display_name}</span>
    </div>
    <div style={styles.input}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select 
            {...field} 
            style={{ width: "100%" }} 
            placeholder={`Chọn ${attr.display_name}`}
            onChange={(value) => {
              field.onChange(value);
              onChange?.({
                id: attr.attribute_id,
                value: value,
                display_name: attr.children.find(item => item.value_id === value)?.display_name || ''
              });
            }}
          >
            {attr.children.map((item) => (
              <Option key={item.value_id} value={item.value_id}>
                {item.display_name}
              </Option>
            ))}
          </Select>
        )}
      />
    </div>
  </div>
);

function Attribute({ attributes, brands, control, brandName, setValue }) {
  const [maxSize, setMaxSize] = useState(INITIAL_MAX_SIZE);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  
  const toggleSize = useCallback(() => {
    setMaxSize(prev => prev === INITIAL_MAX_SIZE ? attributes.length : INITIAL_MAX_SIZE);
  }, [attributes?.length]);

  const handleAttributeChange = (attribute) => {
    setSelectedAttributes(prev => {
      const newAttributes = prev.filter(attr => attr.id !== attribute.id);
      if (attribute.value) {
        newAttributes.push(attribute);
      }
      return newAttributes;
    });
  };

  useEffect(() => {
    setValue("product_attributes", selectedAttributes);
  }, [selectedAttributes, setValue]);

  return (
    <>
      <Flex gap={10}>
        <div style={styles.formContainer}>
          <div style={styles.formItem}>
            <div style={styles.label}>
              <span>Thương hiệu:</span>
            </div>
            <div style={styles.input}>
              <SelectCustom
                keyField="brand_id"
                valueField="display_name"
                data={brands}
                name={brandName}
                control={control}
              />
            </div>
          </div>
          {attributes?.map(
            (attr, idx) =>
              idx < maxSize && (
                <AttributeItem
                  key={attr.attribute_id}
                  attr={attr}
                  control={control}
                  name={`product_attributes.${idx}`}
                  onChange={handleAttributeChange}
                />
              )
          )}
        </div>
      </Flex>
      {attributes?.length > INITIAL_MAX_SIZE && (
        <p onClick={toggleSize} className={styles.toggleButton}>
          {maxSize === INITIAL_MAX_SIZE ? (
            <>
              Hiển thị đầy đủ danh sách
              <DownOutlined />
            </>
          ) : (
            <>
              Rút gọn danh sách
              <UpOutlined />
            </>
          )}
        </p>
      )}
    </>
  );
}

export default Attribute;
