import { NextApiRequest, NextApiResponse } from 'next'
import mintNFT from 'libs/nft/mint'
import Session from 'libs/utils/session'

export default async function newNFTHandler(req:NextApiRequest, res:NextApiResponse){
  let session = Session(req)
  let {metadata, taxon, beneficiary, royalties} = req.body
  let mint = await mintNFT(metadata, taxon, beneficiary, royalties)
  if(mint.error){
    return res.status(500).json({success:false, error:mint.error})
  }
  let tokenId = mint.tokenId 
  return res.status(200).json({success:true, tokenId:tokenId})
}