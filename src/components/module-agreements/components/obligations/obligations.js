import { useEffect, useRef, useState } from 'react'
import { get } from 'lodash-es'
import { cls } from 'reactutils'

import RemarksFooter from 'components/module-agreements/components/remarks-footer'
import CustomExpansionPanel from 'components/module-agreements/components/custom-expansion-panel'
import { HeaderOption } from 'components/module-agreements/components/psa-panel'
import HtmlEditor from 'components/module-agreements/components/html-editor'
import { TextLoader } from 'components/module-agreements/components/loaders/loaders'

const Obligations = props => {
  const {
    obligationData,
    handleObligationData,
    role,
    actions,
    showAction,
    agreementId,
    loading,
    updateSectionEntityStatus,
    activityId,
    amendedAgreement,
  } = props

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
        get(obligationData, 'section_entity.id', '') &&
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

  const status = get(obligationData, 'section_entity.status', '')
  const disableButton =
    activityId ||
    !(role && role.find(elem => elem.id === 2)) ||
    (role &&
      role.find(elem => elem.id === 2) &&
      status === 'APPROVED' &&
      !amendedAgreement)
  const remark = get(obligationData, 'section_entity.remarks', '')

  return (
    <CustomExpansionPanel
      defaultExpanded={agreementId}
      className={cls('obligations', updateStatus || '')}
      header={
        <HeaderOption
          label={props.collapsePanelLabel}
          icon={props.leftIcon}
          iconColor={props.iconColor}
          defaultExpanded={agreementId}
          actions={actions}
          showAction={showAction}
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
                get(obligationData, 'content', null) ? (
                  <HtmlEditor
                    className="obligations"
                    key={1}
                    value={obligationData && obligationData.content}
                    onChange={value =>
                      handleObligationData({
                        ...obligationData,
                        content: value,
                      })
                    }
                  />
                ) : (
                  <HtmlEditor
                    className="obligations"
                    key={2}
                    value={obligationData && obligationData.content}
                    onChange={value =>
                      handleObligationData({
                        ...obligationData,
                        content: value,
                      })
                    }
                  />
                )
              ) : (
                <div
                  className="padding-content"
                  dangerouslySetInnerHTML={{ __html: obligationData.content }}
                />
              )}
            </>
          )
        )
      }
    />
  )
}

export default Obligations
