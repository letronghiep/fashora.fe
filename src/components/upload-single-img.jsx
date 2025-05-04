import { Image, message, Upload } from "antd";
import { useEffect, useState } from "react";
import { apiOrigin } from "../constants";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  // if (!isJpgOrPng) {
  //   message.error('You can only upload JPG/PNG file!');
  // }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isLt2M;
};
function UploadSingleImage({ setImage, thumb_url, dataImage }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
        setImage(thumb_url, info.file.response.metadata.thumb_url);
      });
    }
  };
  useEffect(() => {
    if (dataImage) {
      setImageUrl(dataImage);
    }
  }, [dataImage]);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
        height: "300px",
        // width: "200px",
        // maxWidth: "200px",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Tải ảnh lên
      </div>
    </button>
  );
  return (
    <>
      <Upload
        name="file"
        // className="avatar-uploader"
        showUploadList={false}
        type="drag"
        action={`${apiOrigin}/upload/avatar`}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            loading="lazy"
            style={{
              width: "100%",
              height: "300px",
              objectFit: "contain",
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
            width: "200px",
            height: "300px",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
}

export default UploadSingleImage;
