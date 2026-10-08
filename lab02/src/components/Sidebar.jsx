function Sidebar({ items }) {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {/* key нужен React, чтобы отличать элементы списка друг от друга;
              пункты меню уникальны, поэтому ключом служит сам текст */}
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
