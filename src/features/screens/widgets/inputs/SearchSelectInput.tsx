import React, { useState } from "react";

interface SearchSelectInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (query: string) => void;
  filteredProducts: Array<{ _id: string; name: string }>;
  onSelectProduct: (product: { _id: string; name: string }) => void;
  selectedProducts: Array<{ _id: string; name: string }>;
  onRemoveProduct: (productId: string) => void;
}

const SearchSelectInput: React.FC<SearchSelectInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  filteredProducts,
  onSelectProduct,
  selectedProducts,
  onRemoveProduct,
}) => {
  return (
    <div>
      <label className=" block font-medium md:text-lg">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mb-2 w-full rounded-lg border p-2"
      />
      <div className="mt-2">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            onClick={() => onSelectProduct(product)}
            className="cursor-pointer p-2 hover:bg-gray-100"
          >
            {product.name}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <label className="block font-medium md:text-lg">
          Selected Products
        </label>
        <div className="mt-2">
          {selectedProducts.map((product) => (
            <div
              key={product._id}
              className="mb-2 flex items-center justify-between rounded-md bg-gray-100 p-2"
            >
              <span>{product.name}</span>
              <button
                type="button"
                onClick={() => onRemoveProduct(product._id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchSelectInput;
