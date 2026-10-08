import { useRef, useState } from "react";
import "./DiscountCalculator.css";

// Справочник категорий: ключ — id, значение — { label, discount }
// discount хранится в процентах (число)
const CATEGORIES = [
  { id: "electronics", label: "Электроника", discount: 5 },
  { id: "clothing",    label: "Одежда",      discount: 15 },
  { id: "groceries",   label: "Продукты",    discount: 10 },
  { id: "books",       label: "Книги",       discount: 20 },
  { id: "other",       label: "Другое",      discount: 0 },
];

// Ставка НДС в долях (22%)
const VAT_RATE = 0.22;

// Промокод и его бонус (задание 2): добавляется поверх основной скидки
const PROMO_CODE = "WELCOME10";
const PROMO_BONUS = 10;

// Максимум ручной скидки в процентах (задание 3)
const MAX_CUSTOM_DISCOUNT = 50;

// Сколько последних расчётов хранить в истории (задание 5)
const HISTORY_LIMIT = 5;

// Пустая позиция списка товаров
const createItem = (id) => ({ id, price: "", category: "electronics" });

// Вспомогательная функция: форматирование в рублях
function formatRub(value) {
  return value.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function DiscountCalculator() {
  // --- Состояние ---
  // Список товаров (задание 1). У каждого своя цена и категория.
  // Цена — строка: так её удобно вводить в controlled input
  const [items, setItems] = useState([createItem(1)]);
  // Счётчик для id новых позиций. useRef подходит: значение нужно хранить
  // между рендерами, но перерисовывать компонент при его изменении не нужно
  const nextId = useRef(2);
  // Признак того, что пользователь нажал «Рассчитать»
  // До первого нажатия результаты не показываем
  const [calculated, setCalculated] = useState(false);
  // Ошибки валидации цен: { [id товара]: "текст" }
  const [errors, setErrors] = useState({});
  // Промокод (задание 2)
  const [promo, setPromo] = useState("");
  // Ручная скидка вместо скидки категории (задание 3)
  const [customEnabled, setCustomEnabled] = useState(false);
  const [customDiscount, setCustomDiscount] = useState(10);
  // Переключатель НДС (задание 4): с НДС / без НДС
  const [withVat, setWithVat] = useState(true);
  // История расчётов (задание 5): последние HISTORY_LIMIT штук
  const [history, setHistory] = useState([]);

  // --- Обработчики событий ---
  // Любое изменение исходных данных делает старые результаты устаревшими
  function invalidate() {
    setCalculated(false);
  }

  // Изменение цены: разрешаем только цифры и точку
  function handlePriceChange(id, value) {
    // Разрешаем пустую строку (чтобы пользователь мог стереть поле)
    // и числа с одной точкой
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, price: value } : item))
      );
      setErrors((prev) => ({ ...prev, [id]: "" })); // Сбрасываем ошибку при вводе
      invalidate(); // Пересчёт нужен заново
    }
  }

  // Изменение категории
  function handleCategoryChange(id, value) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, category: value } : item))
    );
    invalidate(); // Категория изменилась — результаты устарели
  }

  function handleAddItem() {
    // id берём до setItems: функция внутри setItems выполняется позже,
    // когда счётчик уже увеличен
    const id = nextId.current;
    nextId.current += 1;
    setItems((prev) => [...prev, createItem(id)]);
    invalidate();
  }

  function handleRemoveItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setErrors((prev) => ({ ...prev, [id]: "" }));
    invalidate();
  }

  // --- Вычисления ---
  // Промокод считаем введённым верно без учёта регистра и пробелов
  const promoActive = promo.trim().toUpperCase() === PROMO_CODE;

  // Итоговый процент скидки для товара: ручная скидка заменяет скидку
  // категории, промокод добавляется сверху. Больше 100% быть не может.
  function getDiscountPercent(item) {
    const category = CATEGORIES.find((c) => c.id === item.category);
    const base = customEnabled ? customDiscount : category ? category.discount : 0;
    return Math.min(base + (promoActive ? PROMO_BONUS : 0), 100);
  }

  // Считает все суммы по текущим данным формы
  function calculate() {
    const lines = items.map((item) => {
      const numPrice = parseFloat(item.price) || 0;
      const percent = getDiscountPercent(item);
      const discountAmount = numPrice * (percent / 100);
      return {
        id: item.id,
        category: CATEGORIES.find((c) => c.id === item.category),
        numPrice,
        percent,
        discountAmount,
        afterDiscount: numPrice - discountAmount,
      };
    });
    const sumPrice = lines.reduce((s, l) => s + l.numPrice, 0);
    const discountAmount = lines.reduce((s, l) => s + l.discountAmount, 0);
    const priceAfterDiscount = sumPrice - discountAmount;
    // НДС начисляется после скидки — на сумму, которую покупатель реально платит
    const vatAmount = withVat ? priceAfterDiscount * VAT_RATE : 0;
    const total = priceAfterDiscount + vatAmount;
    return { lines, sumPrice, discountAmount, priceAfterDiscount, vatAmount, total };
  }

  // Нажатие кнопки «Рассчитать»
  function handleCalculate() {
    // Валидация каждой цены
    const newErrors = {};
    items.forEach((item) => {
      const numPrice = parseFloat(item.price);
      if (!item.price.trim()) {
        newErrors[item.id] = "Введите цену товара"; // пустое поле
      } else if (isNaN(numPrice) || numPrice <= 0) {
        newErrors[item.id] = "Цена должна быть положительным числом";
      }
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setCalculated(false);
      return;
    }

    // Валидация прошла — показываем результаты и пишем расчёт в историю
    setCalculated(true);
    const r = calculate();
    const entry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString("ru-RU"),
      count: items.length,
      discountAmount: r.discountAmount,
      total: r.total,
      withVat,
    };
    setHistory((prev) => [entry, ...prev].slice(0, HISTORY_LIMIT));
  }

  // Сброс формы (историю не трогаем — это журнал прошлых расчётов)
  function handleReset() {
    setItems([createItem(1)]);
    nextId.current = 2;
    setCalculated(false);
    setErrors({});
    setPromo("");
    setCustomEnabled(false);
    setCustomDiscount(10);
    setWithVat(true);
  }

  // Результаты считаем только после нажатия «Рассчитать»
  const result = calculated ? calculate() : null;

  // --- Разметка ---
  return (
    <div className="calculator-wrapper">
      <h2 className="calculator-title">Калькулятор скидок</h2>

      {/* Список товаров: цена и категория для каждой позиции */}
      {items.map((item, index) => (
        <div className="item" key={item.id}>
          <div className="item__header">
            <span className="item__title">Товар {index + 1}</span>
            {items.length > 1 && (
              <button
                type="button"
                className="item__remove"
                onClick={() => handleRemoveItem(item.id)}
              >
                Удалить
              </button>
            )}
          </div>

          {/* Поле ввода цены */}
          <div className="field">
            <label htmlFor={`price-${item.id}`} className="field__label">
              Цена товара (₽)
            </label>
            <input
              id={`price-${item.id}`}
              type="text"
              className={`field__input ${errors[item.id] ? "field__input--error" : ""}`}
              value={item.price}
              onChange={(e) => handlePriceChange(item.id, e.target.value)}
              placeholder="Например: 1000"
              inputMode="decimal"
            />
            {/* Показываем ошибку, если она есть */}
            {errors[item.id] && (
              <span className="field__error">{errors[item.id]}</span>
            )}
          </div>

          {/* Выбор категории */}
          <div className="field">
            <label htmlFor={`category-${item.id}`} className="field__label">
              Категория товара
            </label>
            <select
              id={`category-${item.id}`}
              className="field__input field__select"
              value={item.category}
              onChange={(e) => handleCategoryChange(item.id, e.target.value)}
            >
              {/* Генерируем <option> из справочника категорий */}
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label} — скидка {cat.discount}%
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <button type="button" className="btn btn--add" onClick={handleAddItem}>
        + Добавить товар
      </button>

      {/* Дополнительные параметры расчёта */}
      <div className="options">
        {/* Промокод */}
        <div className="field">
          <label htmlFor="promo" className="field__label">
            Промокод
          </label>
          <input
            id="promo"
            type="text"
            className="field__input"
            value={promo}
            onChange={(e) => {
              setPromo(e.target.value);
              invalidate();
            }}
            placeholder="Например: WELCOME10"
          />
          {promoActive && (
            <span className="field__hint field__hint--ok">
              Промокод применён: дополнительно −{PROMO_BONUS}%
            </span>
          )}
          {promo.trim() && !promoActive && (
            <span className="field__hint">Такого промокода нет</span>
          )}
        </div>

        {/* Ручная скидка (range input) */}
        <div className="field">
          <label className="check">
            <input
              type="checkbox"
              checked={customEnabled}
              onChange={(e) => {
                setCustomEnabled(e.target.checked);
                invalidate();
              }}
            />
            Задать скидку вручную (вместо скидки категории)
          </label>
          {customEnabled && (
            <div className="slider">
              <input
                type="range"
                min="0"
                max={MAX_CUSTOM_DISCOUNT}
                step="1"
                value={customDiscount}
                aria-label="Ручная скидка, %"
                onChange={(e) => {
                  setCustomDiscount(Number(e.target.value));
                  invalidate();
                }}
              />
              <span className="slider__value">{customDiscount}%</span>
            </div>
          )}
        </div>

        {/* Переключатель НДС */}
        <div className="field">
          <label className="check">
            <input
              type="checkbox"
              checked={withVat}
              onChange={(e) => {
                setWithVat(e.target.checked);
                invalidate();
              }}
            />
            Начислять НДС ({VAT_RATE * 100}%)
          </label>
        </div>
      </div>

      {/* Кнопки */}
      <div className="actions">
        <button type="button" className="btn btn--primary" onClick={handleCalculate}>
          Рассчитать
        </button>
        <button type="button" className="btn btn--secondary" onClick={handleReset}>
          Сбросить
        </button>
      </div>

      {/* Результаты — показываем только после расчёта */}
      {result && (
        <div className="results">
          <h3 className="results__title">Результат расчёта</h3>

          {/* Промежуточные вычисления по каждой позиции */}
          <table className="results__table results__table--items">
            <thead>
              <tr>
                <th>Товар</th>
                <th>Цена</th>
                <th>Скидка</th>
                <th>После скидки</th>
              </tr>
            </thead>
            <tbody>
              {result.lines.map((line, index) => (
                <tr key={line.id}>
                  <td>
                    {index + 1}. {line.category.label}
                  </td>
                  <td className="results__value">{formatRub(line.numPrice)} ₽</td>
                  <td className="results__value results__value--discount">
                    {line.percent}%
                  </td>
                  <td className="results__value">{formatRub(line.afterDiscount)} ₽</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="results__table">
            <tbody>
              <tr>
                <td>Исходная цена</td>
                <td className="results__value">{formatRub(result.sumPrice)} ₽</td>
              </tr>
              <tr>
                <td>Скидка</td>
                <td className="results__value results__value--discount">
                  −{formatRub(result.discountAmount)} ₽
                </td>
              </tr>
              <tr>
                <td>Цена после скидки</td>
                <td className="results__value">
                  {formatRub(result.priceAfterDiscount)} ₽
                </td>
              </tr>
              <tr>
                <td>{withVat ? `НДС (${VAT_RATE * 100}%)` : "НДС не начисляется"}</td>
                <td className="results__value">
                  {withVat ? "+" : ""}
                  {formatRub(result.vatAmount)} ₽
                </td>
              </tr>
              <tr className="results__row--total">
                <td>Итого к оплате</td>
                <td className="results__value">{formatRub(result.total)} ₽</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* История последних расчётов */}
      {history.length > 0 && (
        <div className="history">
          <div className="history__header">
            <h3 className="results__title">История расчётов</h3>
            <button
              type="button"
              className="history__clear"
              onClick={() => setHistory([])}
            >
              Очистить
            </button>
          </div>
          <ul className="history__list">
            {history.map((h) => (
              <li key={h.id}>
                <span className="history__time">{h.time}</span>
                <span>
                  товаров: {h.count}, скидка {formatRub(h.discountAmount)} ₽,{" "}
                  {h.withVat ? "с НДС" : "без НДС"}
                </span>
                <strong>{formatRub(h.total)} ₽</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DiscountCalculator;
