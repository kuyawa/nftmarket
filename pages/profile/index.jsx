import Link    from 'next/link'
import Image   from 'next/image'
import Layout  from '/components/layout.jsx'
import common  from '/styles/common.module.css'
import style   from '/styles/profile.module.css'
import Session from '/libs/utils/session.ts'
import Utils   from '/libs/utils/string.ts'
import { deleteCookie } from 'cookies-next'
import { getUserById } from '/libs/data/registry.ts';

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
  // Get profile info
  return (
    <Layout props={props}>
      <section className={style.profile}>
        {/* PROFILE */}
        <div className={style.profileBox}>
          <h1>PROFILE</h1>
          <div className={style.avatarBox}>
            <Image className={style.avatarPic} src={avatarUrl} width={250} height={250} alt="Avatar" priority />
            <div className={style.avatarInfo}>
              <h2>{user.name}</h2>
              <h3>{user.description}</h3>
              <label className={style.avatarLabel}>Member since {dateLong}</label>
              <br />
              <button className={common.linkButton} onClick={onEdit}>EDIT</button>
              <button className={common.linkButton} onClick={logout}>LOGOUT</button>
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

