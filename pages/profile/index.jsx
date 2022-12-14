import Link     from 'next/link'
import Image    from 'next/image'
import Layout   from '/components/layout.jsx'
import common   from '/styles/common.module.css'
import style    from '/styles/profile.module.css'
import Message  from '/libs/ui/message.ts'
import Button   from '/libs/ui/button.ts'
import Session  from '/libs/utils/session.ts'
import Upload   from '/libs/uploaders/upload.ts'
import {apiPut} from '/libs/data/apicall.ts'
import {imageUrl} from '/libs/utils/string.ts'
import {setCookie, deleteCookie} from 'cookies-next'
import {getUserById, getOffersByBuyer} from '/libs/data/registry.ts'

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
    name: $('name').value.toLowerCase(),
    description: $('desc').value,
    email: $('mail').value
  }
  let data = await apiPut('/api/users', profile)
  console.log('Profile Resp', data)
  if(!data.success){
    Message('Error saving profile',1);
    Button('SAVE');
    console.log('ERROR:', data.error)
    return
  }
  setCookie('username', profile.name)
  Message('Profile saved!')
  Button('DONE',1)
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
  // Get user info
  let resp = await getUserById(session.userid)
  let user = resp.data
  //console.log('USER:', user)
  // Acquired NFTs
  let offers = await getOffersByBuyer(user.id)
  let nfts   = offers.data
  let props  = {session, user, nfts, editable}
  return {props}
}

export default function Profile(props) {
  //console.log('Profile props', props)
  let account = props?.account?.substr(0,10) || ''
  let {session, user, nfts, editable} = props
  let {collections, artworks} = user
  let avatarUrl = '/media/images/noavatar.jpg'
  if(user.image){
    avatarUrl = `https://enlightenmint.s3.us-east-1.amazonaws.com/${user.image}`
  }
  let dateLong = new Date(user.created).toLocaleString()
  console.log('AVATAR', avatarUrl)
  console.log('DATELONG', dateLong)
  let iconTag  = '/media/images/icon-tag.svg'
  let iconGive = '/media/images/icon-give.svg'
  let iconTime = '/media/images/icon-time.svg'
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
              let imgurl = imageUrl(item.image)
              return (
                <div className={common.collection} key={item.id}>
                  <Link href={`/collections/${item.id}`}>
                    <Image className={common.collImage} src={imgurl} width={250} height={250} alt={item.name} />
                  </Link>
                  <div className={common.collInfo}>
                    <label className={common.collName}>{item.name}</label>
                    <label className={common.collDesc}>{item.description}</label>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        {/* ARTWORKS */}
        <div className={common.listBox}>
          <h1 className={common.titleTask}>NFTS MINTED<Link href={`/nft/new`} className={common.linkTask}>CREATE</Link></h1>
          <div className={common.listItems}>
            {artworks.length==0?<h3 className={common.secondary}>No artworks</h3>:''}
            {artworks.map(item => {
              let imgurl = imageUrl(item.image)
              let beneficiary = item.beneficiary?.name || 'United Nations'
              let rarity = `${(item.copies||1000)-item.sold}/${item.copies||1000}`
              return (
                <div className={common.item} key={item.id}>
                  <div className={common.itemTop}>
                    <Link href={`/nft/${item.id}`}>
                      <Image className={common.itemImage} src={imgurl} width={250} height={250} alt={item.name} />
                      <div className={common.itemIntro}>
                        <label className={common.itemName}>{item.name}</label>
                        <label className={common.itemAuthor}>by {item.author.name}</label>
                      </div>
                    </Link>
                  </div>
                  <div className={common.itemInfo}>
                    <li className={common.itemLine}><Image className={common.itemIcon} src={iconTag}  width={20} height={20} alt="icon tag"  /><label className={common.itemPrice}>{item.price} XRP</label></li>
                    <li className={common.itemLine}><Image className={common.itemIcon} src={iconGive} width={20} height={20} alt="icon give" /><label className={common.itemFees} >{item.royalties}% Benefit <br /><small className={common.itemSmall}>to {beneficiary}</small></label></li>
                    <li className={common.itemLine}><Image className={common.itemIcon} src={iconTime} width={20} height={20} alt="icon time" /><label className={common.itemRare} >Limited run!<br /><small className={common.itemSmall}>{rarity}</small></label></li>
                  </div>
                </div>
                )
              })}
          </div>
        </div>
        {/* NFTS ACQUIRED */}
        <div className={common.listBox}>
          <h1 className={common.titleTask}>NFTS ACQUIRED</h1>
          <div className={common.listItems}>
            {nfts.length==0?<h3 className={common.secondary}>No artworks</h3>:''}
            {nfts.map(offer => {
              let item = offer.artwork
              let imgurl = imageUrl(item.image)
              let beneficiary = item.beneficiary?.name || 'United Nations'
              let rarity = `${(item.copies||1000)-item.sold}/${item.copies||1000}`
              return (
                <div className={common.item} key={item.id}>
                  <div className={common.itemTop}>
                    <Link href={`/nft/${item.id}`}>
                      <Image className={common.itemImage} src={imgurl} width={250} height={250} alt={item.name} />
                      <div className={common.itemIntro}>
                        <label className={common.itemName}>{item.name}</label>
                        <label className={common.itemAuthor}>by {item.author.name}</label>
                      </div>
                    </Link>
                  </div>
                  <div className={common.itemInfo}>
                    <li className={common.itemLine}><Image className={common.itemIcon} src={iconTag}  width={20} height={20} alt="icon tag"  /><label className={common.itemPrice}>{item.price} XRP</label></li>
                    <li className={common.itemLine}><Image className={common.itemIcon} src={iconGive} width={20} height={20} alt="icon give" /><label className={common.itemFees} >{item.royalties}% Benefit <br /><small className={common.itemSmall}>to {beneficiary}</small></label></li>
                    <li className={common.itemLine}><Image className={common.itemIcon} src={iconTime} width={20} height={20} alt="icon time" /><label className={common.itemRare} >Limited run!<br /><small className={common.itemSmall}>{rarity}</small></label></li>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </Layout>
  )
}

