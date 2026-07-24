import React, { useEffect, useState } from 'react';
import checkIcon from '@/assets/icons/check.svg';

const COLOUR_SWATCHES = {
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#22C55E',
  black: '#111827',
  white: '#F9FAFB',
  yellow: '#EAB308',
  pink: '#EC4899',
  purple: '#8B5CF6',
  orange: '#F97316',
  grey: '#9CA3AF',
  gray: '#9CA3AF',
  navy: '#1E3A5F',
  brown: '#92400E',
};

const resolveSkuFromSelections = (skus, selections) => {
  if (!skus || !skus.length) return null;
  return (
    skus.find((sku) =>
      Object.entries(selections).every(
        ([attr, val]) =>
          sku.attributes?.[attr]?.toLowerCase() === val?.toLowerCase()
      )
    ) || null
  );
};

const SizeOption = ({ value, selected, available, onSelect }) => (
  <button
    type="button"
    onClick={() => available && onSelect(value)}
    disabled={!available}
    aria-pressed={selected}
    className={[
      'px-3 py-1.5 rounded border text-sm font-medium transition-all duration-150',
      selected
        ? 'border-indigo-600 bg-indigo-600 text-white'
        : available
        ? 'border-gray-300 bg-white text-gray-700 hover:border-indigo-400'
        : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed line-through',
    ].join(' ')}
  >
    {value}
  </button>
);

const ColourOption = ({ value, selected, available, onSelect }) => {
  const swatch = COLOUR_SWATCHES[value?.toLowerCase()] || '#D1D5DB';
  const isLight = ['white', '#F9FAFB', '#FFF', '#ffffff'].includes(swatch);
  return (
    <button
      type="button"
      onClick={() => available && onSelect(value)}
      disabled={!available}
      aria-pressed={selected}
      title={value}
      className={[
        'relative w-8 h-8 rounded-full border-2 transition-all duration-150 focus:outline-none',
        selected ? 'border-indigo-600 scale-110' : 'border-transparent hover:border-gray-400',
        !available ? 'opacity-40 cursor-not-allowed' : '',
      ].join(' ')}
      style={{ backgroundColor: swatch }}
    >
      {selected && (
        <img
          src={checkIcon}
          alt="selected"
          className={`absolute inset-0 m-auto w-4 h-4 ${
            isLight ? '' : 'brightness-0 invert'
          }`}
        />
      )}
      {!available && (
        <span
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="block w-full h-0.5 bg-gray-400 rotate-45 transform" />
        </span>
      )}
    </button>
  );
};

const VariantPicker = ({ skus = [], onSkuChange }) => {
  const [selections, setSelections] = useState({});

  const attributeMap = {};
  skus.forEach((sku) => {
    if (!sku.attributes) return;
    Object.entries(sku.attributes).forEach(([key, val]) => {
      if (!attributeMap[key]) attributeMap[key] = new Set();
      attributeMap[key].add(val);
    });
  });

  const attributes = Object.fromEntries(
    Object.entries(attributeMap).map(([k, v]) => [k, Array.from(v)])
  );

  const isValueAvailable = (attrKey, attrValue) => {
    const tentative = { ...selections, [attrKey]: attrValue };
    return skus.some((sku) =>
      Object.entries(tentative).every(
        ([k, v]) => sku.attributes?.[k]?.toLowerCase() === v?.toLowerCase()
      )
    );
  };

  const handleSelect = (attrKey, value) => {
    const next = { ...selections };
    if (next[attrKey]?.toLowerCase() === value?.toLowerCase()) {
      delete next[attrKey];
    } else {
      next[attrKey] = value;
    }
    setSelections(next);
  };

  useEffect(() => {
    if (!onSkuChange) return;
    const allSelected =
      Object.keys(attributes).length > 0 &&
      Object.keys(attributes).every((k) => selections[k] != null);
    if (allSelected) {
      const sku = resolveSkuFromSelections(skus, selections);
      onSkuChange(sku);
    } else {
      onSkuChange(null);
    }
  }, [selections]);

  if (!Object.keys(attributes).length) return null;

  return (
    <div className="space-y-4">
      {Object.entries(attributes).map(([attrKey, values]) => {
        const isColour = attrKey.toLowerCase() === 'colour' || attrKey.toLowerCase() === 'color';
        const isSize = attrKey.toLowerCase() === 'size';
        const selected = selections[attrKey];

        return (
          <div key={attrKey}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-gray-700 capitalize">
                {attrKey}
              </span>
              {selected && (
                <span className="text-sm text-gray-500">: {selected}</span>
              )}
            </div>
            <div className={`flex flex-wrap gap-2`}>
              {values.map((val) => {
                const isSelected =
                  selected?.toLowerCase() === val?.toLowerCase();
                const available = isValueAvailable(attrKey, val);
                if (isColour) {
                  return (
                    <ColourOption
                      key={val}
                      value={val}
                      selected={isSelected}
                      available={available}
                      onSelect={(v) => handleSelect(attrKey, v)}
                    />
                  );
                }
                return (
                  <SizeOption
                    key={val}
                    value={val}
                    selected={isSelected}
                    available={available}
                    onSelect={(v) => handleSelect(attrKey, v)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VariantPicker;
