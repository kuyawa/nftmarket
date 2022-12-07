import { useState } from 'react'
import Link     from 'next/link'
import Image    from 'next/image'
import Layout   from '/components/layout.jsx'
import common   from '/styles/common.module.css'
import Message  from '/libs/ui/message.ts'
import Button   from '/libs/ui/button.ts'
import Session  from '/libs/utils/session.ts'
import Random   from '/libs/utils/random.ts'
import Utils    from '/libs/utils/string.ts'
import { getUserById } from '/libs/data/registry.ts';


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

async function uploadFile(file, ext){
  Message('Uploading artwork, wait a moment...')
  try {
    let id   = Random.string() // To avoid collisions
    let name = id+ext
  //let name = 'art/'+id+ext
    let type = file.type
    let data = new FormData()
    data.append('name', name)
    data.append('file', file)
    let resp = await fetch('/api/upload', {method: 'POST', body: data});
    let info = await resp.json();
    console.log('Upload', info)
    if(info.success) {
      console.log('Upload success!')
      return {success:true, name:name, type:type}
    } else {
      console.error('Upload failed!')
      return {success:false, error:'Upload failed'}
    }
  } catch(ex) {
    console.error(ex)
    return {success:false, error:ex.message}
  }
}

async function uploadNFT(data){
  Message('Uploading NFT, wait a moment...')
  try {
    let info = await fetch('/api/nft/new', {
      method: 'POST', 
      headers:{'content-type':'application/json'}, 
      body: JSON.stringify(data)
    })
    let resp = await resp.json();
    console.log('Upload', resp)
    if(upload.success) {
      console.log('Upload success!')
      return {success:true, tokenId:resp.tokenId}
    } else {
      console.error('Upload failed!')
      return {success:false, error:'Upload failed'}
    }
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
        let xumm = new XummSdkJwt(jwt)
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
  let info = await uploadFile(file, ext)
  if(!info.success){ Message('Error uploading image',1); return }
  //if(inf.error) { Message(inf.error,1); Button('ERROR'); return; }

  let nft = {
    created:       new Date(),
    authorId:      session.userid,
    collectionId:  $('collection').value,
    name:          $('name').value,
    description:   $('description').value,
    media:         'image',
    image:         info.url, // aws
    artwork:       info.uri, // ipfs
    metadata:      '', // fill on server
    tokenId:       '', // fill on server
    royalties:     parseInt($('royalties').value),
    beneficiaryId: $('beneficiary').value,
    forsale:       true,
    copies:        parseInt($('copies').value),
    sold:          0,
    price:         parseInt($('price').value),
    tags:          $('tags').value,
    likes:         0,
    views:         0,
    category:      '',
    inactive:      false
  }

  // Upload NFT to server
  let resp = await uploadNFT(nft)
  if(!resp.success){ Message('Error uploading NFT',1); return }
  Message('NFT created, check your XUMM wallet and accept the offer!')

  // Send offer to client for signing
  let offer = await acceptOffer(resp.offerId, session.account, session.usertoken)
  if(!resp.success){ Message('Error accepting offer',1); return }
  Message('Offer accepted, NFT minted!')
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
  let props = {session, user}
  return {props}
}

// PAGE /nft/new
export default function newNFT(props) {
  //let [session] = useState(props.session);
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
                {props.user.collections.map(item => (
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
                <option value="unitednations">United Nations</option>
                <option value="unicef">Unicef</option>
                <option value="redcross">Red Cross</option>
                <option value="greenpeace">Green Peace</option>
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
          <button id="action-button" className={common.actionButton} onClick={()=>onMint(props.session)}>MINT NFT</button>
          <div id="message" className={common.message}>One wallet confirmation will be needed</div>
        </div>
      </section>
    </Layout>
  )
}

