
function ListImages({images, setImages}) {
  return (
    <div>
      <div>
        {images.map((image, index) => (
          <img key={index} src={image} alt="product" className="w-28 h-28" />
        ))}
      </div>
      
    </div>
  )
}

export default ListImages
