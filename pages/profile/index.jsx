import Link    from 'next/link'
import Image   from 'next/image'
import Layout  from '/components/layout.jsx'
import common  from '/styles/common.module.css'
import style   from '/styles/profile.module.css'
import Message from '/libs/ui/message.ts'
import Button  from '/libs/ui/button.ts'
import Session from '/libs/utils/session.ts'
import Utils   from '/libs/utils/string.ts'
import Upload  from '/libs/uploaders/upload.ts'
import { deleteCookie } from 'cookies-next'
import { getUserById } from '/libs/data/registry.ts';

function $(id){ return document.getElementById(id) }

function onImageError(evt){
  console.log('Image error', evt)
  evt.target.src='/media/images/noavatar.jpg'
}

function onImagePreview(evt){
  console.log('Preview', evt)
  let file = evt.target.files[0]
  let reader = new FileReader()
  reader.onload = function(e)  {
      $('avatar-image').src = e.target.result
  }
  reader.readAsDataURL(file)
}

async function onSave(session, user){
  Message('Saving profile, wait a moment...')
  // Validate image, name, description, price, royalties
  if(!session.account){ Message('Login with your XUMM wallet first',1); return; }
  if(!$('name').value){ Message('User name is required',1); return; }
  if(!$('desc').value){ Message('Description is required',1); return; }
  let file = $('avatar-file').files[0]
  if(!file && !user.image){ Message('Avatar is required, select a jpg or png max 500x500',1); return; }
  let newImage = user.image
  if(file){
    let ext = null
    switch(file.type){
      case 'image/jpg':
      case 'image/jpeg': ext = '.jpg'; break
      case 'image/png':  ext = '.png'; break
      //case 'text/plain': ext = '.txt'; break
    }
    if(!ext){ Message('Only JPG and PNG images are allowed'); Button('SAVE'); return }
    // Upload image to AWS
    Button('WAIT',1)
    Message('Uploading avatar, wait a moment...')
    let info = await Upload(file, ext)
    if(!info.success){ Message('Error uploading image',1); Button('SAVE'); return }
    console.log('INFO', info)
    newImage = info.image
  }

  let profile = {
    id: user.id,
    image: newImage,
    name: $('name').value,
    description: $('desc').value,
    email: $('mail').value
  }
  let resp = await fetch('/api/users', {
    method: 'PUT', 
    headers: {'content-type':'application/json'}, 
    body: JSON.stringify(profile)
  })
  let data = await resp.json();
  console.log('Profile Resp', data)
  if(!data.success){
    Message('Error saving profile',1);
    Button('SAVE');
    console.log('ERROR:', data.error)
    return
  }
  Message('Profile saved!')
  Button('DONE',1)
}

export async function getServerSideProps({req,res,query}){
  let session = Session(req)
  console.log('ACCOUNT:', session.account)
  console.log('USERID :', session.userid)
  if(!session.userid){ 
    return {
      redirect: {destination: '/login', permanent: false}
    }
  }
  let editable = true
  let resp = await getUserById(session.userid)
  let user = resp.data
  // TODO: if not found? 404
  console.log('USER:', user)
  let props = {session, user, editable}
  return {props}
}

function onEdit() {
  alert('Not ready')
}

function logout() {
  deleteCookie('account')
  deleteCookie('userid')
  deleteCookie('username')
  deleteCookie('usertoken')
  window.location.href='/'
}

export default function Profile(props) {
  //console.log('Profile props', props)
  let account = props?.account?.substr(0,10) || ''
  let {session, user, editable} = props
  let {collections, artworks} = user
  let avatarUrl = '/media/images/noavatar.jpg'
  if(user.image){
    avatarUrl = `https://enlightenmint.s3.us-east-1.amazonaws.com/${user.image}`
  }
  let dateLong = new Date(user.created).toLocaleString()
  console.log('AVATAR', avatarUrl)
  console.log('DATELONG', dateLong)

  return (
    <Layout props={props}>
      <section className={style.profile}>
        {/* PROFILE */}
        <div className={style.profileBox}>
          <h1 className={style.profileTitle}>PROFILE</h1>
          <div className={style.avatarBox}>
            <div className={style.avatarImage}>
              <img id="avatar-image" className={style.avatarPic} src={avatarUrl} width={250} height={250} alt="Avatar" onError={onImageError} />
              <input type="file" name="avatar-file" id="avatar-file" className={common.formFile} onChange={onImagePreview} />
            </div>
            <div className={style.avatarInfo}>
              <input className={common.formWider+' '+style.userName} type="text" id="name" defaultValue={user.name} placeholder="User name" />
              <input className={common.formWider+' '+style.userDesc} type="text" id="desc" defaultValue={user.description} placeholder="Description" />
              <input className={common.formWider+' '+style.userMail} type="text" id="mail" defaultValue={user.email} placeholder="Email" />
              <label className={style.avatarLabel}>Member since {dateLong}</label>
              <br />
              <button className={common.linkButton} onClick={()=>onSave(session, user)} id="action-button">SAVE</button>
              <button className={common.linkButton} onClick={logout}>LOGOUT</button>
              <div id="message" className={common.message}>Edit and save your profile</div>
            </div>
          </div>
        </div>
        {/* COLLECTIONS */}
        <div className={common.listBox}>
          <h1 className={common.titleTask}>COLLECTIONS <Link href={`/collections/new`} className={common.linkTask}>CREATE</Link></h1>
          <div className={common.listItems}>
            {collections.length==0?<h3 className={common.secondary}>No collections</h3>:''}
            {collections.map(item => {
              let imgurl = Utils.imageUrl(item.image)
              return (
                <div className={common.collection} key={item.id}>
                  <Image className={common.collImage} src={imgurl} width={250} height={250} alt={item.name} />
                  <label className={common.collName}>{item.name}</label>
                  <label className={common.collDesc}>{item.description}</label>
                  <Link href={`/collections/${item.id}`} className={common.itemButton} data-id={item.id}>VIEW</Link>
                </div>
              )
            })}
          </div>
        </div>
        {/* ARTWORKS */}
        <div className={style.listBox}>
          <h1 className={common.titleTask}>NFTS <Link href={`/nft/new`} className={common.linkTask}>CREATE</Link></h1>
          <div className={style.listItems}>
            {artworks.length==0?<h3 className={common.secondary}>No artworks</h3>:''}
            {artworks.map(item => {
              let imgurl = Utils.imageUrl(item.image)
              let beneficiary = item.beneficiary?.name || 'United Nations'
              return (
                <div className={common.item} key={item.id}>
                  <Image className={common.itemImage} src={imgurl} width={250} height={250} alt={item.name} />
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

