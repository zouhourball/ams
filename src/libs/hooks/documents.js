import { useMutation } from 'react-query'

import { addDocuments, deleteDocument } from 'libs/api/supporting-document-api'

const documents = () => {
  const { mutate, data, isLoading } = useMutation(addDocuments)
  const { mutate: deleteDoc } = useMutation(deleteDocument)

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
    mutate(newFiles)
  }

  const deleteDocuments = (files) => {
    // array of filesId
    return Promise.all(files.map((file) => deleteDoc(file)))
  }

  return { addSupportingDocuments, isLoading, data, deleteDocuments }
}

export default documents
