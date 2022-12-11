import {Wallet, Client, xrpToDrops, isoTimeToRippleTime, NFTokenCreateOfferFlags} from 'xrpl'
// @ts-ignore
import findOffer from '/libs/ripple/findOffer.ts'

// Creates a sell offer
//   tokenId: nft that will be offered
//   destinAcct: address that will approve the offer
//   expires: optional date if offer will expire
export default async function sellOffer(tokenId:string, destinationAddress:string, amount:string,  offerExpirationDate?:Date) {
  console.log('New sell offer:', tokenId, destinationAddress, amount)
  let client = null
  let expiry = null
  let drops = xrpToDrops(amount||0)
  if(offerExpirationDate){ 
    expiry = isoTimeToRippleTime(offerExpirationDate) // must be Ripple epoch
  }
  console.log('expiry', expiry)
  try {
    let wallet  = Wallet.fromSeed(process.env.CFCE_MINTER_WALLET_SEED)
    let account = wallet.classicAddress
    console.log('From account:', account)
    let tx = {
      TransactionType: 'NFTokenCreateOffer',
      Account:         account,
      NFTokenID:       tokenId,
      Destination:     destinationAddress,
      Amount:          drops,  // Zero if it is a transfer
      Flags:           NFTokenCreateOfferFlags.tfSellNFToken // sell offer
    }
    client = new Client(process.env.XRPL_WSS_URI)
    await client.connect()
    let txInfo = await client.submitAndWait(tx, {wallet})
    console.log('Result:', txInfo?.result?.meta?.TransactionResult)
    if(txInfo?.result?.meta?.TransactionResult=='tesSUCCESS'){
      let offerId = findOffer(txInfo)
      console.log('OfferId', offerId)
      return {success: true, offerId:offerId}
    } else {
      return {success: false, error:'Failure creating sell offer'}
    }
  } catch(ex) {
    console.error(ex)
    return {success: false, error:'Error creating sell offer'}
  } finally {
    client?.disconnect()
  }
}
