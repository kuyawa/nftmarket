import Head    from 'next/head';
import Link    from 'next/link';
import Image   from 'next/image';
import Layout  from '/components/layout.jsx';
import common  from '/styles/common.module.css'
import Session from '/libs/utils/session.ts'

export async function getServerSideProps({req,res,query}){
  return {
    redirect: {destination: '/market', permanent: false}
  }
}

export default function Community(props) {
  return (
    <Layout props={props}>
      <section className={common.center}>
        <h1>MARKET</h1>
      </section>
    </Layout>
  )
}
