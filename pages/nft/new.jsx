import Link      from 'next/link'
import Image     from 'next/image'
import Layout    from '/components/layout.jsx'
import common    from '/styles/common.module.css'
import Message   from '/libs/ui/message.ts'
import Button    from '/libs/ui/button.ts'
import Session   from '/libs/utils/session.ts'
import Utils     from '/libs/utils/string.ts'
import Replicate from '/libs/uploaders/replicate.ts'
import {XummSdkJwt} from 'xumm-sdk'
import { getUserById, getOrganizations } from '/libs/data/registry.ts';


function $(id){ return document.getElementById(id) }

function onImageError(evt){
  console.log('Image error', evt)
  evt.target.src='/media/images/nftnew.jpg'
}

function onImagePreview(evt){
  console.log('Preview', evt)
  let file = evt.target.files[0]
  let reader = new FileReader()
  reader.onload = function(e)  {
      $('artwork-image').src = e.target.result
  }
  reader.readAsDataURL(file)
}

async function createNFT(data){
  Message('Creating NFT, wait a moment...')
  try {
    let resp = await fetch('/api/nft/new', {
      method: 'POST', 
      headers: {'content-type':'application/json'}, 
      body: JSON.stringify(data)
    })
    let info = await resp.json();
    console.log('NFT Resp', info)
    if(info.success) {
      console.log('NFT Mint success!')
    } else {
      console.error('NFT Mint failed!')
      console.error(info.error)
    }
    return info
  } catch(ex) {
    console.error(ex)
    return {success:false, error:ex.message}
  }
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
    console.log('TX', tx)
    try {
        let xumm = new XummSdkJwt(userToken)
        //xumm = await authorize()
        if(!xumm){ Message('You must login with XUMM wallet first',1); return; }
        let {created, resolved} = await xumm.payload.createAndSubscribe(tx, function (payloadEvent) {
            if(typeof payloadEvent.data.signed !== 'undefined') {
                console.log('EVENT>', payloadEvent)
                console.log('DATA>', payloadEvent.data)
                return payloadEvent.data  // Resolved value of the `resolved` property
            }
            console.log('DATA?', payloadEvent.data) // check progress
        })
        //console.log('C', created)
        //console.log('R', resolved)
        let payloadId = created?.uuid
        console.log('PAYLOADID', payloadId)
        if(payloadId){ 
            let outcome = await resolved
            console.log('OUTCOME', outcome)
            console.log('SIGNED', outcome.signed)
            if(outcome.signed){
                console.log('TXID', outcome.txid)
                Message('Offer accepted, NFT transfered to your wallet')
                return {success:true, payloadId:payloadId, transactionId:outcome.txid}
            } else {
                Message('User declined signature')
                return {success:false, error:'User declined signature'}
            }
        }
        else { return {success:false, error:'Error accepting NFT'} }
    } catch(ex) {
        console.error('>ERROR:', ex)
        return {success:false, error:ex.message}
    }
}

async function onMint(session){
  Message('Minting, wait a moment...')
  //console.log('SESSION', session)
  // Validate image, name, description, price, royalties
  if(!session.account){ Message('Login with your XUMM wallet first',1); return; }
  if(!$('name').value){ Message('NFT name is required',1); return; }
  if(!$('desc').value){ Message('NFT description is required',1); return; }
  if(!$('price').value){ Message('Price in XRP is required',1); return; }
  let file = $('artwork-file').files[0]
  if(!file){ Message('Image is required, select a jpg or png max 2000x2000',1); return; }
  let ext = null
  switch(file.type){
    case 'image/jpg':
    case 'image/jpeg': ext = '.jpg'; break
    case 'image/png':  ext = '.png'; break
    //case 'text/plain': ext = '.txt'; break
  }
  if(!ext){ Message('Only JPG and PNG images are allowed'); return; }
  Button('WAIT',1)

  // Upload image to server
  // Server uploads to aws and ipfs
  Message('Uploading artwork, wait a moment...')
  let info = await Replicate(file, ext) // upload to AWS and IPFS
  if(!info.success){ Message('Error uploading image',1); return }
  //if(inf.error) { Message(inf.error,1); Button('ERROR'); return; }
  console.log('INFO', info)

  let nft = {
    created:       new Date(),
    authorId:      session.userid,
    collectionId:  $('collection').value,
    name:          $('name').value,
    description:   $('desc').value,
    media:         'image',
    image:         info.image, // aws
    artwork:       info.uri,   // ipfs
    metadata:      '', // fill on server
    tokenId:       '', // fill on server
    royalties:     parseInt($('royalties').value||50),
    beneficiaryId: $('beneficiary').value,
    forsale:       true,
    copies:        parseInt($('copies').value||0),
    sold:          0,
    price:         parseInt($('price').value||1),
    tags:          $('tags').value||'',
    likes:         0,
    views:         0,
    category:      '',
    inactive:      false
  }

  // Upload NFT to server
  console.log('NEW NFT:', nft)
  let resp = await createNFT(nft)
  if(!resp.success){ 
    Message('Error minting NFT',1); 
    Button('MINT NFT');
    console.log('ERROR:', resp.error)
    return
  }
  Message('NFT created, check your XUMM wallet and accept the offer!')

  // Send offer to client for signing
  console.log('SIGN OFFER:', resp.offerId, session.account)
  let offer = await acceptOffer(resp.offerId, session.account, session.usertoken)
  console.log('OFFER RESP:', offer)
  if(!offer.success){
    Message('Error accepting offer',1);
    Button('MINT NFT');
    console.log('ERROR:', offer.error)
    return
  }
  Message(`Offer accepted, NFT minted - <a href="/nft/${offer.artworkId}">VIEW</a>`)
  Button('DONE',1)
}


export async function getServerSideProps({req,res,query}){
  console.log('NFT NEW PROPS')
  let session = Session(req)
  let resp = await getUserById(session.userid, true)
  if(!resp.success || resp.error){
    return {
      redirect: {destination: '/login', permanent: false}
    }
  }
  let user = resp.data
  console.log('USER', user)
  let result = await getOrganizations()
  let organizations = result.data
  let props = {session, user, organizations}
  return {props}
}

// PAGE /nft/new
export default function newNFT(props) {
  //let [session] = useState(props.session)
  let {session, user, organizations} = props
  let {collections} = user
  if(!collections || collections.length==0){
    collections = {
      id: process.env.NEXT_PUBLIC_COLLECTION,
      name:'Public Collection'
    }
  }
  console.log('NFT NEW')
  return (
    <Layout props={props}>
      <section className={common.main}>
        <h1 className={common.mainTitle}>MINT NFT</h1>
        <div className={common.formBox}>
          <div className={common.artwork}>
            <img id="artwork-image" className={common.formPic} src="/media/images/nftnew.jpg" width={500} height={500} onError={onImageError} />
            <input type="file" name="artwork-file" id="artwork-file" className={common.formFile} onChange={onImagePreview} />
          </div>
          <div className={common.formInfo}>
            <li className={common.formList}>
              <label className={common.formLabel}>Collection</label>
              <select id="collection" className={common.formSelect}>
                {collections.map(item => (
                <option value={item.id} key={item.id}>{item.name}</option>
                ))}
              </select>
              <Link className={common.linkTask} href="/collections/new">NEW</Link>
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>NFT Name</label>
              <input className={common.formWider} type="text" id="name"  placeholder="NFT name" />
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>Description</label>
              <input className={common.formWider} type="text" id="desc"  placeholder="Description" />
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>Price</label>
              <input className={common.formInput} type="text" id="price" placeholder="Sale Price" /> XRP
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>Royalties</label>
              <input className={common.formInput} type="number" id="royalties" placeholder="Percentage" min="10" max="50" step="5" /> %
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>Beneficiary <small className={common.formSmall}>(Organization that will receive the royalties)</small></label>
              <select id="beneficiary" className={common.formSelect}>
                {organizations.map(item => (
                  <option value={item.id} key={item.id}>{item.name}</option>
                ))}
              </select>
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>Copies</label>
              <input className={common.formInput} type="text" id="copies" placeholder="0 for unlimited" />
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>Tags</label>
              <input className={common.formWider} type="text" id="tags" placeholder="Tags separated by space" />
            </li>
          </div>
          <button id="action-button" className={common.actionButton} onClick={()=>onMint(session)}>MINT NFT</button>
          <div id="message" className={common.message}>One wallet confirmation will be needed</div>
        </div>
      </section>
    </Layout>
  )
}

