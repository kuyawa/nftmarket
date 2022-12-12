import Head    from 'next/head'
import Link    from 'next/link'
import Image   from 'next/image'
import Layout  from '/components/layout.jsx'
import common  from '/styles/common.module.css'
import styles  from '/styles/curated.module.css'
import Session from '/libs/utils/session.ts'
import {imageUrl} from '/libs/utils/string.ts'
import {getArtworksCurated} from '/libs/data/registry.ts'

export async function getServerSideProps({req,res,query}){
  let session = Session(req)
  let result = await getArtworksCurated()
  let list = []
  if(result.success){
    list = result.data
  }
  let props = {session, list}
  return {props}
}

export default function Curated(props) {
  let {session, list} = props
  let iconTag  = '/media/images/icon-tag.svg'
  let iconGive = '/media/images/icon-give.svg'
  let iconTime = '/media/images/icon-time.svg'
  return (
    <Layout props={props}>
      <section className={styles.main}>
        <h1 className={common.mainTitle}>CURATED NFT COLLECTIONS</h1>
        <div className={styles.sustainable}>
          <div className={styles.cat01}>
            <Image className={styles.catImage} src="/media/categories/sdg.png" width={600} height={100} />
          </div>
          <h1>SELECT A GOAL</h1>
          {/* ARTWORKS */}
          <div className={common.listItems}>
          {list.length==0?<h3 className={common.secondary}>No NFTs for sale</h3>:''}
          {list.map(item => {
            let imgurl = imageUrl(item.image)
            let beneficiary = item.beneficiary?.name || 'United Nations'
            let rarity = `${(item.copies||1000)-item.sold}/${item.copies||1000}`
            return (
            <div className={common.item} key={item.id}>
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
              {/*<Link href={`/nft/${item.id}`} className={common.itemButton} data-id={item.id}>VIEW</Link>*/}
            </div>
            )
            })}
          </div>
        </div>
      </section>
    </Layout>
  )
}
