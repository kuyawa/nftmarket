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
  //console.log('LIST:', list)
  let props = {session, list}
  return {props}
}

export default function Market(props) {
  let {session, list} = props
  let iconTag  = '/media/images/icon-tag.svg'
  let iconGive = '/media/images/icon-give.svg'
  let iconTime = '/media/images/icon-time.svg'
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
            </div>
            )
            })}
          </div>
        </div>
      </section>
    </Layout>
  )
}
