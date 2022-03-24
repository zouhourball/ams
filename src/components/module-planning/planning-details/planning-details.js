import { navigate } from '@reach/router'
import { Button, SelectField } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { useQuery, useMutation } from 'react-query'
import { useMemo, useState, useCallback, useEffect } from 'react'
import moment from 'moment'

import { downloadOriginalFile } from 'libs/api/supporting-document-api'
import useRole from 'libs/hooks/use-role'
import {
  getDetailPlanningById,
  getDetailPlanningByVersion,
  updatePlanning,
  updateWpbStatus,
  getActionsList,
} from 'libs/api/api-planning'

import TopBarDetail from 'components/top-bar-detail'
import SupportedDocument from 'components/supported-document'
import {
  configsWpbDialogMht,
  configsFypDialogMht,
  configsBudgetDialogMht,
} from '../mht-helper-dialog'
import { wpbData, fypData } from '../helpers'
import { buildObjectFromArray } from '../utils'

import './style.scss'

const PlanningDetails = ({ objectId, subModule }) => {
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [version, setVersion] = useState('1.0')
  const role = useRole('planning')
  const { data: dataDetails, refetch } = useQuery(
    ['getDetailPlanningById', objectId, subModule],
    objectId && getDetailPlanningById,
  )
  const { data: dataDetailsByVersion, refetch: refetchDetailData } = useQuery(
    ['getDetailPlanningByVersion', objectId, subModule, version],
    objectId &&
      version?.length &&
      subModule === 'wpb' &&
      getDetailPlanningByVersion,
  )
  const { data: actionsList } = useQuery(
    ['wbpActions', objectId],
    getActionsList,

    // return array
  )
  const updatePlanningMutation = useMutation(updatePlanning, {
    onSuccess: (res) => {
      refetch()
      version && refetchDetailData()
    },
  })
  const updateStatusMutation = useMutation(updateWpbStatus, {
    onSuccess: (res) => {
      if (!res?.error) {
        refetch()
        version && refetchDetailData()
      }
    },
  })
  const rawData = version ? dataDetailsByVersion : dataDetails
  const planningDataDetails = useMemo(() => {
    switch (subModule) {
      case 'wpb':
        return wpbData(rawData) || []
      case 'fyp':
        return fypData(dataDetails) || []
      case 'budgetary-report':
        return (
          (dataDetails?.data || [])?.map((el) => ({
            ...el,
            ...buildObjectFromArray(el.years),
          })) || []
        )
      default:
        return []
    }
  }, [dataDetails, dataDetailsByVersion])

  const versionsList = useMemo(
    () =>
      dataDetails?.versions?.map((v) => ({
        label: v,
        value: v,
      })),
    [dataDetails],
  )
  useEffect(() => {
    versionsList && setVersion(versionsList[versionsList?.length - 1].value)
  }, [dataDetails])
  const currentYear =
    rawData?.categories &&
    rawData?.categories[0]?.subCategories[0]?.kpis[0]?.values[0]?.year

  const headerData = () => {
    return {
      title: `Block ${rawData?.metaData?.block}`,
      companyName: rawData?.metaData?.company,
      submittedBy: rawData?.metaData?.createdBy?.name,
      submittedDate: moment(rawData?.metaData?.createdAt).format(
        'DD MMM, YYYY',
      ),
    }
  }

  const submitDraft = (subModule, objectId) => {
    updatePlanningMutation.mutate({
      subModule: subModule,
      objectId: objectId,
      status: 'SUBMITTED',
    })
  }
  const configsMht = useCallback(() => {
    switch (subModule) {
      case 'wpb':
        return configsWpbDialogMht()
      case 'budgetary-report':
        return [
          ...configsBudgetDialogMht(),
          ...(dataDetails?.data[0]?.years?.map((el) => ({
            label: el.year + '',
            key: el.year + '',
            width: '200',
            icon: 'mdi mdi-spellcheck',
            type: 'text',
          })) || []),
        ]

      case 'fyp':
        return configsFypDialogMht(currentYear)
      default:
        return []
    }
  }, [dataDetails])
  const updateStatus = (objectId, status) => {
    updateStatusMutation.mutate({
      objectId,
      status,
    })
  }
  const handleStatus = (key) => {
    const roleKey = role.slice(0, -1)

    return updateStatus(
      objectId,
      key === 'accept' ? (roleKey === 'JMC' ? `APPROVE` : `ENDORSE`) : `REJECT`,
    )
  }
  const actions = [
    <Button
      key="1"
      id="edit"
      className="top-bar-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {
        downloadOriginalFile(
          rawData?.metaData?.originalFileId,
          rawData?.metaData?.originalFileName,
        )
      }}
    >
      Download Original File
    </Button>,
    <Button
      key="2"
      id="viewDoc"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      swapTheming
      onClick={() => {
        setShowSupportedDocumentDialog(true)
      }}
    >
      {role === 'operator' ? 'Supporting documents' : 'View Documents'}
    </Button>,

    role === 'operator' && rawData?.metaData?.status === 'DRAFT' && (
      <Button
        key="4"
        id="acknowledge"
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
          submitDraft(subModule, objectId, 'SUBMITTED')
        }}
      >
        Commit
      </Button>
    ),

    actionsList?.length > 0 &&
      (actionsList?.includes('ENDORSE') || actionsList?.includes('APPROVE')) &&
      ((
        <Button
          key="4"
          id="accept"
          className="top-bar-buttons-list-item-btn"
          flat
          primary
          swapTheming
          onClick={() => {
            handleStatus('accept')
          }}
        >
          Accept
        </Button>
      ),
      (
        <Button
          key="4"
          id="reject"
          className="top-bar-buttons-list-item-btn"
          flat
          primary
          swapTheming
          onClick={() => {
            handleStatus('reject')
          }}
        >
          Reject
        </Button>
      )),

    // role === 'JMC Chairman' && (
    //   <>
    //     <Button
    //       key="3"
    //       id="joinMeeting"
    //       className="top-bar-buttons-list-item-btn"
    //       flat
    //       primary
    //       swapTheming
    //       onClick={() => {}}
    //     >
    //       Join Meeting
    //     </Button>
    //     ,
    //     <Button
    //       key="4"
    //       id="reject"
    //       className="top-bar-buttons-list-item-btn"
    //       flat
    //       primary
    //       swapTheming
    //       onClick={() => {}}
    //     >
    //       Reject
    //     </Button>
    //     ,
    //     <Button
    //       key="5"
    //       id="approve"
    //       className="top-bar-buttons-list-item-btn"
    //       flat
    //       primary
    //       swapTheming
    //       onClick={() => {}}
    //     >
    //       Approve
    //     </Button>
    //     ,
    //   </>
    // ),
  ]

  return (
    <div className="details-container">
      <TopBarDetail
        detailData={headerData()}
        onClickBack={() => navigate(`/ams/planning/${subModule}`)}
        actions={actions}
      />
      <Mht
        configs={configsMht()}
        tableData={planningDataDetails}
        withSearch
        commonActions
        withSubColumns
        hideTotal={false}
        withFooter
        headerTemplate={
          subModule === 'wpb' && (
            <SelectField
              id="versions"
              menuItems={versionsList}
              block
              position={SelectField.Positions.BELOW}
              value={version}
              onChange={setVersion}
              simplifiedMenu={false}
            />
          )
        }
      />
      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          readOnly={role === 'regulator'}
          processInstanceId={
            rawData?.metaData?.processInstanceId ||
            showSupportedDocumentDialog?.processInstanceId
          }
          // onSaveUpload={(data) => {
          //   handleSupportingDocs(data)
          // }
          // }
        />
      )}
    </div>
  )
}
export default PlanningDetails
