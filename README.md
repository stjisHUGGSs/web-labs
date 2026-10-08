# Разработка web-приложений — лабораторные работы

Ковалёв М. А., группа ИСТ-251, ОмГТУ, ФИТиКС.
Направление 09.03.02 «Информационные системы и технологии».

Стек: React + Vite, JavaScript. В каждой папке `labNN/` — отдельный Vite-проект
со своим `README.md` (запуск и структура); отчёты — в [`reports/`](reports).

| № | Тема | Отчёт |
|---|---|---|
| 1 | React + Vite, компоненты, CSS-модули, список карточек | [lab01](reports/lab01.md) |
| 2 | React + CSS Grid, `props` и `children` | [lab02](reports/lab02.md) |
| 3 | Форма обратной связи: `useState`, валидация, состояния полей | [lab03](reports/lab03.md) |
| 4 | Калькулятор скидок: события, расчёт скидки и НДС | [lab04](reports/lab04.md) |
| 5 | Каталог товаров: `fetch`, `useEffect`, `AbortController`, фильтры | [lab05](reports/lab05.md) |

## Запуск

```
cd labNN
npm install
npm run dev
```

Откроется http://127.0.0.1:5173/. Проверка: `npm run build` и `npm run lint`.

Папки `node_modules/` и `dist/` в репозиторий не входят (`.gitignore`).
