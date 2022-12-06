import Head    from 'next/head'
import Link    from 'next/link'
import Image   from 'next/image'
import Layout  from '/components/layout.jsx'
import common  from '/styles/common.module.css'
import style   from '/styles/profile.module.css'
import Session from '/libs/session.ts'
import { deleteCookie } from 'cookies-next'
import { getUserByName, getCollectionsByUser, getArtworksByUser } from '/libs/registry.ts';

// PAGE /profile/[id]
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
  let data  = await getUserByName(profile)
  let list  = await getCollectionsByUser(profile)
  let nfts  = await getArtworksByUser(profile)
  let props = {session, data, list, nfts}
  return {props}
}

function dateLong(date){
  return new Date(date).toLocaleString()
}

export default function Profile(props) {
  let account = props?.account?.substr(0,10) || ''
  let {session, data, list, nfts} = props
  let imageServer = process.env.AWS_API_ENDPOINT
  console.log(imageServer)
  return (
    <Layout props={props}>
      <section className={style.profile}>
        <h1>PROFILE</h1>
        <div className={style.avatarBox}>
          <img className={style.avatarPic} src={`${imageServer}/avatars/${data.image}`} width={250} height={250} />
          <div className={style.avatarInfo}>
            <h2>{data.name}</h2>
            <h3>{data.description}</h3>
            <label className={style.avatarLabel}>Member since {`${dateLong(data.created)}`}</label>
          </div>
        </div>
        <div className={style.listBox}>
          <h1>COLLECTIONS</h1>
          <Link href={`/collections/new`} className={common.linkButton}>CREATE</Link>
          <div className={style.listItems}>
            {props.list.map(item => (
            <div className={common.item} key={item.id}>
              <img className={common.itemImage} src={`${imageServer}/collections/${item.image}`} />
              <label className={common.itemName}>{item.name}</label>
              <label className={common.itemDesc}>NFTs in collection: {item.quantity}</label>
            </div>
            ))}
          </div>
        </div>
        <div className={style.listBox}>
          <h1>NFTS</h1>
          <Link href={`/nft/new`} className={common.linkButton}>CREATE</Link>
          <div className={style.listItems}>
            {props.nfts.map(item => (
            <div className={common.item} key={item.id}>
              <img className={common.itemImage} src={`${imageServer}/art/${item.image}`} />
              <div className={common.itemInfo}>
                <label className={common.itemName}>{item.name}</label>
                <label className={common.itemAuthor}>Author: {item.author}</label>
                <label className={common.itemPrice}>Price: {item.price}</label>
                <label className={common.itemFees}>{item.fees}% will go to {item.beneficiary}</label>
              </div>
              <Link href={`/nft/edit/${item.token}`} className={common.itemButton} data-token={item.token}>EDIT</Link>
            </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

