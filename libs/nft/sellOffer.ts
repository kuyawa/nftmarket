import {Wallet, Client, isoTimeToRippleTime, NFTokenCreateOfferFlags} from 'xrpl'
// @ts-ignore
import findOffer from '/libs/ripple/findOffer.ts'

// Creates a sell offer
//   tokenId: nft that will be offered
//   destinAcct: address that will approve the offer
//   expires: optional date if offer will expire
export default async function sellOffer(tokenId:string, destinationAddress:string, offerExpirationDate:string) {
  console.log('New sell offer:', tokenId, destinationAddress)
  let client = null
  try {
    let wallet  = Wallet.fromSeed(process.env.CFCE_MINTER_WALLET_SEED)
    let account = wallet.classicAddress
    console.log('From account:', account)
    let tx = {
      TransactionType: 'NFTokenCreateOffer',
      Account:         account,
      NFTokenID:       tokenId,
      Destination:     destinationAddress,
      Amount:          '0',  // Zero price as it is a transfer
      Flags:           NFTokenCreateOfferFlags.tfSellNFToken // sell offer
    }
    //if(offerExpirationDate){ 
    //  tx.Expiration = isoTimeToRippleTime(offerExpirationDate) // must be Ripple epoch
    //}
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
