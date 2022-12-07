import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import { createUser } from '/libs/data/registry.ts';

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  let { method, headers, query, body } = req
  switch (method) {
    case "POST":
      let resp = await createUser(body)
      return res.status(200).json(resp)
  }
}