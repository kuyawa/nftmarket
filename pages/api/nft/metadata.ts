import { NextApiRequest, NextApiResponse } from 'next'
import ipfsUpload from 'libs/uploaders/upload-ipfs'
import Session    from 'libs/utils/session'
import Random     from 'libs/utils/random'

export default async function metadataNFTHandler(req:NextApiRequest, res:NextApiResponse){
  let session = Session(req)
  if(!session?.account){
    return res.status(401).json({success:false, error:'Unauthorized'})
  }
  let meta = req.body
  // Upload metadata to IPFS
  let metadata = {
    mintedBy:     'EnlightenMint',
    created:      new Date().toJSON(),
    author:       session.account,
    organization: meta.organization,
    name:         meta.name,
    image:        meta.image,
    blockchain:   "XRPL",
    network:      process.env.XRPL_NETWORK
  }
  let name  = Random.string()
  let bytes = JSON.stringify(metadata)
  let ipfs  = await ipfsUpload(name, bytes, 'text/plain')
  if(ipfs.error){
    return res.status(500).json({success:false, error:ipfs.error})
  }
  return res.status(200).json({success:true, metaUri:'ipfs:'+ipfs.cid})
}