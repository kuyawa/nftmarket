import Head    from 'next/head';
import Link    from 'next/link';
import Layout  from '/components/layout.jsx';
import common  from '/styles/common.module.css'
import styles  from '/styles/curated.module.css'
import Session from '/libs/utils/session.ts'

export async function getServerSideProps({req,res,query}){
  let session = Session(req)
  let props = {session}
  return {props}
}

export default function Curated(props) {
    return (
    <Layout props={props}>
            <section className={styles.main}>
                <h1 className={styles.mainTitle}>CURATED NFT COLLECTIONS</h1>
                <div className={styles.sustainable}>
                    <div className={styles.cat01}>
                        <img src="/media/categories/sdg.png" width="600px" />
                    </div>
                    <h1>SELECT A GOAL</h1>
                    <div className={styles.catList}>
                        <img className={styles.catImage} src="/media/categories/sdg01.png" width="200px" height="200px" />
                        <img className={styles.catImage} src="/media/categories/sdg02.png" width="200px" height="200px" />
                        <img className={styles.catImage} src="/media/categories/sdg03.png" width="200px" height="200px" />
                        <img className={styles.catImage} src="/media/categories/sdg04.png" width="200px" height="200px" />
                        <img className={styles.catImage} src="/media/categories/sdg05.png" width="200px" height="200px" />
                        <img className={styles.catImage} src="/media/categories/sdg06.png" width="200px" height="200px" />
                        <img className={styles.catImage} src="/media/categories/sdg07.png" width="200px" height="200px" />
                        <img className={styles.catImage} src="/media/categories/sdg08.png" width="200px" height="200px" />
                        <img className={styles.catImage} src="/media/categories/sdg09.png" width="200px" height="200px" />
                        <img className={styles.catImage} src="/media/categories/sdg10.png" width="200px" height="200px" />
                        <img className={styles.catImage} src="/media/categories/sdg11.png" width="200px" height="200px" />
                        <img className={styles.catImage} src="/media/categories/sdg12.png" width="200px" height="200px" />
                        <img className={styles.catImage} src="/media/categories/sdg13.png" width="200px" height="200px" />
                        <img className={styles.catImage} src="/media/categories/sdg14.png" width="200px" height="200px" />
                        <img className={styles.catImage} src="/media/categories/sdg15.png" width="200px" height="200px" />
                        <img className={styles.catImage} src="/media/categories/sdg16.png" width="200px" height="200px" />
                        <img className={styles.catImage} src="/media/categories/sdg17.png" width="200px" height="200px" />
                    </div>
                </div>
            </section>
        </Layout>
    )
}
