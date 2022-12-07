import Head    from 'next/head';
import Link    from 'next/link';
import Image   from 'next/image';
import Layout  from '/components/layout.jsx';
import common  from '/styles/common.module.css'
import Session from '/libs/utils/session.ts'
import Utils   from '/libs/utils/string.ts'
import { getArtworkById } from '/libs/data/registry.ts';

function onBuy(nftId, session){
  //let nftId = evt.target.dataset.token
  console.log('NFTID:', nftId)
  // TODO: buy token
  document.getElementById('message').innerHTML = 'NOT READY YET'
  alert('Buy NFT Id: '+nftId+'\nNot ready yet')
}

export async function getServerSideProps({req,res,query}){
  let session = Session(req)
  let id = query.id
  console.log('ArtID', id)
  let resp = await getArtworkById(id)
  if(!resp.success){
    return {
      redirect: {destination: '/notfound', permanent: false}
    }
  }
  let item = resp.data
  //console.log('ARTWORK', item)
  let props = {session, item}
  return {props}
}

export default function ViewNFT(props) {
  let {item} = props
  let imgurl = Utils.imageUrl(item.image)
  let author = item.author?.name || 'Anonymous'
  let collection = item.collection?.name || 'Single edition'
  let beneficiary = item.beneficiary?.name || 'United Nations'
  return (
    <Layout props={props}>
      <section className={common.main}>
        <h1 className={common.mainTitle}>NFT</h1>
        <div className={common.formBox}>
          <div className={common.artwork}>
            <Image id="artwork-image" className={common.formPic} src={imgurl} width={500} height={500} />
          </div>
          <div className={common.formInfo}>
            <li className={common.formList}>
              <label className={common.formLabel}>Collection</label>
              <label className={common.formValue}>{collection}</label>
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>NFT Name</label>
              <label className={common.formValue}>{item.name}</label>
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>Description</label>
              <label className={common.formValue}>{item.description}</label>
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>Price</label>
              <label className={common.formValue}>{item.price} XRP</label>
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>Royalties</label>
              <label className={common.formValue}>{item.royalties} %</label>
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>Beneficiary <small className={common.formSmall}>(Organization that will receive the royalties)</small></label>
              <label className={common.formValue}>{beneficiary}</label>
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>Copies</label>
              <label className={common.formValue}>{item.copies}</label>
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>Tags</label>
              <label className={common.formValue}>{item.tags}</label>
            </li>
          </div>
          <button id="action-button" className={common.actionButton} onClick={()=>onBuy(props.item.id, props.session)}>BUY NFT</button>
          <div id="message" className={common.message}>One wallet confirmation will be needed</div>
        </div>
      </section>
    </Layout>
  )
}
