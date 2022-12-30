import { NextApiRequest, NextApiResponse } from 'next'
import Session from 'libs/utils/session'
import {createArtwork} from 'libs/data/registry'

export default async function saveNFTHandler(req:NextApiRequest, res:NextApiResponse){
  let session = Session(req)
  let nft = req.body
  let result = await createArtwork(nft)
  if(result.error){
    return res.status(500).json({success:false, error:result.error})
  }
  let artworkId = result.data.id // recently created artwork
  return res.status(200).json({success:true, nftId:artworkId})
}