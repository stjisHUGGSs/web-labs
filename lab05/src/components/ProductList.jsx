import { useState, useEffect } from 'react';
import { Filters } from './Filters';
import { ProductCard } from './ProductCard';

// «Мозги» страницы: загрузка данных, состояния loading / error / products
// и фильтры. Filters и ProductCard только отображают и отдают значения.
export function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Состояние фильтров (пустой массив категорий = «все»)
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: undefined,
    maxPrice: undefined,
  });

  // 1. Загрузка данных при монтировании
  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Используем публичный API (fakestoreapi) — он бесплатный и не требует ключей
        const res = await fetch('https://fakestoreapi.com/products', {
          signal: controller.signal,
        });

        // fetch не считает 404/500 ошибкой сам — проверяем res.ok вручную
        if (!res.ok) {
          throw new Error(`Ошибка сети: ${res.status}`);
        }

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        // Если запрос отменили (размонтировали компонент), ошибку не показываем
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        // После отмены запроса компонент уже размонтирован (или идёт новая
        // загрузка), поэтому индикатор загрузки не трогаем
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Функция очистки: отменяет запрос, если компонент удалили до его завершения
    return () => controller.abort();
  }, []);

  // 2. Фильтрация: пересчитываем список при изменении товаров или фильтров
  useEffect(() => {
    let result = products;

    // Категории: товар подходит, если его категория есть в выбранном массиве
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }
    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filters.maxPrice);
    }

    // По заданию пересчёт делается во втором useEffect. Линтер новых версий React
    // считает это лишним (такое значение можно просто вычислять при рендере
    // или через useMemo), поэтому правило здесь отключено осознанно.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredProducts(result);
  }, [products, filters]);

  // Верхняя граница шкалы ползунков — самая дорогая позиция, округлённая вверх
  const priceLimit = products.length
    ? Math.ceil(Math.max(...products.map((p) => p.price)))
    : 1000;

  if (loading) return <p style={{ textAlign: 'center' }}>Загрузка товаров...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>Ошибка: {error}</p>;

  return (
    <section>
      <Filters onFilterChange={setFilters} initialFilters={filters} priceLimit={priceLimit} />

      {filteredProducts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777' }}>Товары не найдены по выбранным фильтрам.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
