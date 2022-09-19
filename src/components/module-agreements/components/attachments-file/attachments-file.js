import { useState, useRef, useEffect } from 'react'
import { get } from 'lodash-es'
import { cls } from 'reactutils'
import { DialogContainer, Button, ExpansionList } from 'react-md'

import { HeaderOption } from 'components/module-agreements/components//psa-panel'
import { FileLoader } from 'components/module-agreements/components//loaders/loaders'
import CustomExpansionPanel from 'components/module-agreements/components/custom-expansion-panel'
import RemarksFooter from 'components/module-agreements/components//remarks-footer'
import FilePreview from 'components/module-agreements/components//file-preview'
import AttachmentCollapsePanel from 'components/module-agreements/components/attachment-collapse-panel'
import { useTranslation } from 'libs/langs'

import './style.scss'

const Attachments = ({
  categoryList,
  uploadDocs,
  role,
  collapsePanelLabel,
  leftIcon,
  iconColor,
  listUploadedFile,
  agreementId,
  // uploadFile,
  onDelete,
  actions,
  showAction,
  loading,
  updateSectionEntityStatus,
  activityId,
  amendedAgreement,
}) => {
  const { t } = useTranslation()
  const [updateStatus, setUpdateStatus] = useState(false)
  const [previewFile, setPreviewFile] = useState(null)

  const usePrevious = value => {
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }
  const prevUpdateSectionEntityStatus = usePrevious({
    ...updateSectionEntityStatus,
  })
  useEffect(() => {
    if (
      updateSectionEntityStatus &&
      updateSectionEntityStatus.data &&
      updateSectionEntityStatus.data.section ===
        get(listUploadedFile, 'section_entity.id', '') &&
      prevUpdateSectionEntityStatus &&
      !updateSectionEntityStatus.pending &&
      prevUpdateSectionEntityStatus.pending
    ) {
      setUpdateStatus(
        !updateSectionEntityStatus.data.error ? 'success' : 'error',
      )
      setTimeout(() => {
        setUpdateStatus(false)
      }, 10000)
    }
  }, [updateSectionEntityStatus])

  const status = get(listUploadedFile, 'section_entity.status', '')
  const disableDropzone =
    activityId ||
    !(role && role.find(elem => elem.id === 2)) ||
    (role &&
      role.find(elem => elem.id === 2) &&
      status === 'APPROVED' &&
      !amendedAgreement)
  const remark = get(listUploadedFile, 'section_entity.remarks', '')

  return (
    <CustomExpansionPanel
      defaultExpanded={agreementId}
      className={cls('attachments', updateStatus || '')}
      header={
        <HeaderOption
          icon={leftIcon}
          label={collapsePanelLabel}
          iconColor={iconColor}
          showAction={showAction}
          actions={actions}
        />
      }
      body={
        loading ? (
          <div className="md-grid">
            <div className="md-cell md-cell--4">
              <FileLoader />
            </div>
            <div className="md-cell md-cell--4">
              <FileLoader />
            </div>
            <div className="md-cell md-cell--4">
              <FileLoader />
            </div>
          </div>
        ) : (
          agreementId && (
            <>
              {remark && <RemarksFooter remark={remark} />}

              <ExpansionList className="attachmentList">
                {categoryList.map((cat, index) => (
                  <AttachmentCollapsePanel
                    setFileList={value => uploadDocs(value, cat.label)}
                    fileList={get(
                      get(listUploadedFile, 'attachments', []).find(
                        el => el.category.label === cat.label,
                      ),
                      'files',
                      [],
                    )}
                    index={index}
                    key={index}
                    category={cat}
                    disableDropzone={disableDropzone}
                    setPreviewFile={setPreviewFile}
                    onDelete={onDelete}
                  />
                ))}
              </ExpansionList>

              {previewFile && (
                <DialogContainer
                  title={
                    <>
                      <div>{t('preview')}</div>
                      <Button
                        icon
                        iconClassName="mdi mdi-close"
                        onClick={() => setPreviewFile(null)}
                        className="previewDialog-closeButton"
                        primary
                        swapTheming
                      />
                    </>
                  }
                  className="previewDialog"
                  visible={previewFile}
                  Preview
                  width="100%"
                  onHide={() => setPreviewFile(null)}
                  portal={true}
                  lastChild={true}
                  disableScrollLocking={true}
                  renderNode={document.body}
                  focusOnMount={false}
                >
                  <FilePreview
                    testLink={previewFile.url}
                    isPdf={previewFile.type === 'application/pdf'}
                  />
                </DialogContainer>
              )}
            </>
          )
        )
      }
    />
  )
}

export default Attachments
