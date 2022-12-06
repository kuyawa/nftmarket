import Head   from 'next/head';
import Link   from 'next/link';
import Image  from 'next/image';
import Layout from '/components/layout.jsx';
import common from '/styles/common.module.css';


export default function Support(props) {
    return (
        <Layout>
            <section className={common.center}>
                <h1>FAQ</h1>
            </section>
        </Layout>
    )
}
