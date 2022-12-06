import Script from 'next/script'
import Header from './header.jsx'
import Footer from './footer.jsx'
import styles from '/styles/layout.module.css'


export default function Layout({ children, props }) {
  //console.log('Layout props', props)
  return (
    <div id="app" className={styles.app}>
      <Header props={props}/>
      <main>{children}</main>
      <Footer />
      <Script src="/scripts/common.js" />
    </div>
  )
}