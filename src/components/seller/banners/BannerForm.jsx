import { useForm } from 'react-hook-form';
import Input from '~/components/inputs/Input';
import Button from '~/components/Button';
import UploadSingleImage from '~/components/upload-single-img';
import { useEffect } from 'react';

const BannerForm = ({ onSubmit, banner }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (banner) {
      setValue("title", banner.title);
      setValue("linkTo", banner.linkTo);
      setValue("thumb", banner.thumb);
    }
  }, [banner]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <h2 className="text-xl font-semibold mb-5">Thông tin Banner</h2>

      <div className="mb-4">
        <Input
          type="text"
          label="Tiêu đề"
          name="title"
          register={register}
          error={errors.title}
          control={control}
          placeholder="Tiêu đề"
        />
      </div>

      {/* <div className="mb-4">
        <Input
          type="text"
          label="Mô tả"
          name="description"
          register={register}
          error={errors.description}
          control={control}
          placeholder="Mô tả"
          multiline
          rows={4}
        />
      </div> */}

      <div className="mb-4">
        <Input
          type="text"
          label="Link"
          name="linkTo"
          register={register}
          error={errors.linkTo}
          control={control}
          placeholder="Link"
        />
      </div>

      <div className="mb-4">
        <h4>Hình ảnh</h4>
        <UploadSingleImage
          setImage={setValue}
          thumb_url="thumb"
          dataImage={banner?.thumb || ""}
        />
      </div>

      <Button
        size="md"
        className="text-center justify-center items-center"
        variant="default"
        type="submit"
        
      >
        Tạo Banner
      </Button>
    </form>
  );
};

export default BannerForm; 