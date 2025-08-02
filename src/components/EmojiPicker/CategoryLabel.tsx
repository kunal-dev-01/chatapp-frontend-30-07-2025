import React from "react";

const CategoryLabel = React.memo<{ category: string }>(({ category }) => {
  return (
    <div className="sticky top-0 bg-gray-50 dark:bg-zinc-800 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 z-10">
      {category}
    </div>
  );
});

export default CategoryLabel;