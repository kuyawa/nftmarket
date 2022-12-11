import Link       from 'next/link'
import Image      from 'next/image'
import Layout     from '/components/layout.jsx'
import common     from '/styles/common.module.css'
import Session    from '/libs/utils/session.ts'
import {imageUrl} from '/libs/utils/string.ts'
import {getCollectionById, getArtworksByCollection} from '/libs/data/registry.ts';


function $(id){ return document.getElementById(id) }

export async function getServerSideProps({req,res,query}){
  let session = Session(req)
  let resp = await getCollectionById(query.id)
  if(!resp.success || resp.error){
    return {
      redirect: {destination: '/notfound', permanent: false}
    }
  }
  let collection = resp.data
  //console.log('Collection:', collection)
  let nfts = await getArtworksByCollection(collection.id)
  //console.log('Artworks:', nfts)
  let list = []
  if(nfts.success){ list = nfts.data }
  let props = {session, collection, list}
  return {props}
}

export default function viewCollection(props) {
  //console.log('COLLECTION VIEW')
  let {session, collection, list} = props
  let imgurl = imageUrl(collection.image)
  let iconTag  = '/media/images/icon-tag.svg'
  let iconGive = '/media/images/icon-give.svg'
  let iconTime = '/media/images/icon-time.svg'
  return (
    <Layout props={props}>
      <section className={common.main}>
        <h1 className={common.mainTitle}>COLLECTION</h1>
        <div className={common.formBox}>
          <div className={common.artwork}>
            <img id="artwork-image" className={common.formPic} src={imgurl} width={500} height={500} />
          </div>
          <div className={common.formInfo}>
            <li className={common.formList}>
              <label className={common.formLabel}>Name</label>
              <label className={common.formValue}>{collection.name}</label>
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>Description</label>
              <label className={common.formValue}>{collection.description}</label>
            </li>
          </div>
        </div>
        {/* ARTWORKS */}
        <div className={common.listBox}>
          <h1 className={common.mainTitle}>NFTS</h1>
          <div className={common.listItems}>
          {list.length==0?<h3 className={common.secondary}>No artworks</h3>:''}
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

