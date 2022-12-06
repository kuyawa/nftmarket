import Head   from 'next/head';
import Link   from 'next/link';
import Image  from 'next/image';
import Layout from '/components/layout.jsx';
import common from '/styles/common.module.css';

export async function getServerSideProps({req,res,query}){
  return {
    redirect: {destination: '/nft/new', permanent: false}
  }
}


export default function Mint(props) {
  return (
    <Layout>
      <section className={common.center}>
        <h1>MINT</h1>
      </section>
    </Layout>
  )
}
