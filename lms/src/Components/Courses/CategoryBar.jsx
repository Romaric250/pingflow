// CategoryBar.js
import React from "react";

const CategoryBar = ({
  categories,
  selectedCategory,
  handleCategoryChange,
}) => {
  return (
    <div className="category-bar">
      {categories.map((category) => (
        <div
          key={category}
          className={`category ${
            selectedCategory === category ? "active" : ""
          }`}
          onClick={() => handleCategoryChange(category)}
        >
          {category}
        </div>
      ))}
    </div>
  );
};

export default CategoryBar;
