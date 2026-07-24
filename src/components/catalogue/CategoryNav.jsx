import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';

const CategoryNode = ({ category, depth = 0, activeCategoryId }) => {
  const hasChildren = category.children && category.children.length > 0;
  const isActive = String(category.id) === String(activeCategoryId);
  const isAncestor =
    hasChildren &&
    category.children.some(
      (c) =>
        String(c.id) === String(activeCategoryId) ||
        (c.children || []).some(
          (gc) => String(gc.id) === String(activeCategoryId)
        )
    );

  const [open, setOpen] = useState(isActive || isAncestor);

  const paddingLeft = depth * 12 + 12;

  return (
    <li>
      <div
        className={`flex items-center group ${
          isActive ? 'bg-indigo-50' : 'hover:bg-gray-50'
        } rounded transition-colors`}
        style={{ paddingLeft }}
      >
        <Link
          to={`/categories/${category.id}/products`}
          className={`flex-1 py-2 pr-2 text-sm ${
            isActive
              ? 'font-semibold text-indigo-700'
              : 'text-gray-700 group-hover:text-indigo-600'
          } transition-colors`}
        >
          {category.name}
        </Link>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Collapse' : 'Expand'}
            className="p-1 mr-1 rounded hover:bg-gray-200 transition-colors"
          >
            <img
              src={open ? chevronDownIcon : chevronRightIcon}
              alt=""
              className="w-3.5 h-3.5"
            />
          </button>
        )}
      </div>

      {hasChildren && open && (
        <ul className="mt-0.5">
          {category.children.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              depth={depth + 1}
              activeCategoryId={activeCategoryId}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const CategoryNav = ({ categories = [], activeCategoryId }) => {
  const params = useParams();
  const resolvedActive = activeCategoryId ?? params.categoryId;

  if (!categories.length) {
    return (
      <nav aria-label="Category navigation">
        <div className="text-sm text-gray-400 px-3 py-2">No categories</div>
      </nav>
    );
  }

  return (
    <nav aria-label="Category navigation">
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 mb-2">
        Categories
      </h2>
      <ul className="space-y-0.5">
        {categories.map((cat) => (
          <CategoryNode
            key={cat.id}
            category={cat}
            depth={0}
            activeCategoryId={resolvedActive}
          />
        ))}
      </ul>
    </nav>
  );
};

export default CategoryNav;
