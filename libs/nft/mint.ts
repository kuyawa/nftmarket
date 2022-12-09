import {Wallet, Client, convertStringToHex, NFTokenMintFlags} from 'xrpl'
// @ts-ignore
import findToken from '/libs/ripple/findToken.ts'

// Mints NFT and returns tokenId
//   uri: uri to metadata
//   taxon: same id for all similar nfts
//   beneficiary: issuer wallet
//   royalties: percentage
export default async function mintNFT(uri:string, taxon:string, beneficiary: string, royalties: number) {
  console.log('MINTING...', uri, taxon, beneficiary, royalties)
  let client = null
  try {
    let wallet   = Wallet.fromSeed(process.env.CFCE_MINTER_WALLET_SEED)
    let account  = wallet.classicAddress
    let nftUri   = convertStringToHex(uri)
    let nftTaxon = parseInt(taxon)
    let flags    = NFTokenMintFlags.tfBurnable + NFTokenMintFlags.tfOnlyXRP + NFTokenMintFlags.tfTransferable
    console.log('MINTER', account)
    let tx = {
      TransactionType: 'NFTokenMint',
      Account:         account,
      Issuer:          null,
      URI:             nftUri,   // uri to metadata
      NFTokenTaxon:    nftTaxon, // id for all nfts in same collection
      Flags:           flags,    // burnable, onlyXRP, transferable
      TransferFee:     10000     // 10% royalties
    }
    if(beneficiary){
      if(account!==beneficiary){
        tx.Issuer = beneficiary // must be different than minter
      }
      tx.TransferFee = royalties * 1000
    }
    console.log('MINT TX', tx)
    client = new Client(process.env.XRPL_WSS_URI)
    await client.connect()
    let txInfo = await client.submitAndWait(tx,{wallet})
    console.log('Result:', txInfo?.result?.meta?.TransactionResult)
    if(txInfo?.result?.meta?.TransactionResult=='tesSUCCESS'){
      let tokenId = findToken(txInfo)
      console.log('TokenId:', tokenId)
      return {success:true, tokenId:tokenId}
    }
  } catch(ex) {
    console.error(ex)
    return {success:false, error:'Error minting NFT'}
  } finally {
    client?.disconnect()
  }
}
