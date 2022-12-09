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
import { getUserById, getCollectionById, getOrganizationById, getOrganizations } from '/libs/data/registry.ts';


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
  let resp, info
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

  // Gather NFT data
  let collectionId =  $('collection').value
  let name =          $('name').value
  let description =   $('desc').value
  let royalties =     parseInt($('royalties').value||50)
  let beneficiaryId = $('beneficiary').value
  let copies =        parseInt($('copies').value||0)
  let price =         parseInt($('price').value||1)
  let tags =          $('tags').value||''


  // Get collection taxon
  console.log('COLLECTION:', collectionId)
  resp = await fetch('/api/collections/'+collectionId)
  info = await resp.json()
  console.log('INFO', info)
  if(!info.success){
    console.log('ERROR:', info?.error)
    Message('Error getting collection',1); 
    Button('MINT NFT');
    return
  }
  let taxon = info.data.taxon
  console.log('TAXON:', taxon)

  // Get organization info
  console.log('ORGANIZATION:', beneficiaryId)
  resp = await fetch('/api/organizations/'+beneficiaryId)
  info = await resp.json()
  console.log('INFO', info)
  if(!info.success){
    console.log('ERROR:', info?.error)
    Message('Error getting organization',1); 
    Button('MINT NFT');
    return
  }
  let orgName = info.data.name
  console.log('ORGNAME:', orgName)


  // Upload image to aws and ipfs
  let timer = new Date().getTime()
  console.log('Timer:', timer)
  Message('Uploading artwork, wait a moment...')
  resp = await Replicate(file, ext) // upload to AWS and IPFS
  if(!resp.success){ Message('Error uploading image',1); return }
  console.log('UPLOAD', resp)
  let image = resp.image
  let artwork = resp.uri

  let nft = {
    created:       new Date(),
    authorId:      session.userid,
    collectionId:  collectionId,
    name:          name,
    description:   description,
    media:         'image',
    image:         image,    // aws
    artwork:       artwork,  // ipfs
    metadata:      '', // fill on server
    tokenId:       '', // fill on server
    royalties:     royalties,
    beneficiaryId: beneficiaryId,
    forsale:       true,
    copies:        copies,
    sold:          0,
    price:         price,
    tags:          tags,
    likes:         0,
    views:         0,
    category:      '',
    inactive:      false
  }

  // Upload metadata to IPFS
  console.log('Timer:', new Date().getTime()-timer)
  Message('Uploading metadata, wait a moment...')
  let meta = {
    organization: orgName,
    name:         nft.name,
    image:        nft.artwork
  }
  console.log('METADATA:', meta)
  resp = await fetch('/api/nft/metadata', {
    method: 'POST', 
    headers: {'content-type':'application/json'}, 
    body: JSON.stringify(meta)
  })
  info = await resp.json()
  console.log('RESP:', info)
  if(!info.success){ 
    Message('Error uploading metadata',1); 
    Button('MINT NFT');
    console.log('ERROR:', info?.error)
    return
  }
  let metadata = info.metaUri
  nft.metadata = info.metaUri

  // Upload NFT to server
  console.log('Timer:', new Date().getTime()-timer)
  Message('Uploading NFT, wait a moment...')
  console.log('NEW NFT:', {metadata, taxon})
  resp = await fetch('/api/nft/new', {
    method: 'POST', 
    headers: {'content-type':'application/json'}, 
    body: JSON.stringify({metadata, taxon})
  })
  info = await resp.json()
  console.log('RESP:', info)
  if(!info.success){ 
    Message('Error minting NFT',1); 
    Button('MINT NFT');
    console.log('ERROR:', info?.error)
    return
  }
  nft.tokenId = info.tokenId

  // Save to DB
  console.log('Timer:', new Date().getTime()-timer)
  Message('Saving NFT, wait a moment...')
  console.log('SAVE NFT:', nft)
  resp = await fetch('/api/nft/save', {
    method: 'POST', 
    headers: {'content-type':'application/json'}, 
    body: JSON.stringify(nft)
  })
  info = await resp.json()
  console.log('RESP:', info)
  if(!info.success){ 
    Message('Error saving NFT',1); 
    Button('MINT NFT');
    console.log('ERROR:', info?.error)
    return
  }
  nft.artworkId = info.nftId

  // Create sell offer
  console.log('Timer:', new Date().getTime()-timer)
  Message('Creating Sell Offer, wait a moment...')
  let offer = {
    created:       new Date(),
    type:          0,
    sellerId:      nft.authorId,
    collectionId:  nft.collectionId,
    artworkId:     nft.artworkId,
    tokenId:       nft.tokenId,
    price:         nft.price,
    royalties:     nft.royalties,
    beneficiaryId: nft.beneficiaryId,
    wallet:        '',
    offerId:       null, // set on server
    status:        1     // 0.created 1.accepted 2.declined
  }
  console.log('OFFER:', offer)
  resp = await fetch('/api/nft/offer', {
    method: 'POST', 
    headers: {'content-type':'application/json'}, 
    body: JSON.stringify(offer)
  })
  info = await resp.json()
  console.log('RESP:', info)
  if(!info.success){ 
    Message('Error saving offer',1); 
    Button('MINT NFT');
    console.log('ERROR:', info?.error)
    return
  }
  let offerId = info.offerId

  // Send offer to client for signing
  Message('NFT created, check your XUMM wallet and accept the offer!')
  console.log('SIGN OFFER:', offerId, session.account)
  let accept = await acceptOffer(offerId, session.account, session.usertoken)
  console.log('OFFER RESP:', accept)
  if(!accept.success){
    Message('Error accepting offer',1);
    Button('MINT NFT');
    console.log('ERROR:', accept?.error)
    return
  }

  Message(`Offer accepted, NFT minted - <a href="/nft/${nft.artworkId}">VIEW</a>`)
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

