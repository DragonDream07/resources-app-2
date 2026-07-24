import React, { useState } from 'react';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import starIcon from '@/assets/icons/star.svg';

const RATING_OPTIONS = [
  { value: 4, label: '4 & above' },
  { value: 3, label: '3 & above' },
  { value: 2, label: '2 & above' },
];

const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        type="button"
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <img
          src={chevronDownIcon}
          alt=""
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
};

const FilterPanel = ({
  brands = [],
  selectedBrands = [],
  onBrandChange,
  priceRange = { min: 0, max: 100000 },
  selectedPriceRange = { min: 0, max: 100000 },
  onPriceRangeChange,
  selectedRating = null,
  onRatingChange,
  facetCounts = {},
}) => {
  const handleBrandToggle = (brandId) => {
    if (!onBrandChange) return;
    const next = selectedBrands.includes(brandId)
      ? selectedBrands.filter((b) => b !== brandId)
      : [...selectedBrands, brandId];
    onBrandChange(next);
  };

  const handleMinPrice = (e) => {
    if (!onPriceRangeChange) return;
    const val = Number(e.target.value);
    onPriceRangeChange({ ...selectedPriceRange, min: val });
  };

  const handleMaxPrice = (e) => {
    if (!onPriceRangeChange) return;
    const val = Number(e.target.value);
    onPriceRangeChange({ ...selectedPriceRange, max: val });
  };

  const handleRating = (value) => {
    if (!onRatingChange) return;
    onRatingChange(selectedRating === value ? null : value);
  };

  return (
    <aside className="w-full">
      <h2 className="text-base font-bold text-gray-800 mb-4">Filters</h2>

      {brands.length > 0 && (
        <Section title="Brand">
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {brands.map((brand) => {
              const count =
                facetCounts?.brands?.[brand.id] ??
                facetCounts?.brands?.[brand.name] ??
                null;
              return (
                <li key={brand.id}>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() => handleBrandToggle(brand.id)}
                    />
                    <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors flex-1">
                      {brand.name}
                    </span>
                    {count != null && (
                      <span className="text-xs text-gray-400">({count})</span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      <Section title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Min (₹)</label>
              <input
                type="number"
                min={priceRange.min}
                max={selectedPriceRange.max}
                value={selectedPriceRange.min}
                onChange={handleMinPrice}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <span className="text-gray-400 mt-4">—</span>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Max (₹)</label>
              <input
                type="number"
                min={selectedPriceRange.min}
                max={priceRange.max}
                value={selectedPriceRange.max}
                onChange={handleMaxPrice}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={selectedPriceRange.min}
              onChange={handleMinPrice}
              className="flex-1 accent-indigo-600"
            />
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={selectedPriceRange.max}
              onChange={handleMaxPrice}
              className="flex-1 accent-indigo-600"
            />
          </div>
        </div>
      </Section>

      <Section title="Customer Rating">
        <ul className="space-y-2">
          {RATING_OPTIONS.map(({ value, label }) => {
            const count = facetCounts?.ratings?.[value] ?? null;
            return (
              <li key={value}>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="rating"
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    checked={selectedRating === value}
                    onChange={() => handleRating(value)}
                  />
                  <span className="inline-flex items-center gap-1 text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">
                    <img src={starIcon} alt="" className="w-3.5 h-3.5" />
                    {label}
                  </span>
                  {count != null && (
                    <span className="text-xs text-gray-400">({count})</span>
                  )}
                </label>
              </li>
            );
          })}
        </ul>
      </Section>
    </aside>
  );
};

export default FilterPanel;
