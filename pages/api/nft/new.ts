import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import ipfsUpload from '/libs/uploaders/upload-ipfs.ts'
// @ts-ignore
import mintNFT    from '/libs/nft/mint.ts'
// @ts-ignore
import sellOffer  from '/libs/nft/sellOffer.ts'
// @ts-ignore
import Session    from '/libs/utils/session.ts'
// @ts-ignore
import Random     from '/libs/utils/random.ts'
// @ts-ignore
import {createArtwork, createOffer, getCollectionById, getOrganizationById} from '/libs/data/registry.ts'


export default async function NewNFT(req:NextApiRequest, res:NextApiResponse){
  console.log('New NFT...')
  let session = Session(req)
  let {metadata, taxon} = req.body
  console.log('DATA:', {metadata, taxon})

  // Mint NFT
  let mint = await mintNFT(metadata, taxon)
  console.log('MINT', mint)
  if(mint.error){
    return res.status(500).json({success:false, error:mint.error})
  }
  let tokenId = mint.tokenId 
  return res.status(200).json({success:true, tokenId:tokenId})
}