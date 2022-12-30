const registryApiUrl = process.env.CFCE_REGISTRY_API_URL

type Dictionary = { [key:string]:any }

const fetchRegistry = async (endpoint: string, page: number = 0, size: number = 100) => {
  let url = `${registryApiUrl}/${endpoint}`
  console.log('GET', registryApiUrl)
  console.log('REGISTRY', url)
  let query = ''
  if(page){ query = '?page='+page }
  if(size){ query += (page?'&':'?')+'size='+size }
  if(query){ url += query }
  const options = {
    headers: {
      'x-api-key': process.env.CFCE_REGISTRY_API_KEY,
      'content-type': 'application/json'
    }
  }
  const response = await fetch(url, options)
  const result = await response.json()
  return result
}

const postRegistry = async (endpoint: string, data: Dictionary) => {
  const url = `${registryApiUrl}/${endpoint}`
  console.log('POST', process.env.CFCE_REGISTRY_API_URL)
  console.log('REGISTRY', url)
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': process.env.CFCE_REGISTRY_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify(data)
  }
  const response = await fetch(url, options)
  const result = await response.json()
  return result
}

const putRegistry = async (endpoint: string, data: Dictionary) => {
  const url = `${registryApiUrl}/${endpoint}`
  console.log('PUT', process.env.CFCE_REGISTRY_API_URL)
  console.log('REGISTRY', url)
  const options = {
    method: 'PUT',
    headers: {
      'x-api-key': process.env.CFCE_REGISTRY_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify(data)
  }
  const response = await fetch(url, options)
  const result = await response.json()
  return result
}


// Users
export const createUser = (data: Dictionary) => postRegistry('users', data)
export const updateUser = (data: Dictionary) => putRegistry('users', data)
export const getUserById = (id: string) => fetchRegistry(`users/${id}`)
export const getUserByName = (name: string) => fetchRegistry(`users/byname?name=${name}`)
export const getUserByWallet = (address: string) => fetchRegistry(`users/bywallet?address=${address}`)
// Organizations
export const getOrganizations = () => fetchRegistry(`organizations/list`)
export const getOrganizationById = (id: string) => fetchRegistry(`organizations/${id}`)
// Collections
export const createCollection = (data: Dictionary) => postRegistry('collections', data)
export const getCollectionById = (id: string) => fetchRegistry(`collections/${id}`)
export const getCollections = (page: number = 0, size: number = 100) => fetchRegistry('collections', page, size)
export const getCollectionsByUser = (id: string) => fetchRegistry(`collections/byuser?id=${id}`)
// Artworks
export const createArtwork = (data: Dictionary) => postRegistry('artworks', data)
export const getArtworkById = (id: string) => fetchRegistry(`artworks/${id}`)
export const getArtworks = (page: number = 0, size: number = 100) => fetchRegistry('artworks', page, size)
export const getArtworksByUser = (id: string) => fetchRegistry(`artworks/byuser?id=${id}`)
export const getArtworksByCollection = (id: string) => fetchRegistry(`artworks/bycollection?id=${id}`)
export const getArtworksCurated = (page: number = 0, size: number = 100) => fetchRegistry('artworks/curated', page, size)
export const getArtworksCommunity = (page: number = 0, size: number = 100) => fetchRegistry('artworks/community', page, size)
// Offers
export const createOffer = (data: Dictionary) => postRegistry('offers', data)
export const updateOffer = (data: Dictionary) => putRegistry('offers', data)
export const getOfferById = (id: string) => fetchRegistry(`offers/${id}`)
export const getOffers = (page: number = 0, size: number = 100) => fetchRegistry('offers', page, size)
export const getOffersBySeller = (id: string) => fetchRegistry(`offers/byseller?id=${id}`)
export const getOffersByBuyer  = (id: string) => fetchRegistry(`offers/bybuyer?id=${id}`)
