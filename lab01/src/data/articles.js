// Данные для карточек. Компоненты ничего не знают о конкретных статьях:
// число карточек определяется только длиной этого массива.
const articles = [
  {
    id: 1,
    title: 'Что такое React',
    excerpt:
      'React — это библиотека для создания пользовательских интерфейсов. Рассматриваем основные концепции.',
    author: 'Анна Иванова',
    date: '12 марта 2026',
    tag: 'Основы',
    image: 'https://picsum.photos/seed/react1/400/250',
  },
  {
    id: 2,
    title: 'Хуки в React',
    excerpt:
      'useState, useEffect, useContext — разбираемся, как работают хуки и зачем они нужны.',
    author: 'Пётр Смирнов',
    date: '18 марта 2026',
    tag: 'Хуки',
    image: 'https://picsum.photos/seed/hooks2/400/250',
  },
  {
    id: 3,
    title: 'Vite против Webpack',
    excerpt:
      'Сравниваем два сборщика: скорость, конфигурация и удобство разработки.',
    author: 'Мария Кузнецова',
    date: '22 марта 2026',
    tag: 'Инструменты',
    image: 'https://picsum.photos/seed/vite3/400/250',
  },
  {
    id: 4,
    title: 'CSS-модули в React',
    excerpt:
      'Как изолировать стили компонентов и забыть о конфликтах классов.',
    author: 'Иван Петров',
    date: '25 марта 2026',
    tag: 'Стили',
    image: 'https://picsum.photos/seed/css4/400/250',
  },
  {
    id: 5,
    title: 'Flexbox за 5 минут',
    excerpt:
      'Краткий гайд по Flexbox: основные свойства и типичные паттерны вёрстки.',
    author: 'Ольга Сидорова',
    date: '30 марта 2026',
    tag: 'Вёрстка',
    image: 'https://picsum.photos/seed/flex5/400/250',
  },
  {
    id: 6,
    title: 'Git для фронтендера',
    excerpt:
      'Базовые команды Git, ветвление и публикация проекта на GitHub.',
    author: 'Дмитрий Волков',
    date: '2 апреля 2026',
    tag: 'Git',
    image: 'https://picsum.photos/seed/git6/400/250',
  },
  // 7-я и 8-я карточки — задание для самопроверки №1
  {
    id: 7,
    title: 'Условный рендеринг: &&, тернарник и ранний return',
    excerpt:
      'Три способа показать разметку по условию. Разбираем, почему && иногда выводит на экран неожиданный ноль.',
    author: 'Ольга Белова',
    date: '6 апреля 2026',
    tag: 'Основы',
    image: 'https://picsum.photos/seed/condrender/400/250',
  },
  {
    id: 8,
    title: 'Семантическая вёрстка и доступность',
    excerpt:
      'Почему header, nav, main и article лучше бесконечных div: скринридеры, SEO и читаемость кода.',
    author: 'Сергей Мальцев',
    date: '9 апреля 2026',
    tag: 'Вёрстка',
    image: 'https://picsum.photos/seed/semantics/400/250',
  },
]

export default articles
