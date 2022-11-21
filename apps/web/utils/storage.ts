import * as FileSaver from 'file-saver'
import { BlobServiceClient } from '@azure/storage-blob'

import { getSharedAccessSignatures } from 'modules/util/api/getSharedAccessSignatures'

async function getContainerClient () {
  const sharedAccessSignaturesObj = await getSharedAccessSignatures()
  const blobServiceClient = new BlobServiceClient(sharedAccessSignaturesObj.url)
  return blobServiceClient.getContainerClient(sharedAccessSignaturesObj.containerName)
}

export async function download (blobName: string) {
  const filename = blobName.split('/').pop()
  const containerClient = await getContainerClient()
  const blobClient = containerClient.getBlobClient(blobName)
  const downloadBlockBlobResponse = await blobClient.download()
  const blob = await downloadBlockBlobResponse.blobBody
  FileSaver.saveAs(blob, filename)
}

export async function upload (file: File, blobName: string) {
  const containerClient = await getContainerClient()
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  return blockBlobClient.uploadData(file)
}
