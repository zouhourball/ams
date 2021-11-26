import { useMutation } from 'react-query'

import { addDocuments } from 'libs/api/supporting-document-api'

const documents = () => {
  const { mutate, data, isLoading } = useMutation(addDocuments)

  const addSupportingDocuments = (files, processInstanceId) => {
    // this files must be from filemanager
    if (!files || files.length === 0 || !processInstanceId) {
      return null
    }
    const newFiles = files.map(
      ({ subject, contentType, filename, id, size, url }) => ({
        author: subject,
        contentType,
        fileId: id,
        filename,
        id,
        processInstanceId,

        size,
        url,
      }),
    )
    return mutate(newFiles)
  }
  return { addSupportingDocuments, isLoading, data }
}

export default documents
