import Head    from 'next/head';
import Link    from 'next/link';
import Image   from 'next/image';
import Layout  from '/components/layout.jsx';
import common  from '/styles/common.module.css'
import Message from '/libs/ui/message.ts'
import Button  from '/libs/ui/button.ts'
import Session from '/libs/utils/session.ts'
import Sign    from '/libs/xumm/sign.ts'
import {imageUrl} from '/libs/utils/string.ts'
import {apiGet, apiPost} from '/libs/data/apicall.ts'
import {getArtworkById}  from '/libs/data/registry.ts';

async function reset(txt, warn, btn, off, err) {
  Message(txt,warn); 
  Button(btn||'BUY NFT',off);
  if(err){ console.log('ERROR:', err) }
}

async function sendPayment(amount, account, userToken) {
  let tx = {
    user_token: userToken,
    txjson: {
      TransactionType: "Payment",
      Destination: account,
      Amount: (amount * 1000000).toString()
    }
  }
  let signed = await Sign(tx, userToken)
  console.log('SIGNED', signed)
  return signed
}

async function acceptOffer(offerId, account, userToken) {
  let tx = {
    user_token: userToken,
    txjson: {
      TransactionType:  'NFTokenAcceptOffer',
      Account:          account,
      NFTokenSellOffer: offerId,
    }
  }
  let signed = await Sign(tx, userToken)
  console.log('SIGNED', signed)
  return signed
}

async function onBuy(nft, session){
  let timer = new Date().getTime()
  let info = null
  console.log('NFT:', nft)
  console.log('ID:', nft.id)
  console.log('Timer:', timer)

  // CHECK NFT author and buyer not the same
  console.log('Author/Session:', nft.authorId, session.userid)
  if(nft.authorId == session.userid){
    Message('Author can not buy own token')
    return
  }

  // Send payment to the user and verify signature
  //console.log('PAYMENT', nft.price, nft.beneficiary.wallet)
  //info = await sendPayment(nft.price, nft.beneficiary.wallet, session.usertoken)
  //console.log('SIGNED', info)
  //if(!info.success){ return reset('Error recieving payment',1,0,1,info?.error) }

  // Create NFT
  console.log('Timer:', new Date().getTime()-timer)
  Message('Minting NFT, wait a moment...')
  let data = {metadata:nft.metadata, taxon:nft.collection.taxon, beneficiary:nft.beneficiary.wallet, royalties:nft.royalties}
  console.log('NEW NFT:', data)
  info = await apiPost('/api/nft/new', data)
  console.log('RESP:', info)
  if(!info.success){ return reset('Error minting NFT',1,0,1,info?.error) }
  nft.tokenId = info.tokenId


  // Create sell offer
  console.log('Timer:', new Date().getTime()-timer)
  Message('Creating Sell Offer, wait a moment...')
  let offer = {
    created:       new Date(),
    type:          0,
    sellerId:      nft.authorId,
    collectionId:  nft.collectionId,
    artworkId:     nft.id,
    tokenId:       nft.tokenId,
    price:         nft.price,
    royalties:     nft.royalties,
    beneficiaryId: nft.beneficiaryId,
    wallet:        '',
    offerId:       null, // set on server
    status:        0     // 0.created 1.accepted 2.declined
  }
  console.log('OFFER:', offer)
  info = await apiPost('/api/nft/offer', offer)
  console.log('RESP:', info)
  if(!info.success){ return reset('Error saving offer',1,0,1,info?.error) }
  let recId   = info.id
  let offerId = info.offerId

  // Send offer to client for signing
  console.log('Timer:', new Date().getTime()-timer)
  Message('NFT created, check your XUMM wallet and accept the offer!')
  console.log('SIGN OFFER:', offerId, session.account)
  let accept = await acceptOffer(offerId, session.account, session.usertoken)
  console.log('OFFER RESP:', accept)
  if(!accept.success){ return reset('Error accepting offer',1,0,1,accept?.error) }

  // Save offer as accepted
  info = await apiPost('/api/nft/accept',{id:recId, status:1})
  console.log('ACCEPT:', info)

  // Increment copies sold in artwork
  // TODO:

  //Message(`Offer accepted for NFT - <a href="/nft/${nft.id}">VIEW</a>`)
  Message('Offer accepted, NFT transferred')
  Button('DONE',1)
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
  let {session, item}  = props
  let imgurl  = imageUrl(item.image)
  let created = new Date(item.created).toLocaleString()
  let author  = item.author?.name || 'Anonymous'
  let authorLink = '/profile/'+item.author?.name
  let tokenLink = 'https://nft-devnet.xrpl.org/nft/'+item.tokenId
  let collection = item.collection?.name || 'Single edition'
  let collectionLink = '/collections/'+item.collectionId
  let beneficiary = item.beneficiary?.name || 'United Nations'
  let available = item.copies - item.sold
  if(item.copies==0){ available = 1 } // unlimited
  return (
    <Layout props={props}>
      <section className={common.main}>
        <h1 className={common.mainTitle}>NFT</h1>
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
              <label className={common.formValue}>{item.copies||`Unlimited`}</label>
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>Tags</label>
              <label className={common.formValue}>{item.tags||`--`}</label>
            </li>
          </div>
          {available?
          <>
            <button id="action-button" className={common.actionButton} onClick={()=>onBuy(item, session)}>BUY NFT</button>
            <div id="message" className={common.message}>One wallet confirmation will be needed</div>
          </>
          :
          <>
            <button id="action-button" disabled="disabled" className={common.actionButton}>SOLD OUT</button>
            <div id="message" className={common.message}>No more copies available</div>
          </>
          }
        </div>
      </section>
    </Layout>
  )
}
