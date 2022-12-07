import Router  from 'next/router';
import Head    from 'next/head';
import Link    from 'next/link';
import Image   from 'next/image';
import Layout  from '/components/layout.jsx'
import styles  from '/styles/login.module.css'
import Session from '/libs/utils/session.ts'
import {XummPkce}  from 'xumm-oauth2-pkce'
import {setCookie} from 'cookies-next'


async function xummHandler(state){
  console.log('STATEX', state)
  let connected = false
  if(state.me.account){
    let account = state.me.account
    let network = state.me.networkType
    let usertoken = state.jwt
    if(state.me.networkEndpoint.startsWith('wss://xls20')){
      let network = 'NFT-DEVNET'
    }
    // get user from registry
    let resp = await fetch('/api/users/wallet/'+account)
    let user = await resp.json()
    let userid = ''
    let username = ''
    console.log('USER', user)
    if(!user.success){
      let data = {
        api_key:       '',
        email:         '',
        emailVerified: false,
        image:         '',
        name:          account.substr(0,10),
        description:   'A new user',
        wallet:        account,
        type:          0,
        created:       new Date(),
        inactive:      false
      }
      let create = await fetch('/api/users', {
        method:'POST', 
        headers:{'content-type':'application/json'}, 
        body:JSON.stringify(data)
      })
      let result = await create.json()
      console.log('CREATE', result)
      if(result.success){ 
        userid   = result.data.id
        username = result.data.name
      }
    } else {
      userid   = user.data.id
      username = user.data.name
    }
    console.log('account',  account)
    console.log('network',  network)
    console.log('userid',   userid)
    console.log('username', username)
    //console.log('usertoken', usertoken)
    setCookie('account',   account)
    setCookie('network',   network)
    setCookie('userid',    userid)
    setCookie('username',  username)
    setCookie('usertoken', usertoken)
    connected = true
  }
  if(connected){
    console.log('Connected')
    Router.push('/profile') // After connect, redirect to /profile
  }
}

async function onConnect(){
  console.log('Connect...')
  xummStart()
}

async function onLogout(){
  console.log('Logout...')
  xummLogout()
  setCookie('account',   '')
  setCookie('userid',    '')
  setCookie('username',  '')
  setCookie('usertoken', '')
}

function showMessage(text, warn){
  if(warn){ text = '<warn>'+text+'</warn>' }
  document.getElementById('message').innerHTML = text
}

async function xummLogout(){
  let xumm = new XummPkce(process.env.NEXT_PUBLIC_XUMM_APP_KEY)
  xumm.logout()
  showMessage('XUMM wallet disconnected')
  console.log('Disconnected')
}

async function xummStart(){
  console.log('XUMM start...')
  try {
    let xumm = new XummPkce(process.env.NEXT_PUBLIC_XUMM_APP_KEY)
    xumm.logout()
    xumm.on('error', async (ex) => {
      console.log('XUMM error', ex)
    })
    xumm.on('success', async () => {
      console.log('XUMM started')
    })
    //xumm.on('retrieved', async () => {
    //    console.log('Retrieved: from localStorage or mobile browser redirect')
    //    let state = await xumm.state()
    //    xummHandler(state)
    //})
    let state = await xumm.authorize()
    console.log('STATE:', state)
    xummHandler(state)
  } catch(ex) {
    console.error(ex)
  }
}

export async function getServerSideProps({req,res,query}){
  let session = Session(req)
  let props = {session}
  return {props}
}

export default function Login(props) {
  //console.log('LOGIN PROPS', props)
  //console.log('APIKEY', process.env.NEXT_PUBLIC_XUMM_APP_KEY)
  return (
    <Layout>
      <section className={styles.login}>
        <div className={styles.action}>
          <h1>CONNECT YOUR WALLET</h1>
          <h2>You need to connect your XUMM wallet before minting NFTs</h2>
          <div className={styles.actions}>
            <button id="login" className={styles.actionButton} onClick={onConnect}>CONNECT</button>
          </div>
          <div id="message">You must scan a qrcode with your wallet and accept the request</div>
          <button id="logout" className={styles.miniButton} onClick={onLogout}>LOGOUT</button>
        </div>
        <div className={styles.wallet}>
          <Image priority className={styles.walletImage} src="/media/images/xumm.png" width={300} height={325} alt="xumm wallet" />
          <h1 className={styles.walletTitle}>We use <b>XUMM</b> as our preferred crypto wallet</h1>
          <p>In order to mint NFTs you will need to install <Link id="getwallet" href="https://xumm.app/" target="_blank">XUMM wallet</Link> in your mobile phone and have some XRP funds as all transactions will be stored in Ripple blockchain</p>
          <p className={styles.walletStores}>
            <Link href="https://play.google.com/store/apps/details?id=com.xrpllabs.xumm" target="_blank"><Image className={styles.getWallet} src="/media/images/getandroid.png" width={150} height={50} alt="android store" /></Link> 
            <Link href="https://apps.apple.com/us/app/xumm/id1492302343" target="_blank"><Image className={styles.getWallet} src="/media/images/getapple.png" width={150} height={50} alt="apple store" /></Link> 
            <Image className={styles.walletQrcode} src="/media/images/nftdevnet.png" width={100} height={120} alt="qrcode" />
          </p>
          <p>Once installed, scan the qrcode to add NFT-DEVNET to XUMM wallet as NFTs in Ripple are in beta for the moment</p>
          <p>Then go to the <Link href="https://xrpl.org/xrp-testnet-faucet.html" target="_blank">faucet</Link> to get some test coins to start minting some NFTs, remember to use NFT-DEVNET again</p>
        </div>
      </section>
    </Layout>
  )
}

//Login.getInitialProps = async function(ctx){
//    console.log('CLIENT PROPS')
//    let state = await xummStart()
//    return {props:{name:'test', account:state?.me?.account}}
//}