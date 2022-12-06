import Link   from 'next/link'
import common from '/styles/common.module.css'
import styles from '/styles/footer.module.css'
import * as utils from './utils.jsx'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footMain+' '+common.wrap}>
        <div className={styles.rights}>&copy; 2022 EnlightenMint</div>
        <div className={styles.links}>
          <Link href="/faq">FAQ</Link>
          <small className={styles.bull}>&bull;</small>
          <Link href="/terms">Terms of Service</Link>
          <small className={styles.bull}>&bull;</small>
          <Link href="/privacy">Privacy Policy</Link>
          <small className={styles.bull}>&bull;</small>
          <Link id="text-theme" href="#" onClick={utils.changeTheme}>Light Mode</Link>
        </div>
      </div>
    </footer>
  )
}