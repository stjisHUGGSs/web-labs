function Header({ title, userName }) {
  return (
    <header className="header">
      <h1>{title}</h1>
      {/* Приветствие показываем, только если userName передан */}
      {userName && <span className="user-badge">Привет, {userName}</span>}
    </header>
  )
}

export default Header
