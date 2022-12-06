import Head    from 'next/head'
import Link    from 'next/link'
import Image   from 'next/image'
import Layout  from '/components/layout.jsx'
import common  from '/styles/common.module.css'
import style   from '/styles/nft.module.css'
import Session from '/libs/session.ts'
import Message from '/libs/message.ts'
import Button  from '/libs/button.ts'
import Random  from '/libs/random.ts'


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
    //let resp = await fetch('/api/upload', {method: 'POST', headers:{'content-type':'multipart/form-data; boundary='+bndr}, body: data});
    //let resp = await fetch('/api/upload', {method: 'POST', headers:{'content-type':'multipart/form-data'}, body: data});
    let resp = await fetch('/api/upload', {method: 'POST', body: data});
    let info = await resp.json();
    console.log('Upload', info)
    if(info.success) {
      console.log('Uploaded successfully!')
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

async function uploadFileOLD(file, ext){
  Message('Uploading artwork, wait a moment...')
  try {
    let id   = Random.string() // To avoid collisions
    let name = id+ext
    let namex= encodeURIComponent('art/'+name)
    let type = file.type
    let typex= encodeURIComponent(file.type)
    let resp = await fetch(`/api/presignaws?name=${namex}&type=${typex}`)
    let info = await resp.json();
    console.log('ImageName:', name)
    console.log('ImageType:', type)
    console.log('Presigned:', info)
    let data = new FormData()
    Object.entries({ ...info.fields, file }).forEach(([key, value]) => {
      data.append(key, value)
    })
    let upload = await fetch(info.url, {method: 'POST', body: data})
    console.log('Upload', upload)
    if(upload.ok) {
      console.log('Uploaded successfully!')
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

async function uploadIPFS(file, ext){
  Message('Uploading artwork to IPFS, wait a moment...')
  try {
    let id   = Random.string() // To avoid collisions
    let name = id+ext
    let namex= encodeURIComponent('art/'+name)
    let type = file.type
    let typex= encodeURIComponent(file.type)
    let resp = await fetch(`/api/presignipfs?name=${namex}&type=${typex}`)
    let info = await resp.json();
    console.log('ImageName:', name)
    console.log('ImageType:', type)
    console.log('Presigned:', info)
    let data = new FormData()
    Object.entries({ ...info.fields, file }).forEach(([key, value]) => {
      data.append(key, value)
    })
    let upload = await fetch(info.url, {method: 'POST', body: data})
    console.log('Upload', upload)
    if(upload.ok) {
      console.log('Uploaded successfully!')
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

async function onMint(){
  Button('WAIT',1)
  Message('Minting, wait a moment...')
  
  // Validate image, name, description, price, royalties
  //if(!session.account){ Message('Connect your XUMM wallet first',1); return; }
//  if(!$('name').value){ Message('NFT name is required',1); return; }
//  if(!$('desc').value){ Message('NFT description is required',1); return; }
//  if(!$('price').value){ Message('Price in XRP is required',1); return; }
  let file = $('artwork-file').files[0]
  if(!file){ Message('Image is required, select a jpg or png max 2000x2000',1); return; }
  let ext = null
  switch(file.type){
    case 'image/jpg':
    case 'image/jpeg': ext = '.jpg'; break
    case 'image/png':  ext = '.png'; break
    case 'text/plain': ext = '.txt'; break
  }
  //if(!ext){ Message('Only JPG and PNG images are allowed'); return; }
  
  // Upload file to server
  let done = await uploadFile(file, ext)
  if(!done.success){ Message('Error uploading image',1); return }
  Message('Uploaded!')
  Button('DONE',1)
  
  // Upload file to AWS first
  //let done = await uploadFile(file, ext)
  //if(!done.success){ Message('Error uploading image',1); return }
  //Message('Uploaded...')
  
  // Then upload file to Filebase IPFS
  //let ipfs = await uploadIPFS(file, ext)
  //if(!ipfs.success){ Message('Error uploading image to IPFS',1); return }
  //Message(`Uploaded ${ipfs.name} ${ipfs.type}`)


  //if(inf.error) { Message(inf.error,1); Button(); return; }
  //let artwork = inf.artwork

  //Message('Error Minting, try again in a moment', 1)
}



// PAGE /nft/new
export async function getServerSideProps({req,res,query}){
  console.log('NFT NEW PROPS')
  let session = Session(req)
  let props = {session}
  return {props}
}

export default function newNFT(props) {
  console.log('NFT NEW')
  return (
    <Layout props={props}>
      <section className={common.main}>
        <h1 className={common.mainTitle}>MINT NFT</h1>
        <div className={common.formBox}>
          <div className={style.artwork}>
            <img id="artwork-image" className={common.formPic} src="/media/images/nftnew.jpg" width={500} height={500} onError={onImageError} />
            <input type="file" name="artwork-file" id="artwork-file" className={common.formFile} onChange={onImagePreview} />
          </div>
          <div className={common.formInfo}>
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
          <button id="action-button" className={common.actionButton} onClick={onMint}>MINT NFT</button>
          <div id="message" className={common.message}>One wallet confirmation will be needed</div>
        </div>
      </section>
    </Layout>
  )
}

