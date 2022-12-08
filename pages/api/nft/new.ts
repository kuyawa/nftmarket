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
  let taxon = '1234567890' // public collection for NFTs without collection
  console.log('COLLID:', nft.collectionId)
  let collection = await getCollectionById(nft.collectionId)
  if(collection.success){
    taxon = collection.data.taxon
  }
  // Get organization info
  let organizationName = 'United Nations' // Default org if no beneficiary
  console.log('ORGID:', nft.beneficiaryId)
  let organization = await getOrganizationById(nft.beneficiaryId)
  if(organization.success){
    organizationName = organization.data.name
  }

  // Upload metadata to IPFS
  let metadata = {
    mintedBy:     'EnlightenMint',
    created:      nft.created,
    author:       session.account,
    organization: organizationName,
    name:         nft.name,
    image:        nft.artwork
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
  console.log('IPFS', ipfs)
  if(ipfs.error){
    return res.status(500).json({success:false, error:ipfs.error})
  }

  // Mint NFT
  let uri  = ipfs.cid
  let mint = await mintNFT(uri, taxon)
  console.log('MINT', mint)
  if(mint.error){
    return res.status(500).json({success:false, error:mint.error})
  }

  // Save to DB
  nft.tokenId  = mint.tokenId
  nft.metadata = ipfs.cid
  let art = await createArtwork(nft)
  console.log('ART', art)
  if(art.error){
    return res.status(500).json({success:false, error:art.error})
  }
  let artworkId = art.data.id // recently created artwork

  // Create sell offer
  let sell = await sellOffer(mint.tokenId, session.account)
  console.log('SELL', sell)
  if(sell.error){
    return res.status(500).json({success:false, error:sell.error})
  }

  // Save sell offer
  let offer = {
    created:       new Date(),
    type:          0,
    sellerId:      nft.authorId,
    collectionId:  nft.collectionId,
    artworkId:     artworkId,
    tokenId:       nft.tokenId,
    price:         nft.price,
    royalties:     nft.royalties,
    beneficiaryId: nft.beneficiaryId,
    wallet:        '',
    offerId:       sell.offerId,
    status:        1    // 0.created 1.accepted 2.declined
  }
  console.log('OFFER', offer)
  let result = await createOffer(offer)
  console.log('RESULT', result)
  if(result.error){
    return res.status(500).json({success:false, error:result.error})
  }
  return res.status(200).json({success:true, metaUri:nft.metadata, nftId:offer.artworkId, tokenId:offer.tokenId, offerId:offer.offerId})
}