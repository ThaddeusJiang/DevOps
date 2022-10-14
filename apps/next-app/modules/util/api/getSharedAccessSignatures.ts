import axios from "axios";

import { AzureSharedAccessSignaturesObj } from 'types'

export async function getSharedAccessSignatures (): Promise<AzureSharedAccessSignaturesObj> {
  const res = await axios.post('/api/generateSharedAccessSignatures')
  return res.data
}
