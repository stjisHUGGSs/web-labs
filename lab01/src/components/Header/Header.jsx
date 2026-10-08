import styles from './Header.module.css'
import Nav from '../Nav/Nav'
import articles from '../../data/articles'

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h1 className={styles.logo}>React Blog</h1>
          <p className={styles.tagline}>
            Домашняя страничка начинающего веб-мастера
          </p>
        </div>
        {/* Количество статей берём прямо из данных */}
        <span className={styles.counter}>Статей: {articles.length}</span>
      </div>
      <Nav />
    </header>
  )
}

export default Header
