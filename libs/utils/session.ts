// Session data for all pages
export default function Session(req) {
  console.log(new Date(), req.url)
  let theme     = req.cookies?.theme||'lite'
  let network   = req.cookies?.network||'nft-devnet'
  let account   = req.cookies?.account||null
  let userid    = req.cookies?.userid||null
  let username  = req.cookies?.username||null
  let usertoken = req.cookies?.usertoken||null
  //console.log('Cookies :', req.cookies)
  //console.log('Theme   :', theme)
  //console.log('Network :', network)
  //console.log('Account :', account)
  //console.log('UserId  :', userid)
  //console.log('UserName:', username)
  let data = {theme, network, account, userid, username, usertoken}
  return data
}
