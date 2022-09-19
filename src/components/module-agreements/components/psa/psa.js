import { useEffect, useRef } from 'react'
import query from '@target-energysolutions/react-hoc-query'
import { get } from 'lodash-es'

import AgreementSession from '../agreement-section/agreement-session'
import mutate from 'libs/hocs/mutate'
import { agreementsData } from './helpersV2'

import {
  getCurrentConfiguration,
  getAvailableSections,
  getAvailableRoles,
  addUpdateConfiguration,
  deleteConfiguration,
} from 'libs/api/api-psa'

import './style.scss'

function usePrevious (value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const PSA = ({
  getAvailableSections,
  mutations: {
    addUpdateConfiguration,
    deleteConfiguration,
    getCurrentConfiguration,
  },
  organizationId,
  addUpdateConfigurationStatus,
  deleteConfigurationStatus,
  getCurrentConfigurationStatus,
}) => {
  const prevConfiguration = usePrevious(addUpdateConfigurationStatus)
  const prevDelete = usePrevious(deleteConfigurationStatus)

  useEffect(() => {
    getCurrentConfiguration(organizationId)
  }, [])

  useEffect(() => {
    if (
      !addUpdateConfigurationStatus.pending &&
      addUpdateConfigurationStatus.data === 'success'
    ) {
      getCurrentConfiguration(organizationId)
    }
  }, [prevConfiguration])

  useEffect(() => {
    if (
      !deleteConfigurationStatus.pending &&
      deleteConfigurationStatus.data &&
      deleteConfigurationStatus.data.deleted === 1
    ) {
      getCurrentConfiguration(organizationId)
    }
  }, [prevDelete])

  const addUpdateStream = (roleId, member, sectionId) => {
    addUpdateConfiguration(organizationId, {
      section_id: sectionId,
      role_id: roleId,
      user_sub: member.subject,
    })
  }
  const deleteStream = (roleId, member, sectionId) => {
    deleteConfiguration(organizationId, {
      section_id: sectionId,
      role_id: roleId,
      user_sub: member.subject,
    })
  }
  const findAgreementDetail = (idAgreement) => {
    return (
      agreementsData.find((agreement) => agreement.id === idAgreement) || {}
    )
  }
  const findAgreementConfig = (idAgreement) => {
    const ags = get(getCurrentConfigurationStatus, 'data.sections', [])
    const ag = ags && ags.find((agreement) => agreement.id === idAgreement)

    if (ag) {
      return { users: ag.users }
    } else {
      return null
    }
  }
  const onRemoveUser = (member, sectionId) => {
    deleteConfiguration(organizationId, { section_id: sectionId, ...member })
  }

  const renderCards = () => {
    const ags = get(getAvailableSections, 'data', [])

    return ags?.map((agreement, index) => (
      <AgreementSession
        // organizationID={organizationId}
        key={index}
        data={{
          ...findAgreementDetail(agreement.id),
          ...agreement,
          ...findAgreementConfig(agreement.id),
          loading: getCurrentConfigurationStatus.pending,
        }}
        className="md-cell md-cell--3"
        addUpdateStream={addUpdateStream}
        deleteStream={deleteStream}
        removeUser={onRemoveUser}
      />
    ))
  }
  // console.log(renderCards(), 'renderCards')
  return <div className="psa md-grid">{renderCards()}</div>
}

export default mutate({
  moduleName: `psaConfig`,
  mutations: {
    addUpdateConfiguration,
    deleteConfiguration,
    getCurrentConfiguration,
  },
})(
  query({
    key: 'getAvailableRoles',
    op: getAvailableRoles,
    name: 'getAvailableRoles',
  })(
    query({
      key: 'getAvailableSections',
      op: getAvailableSections,
      name: 'getAvailableSections',
    })(PSA),
  ),
)
