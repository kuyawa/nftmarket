import Link    from 'next/link';
import Image   from 'next/image';
import Layout  from '/components/layout.jsx';
import common  from '/styles/common.module.css';
import style   from '/styles/market.module.css';
import Session from '/libs/utils/session.ts'
import {imageUrl} from '/libs/utils/string.ts'
import {getArtworksCommunity} from '/libs/data/registry.ts';

export async function getServerSideProps({req,res,query}){
  let session = Session(req)
  let resp = await getArtworksCommunity()
  let list = resp.data
  console.log('LIST:', list)
  let props = {session, list}
  return {props}
}

export default function Market(props) {
  let {session, list} = props
  return (
    <Layout props={props}>
      <section className={style.market}>
        {/* ARTWORKS */}
        <div className={style.listBox}>
          <h1 className={common.mainTitle}>COMMUNITY MINTED NFTS</h1>
          <div className={common.listItems}>
          {list.length==0?<h3 className={common.secondary}>No NFTs for sale</h3>:''}
          {list.map(item => {
            let imgurl = imageUrl(item.image)
            let beneficiary = item.beneficiary?.name || 'United Nations'
            return (
            <Link href={`/nft/${item.id}`}>
            <div className={common.item} key={item.id}>
              <Image className={common.itemImage} src={imgurl} width={250} height={250}  />
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
