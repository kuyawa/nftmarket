import Head    from 'next/head'
import Link    from 'next/link'
import Image   from 'next/image'
import Layout  from '/components/layout.jsx'
import common  from '/styles/common.module.css'
import style   from '/styles/profile.module.css'
import Session from '/libs/session.ts'
import { deleteCookie } from 'cookies-next'
import { getUserByName, getCollectionsByUser, getArtworksByUser } from '/libs/registry.ts';

export async function getServerSideProps({req,res,query}){
  let session = Session(req)
  console.log('ACCOUNT:', session.account)
  if(!session.account){ 
    return {
      redirect: {destination: '/login', permanent: false}
    }
  }
  let editable = true
  let data = await getUserByWallet(session.account)
  let user = data.id
  let list = await getCollectionsByUser(user)
  let nfts = await getArtworksByUser(user)
  //let data = {username:'Kuyawa', description:'Just a programmer', created:'2022-11-28 12:35:00'}
  /*
  let list = [
    {
      image:'collections/c1234567890',
      name:'End Poverty',
      quantity:10
    },
    {
      image:'collections/c1234567891',
      name:'End World Hunger',
      quantity:20
    }
  ]
  let nfts = [
    {
      image:'art/a1234567890.jpg',
      name:'End Poverty #001',
      author:'Kuyawa',
      owner:'',
      price:'10.00',
      fees:'10',
      beneficiary:'UNICEF'
    },
    {
      image:'art/a1234567891.jpg',
      name:'End Poverty #002',
      author:'Kuyawa',
      owner:'',
      price:'10.00',
      fees:'10',
      beneficiary:'UNICEF'
    },
    {
      image:'art/a1234567892.jpg',
      name:'End Poverty #003',
      author:'Kuyawa',
      owner:'',
      price:'10.00',
      fees:'10',
      beneficiary:'UNICEF'
    },
    {
      image:'art/a1234567893.jpg',
      name:'End Poverty #004',
      author:'Kuyawa',
      owner:'',
      price:'10.00',
      fees:'10',
      beneficiary:'UNICEF'
    },
    {
      image:'art/a1234567894.jpg',
      name:'End Poverty #005',
      author:'Kuyawa',
      owner:'',
      price:'10.00',
      fees:'10',
      beneficiary:'UNICEF'
    },
  ]
  */
  let props = {session, data, list, nfts, editable}
  return {props}
}

function logout() {
  deleteCookie('account')
  deleteCookie('username')
  deleteCookie('usertoken')
  window.location.href='/'
}

export default function Profile(props) {
  console.log('Profile props', props)
  let account = props?.account?.substr(0,10) || ''
  let {session, data, list, nfts, editable} = props
  // Get profile info
  return (
    <Layout props={props}>
      <section className={style.profile}>
        <h1>PROFILE</h1>
        <div className={style.avatarBox}>
          <Image className={style.avatarPic} src={`${process.env.AWS_API_ENDPOINT+data.image}`} width={250} height={250} />
          <div className={style.avatarInfo}>
            <h2>{data.name}</h2>
            <h3>{data.description}</h3>
            <label className={style.avatarLabel}>Member since {data.created}</label>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
        <div className={style.listBox}>
          <h1>COLLECTIONS</h1>
          {/*<!-- show button [new collection] -->*/}
          <div className={style.listItems}>
            {props.list.map(item => (
            <div className={style.item} key={item.id}>
              <img className={style.itemImage} src="/media/nfts/{item.image}" />
              <label className={style.itemName}>{item.name}</label>
              <label className={style.itemDesc}>NFTs in collection: {item.quantity}</label>
            </div>
            ))}
          </div>
        </div>
        <div className={style.listBox}>
          <h1>NFTS</h1>
          {/*<!-- show button [new nft] -->*/}
          <div className={style.listItems}>
            {props.nfts.map(item => (
            <div className={style.item} key={item.id}>
              <img className={style.itemImage} src="/media/nfts/{item.image}" />
              <div className={style.itemInfo}>
                <label className={style.itemName}>{item.name}</label>
                <label className={style.itemAuthor}>Author: {item.author}</label>
                <label className={style.itemOwner}>Owner: {item.owner}</label>
                <label className={style.itemPrice}>Price: {item.price}</label>
                <label className={style.itemFees}>{item.fees}% will go to {item.beneficiary}</label>
              </div>
            </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

