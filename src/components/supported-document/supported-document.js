import { useEffect, useState } from 'react'
import { FontIcon } from 'react-md'

import Dropzone from 'react-dropzone'

import { fileManagerUpload } from 'libs/api'

const SupportedDocument = ({ oldFiles }) => {
  const [files, setFiles] = useState(null)

  useEffect(() => {
    if (oldFiles && oldFiles.length > 0) { setFiles(...files, oldFiles) }
  }, [oldFiles])

  const onUpload = documents => {
    fileManagerUpload(documents).then(res => {
      if (res?.files) {
        setFiles([...res?.files])
      }
    })
  }

  return (
    <div className="supported-document">
      <Dropzone
        onDrop={onUpload}
        accept="image/*"
        multiple={true}
        className="dropzone-logo"
      >

        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <FontIcon>file_upload</FontIcon>
              <p>Drag and drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone>
      {
          files?.map((file) => {
            return (
              <div key={file.id}>{file.filename}</div>
            )
          })
      }
    </div>
  )
}

export default SupportedDocument