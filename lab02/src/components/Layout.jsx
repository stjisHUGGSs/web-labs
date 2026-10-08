// Обёртка-сетка: ничего не знает о содержимом,
// просто рендерит детей внутри grid-контейнера .layout.
function Layout({ siteTitle, children }) {
  return (
    <div className="layout" aria-label={`Макет сайта: ${siteTitle}`}>
      {children}
    </div>
  )
}

export default Layout
