import Layout from '/components/layout.jsx';
import common from '/styles/common.module.css';


export default function NotFound(props) {
    return (
        <Layout>
            <section className={common.center}>
                <h1>404 NOT FOUND</h1>
            </section>
        </Layout>
    )
}
