import Link     from 'next/link'
import Image    from 'next/image'
import Layout   from '/components/layout.jsx'
import common   from '/styles/common.module.css'
import Message  from '/libs/ui/message.ts'
import Button   from '/libs/ui/button.ts'
import Session  from '/libs/utils/session.ts'
import Random   from '/libs/utils/random.ts'
import Utils    from '/libs/utils/string.ts'
import {XummSdkJwt} from 'xumm-sdk'
import { getUserById, getArtworkById } from '/libs/data/registry.ts';


async function onUpdate(session){
  //Message('Updating, wait a moment...')
  Message('Not ready...')
}


export async function getServerSideProps({req,res,query}){
  console.log('NFT EDIT PROPS')
  let session = Session(req)
  // Get user
  let resp = await getUserById(session.userid, true)
  if(!resp.success || resp.error){
    return {
      redirect: {destination: '/login', permanent: false}
    }
  }
  let user = resp.data
  // Get artwork
  let id = query.id
  console.log('ArtID', id)
  let art = await getArtworkById(id)
  if(!art.success){
    return {
      redirect: {destination: '/notfound', permanent: false}
    }
  }
  let item = art.data
  //console.log('ARTWORK', item)
  let props = {session, user, item}
  return {props}
}

// PAGE /nft/edit/:id
export default function editNFT(props) {
  //let [session] = useState(props.session)
  let {session, user, item} = props
  let {collections} = user
  let imgurl  = Utils.imageUrl(item.image)
  let created = new Date(item.created).toLocaleString()
  let author  = item.author?.name || 'Anonymous'
  let authorLink = '/profile/'+item.author?.name
  let tokenLink = 'https://nft-devnet.xrpl.org/nft/'+item.tokenId
  let collection = item.collection?.name || 'Single edition'
  let collectionLink = '/collections/'+item.collectionId
  let beneficiary = item.beneficiary?.name || 'United Nations'
  console.log('NFT EDIT')
  return (
    <Layout props={props}>
      <section className={common.main}>
        <h1 className={common.mainTitle}>EDIT NFT</h1>
        <div className={common.formBox}>
          <div className={common.artwork}>
            <Image id="artwork-image" className={common.formPic} src={imgurl} width={500} height={500} alt={item.name} />
          </div>
          <div className={common.formInfo}>
            <li className={common.formList}>
              <label className={common.formLabel}>TokenID</label>
              <label className={common.formValue}><small className={common.extraSmall}><Link href={tokenLink} target="_blank">{item.tokenId}</Link></small></label>
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>Author</label>
              <label className={common.formValue}><Link href={authorLink}>{author}</Link></label>
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>Created</label>
              <label className={common.formValue}>{created}</label>
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>Collection</label>
              <label className={common.formValue}><Link href={collectionLink}>{collection}</Link></label>
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
          <button id="action-button" className={common.actionButton} onClick={()=>onUpdate(item.id, session)}>UPDATE</button>
          <div id="message" className={common.message}>One wallet confirmation will be needed</div>
        </div>
      </section>
    </Layout>
  )
}
