import styles from './Nav.module.css'

// Навигация вынесена из Header в отдельный компонент (задание для самопроверки №3)
function Nav() {
  return (
    <nav className={styles.nav}>
      <a href="#" className={styles.link}>Главная</a>
      <a href="#" className={styles.link}>Статьи</a>
      <a href="#" className={styles.link}>О нас</a>
    </nav>
  )
}

export default Nav
