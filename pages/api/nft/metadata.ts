import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import ipfsUpload from '/libs/uploaders/upload-ipfs.ts'
// @ts-ignore
import Session    from '/libs/utils/session.ts'
// @ts-ignore
import Random     from '/libs/utils/random.ts'


export default async function NewNFT(req:NextApiRequest, res:NextApiResponse){
  console.log('Uploading metadata...')
  let session = Session(req)
  let meta = req.body
  console.log('BODY:', meta)

  // Upload metadata to IPFS
  let metadata = {
    mintedBy:     'EnlightenMint',
    created:      new Date().toJSON(),
    author:       session.account,
    organization: meta.organizationName,
    name:         meta.name,
    image:        meta.artwork
  }
  console.log('META', metadata)
  let name  = Random.string()
  let bytes = JSON.stringify(metadata)
  let ipfs  = await ipfsUpload(name, bytes, 'text/plain')
  console.log('IPFS', ipfs)
  if(ipfs.error){
    return res.status(500).json({success:false, error:ipfs.error})
  }
  return res.status(200).json({success:true, metaUri:ipfs.cid})
}