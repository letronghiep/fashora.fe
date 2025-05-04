import { notification, Spin, Typography } from "antd";
import { useForm } from "react-hook-form";
import {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
} from "../../../apis/categoriesApi";
import CategoryForm from "../../../components/form/category-form";
import { useNavigate } from "react-router-dom";
function CreateCategory() {
  const { handleSubmit, setValue, control, reset } = useForm({
    criteriaMode: "all",
  });
  const { data: categories, error, isLoading } = useGetCategoriesQuery();
  const [createMenuItem, { isLoading: isCreating, isError }] =
    useCreateCategoryMutation();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const res = await createMenuItem(data).unwrap();
      if (res.status === 201) {
        notification.success({
          message: "Tạo danh mục thành công",
          showProgress: true,
          placement: "top",
          onClose: () => {
            navigate("/seller/categories");
            reset();
            window.location.reload();
          },
        });
      }
      if (isError) {
        notification.error({
          message: error.message,
          showProgress: true,
          placement: "top",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (isLoading) return <Spin size="large" />;
  return (
    <div className="w-[90%] relative bg-white p-4">
      <Typography.Title level={3}>Tạo danh mục</Typography.Title>
      <div className="w-[50%] mx-auto">
        <CategoryForm
          onSubmit={handleSubmit(onSubmit)}
          categoryData={categories?.metadata || []}
          control={control}
          setValue={setValue}
          loadingSubmit={isCreating}
        />
      </div>
    </div>
  );
}

export default CreateCategory;
