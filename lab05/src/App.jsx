import { ProductList } from './components/ProductList';

function App() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Каталог товаров</h1>
      <ProductList />
    </main>
  );
}

export default App;
