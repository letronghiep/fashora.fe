import { modifyImageDimensions } from "../../helpers";

function ProductVariation({ variations, selectedOptions, setSelectedOptions }) {
  const handleSelect = (variationName, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [variationName]: option,
    }));
  };

  return (
    <div className="w-[80%]">
      {variations.length > 0 &&
        variations.map((variation, index) => (
          <div className="flex items-start mb-6" key={index}>
            <span className="w-[100px]">{variation?.name}</span>
            <div className="flex items-center flex-wrap gap-x-2">
              {variation?.options?.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className={`px-4 py-1.5 border cursor-pointer flex items-center gap-x-2 ${
                    selectedOptions[variation.name] === option
                      ? "border-orange-500"
                      : "border-gray-400/40"
                  }`}
                  onClick={() => handleSelect(variation.name, option)}
                >
                  {variation?.images[optionIndex] && (
                    <img
                      src={modifyImageDimensions(
                        variation?.images[optionIndex],
                        20,
                        20
                      )}
                    />
                  )}
                  <p className="text-center flex items-center justify-center">
                    {option}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

export default ProductVariation;
