import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import Session    from '/libs/utils/session.ts'
// @ts-ignore
import {createArtwork} from '/libs/data/registry.ts'


export default async function saveNFT(req:NextApiRequest, res:NextApiResponse){
  console.log('SAVE NFT...')
  let session = Session(req)
  let nft = req.body
  console.log('DATA:', nft)

  let art = await createArtwork(nft)
  console.log('ART', art)
  if(art.error){
    return res.status(500).json({success:false, error:art.error})
  }
  let artworkId = art.data.id // recently created artwork
  return res.status(200).json({success:true, nftId:artworkId})
}