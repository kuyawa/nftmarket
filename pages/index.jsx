import Head    from 'next/head'
import Link    from 'next/link'
import Image   from 'next/image'
import Layout  from '/components/layout.jsx'
import style   from '/styles/index.module.css'
import common  from '/styles/common.module.css'
import Session from '/libs/utils/session.ts'
import {imageUrl} from '/libs/utils/string.ts'
import {getArtworks} from '/libs/data/registry.ts';

export async function getServerSideProps({req,res,query}){
  let session = Session(req)
  let resp = await getArtworks(0,20)
  let list = resp.data
  //console.log('LIST:', list)
  let props = {session, list}
  return {props}
}

export default function Home(props) {
  let {session, list} = props
  let hero = '/media/images/hero.jpg'
  let iconTag  = '/media/images/icon-tag.svg'
  let iconGive = '/media/images/icon-give.svg'
  let iconTime = '/media/images/icon-time.svg'
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
      <section className={style.latest}>
        {/* ARTWORKS */}
        <div className={style.listBox}>
          <h1 className={common.mainTitle}>LATEST NFTS</h1>
          <div className={style.latestItems}>
          {list.length==0?<h3 className={common.secondary}>No NFTs</h3>:''}
          {list.map(item => {
            let imgurl = imageUrl(item.image)
            let beneficiary = item.beneficiary?.name || 'United Nations'
            let rarity = `${(item.copies||1000)-item.sold}/${item.copies||1000}`
            return (
            <div className={style.item} key={item.id}>
              <div className={common.itemTop}>
                <Link href={`/nft/${item.id}`}>
                  <Image className={common.itemImage} src={imgurl} width={250} height={250} alt={item.name} />
                  <div className={common.itemIntro}>
                    <label className={common.itemName}>{item.name}</label>
                    <label className={common.itemAuthor}>by {item.author.name}</label>
                  </div>
                </Link>
              </div>
              <div className={common.itemInfo}>
                <li className={common.itemLine}><Image className={common.itemIcon} src={iconTag}  width={20} height={20} alt="icon tag"  /><label className={common.itemPrice}>{item.price} XRP</label></li>
                <li className={common.itemLine}><Image className={common.itemIcon} src={iconGive} width={20} height={20} alt="icon give" /><label className={common.itemFees} >{item.royalties}% Benefit <br /><small className={common.itemSmall}>to {beneficiary}</small></label></li>
                <li className={common.itemLine}><Image className={common.itemIcon} src={iconTime} width={20} height={20} alt="icon time" /><label className={common.itemRare} >Limited run!<br /><small className={common.itemSmall}>{rarity}</small></label></li>
              </div>
            </div>
            )
            })}
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
