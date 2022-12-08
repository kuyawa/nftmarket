import { useState } from 'react'
import Link     from 'next/link'
import Image    from 'next/image'
import Layout   from '/components/layout.jsx'
import common   from '/styles/common.module.css'
import Message  from '/libs/ui/message.ts'
import Button   from '/libs/ui/button.ts'
import Session  from '/libs/utils/session.ts'
import Random   from '/libs/utils/random.ts'
import Upload   from '/libs/uploaders/upload.ts'
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

async function onSave(session){
  Message('Saving collection, wait a moment...')
  //console.log('SESSION', session)
  // Validate image, name, description
  if(!session.account){ Message('Login with your XUMM wallet first',1); return; }
  if(!$('name').value){ Message('Collection name is required',1); return; }
  if(!$('desc').value){ Message('Collection description is required',1); return; }
  let file = $('artwork-file').files[0]
  if(!file){ Message('Image is required, select a jpg or png max 2000x2000',1); return; }
  let ext = null
  switch(file.type){
    case 'image/jpg':
    case 'image/jpeg': ext = '.jpg'; break
    case 'image/png':  ext = '.png'; break
  }
  if(!ext){ Message('Only JPG and PNG images are allowed'); return; }
  Button('WAIT',1)

  // Upload image to server
  // Server uploads to aws and ipfs
  Message('Uploading image, wait a moment...')
  let result = await Upload(file, ext)
  if(!result.success){ Message('Error uploading image',1); return }
  console.log('IMAGE', result)

  let record = {
    created:     new Date(),
    name:        $('name').value,
    description: $('desc').value,
    authorId:    session.userid,
    image:       result.image, // AWS
    taxon:       Random.number(8),
    nftcount:    0,
    curated:     false,
    inactive:    false
  }
  console.log('RECORD', record)
  // Save collection to registry
  let resp = await fetch('/api/collections', {
    method: 'POST',
    headers: {'content-type':'application/json'},
    body: JSON.stringify(record)
  })
  let info = await resp.json()
  if(!info.success){ Message('Error saving collection',1); return }
  Message('Collection created!')
  Button('DONE',1)
}

export async function getServerSideProps({req,res,query}){
  let session = Session(req)
  let resp = await getUserById(session.userid, true)
  if(!resp.success || resp.error){
    return {
      redirect: {destination: '/login', permanent: false}
    }
  }
  let user = resp.data
  let props = {session, user}
  return {props}
}

export default function newCollection(props) {
  //let [session] = useState(props.session);
  console.log('COLLECTION NEW')
  return (
    <Layout props={props}>
      <section className={common.main}>
        <h1 className={common.mainTitle}>NEW COLLECTION</h1>
        <div className={common.formBox}>
          <div className={common.artwork}>
            <img id="artwork-image" className={common.formPic} src="/media/images/nftnew.jpg" width={500} height={500} onError={onImageError} />
            <input type="file" name="artwork-file" id="artwork-file" className={common.formFile} onChange={onImagePreview} />
          </div>
          <div className={common.formInfo}>
            <li className={common.formList}>
              <label className={common.formLabel}>Name</label>
              <input className={common.formWider} type="text" id="name"  placeholder="Collection name" />
            </li>
            <li className={common.formList}>
              <label className={common.formLabel}>Description</label>
              <input className={common.formWider} type="text" id="desc"  placeholder="Description" />
            </li>
          </div>
          <button id="action-button" className={common.actionButton} onClick={()=>onSave(props.session)}>SAVE</button>
          <div id="message" className={common.message}>Enter collection info and save</div>
        </div>
      </section>
    </Layout>
  )
}

