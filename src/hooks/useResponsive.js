import { useEffect, useState } from "react";
function useResponsive() {
  const [width, setWidth] = useState(() => {
    return typeof window !== "undefined" ? window.innerWidth : 0;
  });
  const handleWindowsSizeChange = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", handleWindowsSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowsSizeChange);
    };
  }, []);
  const isMobile = width <= 768;
  const isTablet = width > 768 && width <= 1024;
  const isDesktop = width > 1024;
  return {
    isMobile,
    isTablet,
    isDesktop,
  };
}

export default useResponsive;
