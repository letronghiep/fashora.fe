import { Button } from "antd";
import { useEffect, useState } from "react";

function FooterView({
  actionLabel,
  secondaryAction,
  secondaryActionLabel,
  cancelLabel,
  onSubmit,
  onCancel,
}) {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10
      ) {
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className={`sticky ${
        !isBottom && "bg-white"
      }  z-50 bottom-0 left-0 right-0 p-4 flex justify-end gap-4`}
    >
      <Button type="default" variant="text" color="default" onClick={onCancel}>{cancelLabel}</Button>
      <Button
        type="default"
        variant="outlined"
        color="primary"
        onClick={secondaryAction}
      >
        {secondaryActionLabel}
      </Button>
      <Button variant="outlined" type="primary" onClick={onSubmit}>
        {actionLabel}
      </Button>
    </div>
  );
}

export default FooterView;
