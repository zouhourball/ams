import { useState, useEffect } from 'react'
import { FontIcon, CircularProgress } from 'react-md'

import { getPreviewFile, getPreviewPDFFile } from 'libs/api/api-file-manager'
import { useTranslation } from 'libs/langs'

import './style.scss'

const FilePreview = ({ testLink, isPdf }) => {
  const [fileResult, setFileResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const recursiveStatus = () => {
    getPreviewFile(testLink)
      .then((res) => {
        if (res.ok) {
          setFileResult(res.blobURL)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    if (testLink) {
      setFileResult(null)
      setLoading(true)
      isPdf
        ? getPreviewPDFFile(testLink)
          .then((res) => {
            if (res.ok) {
              setFileResult(res.blobURL)
            }
            setLoading(false)
          })
          .catch(() => setLoading(false))
        : recursiveStatus()
    }
  }, [testLink])

  return !testLink ? (
    <div>
      <FontIcon>insert_drive_file</FontIcon>
      <p>{t('no_preview')}</p>
    </div>
  ) : loading ? (
    <CircularProgress />
  ) : fileResult ? (
    <embed
      width="100%"
      height="850"
      className="pdfObject"
      src={fileResult}
      // type="application/pdf"
      internalinstanceid="88"
    />
  ) : (
    <div className="empty-content">{t('something_wrong')}</div>
  )
}

export default FilePreview
