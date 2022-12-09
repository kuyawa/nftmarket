import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import mintNFT from '/libs/nft/mint.ts'
// @ts-ignore
import Session from '/libs/utils/session.ts'


export default async function NewNFT(req:NextApiRequest, res:NextApiResponse){
  console.log('NEW NFT...')
  let session = Session(req)
  let {metadata, taxon, beneficiary, royalties} = req.body
  console.log('DATA:', {metadata, taxon, beneficiary, royalties})

  // Mint NFT
  let mint = await mintNFT(metadata, taxon, beneficiary, royalties)
  console.log('MINT', mint)
  if(mint.error){
    return res.status(500).json({success:false, error:mint.error})
  }
  let tokenId = mint.tokenId 
  return res.status(200).json({success:true, tokenId:tokenId})
}