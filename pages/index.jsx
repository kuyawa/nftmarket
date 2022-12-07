import Head    from 'next/head'
import Link    from 'next/link'
import Image   from 'next/image'
import Layout  from '/components/layout.jsx'
import styles  from '/styles/index.module.css'
import Session from '/libs/utils/session.ts'

export async function getServerSideProps({req,res,query}){
  let session = Session(req)
  let props = {session}
  return {props}
}

export default function Home(props) {
  let rnd = parseInt(Math.random()*3)+1
  let hero = `/media/images/hero-0${rnd}.jpg`
  return (
    <Layout props={props}>
      <section className={styles.center}>
        <h1 className={styles.mainTitle}>CHARITABLE NFT MARKETPLACE</h1>
        <h1 className={styles.mainSubtitle}>EXCLUSIVELY FOR XRPL LEDGER</h1>
        <div className={styles.hero}>
          <div className={styles.slideshow}>
            <div className={styles.slideImages}><Image src={hero} className={styles.heroImage} width={1200} height={1000} /></div>
            <div className={styles.slideShadow}></div>
          </div>
        </div>
        <div className={styles.callToAction}>
          <div><Link href="/curated"><h1 className={styles.curated}>CURATED NFT COLLECTIONS</h1></Link></div>
          <div><Link href="/community"><h1 className={styles.community}>COMMUNITY MINTED NFTS</h1></Link></div>
          <h1>REGISTER FOR FREE TO START MINTING NFTS TODAY</h1>
          <Link href="/login" id="register" className={styles.register}>REGISTER</Link>
          <p>You will need XUMM wallet and some XRP funds to mint and trade</p>
        </div>
      </section>
    </Layout>
  )
}
