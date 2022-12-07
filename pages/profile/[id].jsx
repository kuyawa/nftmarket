import Link    from 'next/link'
import Image   from 'next/image'
import Layout  from '/components/layout.jsx'
import common  from '/styles/common.module.css'
import style   from '/styles/profile.module.css'
import Session from '/libs/utils/session.ts'
import { deleteCookie } from 'cookies-next'
import { getUserByName } from '/libs/data/registry.ts';

export async function getServerSideProps({req,res,query}){
  let session = Session(req)
  let profile = query?.id?.toLowerCase()
  console.log('query', query)
  console.log('profile', profile)
  if(!profile){ 
    return {
      redirect: {destination: '/notfound', permanent: false}
    }
  }
  let editable = false
  let resp = await getUserByName(profile)
  if(!resp.success){
    return {
      redirect: {destination: '/notfound', permanent: false}
    }
  }
  let user = resp.data
  let props = {session, user, editable}
  return {props}
}

function dateLong(date){
  return new Date(date).toLocaleString()
}

function imageUrl(image) {
  console.log('IMGURL', `${process.env.AWS_API_ENDPOINT}/${image}`)
  //return `${process.env.AWS_API_ENDPOINT}/${image}`
  return `https://enlightenmint.s3.us-east-1.amazonaws.com/${image}`
}


export default function Profile(props) {
  let account = props?.account?.substr(0,10) || ''
  let {session, user, editable} = props
  let {collections, artworks} = user
  let avatarUrl = '/media/images/noavatar.jpg'
  if(user.image){
    avatarUrl = `https://enlightenmint.s3.us-east-1.amazonaws.com/${user.image}`
  }
  let dateLong = new Date(user.created).toLocaleString()
  return (
    <Layout props={props}>
      <section className={style.profile}>
        {/* PROFILE */}
        <div className={style.profileBox}>
          <h1>PROFILE</h1>
          <div className={style.avatarBox}>
            <Image className={style.avatarPic} src={avatarUrl} width={250} height={250} />
            <div className={style.avatarInfo}>
              <h2>{user.name}</h2>
              <h3>{user.description}</h3>
              <label className={style.avatarLabel}>Member since {dateLong}</label>
            </div>
          </div>
        </div>
        {/* COLLECTIONS */}
        <div className={style.listBox}>
          <h1>COLLECTIONS</h1>
          <div className={style.listItems}>
            {collections.length==0?<h3 className={common.secondary}>No collections</h3>:''}
            {collections.map(item => {
              let imgurl = imageUrl(item.image)
              return (
                <div className={common.collection} key={item.id}>
                  <Image className={common.collImage} src={imgurl} width={250} height={250}/>
                  <label className={common.collName}>{item.name}</label>
                  <label className={common.collDesc}>{item.description}</label>
                  <Link href={`/collections/${item.id}`} className={common.itemButton} data-id={item.id}>VIEW</Link>
                </div>
              )
            })}
          </div>
        </div>
        {/* ARTWORKS */}
        <div className={common.listBox}>
          <h1>NFTS</h1>
          <div className={common.listItems}>
            {artworks.length==0?<h3 className={common.secondary}>No artworks</h3>:''}
            {artworks.map(item => {
              let imgurl = imageUrl(item.image)
              let beneficiary = item.beneficiary?.name || 'United Nations'
              return (
                <div className={common.item} key={item.id}>
                  <Image className={common.itemImage} src={imgurl} width={250} height={250}  />
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

