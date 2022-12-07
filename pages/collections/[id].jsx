import Link     from 'next/link'
import Image    from 'next/image'
import Layout   from '/components/layout.jsx'
import common   from '/styles/common.module.css'
import Session  from '/libs/utils/session.ts'
import Utils    from '/libs/utils/string.ts'
import { getCollectionById } from '/libs/data/registry.ts';


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
  console.log('Collection:', collection)
  let props = {session, collection}
  return {props}
}

export default function viewCollection(props) {
  console.log('COLLECTION VIEW')
  let {session, collection} = props
  let {artworks} = collection
  if(!artworks){ artworks = [] }
  let imgurl = Utils.imageUrl(collection.image)
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
          <h1 className={common.titleTask}>NFTS</h1>
          <div className={common.listItems}>
            {artworks.length==0?<h3 className={common.secondary}>No artworks</h3>:''}
            {artworks.map(item => {
              let imgurl = Utils.imageUrl(item.image)
              let beneficiary = item.beneficiary?.name || 'United Nations'
              return (
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
                )
              })}
          </div>
        </div>
      </section>
    </Layout>
  )
}

