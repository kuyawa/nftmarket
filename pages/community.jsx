import Head    from 'next/head';
import Link    from 'next/link';
import Image   from 'next/image';
import Layout  from '/components/layout.jsx';
import common  from '/styles/common.module.css'
import Session from '/libs/session.ts'

export async function getServerSideProps({req,res,query}){
  let session = Session(req)
  let list = [
  {
    token:'1234567890',
    image:'/media/artworks/sdg01.jpg',
    name:'Sustainable NFT',
    author:'Kuyawa',
    price:'10.00 XRP',
    fees:'50',
    beneficiary:'United Nations'
  },
  {
    token:'1234567890',
    image:'/media/artworks/sdg02.jpg',
    name:'Sustainable NFT',
    author:'Kuyawa',
    price:'10.00 XRP',
    fees:'50',
    beneficiary:'United Nations'
  },
  {
    token:'1234567890',
    image:'/media/artworks/sdg03.jpg',
    name:'Sustainable NFT',
    author:'Kuyawa',
    price:'10.00 XRP',
    fees:'50',
    beneficiary:'United Nations'
  },
  {
    token:'1234567890',
    image:'/media/artworks/sdg04.jpg',
    name:'Sustainable NFT',
    author:'Kuyawa',
    price:'10.00 XRP',
    fees:'50',
    beneficiary:'United Nations'
  },
  {
    token:'1234567890',
    image:'/media/artworks/sdg05.jpg',
    name:'Sustainable NFT',
    author:'Kuyawa',
    price:'10.00 XRP',
    fees:'50',
    beneficiary:'United Nations'
  },
  {
    token:'1234567890',
    image:'/media/artworks/sdg06.jpg',
    name:'Sustainable NFT',
    author:'Kuyawa',
    price:'10.00 XRP',
    fees:'50',
    beneficiary:'United Nations'
  },
  {
    token:'1234567890',
    image:'/media/artworks/sdg07.jpg',
    name:'Sustainable NFT',
    author:'Kuyawa',
    price:'10.00 XRP',
    fees:'50',
    beneficiary:'United Nations'
  },
  ]
  let props = {session, list}
  return {props}
}

function linkProfile(id){
  return '/profile?id='+id.toLowerCase()
}

export default function Community(props) {
  return (
    <Layout props={props}>
      <section className={common.main}>
        <h1 className={common.mainTitle}>COMMUNITY MINTED NFTS</h1>
        <div className={common.listItems}>
        {props.list.map(item => (
          <div className={common.item}>
            <Image className={common.itemImage} src={item.image} width={200} height={200} alt="Sustainable Development Group" />
            <div className={common.itemInfo}>
              <label className={common.itemName}>{item.name}</label>
              <label className={common.itemAuthor}>Author: <Link href={`/profile?id=${item.author}`}>{item.author}</Link></label>
              <label className={common.itemPrice}>Price: {item.price}</label>
              <label className={common.itemFees}>{item.fees}% will go to {item.beneficiary}</label>
            </div>
            <Link href={`/nft/${item.token}`} className={common.itemButton} data-token={item.token}>BUY NOW</Link>
          </div>
        ))}
        </div>
      </section>
    </Layout>
  )
}
