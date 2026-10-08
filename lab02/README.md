# ЛР №2 — React + CSS Grid

**Цель:** собрать макет страницы на CSS Grid из React-компонентов: данные
передаются через `props`, содержимое — через `children`.

## Запуск

Команды выполняются из папки `lab02/`:

```
npm install
npm run dev
```

Откроется http://127.0.0.1:5173/

Проверка сборки и линтера:

```
npm run build
npm run lint
```

## Структура

```
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/
    │   ├── Layout.jsx        grid-контейнер, рендерит {children}
    │   ├── Header.jsx        title + userName через props
    │   ├── Sidebar.jsx       items.map() с key
    │   ├── MainContent.jsx   прокидывает children в <main>
    │   └── Footer.jsx        year через props
    └── styles/
        └── index.css
```

## Разметка

Сетка задана через `grid-template-areas` — текстовую «карту» макета,
где каждая строка в кавычках соответствует строке сетки, а каждое
слово — колонке:

```css
grid-template-columns: 200px 1fr 200px;
grid-template-rows: auto 1fr auto;
grid-template-areas:
  "header header header"
  "main . sidebar"
  "footer footer footer";
```

Каждый блок привязан к своей области через `grid-area`, поэтому
перестроить макет можно, не трогая JSX.

## Адаптивность

Медиа-запрос `@media (max-width: 768px)` схлопывает три колонки в одну
и ставит области в порядок `header → main → sidebar → footer`.
Меняется только CSS — разметка компонентов остаётся прежней.

## Мини-задания

1. **Сайдбар и контент поменяны местами.** В карте областей `main` стоит
   перед `sidebar`; в `App.jsx` порядок компонентов не менялся.
2. **Пустая колонка.** Колонки `200px 1fr 200px`, в карте областей точка
   посередине: `"main . sidebar"`.
3. **Другой контент в `MainContent`.** Заголовки, абзацы и список передаются
   из `App.jsx` через `children`; сам компонент не менялся.
4. **Адаптив.** В DevTools (Toggle Device Toolbar) при ширине до 768 px
   макет перестраивается в одну колонку.

Также использовано: CSS-переменные в `:root`, `:hover` и `:active` для пунктов
сайдбара, условный вывод приветствия `{userName && ...}`, оформление `<code>`.

Отчёт с листингами и результатами — [`../reports/lab02.md`](../reports/lab02.md).
