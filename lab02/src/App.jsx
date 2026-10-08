import Layout from './components/Layout.jsx'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import MainContent from './components/MainContent.jsx'
import Footer from './components/Footer.jsx'

// Данные держим в App и передаём вниз через props —
// дочерние компоненты остаются «глупыми» и переиспользуемыми.
const siteTitle = 'Мой React-сайт'
const userName = 'Студент'
const menuItems = ['Главная', 'О нас', 'Услуги', 'Контакты']
// Год считаем один раз вне компонента: вызывать Date прямо в render не стоит
const currentYear = new Date().getFullYear()

function App() {
  return (
    <Layout siteTitle={siteTitle}>
      <Header title={siteTitle} userName={userName} />
      <Sidebar items={menuItems} />
      {/* Всё, что между <MainContent> и </MainContent>,
          приходит внутрь компонента как props.children. */}
      <MainContent>
        <h2>CSS Grid и Flexbox в React</h2>
        <p>
          Это пример макета на CSS Grid с React-компонентами (JS версия).
          Контейнер <code>.layout</code> задаёт именованные области (header,
          sidebar, main, footer), а каждый блок просто указывает, в какой
          области он лежит.
        </p>
        <h3>Что здесь можно посмотреть</h3>
        <ul>
          <li>
            Сайдбар и контент поменяны местами — в JSX порядок компонентов
            прежний, переставлены только имена в{' '}
            <code>grid-template-areas</code>.
          </li>
          <li>
            Между контентом и сайдбаром пустая колонка: точка{' '}
            <code>.</code> вместо имени области.
          </li>
          <li>
            Данные идут через <code>props</code>, а содержимое этого блока —
            через <code>children</code>.
          </li>
        </ul>
        <p>
          На экранах уже 768px медиа-запрос перестраивает те же области в одну
          колонку — разметку менять не нужно, меняется только CSS.
        </p>
      </MainContent>
      <Footer year={currentYear} />
    </Layout>
  )
}

export default App
