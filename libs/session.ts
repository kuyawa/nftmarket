// Session data for all pages
export default function Session(req) {
  let theme     = req.cookies?.theme||'dark'
  let network   = req.cookies?.network||'nft-devnet'
  let account   = req.cookies?.account||null
  let username  = req.cookies?.username||null
  let usertoken = req.cookies?.usertoken||null
  //console.log('Cookies :', req.cookies)
  console.log(new Date(), req.url)
  //console.log('Theme   :', theme)
  //console.log('Network :', network)
  //console.log('Account :', account)
  //console.log('UserName:', username)
  let data = {theme, network, account, username, usertoken}
  return data
}
