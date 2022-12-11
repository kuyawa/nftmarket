import Head    from 'next/head'
import Link    from 'next/link'
import Image   from 'next/image'
import Layout  from '/components/layout.jsx'
import style   from '/styles/index.module.css'
import Session from '/libs/utils/session.ts'

export async function getServerSideProps({req,res,query}){
  let session = Session(req)
  let props = {session}
  return {props}
}

export default function Home(props) {
  //let rnd = parseInt(Math.random()*3)+1
  //let hero = `/media/images/hero-0${rnd}.jpg`
  let hero = '/media/images/hero.jpg'
  return (
    <Layout props={props}>
      <section className={style.index}>
      <div className={style.wrap}>
        <h1 className={style.mainTitle}>CHARITABLE NFT MARKETPLACE</h1>
        <h2 className={style.mainSubtitle}>EXCLUSIVELY FOR XRPL LEDGER</h2>
        <h3 className={style.mainInfo}>ALL NFT SALES BENEFIT NON-PROFIT ORGANIZATIONS</h3>
        <div className={style.hero}>
          <div className={style.slideshow}>
            <div className={style.actions}>
              <h1 className={style.curated}><Link className={style.mainLink} href="/curated">CURATED NFT COLLECTIONS</Link></h1>
              <h1 className={style.community}><Link className={style.mainLink} href="/community">COMMUNITY MINTED NFTS</Link></h1>
            </div>
          </div>
        </div>
      </div>
      </section>
      <section className={style.middle}>
        <div className={style.callToAction}>
          <h1 className={style.actionHead}>Are you an artist? Want to save the world?</h1>
          <h3 className={style.actionInfo}>Get exposure while benefitting your favorite cause!</h3>
          <Link href="/login" id="register" className={style.register}>MINT NOW</Link>
          <p>You will need XUMM wallet and some XRP funds to mint and trade</p>
        </div>
      </section>
    </Layout>
  )
}
