import { NextApiRequest, NextApiResponse } from 'next'
import { createUser, updateUser } from 'libs/data/registry'

export default async function usersHandler(req:NextApiRequest, res:NextApiResponse){
  let { method, body } = req
  let record = body
  let result
  switch (method) {
    case "POST":
      result = await createUser(record)
      return res.status(200).json(result)
      break
    case "PUT":
      result = await updateUser(record)
      return res.status(200).json(result)
      break
    default:
      return res.status(500).json({success:false, error:'Invalid HTTP method'})
  }
}