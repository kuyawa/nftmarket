import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import ipfsUpload      from '/libs/upload-ipfs.ts'
// @ts-ignore
import mintNFT         from '/libs/nft/mint.ts'
// @ts-ignore
import {createArtwork} from '/libs/data/registry.ts'
// @ts-ignore
import Random          from '/libs/utils/random.ts'


export default async function NewNFT(req:NextApiRequest, res:NextApiResponse){
  console.log('New NFT...')
  let nft = req.body
  console.log('DATA:', nft)
/*
  let nft = {
    created:       new Date(),
    authorId:      session.userid,
    collectionId:  $('collection').value,
    name:          $('name').value,
    description:   $('description').value,
    media:         'image',
    image:         info.url, // aws
    artwork:       info.uri, // ipfs
    metadata:      '',       // fill on server
    tokenId:       '',       // fill on server
    royalties:     parseInt($('royalties').value),
    beneficiaryId: $('beneficiary').value,
    forsale:       true,
    copies:        parseInt($('copies').value),
    sold:          0,
    price:         parseInt($('price').value),
    tags:          $('tags').value,
    likes:         0,
    views:         0,
    category:      '',
    inactive:      false
  }
*/

  // Get collection taxon
  // TODO: registry get collection by id
  let taxon = '1234567890'

  // Upload metadata to IPFS
  let metadata = {
    mintedBy:     'EnlightenMint',
    created:      nft.created,
    author:       nft.authorId,     //<<
    organization: nft.organization, //<<
    image:        nft.artwork,
    //coinNetwork:  process.env.XRPL_NETWORK,
    //coinLabel:    'ripple',
    //coinSymbol:   'XRP',
    //coinValue:    nft.price,
    //usdValue:     amountUSD
  }
  console.log('META', metadata)
  let name  = Random.string()
  let bytes = JSON.stringify(metadata)
  let ipfs  = await ipfsUpload(name, bytes, 'text/plain')
  console.log('URL', ipfs)
  if(ipfs.error){
    return res.status(500).json({success:false, error:ipfs.error})
  }

  // Mint NFT
  let uri  = ipfs.cid
  let mint = await mintNFT(uri, taxon)
  if(mint.error){
    return res.status(500).json({success:false, error:mint.error})
  }

  // Save to DB
  nft.tokenId  = mint.tokenId
  nft.metadata = ipfs.cid

  // Create sell offer
  //
  let offerId = '1234567890'

  return res.status(200).json({success:true, metaUri:ipfs.cid, offerId:offerId})
}