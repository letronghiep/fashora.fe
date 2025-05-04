import { Carousel } from "antd";
import { useRef, useState } from "react";
import { modifyImageDimensions } from "../helpers";

const ImageCarousel = ({ images, width, height }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const carouselRef = useRef(null);

  const handleThumbnailClick = (index) => {
    setSelectedIndex(index);
    carouselRef.current.goTo(index);
  };

  return (
    <>
      <Carousel
        ref={carouselRef}
        autoplay
        dots={false}
        beforeChange={(from, to) => setSelectedIndex(to)}
      >
        {images.map((src, index) => (
          <div key={index}>
            <img
              src={modifyImageDimensions(src, width, height)}
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </Carousel>
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Thumbnail ${index + 1}`}
            className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
              selectedIndex === index ? "border-blue-500" : "border-transparent"
            }`}
            onClick={() => handleThumbnailClick(index)}
          />
        ))}
      </div>
    </>
  );
};

export default ImageCarousel;
