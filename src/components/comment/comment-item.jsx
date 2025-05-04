import { Rate } from "antd";
import { modifyImageDimensions } from "../../helpers";
import { formatDate } from "../../helpers/formatDate";

function CommentItem({ comment }) {
  if (!comment) return null;
  return (
    <div className="flex gap-x-2 p-4 border-b">
      <div>
        <img
          src={modifyImageDimensions(
            comment?.comment_userId?.usr_avatar,
            40,
            40
          )}
          alt="avatar"
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col gap-y-2 w-full">
        <div className="text-xs text-neutral-600/80 italic flex flex-col gap-y-1">
          <p>{comment?.comment_userId?.usr_full_name}</p>
          <Rate
            value={comment.comment_rating}
            allowHalf
            disabled
            style={{
              fontSize: "10px",
            }}
          />
          <p>{formatDate(comment?.createdAt, "DD/MM/YYYY")}</p>
        </div>
        <div
          className="w-full"
          dangerouslySetInnerHTML={{ __html: comment?.comment_content }}
        />
      </div>
    </div>
  );
}

export default CommentItem;
