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
  return (
    <Layout props={props}>
      <section className={styles.main}>
        <h1 className={common.mainTitle}>CURATED NFT COLLECTIONS</h1>
        <div className={styles.sustainable}>
          <div className={styles.cat01}>
            <img src="/media/categories/sdg.png" width="600px" />
          </div>
          <h1>SELECT A GOAL</h1>
          {/* ARTWORKS */}
          <div className={common.listItems}>
          {list.length==0?<h3 className={common.secondary}>No NFTs for sale</h3>:''}
          {list.map(item => {
            let imgurl = imageUrl(item.image)
            let beneficiary = item.beneficiary?.name || 'United Nations'
            return (
            <Link href={`/nft/${item.id}`}>
            <div className={common.item} key={item.id}>
              <Image className={common.itemImage} src={imgurl} width={250} height={250} alt={item.name} />
              <div className={common.itemInfo}>
              <label className={common.itemName}>{item.name}</label>
              <label className={common.itemAuthor}>Author: {item.author.name}</label>
              <label className={common.itemPrice}>Price: {item.price} XRP</label>
              <label className={common.itemFees}>{item.royalties}% will go to {beneficiary}</label>
              </div>
              <Link href={`/nft/${item.id}`} className={common.itemButton} data-id={item.id}>VIEW</Link>
            </div>
            </Link>
            )
            })}
          </div>
        </div>
      </section>
    </Layout>
  )
}
