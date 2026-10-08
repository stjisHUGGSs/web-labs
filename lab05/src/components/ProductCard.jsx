// Презентационный компонент: только отображает данные.
// Стили оставлены прямо в JSX для наглядности (как в задании),
// в реальном проекте их лучше вынести в CSS-файл.
export function ProductCard({ product }) {
  return (
    <article style={{ border: '1px solid #e0e0e0', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      {/* Заглушка картинки через Data URI */}
      <div
        style={{
          height: '120px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'%3E%3Crect fill='%23eee' width='200' height='120'/%3E%3Ctext fill='%23999' x='50%' y='55%' text-anchor='middle' font-size='16' font-family='sans-serif'%3E${product.category}%3C/text%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          marginBottom: '1rem',
          borderRadius: '4px',
        }}
      />
      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{product.title}</h3>
      <p style={{ margin: '4px 0', color: '#555' }}>Категория: {product.category}</p>
      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.2rem' }}>{product.price.toLocaleString('ru-RU')} ₽</p>
    </article>
  );
}
