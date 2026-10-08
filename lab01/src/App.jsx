import Header from './components/Header/Header'
import ArticleList from './components/ArticleList/ArticleList'
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <h2 className={styles.heading}>Последние статьи</h2>
        <ArticleList />
      </main>
    </div>
  )
}

export default App
