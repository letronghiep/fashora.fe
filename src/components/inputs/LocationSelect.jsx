import { getDistrict, getProvince, getWard } from "~/services/location";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import SelectCustom from "./Select";

function LocationSelect({ setPosition, onApply, dataLocation, disabled }) {
  const { control, watch, setValue } = useForm({
    defaultValues: {
      ward: "",
      district: "",
      province: "",
    },
    criteriaMode: "all",
  });

  const [provinces, setProvinces] = React.useState([]);
  const [districts, setDistricts] = React.useState([]);
  const [wards, setWards] = React.useState([]);
  const [provinceId, setProvinceId] = React.useState();
  const [districtId, setDistrictId] = React.useState();
  const [wardId, setWardId] = React.useState();
  // Map dataLocation vào form và trigger load dữ liệu tương ứng
  useEffect(() => {
    if (
      dataLocation?.province &&
      provinces.length &&
      !provinceId // tránh gọi lại nếu đã có
    ) {
      const selectedProvince = provinces.find(
        (p) => p.name === dataLocation.province
      );
      if (selectedProvince) {
        setProvinceId(selectedProvince.id);
        setValue("province", selectedProvince.name);
      }
    }
  }, [dataLocation?.province, provinces, provinceId, setValue]);

  useEffect(() => {
    if (
      dataLocation?.district &&
      districts.length &&
      provinceId &&
      !districtId
    ) {
      const selectedDistrict = districts.find(
        (d) => d.name === dataLocation.district
      );
      if (selectedDistrict) {
        setDistrictId(selectedDistrict.id);
        setValue("district", selectedDistrict.name);
      }
    }
  }, [dataLocation?.district, districts, districtId, provinceId, setValue]);

  useEffect(() => {
    if (dataLocation?.ward && wards.length && districtId && !wardId) {
      const selectedWard = wards.find((w) => w.name === dataLocation.ward);
      if (selectedWard) {
        setWardId(selectedWard.id);
        setValue("ward", selectedWard.name);
      }
    }
  }, [dataLocation?.ward, wards, wardId, districtId, setValue]);
  // Fetch provinces on mount
  useEffect(() => {
    async function fetchProvinces() {
      try {
        const response = await getProvince();
        setProvinces(response?.data || []);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    }
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    async function fetchDistricts() {
      if (!provinceId) return;

      try {
        const response = await getDistrict(provinceId);
        setDistricts(response?.data || []);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    }
    fetchDistricts();
  }, [provinceId, setValue]);

  // Fetch wards when district changes
  useEffect(() => {
    async function fetchWards() {
      if (!districtId) return;

      try {
        const response = await getWard(districtId);
        setWards(response?.data || []);
        // Reset ward when district changes
        // setValue("wardId", "");
        // setValue("ward", "");
      } catch (error) {
        console.error("Error fetching wards:", error);
      }
    }
    fetchWards();
  }, [districtId, setValue]);

  // Update position when district changes
  useEffect(() => {
    const district = districts.find((d) => d.id === districtId);
    if (district) {
      setPosition({ lat: district.latitude, lng: district.longitude });
    }
  }, [districtId, districts, setPosition]);

  // Apply changes when form values change
  useEffect(() => {
    const subscription = watch((values) => {
      onApply(values);
    });
    return () => subscription.unsubscribe();
  }, [watch, onApply]);

  // Initialize form values from `dataLocation`

  const provincesData = useMemo(
    () =>
      provinces.map((province) => ({ id: province.id, label: province.name })),
    [provinces]
  );
  const districtsData = useMemo(
    () =>
      districts.map((district) => ({ id: district.id, label: district.name })),
    [districts]
  );
  const wardsData = useMemo(
    () => wards.map((ward) => ({ id: ward.id, label: ward.name })),
    [wards]
  );
  const handleSelectProvince = (provinceId) => {
    setProvinceId(provinceId);
    const provinceSelect = provinces.find((p) => p.id === provinceId);
    setValue("province", provinceSelect ? provinceSelect.name : "");
  };
  const handleSelectDistrict = (districtId) => {
    setDistrictId(districtId);
    const districtSelect = districts.find((p) => p.id === districtId);
    setValue("district", districtSelect ? districtSelect.name : "");
  };
  const handleSelectWard = (wardId) => {
    setWardId(wardId);
    const wardSelect = wards.find((p) => p.id === wardId);
    setValue("ward", wardSelect ? wardSelect.name : "");
  };
  return (
    <div className="w-full gap-x-3 flex items-center">
      <SelectCustom
        name="province"
        label="Tỉnh/Thành phố"
        control={control}
        data={provincesData}
        valueField="label"
        keyField="id"
        placeholder="Tỉnh/Thành phố"
        onChange={(value) => handleSelectProvince(value)}
        disabled={disabled}
      />
      <SelectCustom
        name="district"
        label="Quận/Huyện"
        control={control}
        data={districtsData}
        valueField="label"
        keyField="id"
        placeholder="Quận/Huyện"
        onChange={(value) => handleSelectDistrict(value)}
        disabled={disabled}
      />
      <SelectCustom
        name="ward"
        label="Phường/Xã"
        control={control}
        data={wardsData}
        valueField="label"
        keyField="id"
        placeholder="Phường/Xã"
        onChange={(value) => handleSelectWard(value)}
        disabled={disabled}
      />
    </div>
  );
}

export default LocationSelect;
