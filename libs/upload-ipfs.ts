import {S3Client, PutObjectCommand, HeadObjectCommand} from '@aws-sdk/client-s3'

// Uploads buffer data to AWS IPFS pinning service
// Can be a file or text as metadata
// Data must be passed as buffer of bytes:
//   Text can be read as Buffer.from(text)
//   File can be read as fs.readFileSync(path)
// Mime type is required text/plain image/jpeg image/png
//export default async function ipfsUpload(fileId:string, bytes:Buffer, mimeType:string) {
export default async function ipfsUpload(fileId, bytes, mimeType) {
  try {
    let region = process.env.IPFS_DEFAULT_REGION
    let bucket = process.env.IPFS_DEFAULT_BUCKET
    let point  = process.env.IPFS_API_ENDPOINT
    let apikey = process.env.IPFS_API_KEY
    let secret = process.env.IPFS_API_SECRET
    let gateway= process.env.IPFS_GATEWAY_URL
    let params = {
      Bucket: bucket,
      Key: fileId,
      ContentType: mimeType,
      Body: bytes
    }
    let config = {
      endpoint: point, 
      region: region,
      credentials: {
        accessKeyId: apikey,
        secretAccessKey: secret
      }
    }
    let client = new S3Client(config)
    let action = new PutObjectCommand(params)
    let result = await client.send(action)
    //console.log('PUT', result)
    if(!result?.ETag){
      return {success:false, error:'Error uploading file to IPFS'}
    }
    let head = new HeadObjectCommand({Bucket: bucket, Key: fileId})
    let data = await client.send(head)
    //console.log('GET', data)
    //data.$metadata.httpStatusCode === 200
    if(!data?.Metadata?.cid){
      return {success:false, error:'Error retrieving file info'}
    }
    let cid = data?.Metadata?.cid
    return {success:true, cid:cid, url:gateway+cid}
  } catch(ex) {
    console.error(ex)
    return {success:false, error:ex.message}
  }
}
