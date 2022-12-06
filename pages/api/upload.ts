import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import fileUpload from '/libs/upload-aws.ts'
// @ts-ignore
import ipfsUpload from '/libs/upload-ipfs.ts'
import formidable from 'formidable'
import * as fs from 'fs'

// To avoid bodyParser corrupting file data
export const config = {
  api: {
    bodyParser: false
  }
}

export default async function Upload(req:NextApiRequest, res:NextApiResponse){
  console.log('Uploading...')
  let form = new formidable.IncomingForm()
  form.parse(req, async function (err, data, files) {
    if(err){
      console.log('ERROR:', err)
      return res.status(500).json({success:false, error:'Error uploading file'})
    }
    let file = files.file
    let path = file.filepath
    let orig = file.originalFilename
    let mime = file.mimetype
    let size = file.size
    console.log('DATA', data)
    console.log('FILE', orig)
    console.log('PATH', path)
    console.log('MIME', mime)
    console.log('SIZE', size)
    let bytes = await fs.readFileSync(path)
    await fs.unlinkSync(path)
    //await fs.writeFileSync(orig, bytes)
    // awsUpload
    let resp = await fileUpload(data.name, bytes, mime)
    console.log('URL', resp)
    if(resp.error){
      return res.status(500).json({success:false, error:resp.error})
    }
    // ipfsUpload
    let ipfs = await ipfsUpload(data.name, bytes, mime)
    console.log('URL', ipfs)
    if(ipfs.error){
      return res.status(500).json({success:false, error:ipfs.error})
    }
    return res.status(200).json({success:true, image:resp.image, type:resp.type, url:resp.url, ipfs:ipfs.cid, uri:ipfs.url})
  })
}