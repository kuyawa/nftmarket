import Image   from 'next/image'
import Layout from '/components/layout.jsx';
import common from '/styles/common.module.css';


export default function NotFound(props) {
    return (
        <Layout>
            <section className={common.notFound}>
                <Image src="/media/images/logo-color.png" width={250} height={250} />
                <h1>404 NOT FOUND</h1>
            </section>
        </Layout>
    )
}
