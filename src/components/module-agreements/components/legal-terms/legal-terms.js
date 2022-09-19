import { useRef, useEffect, useState } from 'react'
import { cls } from 'reactutils'
import { get } from 'lodash-es'

import RemarksFooter from 'components/module-agreements/components/remarks-footer'
import CustomExpansionPanel from 'components/module-agreements/components/custom-expansion-panel'
import { HeaderOption } from 'components/module-agreements/components/psa-panel/psa-panel'
// import { checkIcon, errorIcon } from 'components/animated-icons/animated-icons'
import { TextLoader } from 'components/module-agreements/components/loaders/loaders'
import HtmlEditor from 'components/module-agreements/components/html-editor'

import './style.scss'

const LegalTerms = ({
  collapsePanelLabel,
  leftIcon,
  iconColor,
  legalTermsData,
  handleLegalTermsData,
  role,
  onApprove,
  handleRequestAmend,
  amendedAgreement,
  actions,
  showAction,
  agreementId,
  updateSectionEntityStatus,
  loading,
  activityId,
}) => {
  const [updateStatus, setUpdateStatus] = useState(false)

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
        get(legalTermsData, 'section_entity.id', '') &&
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
  const status = get(legalTermsData, 'section_entity.status', '')
  const disableButton =
    activityId ||
    !(role && role.find(elem => elem.id === 2)) ||
    (role &&
      role.find(elem => elem.id === 2) &&
      status === 'APPROVED' &&
      !amendedAgreement)
  const remark = get(legalTermsData, 'section_entity.remarks', '')
  return (
    <CustomExpansionPanel
      defaultExpanded={agreementId}
      className={cls('legal-terms', updateStatus || '')}
      header={
        <HeaderOption
          actions={actions}
          showAction={showAction}
          label={collapsePanelLabel}
          icon={leftIcon}
          iconColor={iconColor}
        />
      }
      body={
        loading ? (
          <TextLoader />
        ) : (
          agreementId && (
            <>
              {remark && <RemarksFooter remark={remark} />}
              {!disableButton ? (
                get(legalTermsData, 'content', null) ? (
                  <HtmlEditor
                    className="legal-terms"
                    key={1}
                    value={legalTermsData && legalTermsData.content}
                    onChange={value =>
                      handleLegalTermsData({
                        ...legalTermsData,
                        content: value,
                      })
                    }
                  />
                ) : (
                  <HtmlEditor
                    className="legal-terms"
                    key={2}
                    value={legalTermsData && legalTermsData.content}
                    onChange={value =>
                      handleLegalTermsData({
                        ...legalTermsData,
                        content: value,
                      })
                    }
                  />
                )
              ) : (
                <div
                  className="padding-content"
                  dangerouslySetInnerHTML={{ __html: legalTermsData.content }}
                />
              )}
            </>
          )
        )
      }
    />
  )
}

export default LegalTerms
