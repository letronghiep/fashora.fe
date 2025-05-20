import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "../../../apis/categoriesApi";
import CategoryForm from "../../../components/form/category-form";
import SpinLoading from "../../../components/loading/SpinLoading";
import { notification, Typography } from "antd";
import { useNavigate } from "react-router-dom";
function EditCategory() {
  const {
    handleSubmit, 
    setValue,
    control,
    reset,
  } = useForm({
    criteriaMode: "all",
  });
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { data, loading, error } = useGetCategoryByIdQuery(categoryId);
  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
  } = useGetCategoriesQuery();
  const [
    updateCategory,
    { isLoading: isUpdating },
  ] = useUpdateCategoryMutation();
  
  const onSubmit = async (data) => {
    const res = await updateCategory({
      categoryId: categoryId,
      data: data,
    }).unwrap();
    if (res.status === 200) {
      notification.success({
        message: "Cập nhật danh mục thành công",
        showProgress: true,
        placement: "topRight",
        onClose: () => {
          navigate("/seller/categories");
          reset();
          window.location.reload();
        },
      });
    }
  };
  if (loading || categoryLoading) return <SpinLoading />;
  if (error || categoryError) return "Error";
  return (
    <div className="w-[90%] relative bg-white p-4">
      <Typography.Title level={3}>Chỉnh sửa danh mục</Typography.Title>
      <div className="w-[50%] mx-auto">
        <CategoryForm
          categoryData={categoryData?.metadata || []}
          control={control}
          onSubmit={handleSubmit(onSubmit)}
          setValue={setValue}
          category={data?.metadata}
          loadingSubmit={isUpdating}
        />
      </div>
    </div>
  );
}

export default EditCategory;
