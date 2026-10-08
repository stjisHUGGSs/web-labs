import { useState } from 'react';

// Категории fakestoreapi: значение — то, что приходит в product.category
const CATEGORY_OPTIONS = [
  { value: 'electronics', label: 'Электроника' },
  { value: 'jewelery', label: 'Ювелирные изделия' },
  { value: "men's clothing", label: 'Мужская одежда' },
  { value: "women's clothing", label: 'Женская одежда' },
];

// Компонент фильтров. Поля хранят локальное состояние, а родителю значения
// отдаются только по кнопке «Применить фильтры» (и только если нет ошибок).
// priceLimit — верхняя граница для ползунков цены.
export function Filters({ onFilterChange, initialFilters, priceLimit }) {
  // Выбранные категории — массив (задание 1). Пустой массив = «все категории»
  const [localCategories, setLocalCategories] = useState(initialFilters.categories || []);
  const [localMinPrice, setLocalMinPrice] = useState(String(initialFilters.minPrice || ''));
  const [localMaxPrice, setLocalMaxPrice] = useState(String(initialFilters.maxPrice || ''));

  // Ошибки валидации
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    const min = localMinPrice ? Number(localMinPrice) : undefined;
    const max = localMaxPrice ? Number(localMaxPrice) : undefined;

    // Проверка на отрицательные значения
    if (min !== undefined && min < 0) {
      errs.min = 'Цена не может быть отрицательной';
    }
    if (max !== undefined && max < 0) {
      errs.max = 'Цена не может быть отрицательной';
    }

    // Проверка диапазона: только если оба поля заполнены и оба валидны
    if (
      min !== undefined && max !== undefined &&
      min >= 0 && max >= 0 &&
      min > max
    ) {
      errs.min = 'Цена «от» не может быть больше цены «до»';
      errs.max = 'Цена «до» не может быть меньше цены «от»';
    }

    return errs;
  };

  const handleApply = () => {
    const errs = validate();
    setErrors(errs);

    // Если есть ошибки — не отправляем фильтры
    if (Object.keys(errs).length > 0) return;

    onFilterChange({
      categories: localCategories,
      minPrice: localMinPrice ? Number(localMinPrice) : undefined,
      maxPrice: localMaxPrice ? Number(localMaxPrice) : undefined,
    });
  };

  // Включение/выключение категории: добавляем в массив или убираем из него.
  // Состояние не мутируем — каждый раз создаём новый массив.
  const handleCategoryToggle = (value) => {
    setLocalCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  // Сбрасываем ошибку поля при ручном изменении,
  // чтобы она не висела после того, как пользователь начал исправлять значение.
  // Один обработчик обслуживает и числовое поле, и ползунок (задание 2).
  const handleMinChange = (e) => {
    setLocalMinPrice(e.target.value);
    setErrors((prev) => ({ ...prev, min: '' }));
  };

  const handleMaxChange = (e) => {
    setLocalMaxPrice(e.target.value);
    setErrors((prev) => ({ ...prev, max: '' }));
  };

  // Положение ползунков: пустое поле = край шкалы
  const minSliderValue = Number(localMinPrice) || 0;
  const maxSliderValue = localMaxPrice === '' ? priceLimit : Number(localMaxPrice);

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <fieldset style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}>
          <legend>Категории</legend>
          {CATEGORY_OPTIONS.map((option) => (
            <label key={option.value} style={{ display: 'block', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={localCategories.includes(option.value)}
                onChange={() => handleCategoryToggle(option.value)}
              />{' '}
              {option.label}
            </label>
          ))}
          <small style={{ color: '#777' }}>
            {localCategories.length === 0 ? 'Не выбрано — показаны все' : `Выбрано: ${localCategories.length}`}
          </small>
        </fieldset>

        <div>
          <label htmlFor="minPrice">Цена от</label>
          <input
            id="minPrice"
            type="number"
            value={localMinPrice}
            onChange={handleMinChange}
            placeholder="0"
            min="0"
            style={{
              width: '100%',
              boxSizing: 'border-box', // иначе padding выталкивает поле за пределы колонки
              padding: '8px',
              border: errors.min ? '1px solid red' : '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <input
            type="range"
            aria-label="Цена от (ползунок)"
            min="0"
            max={priceLimit}
            value={minSliderValue}
            onChange={handleMinChange}
            style={{ width: '100%' }}
          />
          {errors.min && (
            <span style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
              {errors.min}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="maxPrice">Цена до</label>
          <input
            id="maxPrice"
            type="number"
            value={localMaxPrice}
            onChange={handleMaxChange}
            placeholder="9999"
            min="0"
            style={{
              width: '100%',
              boxSizing: 'border-box', // иначе padding выталкивает поле за пределы колонки
              padding: '8px',
              border: errors.max ? '1px solid red' : '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <input
            type="range"
            aria-label="Цена до (ползунок)"
            min="0"
            max={priceLimit}
            value={maxSliderValue}
            onChange={handleMaxChange}
            style={{ width: '100%' }}
          />
          {errors.max && (
            <span style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
              {errors.max}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={handleApply}
        style={{
          padding: '10px 24px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Применить фильтры
      </button>
    </div>
  );
}
