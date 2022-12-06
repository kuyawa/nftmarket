import Head   from 'next/head';
import Link   from 'next/link';
import Image  from 'next/image';
import Layout from '/components/layout.jsx';
import common from '/styles/common.module.css';
//import styles from '/styles/market.module.css';

function onBuy(){
    console.log('Buy...')
}

export default function Market(props) {
    return (
        <Layout>
            <section className={common.center}>
                <h1>MARKET</h1>
            </section>
        </Layout>
    )
}
