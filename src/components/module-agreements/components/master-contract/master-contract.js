import { useState, useRef, useEffect } from 'react'
import Dropzone from 'react-dropzone'
import {
  Button,
  FontIcon,
  Avatar,
  IconSeparator,
  DialogContainer,
} from 'react-md'
import { get } from 'lodash-es'
import moment from 'moment'
import { cls } from 'reactutils'

import mastercontract from './masterContract.svg'
import UserInfos from 'components/module-agreements/components//user-Infos'
import { MasterContractLoader } from 'components/module-agreements/components//loaders/loaders'
import RemarksFooter from 'components/module-agreements/components/remarks-footer'
import FilePreview from 'components/module-agreements/components/file-preview'

import { getPublicUrl } from 'libs/utils/custom-function'
import { useTranslation } from 'libs/langs'

import './style.scss'

const MasterContract = ({
  getUploadedFiles,
  role,
  member,
  collapsePanelLabel,
  leftIcon,
  iconColor,
  showAction,
  actions,
  onClickDownload,
  AgreementFiles,
  agreementId,
  loading,
  updateSectionEntityStatus,
  getMasterContractStatus,
  activityId,
  amendedAgreement,
  onDeleteUploadedFile,
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
        get(AgreementFiles, 'section_entity.id', '') &&
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

  const handleOnclick = e => {
    // e.stopPropagation()
  }

  const renderFileIcon = type => {
    switch (type) {
      case 'pdf':
        return (
          <FontIcon
            className="file-icon pdf"
            iconClassName="mdi mdi-file-pdf"
          />
        )
      case 'image/jpg':
      case 'image/jpeg':
      case 'image/png':
        return (
          <FontIcon className="file-icon" iconClassName="mdi mdi-file-image" />
        )
    }
  }
  const Item = ({ label, children }) => (
    <IconSeparator
      label={label}
      iconBefore
      component="li"
      className="md-cell md-cell--12"
    >
      {children}
    </IconSeparator>
  )
  const humanFileSize = size => {
    const i = Math.floor(Math.log(size) / Math.log(1024))
    return (
      (size / Math.pow(1024, i)).toFixed(2) * 1 +
      ' ' +
      ['B', 'kB', 'MB', 'GB', 'TB'][i]
    )
  }

  const renderFiles = file => {
    return (
      <>
        {AgreementFiles && AgreementFiles.id && (
          <div className="agreementFile">
            <div className="agreementFile-file-details">
              {renderFileIcon(file.content_type)}
              <div className="file-name">
                <div className="title"> {file.file_name} </div>
                <div className="file-size"> {humanFileSize(file.size)} </div>
              </div>
              <Button
                icon
                className="uploadButton"
                iconClassName="mdi mdi-eye"
                onClick={() => {
                  setPreviewFile(file)
                }}
              />
              <Button
                icon
                className="uploadButton"
                iconClassName="mdi mdi-download"
                onClick={() => {
                  onClickDownload(file)
                }}
              ></Button>
              {file.canDelete && (
                <Button
                  icon
                  className="uploadButton"
                  iconClassName="mdi mdi-delete"
                  onClick={onDeleteUploadedFile}
                />
              )}
            </div>
            <div className="agreementFile-footer">
              <div className="agreementFile-footer-details">
                <UserInfos subject={AgreementFiles.created_by || ''}>
                  {user => {
                    return (
                      <>
                        <span>
                          {get(user, 'photo.aPIID') ? (
                            <Item label={user.fullName}>
                              <Avatar
                                src={getPublicUrl(user.photo.aPIID)}
                                role="presentation"
                              />
                            </Item>
                          ) : (
                            <Item label={user.fullName}>
                              <Avatar icon={<FontIcon>person</FontIcon>} />
                            </Item>
                          )}
                        </span>
                      </>
                    )
                  }}
                </UserInfos>
              </div>
              <div className="agreementFile-footer-details">
                <FontIcon iconClassName="mdi mdi-calendar-clock" />
                <label>
                  {file &&
                    moment(file.created_at).format('D/MM/YYYY [at] h:mm A')}
                </label>
              </div>
            </div>
          </div>
        )}
        {!AgreementFiles ||
          (!AgreementFiles.id && (
            <div className="no-files">No Files Available</div>
          ))}
      </>
    )
  }

  const handleUploadFiles = acceptedFiles => {
    getUploadedFiles(acceptedFiles)
  }
  const status = get(getMasterContractStatus, 'data.section_entity.status', '')
  const disableButton =
    activityId ||
    !(role && role.find(elem => elem.id === 2)) ||
    (role &&
      role.find(elem => elem.id === 2) &&
      status === 'APPROVED' &&
      !amendedAgreement)
  const remark = get(getMasterContractStatus, 'data.section_entity.remarks', '')
  return (
    <div className={cls('master-contract', updateStatus || '')}>
      <div className="header-contract-panel">
        <img src={mastercontract} width="16px" />
        <label className="psaPanel_label">{collapsePanelLabel}</label>
        {showAction && <div className="psaPanel_rightButtons">{actions}</div>}
      </div>
      {remark && <RemarksFooter remark={remark} />}
      {loading ? (
        <MasterContractLoader />
      ) : !disableButton ? (
        <div>
          <div className="master-contract-dropzone">
            <Dropzone
              multiple={false}
              onDrop={acceptedFiles => handleUploadFiles(acceptedFiles)}
            >
              {({ getRootProps, getInputProps }) => (
                <div className="dropzone" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <FontIcon iconClassName="mdi mdi-file-import"></FontIcon>
                  <p>
                    {t('drag_drop')}{' '}
                    <span
                      className="dropzone-wrapper-blue-text"
                      onClick={e => handleOnclick(e)}
                    >
                      {t('select_contract')}
                    </span>
                  </p>
                </div>
              )}
            </Dropzone>
          </div>
          {AgreementFiles && AgreementFiles.id && (
            <div className="content-contract-panel">
              {renderFiles(AgreementFiles)}
            </div>
          )}
        </div>
      ) : (
        agreementId && (
          <div className="content-contract-panel">
            {renderFiles(AgreementFiles)}
          </div>
        )
      )}
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
          width="100%"
          onHide={() => setPreviewFile(null)}
          modal
          focusOnMount={false}
          portal={true}
          lastChild={true}
          renderNode={document.body}
        >
          <FilePreview
            testLink={previewFile.url}
            isPdf={previewFile.content_type === 'application/pdf'}
          />
        </DialogContainer>
      )}
    </div>
  )
}
export default MasterContract
