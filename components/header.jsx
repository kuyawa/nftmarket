import Head   from 'next/head'
import Link   from 'next/link'
import Image  from 'next/image'
import common from '/styles/common.module.css'
import styles from '/styles/header.module.css'
import {changeTheme} from './utils.jsx'


export default function Header({children, props}) {
  let userName = props?.session?.username || props?.session?.account?.substr(0,10) || 'Anonymous'
  let actionLabel = props?.session?.account ? userName.toUpperCase() : 'LOGIN'
  let actionLink  = props?.session?.account ? '/profile' : '/login'
  return (
    <>
      <Head>
        <title>EnlightenMint</title>
        <meta name="application-name" content="EnlightenMint" />
        <meta name="description" content="NFT Marketplace for Ripple Network" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=1, shrink-to-fit=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#202428" />
        {/*
        <link rel="icon" href="/favicons/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicons/favicon076.png" sizes="76x76" />
        <link rel="apple-touch-icon" href="/favicons/favicon120.png" sizes="120x120" />
        <link rel="apple-touch-icon" href="/favicons/favicon152.png" sizes="152x152" />
        <link rel="apple-touch-icon" href="/favicons/favicon180.png" sizes="180x180" />
        <link rel="shortcut icon"    href="/favicons/favicon180.png" sizes="180x180" />
        */}
      </Head>
      <header className={styles.header}>
        <div id="topbar" className={styles.topBar}>
            <div id="main-logo" className={styles.flexH, styles.mainLogo}><Link href="/" className={styles.mainHome}><Image className={styles.logo} src="/media/images/logo-dark.svg" width={360} height={36} alt="logo"/></Link></div>
            <div id="main-menu" className={styles.flexH, styles.mainMenu}>
                <Link className={styles.menuLink} href="/mint">MINT</Link>
                <Link className={styles.menuLink} href="/market">MARKET</Link>
                <Link className={styles.menuLink} href={actionLink} id="connect">{actionLabel}</Link>
                <Link className={styles.menuLink} href="#" onClick={changeTheme}><Image className={styles.iconTheme} src="/media/images/icon-theme-dark.png" width={28} height={28} alt="theme"/></Link>
            </div>
        </div>
      </header>
    </>
  )
}
