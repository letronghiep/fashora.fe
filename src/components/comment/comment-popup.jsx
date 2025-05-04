import { Input, Modal, notification, Rate } from "antd";
import { useState } from "react";
import { modifyImageDimensions } from "../../helpers";
import { createComment } from "../../services/comment";
import UploadImage from "../upload";
function CommentPopup({ openPopup, setOpenPopup, productId }) {
  // const [open, setOpen] = useState(false);
  const { TextArea } = Input;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [images, setImages] = useState();
  const [commentText, setCommentText] = useState("");
  const handleOk = async () => {
    const sanitizeHTML = (str) =>
      str.replace(
        /[&<>"']/g,
        (match) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          }[match])
      );

    const safeCommentText = sanitizeHTML(commentText);

    const content = `<div class="">
      <p>${safeCommentText}</p>
      ${
        images && images.length > 0
          ? `<div class="mt-2 flex gap-x-2 flex-wrap">
              ${images
                .filter((image) => image) // Loại bỏ giá trị null/undefined
                .map(
                  (image) =>
                    `<img src="${modifyImageDimensions(image, 80, 80)}" 
                          alt="image preview" 
                          width="80" 
                          height="80">`
                )
                .join("")}
            </div>`
          : ""
      }
    </div>`;

    const dataComment = {
      comment_content: content,
      comment_rating: value,
      productId: productId,
    };
    const response = await createComment(dataComment);
    if (response.status === 201) {
      notification.success({
        message: "Gửi đánh giá thành công",
        showProgress: true,
        placement: "top",
        onClose: () => {
          setOpenPopup(false);
          setValue(0);
          setCommentText("");
          setImages([]);
          setConfirmLoading(false);
        },
      });
    }
  };

  const handleChangeValue = (value) => {
    setValue(value);
  };
  const handleCancel = () => {
    setOpenPopup(false);
  };
  // upload Image
  return (
    <Modal
      title="Đánh giá và nhận xét"
      open={openPopup}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <>
        <div className="flex gap-x-4">
          <p className="font-semibold">Mức độ đánh giá*</p>
          <Rate value={value} onChange={handleChangeValue} handleCancel />
        </div>
        <div className="flex flex-col gap-y-2">
          <p className="font-semibold">Nhận xét: *</p>
          <TextArea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Thêm đánh giá của bạn về sản phẩm"
            autoSize={{
              minRows: 3,
              maxRows: 5,
            }}
          />
        </div>
        <div className="my-4">
          <UploadImage setImages={setImages} />
        </div>
      </>
    </Modal>
  );
}

export default CommentPopup;
