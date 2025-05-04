import { Button, Pagination, Skeleton } from "antd";
import CommentItem from "./comment-item";
import { StarTwoTone } from "@ant-design/icons";
import { useState } from "react";
import CommentPopup from "./comment-popup";

function CommentList({
  comments,
  currentPage,
  setCurrentPage,
  totalRows,
  limit,
  productId,
}) {
  const [openPopup, setOpenPopup] = useState(false);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenPopup = () => {
    setOpenPopup(!openPopup);
  };
  if (!comments) return <Skeleton />;
  return (
    <>
      <div className="py-4">
        <div className="flex flex-col gap-y-4">
          {comments.length > 0 &&
            comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))}
        </div>
        {comments.length > 0 && (
          <Pagination
            className="flex justify-end mt-4"
            align="center"
            current={currentPage}
            onChange={handlePageChange}
            total={totalRows}
            pageSize={limit}
          />
        )}
      </div>
      <Button onClick={handleOpenPopup}>
        <StarTwoTone /> Thêm đánh giá
      </Button>
      {openPopup && (
        <CommentPopup
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          productId={productId}
        />
      )}
    </>
  );
}

export default CommentList;
