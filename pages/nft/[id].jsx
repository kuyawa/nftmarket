import Head    from 'next/head';
import Link    from 'next/link';
import Image   from 'next/image';
import Layout  from '/components/layout.jsx';
import styles  from '/styles/nft.module.css'
import Session from '/libs/session.ts'

//export async function getStaticProps({params}){
//  let token = params.id;
//  console.log('Token', token)
//  return {
//    props: {
//      postData,
//    },
//  };
//}

export async function getServerSideProps({req,res,query}){
  let session = Session(req)
  let token = query.id
  console.log('Token', token)
  let item = {
    token:'1234567890',
    image:'/media/artworks/sdg01.jpg',
    name:'Sustainable NFT',
    author:'Kuyawa',
    price:'10.00 XRP',
    fees:'50',
    beneficiary:'United Nations'
  }
  let props = {session, item}
  return {props}
}

function onBuy(evt){
  let token = evt.target.dataset.token
  console.log('TOKEN:', token)
  // TODO: buy token
  document.getElementById('message').innerHTML = 'NOT READY YET'
  alert('Not reay yet')
}

export default function Community(props) {
  let {item} = props
  return (
    <Layout props={props}>
      <section className={styles.main}>
        <h1 className={styles.mainTitle}>BUY NFT</h1>
        <h3 className={styles.subTitle}>TOKEN ID: {item.token}</h3>
        <div className={styles.item}>
          <Image className={styles.itemImage} src={item.image} width={200} height={200} alt="Sustainable Development Group" />
          <div className={styles.itemInfo}>
            <label className={styles.itemName}>{item.name}</label>
            <label className={styles.itemAuthor}>Author: <Link href={`/profile?id=${item.author}`}>{item.author}</Link></label>
            <label className={styles.itemPrice}>Price: {item.price}</label>
            <label className={styles.itemFees}>{item.fees}% will go to {item.beneficiary}</label>
          </div>
        </div>
        <button className={styles.itemButton} data-token={item.token} onClick={onBuy}>BUY NOW</button>
        <div id="message" className={styles.message}>In order to buy NFTs you need to have XUMM wallet in your phone</div>
      </section>
    </Layout>
  )
}
