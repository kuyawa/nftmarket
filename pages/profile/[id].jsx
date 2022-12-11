import Link    from 'next/link'
import Image   from 'next/image'
import Layout  from '/components/layout.jsx'
import common  from '/styles/common.module.css'
import style   from '/styles/profile.module.css'
import Session from '/libs/utils/session.ts'
import {imageUrl}     from '/libs/utils/string.ts'
import {deleteCookie} from 'cookies-next'
import {getUserByName, getOffersByBuyer} from '/libs/data/registry.ts';

function dateLong(date){
  return new Date(date).toLocaleString()
}

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
  // Get user info
  let resp = await getUserByName(profile)
  if(!resp.success){
    return {
      redirect: {destination: '/notfound', permanent: false}
    }
  }
  let user = resp.data
  // Acquired NFTs
  let offers = await getOffersByBuyer(user.id)
  let nfts   = offers.data
  let props = {session, user, nfts, editable}
  return {props}
}

export default function Profile(props) {
  let account = props?.account?.substr(0,10) || ''
  let {session, user, nfts, editable} = props
  let {collections, artworks} = user
  let avatarUrl = '/media/images/noavatar.jpg'
  if(user.image){
    avatarUrl = `https://enlightenmint.s3.us-east-1.amazonaws.com/${user.image}`
  }
  let dateLong = new Date(user.created).toLocaleString()
  let iconTag  = '/media/images/icon-tag.svg'
  let iconGive = '/media/images/icon-give.svg'
  let iconTime = '/media/images/icon-time.svg'
  return (
    <Layout props={props}>
      <section className={style.profile}>
        {/* PROFILE */}
        <div className={style.profileBox}>
          <h1>PROFILE</h1>
          <div className={style.avatarBox}>
            <Image className={style.avatarPic} src={avatarUrl} width={250} height={250} alt="Avatar"/>
            <div className={style.avatarInfo}>
              <h2>{user.name}</h2>
              <h3>{user.description}</h3>
              <label className={style.avatarLabel}>Member since {dateLong}</label>
            </div>
          </div>
        </div>
        {/* COLLECTIONS */}
        <div className={common.listBox}>
          <h1>COLLECTIONS</h1>
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
          <h1>NFTS</h1>
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

