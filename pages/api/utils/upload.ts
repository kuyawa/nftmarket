import { NextApiRequest, NextApiResponse } from 'next'
import fileUpload from 'libs/uploaders/upload-aws'
import formidable from 'formidable'
import * as fs from 'fs'

// To avoid bodyParser corrupting file data
export const config = {
  api: {
    bodyParser: false
  }
}

export default async function uploadHandler(req:NextApiRequest, res:NextApiResponse){
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
    let bytes = await fs.readFileSync(path)
    await fs.unlinkSync(path)
    // awsUpload
    let resp = await fileUpload(data.name, bytes, mime)
    if(resp.error){
      return res.status(500).json({success:false, error:resp.error})
    }
    return res.status(200).json({success:true, image:resp.image, type:resp.type, url:resp.url})
  })
}