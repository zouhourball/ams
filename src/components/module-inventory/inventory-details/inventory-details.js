import { navigate } from '@reach/router'
import { Button, FontIcon, SelectField } from 'react-md'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash-es'
import { useState, useEffect } from 'react'
import moment from 'moment'
import { useQuery as useQueryHook } from 'react-apollo-hooks'
import workers from 'libs/queries/workers.gql'

import { messengerAct } from '@target-energysolutions/messenger'
import Mht from '@target-energysolutions/mht'

import { addToast } from 'modules/app/actions'
import useRole from 'libs/hooks/use-role'
import addGroup from 'libs/hooks/add-group'

import {
  updateInventory,
  channelUpdate,
  getDetailInventoryById,
  getTransactionById,
  addTransaction,
  getAdditionsList,
  getSnapshotsByInventoryId,
  getSnapshotOfBase,
} from 'libs/api/api-inventory'

import TopBarDetail from 'components/top-bar-detail'
import SupportedDocument from 'components/supported-document'
import ToastMsg from 'components/toast-msg'
import SelectWorkspacesMembersDialog from 'components/select-workspaces-members-dialog'

import {
  annualBaseDetailsConfigs,
  annualBaseDetailsData,
  assetDisposalDetailsConfigs,
  assetConsumptionDetailsConfigs,
} from '../helpers'

import './style.scss'
import { downloadOriginalFile } from 'libs/api/supporting-document-api'

const InventoryDetails = () => {
  const dispatch = useDispatch()
  const role = useRole('inventory')
  const organizationID = useSelector((state) => state?.shell?.organizationId)

  const pathItems = get(location, 'pathname', '/').split('/').reverse()
  const currentTabName = pathItems[0]
  const inventoryId = pathItems[1]
  const [selectFieldValue, setSelectFieldValue] = useState('latest')

  const [rows, setRows] = useState([])
  const [chatId, setId] = useState('')
  const [showSelectMembersWorkspaces, setShowSelectMembersWorkspaces] =
    useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const categoryKeyword = [
    'base',
    'assetTransferRequestProcess',
    'assetDisposalRequestProcess',
  ]
  const transactionKeyword = [
    'consumptionReportProcess',
    'surplusInventoryProcess',
  ]
  const categoryAccepted = ['base-consumption', 'base-surplus']

  const { data: inventoryData, refetch: refetchInventory } = useQuery(
    ['getDetailInventoryById', currentTabName, inventoryId],
    categoryKeyword.includes(currentTabName) && getDetailInventoryById,
    {
      refetchOnWindowFocus: false,
    },
  )

  const { data: inventoryAcceptedData, refetch: refetchInventoryAccepted } =
    useQuery(
      ['getDetailInventoryById', 'base', inventoryId],
      categoryAccepted.includes(currentTabName) && getDetailInventoryById,
      {
        refetchOnWindowFocus: false,
      },
    )
  const { data: transactionData, refetch: refetchTransaction } = useQuery(
    ['getTransactionById', inventoryId],
    transactionKeyword.includes(currentTabName) && getTransactionById,
    {
      refetchOnWindowFocus: false,
    },
  )
  const { data: snapshotsData } = useQuery(
    ['getSnapshotsByInventoryId', inventoryId],
    categoryKeyword.includes(currentTabName) && getSnapshotsByInventoryId,
    {
      refetchOnWindowFocus: false,
    },
  )
  const { data: snapshotDataOfBase, refetch: refetchSnapshotBase } = useQuery(
    ['getSnapshotOfBase', inventoryId, selectFieldValue],
    selectFieldValue !== 'latest' &&
      currentTabName === 'base' &&
      getSnapshotOfBase,
    {
      refetchOnWindowFocus: false,
    },
  )
  const snaps = [
    { label: 'latest', value: 'latest' },
    ...(snapshotsData || [])?.map((el) => {
      return { label: el?.date, value: el?.transactionId }
    }),
  ]
  const { data: listAdditions } = useQuery(
    ['getListConsumptionDeclarationRecords', inventoryId, 0, 2000],
    getAdditionsList,
    {
      refetchOnWindowFocus: false,
    },
  )
  useEffect(() => {
    setId(inventoryData?.metaData?.discussionChannelId)
  }, [inventoryData])
  const channelUpdateMutation = useMutation(channelUpdate, {
    onSuccess: (res) => {
      if (res) {
        // navigate('/ams/inventory')
        renderRefetchAfterUpdate()
        dispatch(
          addToast(
            <ToastMsg
              text={res.message || 'created channel successfully '}
              type="success"
            />,
            'hide',
          ),
        )
      } else {
        dispatch(
          addToast(
            <ToastMsg
              text={res.error?.body?.message || 'Something went wrong'}
              type="error"
            />,
            'hide',
          ),
        )
      }
    },
  })
  const updateInventoryMutation = useMutation(updateInventory, {
    onSuccess: (res) => {
      if (!res.error) {
        navigate('/ams/inventory')
        renderRefetchAfterUpdate()

        dispatch(
          addToast(
            <ToastMsg text={res.message || 'success'} type="success" />,
            'hide',
          ),
        )
      } else {
        dispatch(
          addToast(
            <ToastMsg
              text={res.error?.body?.message || 'Something went wrong'}
              type="error"
            />,
            'hide',
          ),
        )
      }
    },
  })

  const addTransactionInventoryMutate = useMutation(
    addTransaction,

    {
      onSuccess: (res) => {
        if (!res.error) {
          navigate('/ams/inventory')
          dispatch(
            addToast(
              <ToastMsg
                text={res.message || 'Submitted successfully'}
                type="success"
              />,
              'hide',
            ),
          )
        } else {
          dispatch(
            addToast(
              <ToastMsg
                text={res.error?.body?.message || 'Something went wrong'}
                type="error"
              />,
              'hide',
            ),
          )
        }
      },
    },
  )
  const onSubmitInventory = () => {
    const data = rows?.map((el) => {
      let item = { ...el }
      if (el?.date && currentTabName === 'base-consumption') {
        item['Date of consumption'] = el?.date
      }
      if (el?.date && currentTabName === 'base-surplus') {
        item['Date of surplus'] = el?.date
      }
      return { data: item, inventoryId: inventoryId, rowId: el?.id }
    })

    const transactionType =
      currentTabName === 'base-consumption'
        ? 'consumptionReportProcess'
        : 'surplusInventoryProcess'
    addTransactionInventoryMutate.mutate({
      body: {
        data: data,
        inventoryId: inventoryId,
        processInstanceId: inventoryAcceptedData?.metaData?.processInstanceId,
        transactionType: transactionType,
      },
    })
  }

  const mhtBaseDetailData = (
    get(
      inventoryData || inventoryAcceptedData || transactionData,
      'rows',
      [],
    ) || []
  ).map((el) => {
    return {
      id: el?.rowId,
      materialName: el?.data['Material Name'],
      materialCategory: el?.data['Material Category'],
      materialDescription: el?.data['Material Description'],
      measurementUnit: el?.data['Measurement Unit'],
      currentSt: el?.data['Quantity'],
      quantity: el?.data['Quantity'],
      unitPrice: el?.data['Unit Price (USD)'],
    }
  })

  const mhtBaseDetailDataSnapchat = (
    get(snapshotDataOfBase, 'rows', []) || []
  ).map((el) => {
    return {
      id: el?.rowId,
      materialName: el?.data['Material Name'],
      materialCategory: el?.data['Material Category'],
      materialDescription: el?.data['Material Description'],
      measurementUnit: el?.data['Measurement Unit'],
      currentSt: el?.data['Quantity'],
      quantity: el?.data['Quantity'],
      unitPrice: el?.data['Unit Price (USD)'],
    }
  })
  const tableDataListAdditions = (get(listAdditions, 'content', []) || []).map(
    (el) => {
      return {
        id: el?.id,
        company: get(el, 'metaData.company', 'n/a'),
        block: get(el, 'metaData.block', 'n/a'),
        submittedDate: moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
        submittedBy: get(el, 'metaData.createdBy.name', 'n/a'),
        referenceDate: get(el, 'metaData.year', 'n/a'),
        statusDate: el?.metaData?.updatedAt
          ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
          : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
        status: get(el, 'metaData.status', 'n/a'),
        processInstanceId: get(el, 'metaData.processInstanceId', 'n/a'),
      }
    },
  )

  const mhtDisposalDetailData = (get(inventoryData, 'rows', []) || []).map(
    (el) => {
      return {
        id: el?.rowId,
        materialName: el?.data['Material Name'],
        materialCategory: el?.data['Material Category'],
        materialDescription: el?.data['Material Description '],
        measurementUnit: el?.data['Measurement Unit'],
        quantity: el?.data['Quantity'],
        unitPrice: el?.data['Unit Price (USD)'],
        classification: el?.data['Classification'],
        bookValue: el?.data['Book Value(USD)'],
        estimatedCurrentValue: el?.data['Estimated Current Value(USD)'],
        dateOfPurchase: el?.data['Date of Purchase'],
        averageLength: el?.data['Average Length'],
        grade: el?.data['Grade'],
        inspectionDate: el?.data['Inspection Date'],
        itemWeight: el?.data['Item Weight'],
        mTCertificate: el?.data['MT Certificate'],
        materialCondition: el?.data['Material Condition'],
        materialLocation: el?.data['Material Location'],
        reasonsForSale: el?.data['Reasons for Sale / Write - off'],
        remarks: el?.data['Remarks'],
        storageLocation: el?.data['Storage Location'],
        totalWeight: el?.data['Total Weight'],
        weight: el?.data['Weight'],
      }
    },
  )
  const renderCurrentTabData = () => {
    switch (currentTabName) {
      case 'base': // annual base tab 0
        return selectFieldValue === 'latest'
          ? mhtBaseDetailData
          : mhtBaseDetailDataSnapchat
      case 'assetTransferRequestProcess': // Asset Transfer tab 3
        return mhtBaseDetailData
      case 'assetDisposalRequestProcess': // Asset Disposal tab 4
        return mhtDisposalDetailData
      case 'base-consumption': // Asset Consumption tab 2
        return mhtBaseDetailData
      case 'base-surplus': // Surplus Declaration tab 3
        return mhtBaseDetailData
      case 'addition': // Addition tab 5
        return tableDataListAdditions
      default:
        return annualBaseDetailsData
    }
  }
  const renderRefetchAfterUpdate = () => {
    switch (currentTabName) {
      case 'base': // annual base tab 0
        return refetchInventory()
      case 'assetTransferRequestProcess': // Asset Transfer tab 3
        return refetchInventory()
      case 'assetDisposalRequestProcess': // Asset Disposal tab 4
        return refetchInventory()
      case 'base-consumption': // Asset Consumption tab 2
        return refetchInventoryAccepted()
      case 'base-surplus': // Surplus Declaration tab 3
        return refetchInventoryAccepted()
      default:
        return refetchTransaction()
    }
  }
  const renderCurrentTabConfigs = () => {
    switch (currentTabName) {
      case 'base':
        return annualBaseDetailsConfigs()
      case 'base-consumption':
        return assetConsumptionDetailsConfigs(
          rows,
          (v) => {
            setRows(v)
          },
          'Consumption',
          showDatePicker,
          setShowDatePicker,
        )
      case 'base-surplus':
        return assetConsumptionDetailsConfigs(rows, setRows, 'Surplus')
      case 'assetDisposalRequestProcess':
        return assetDisposalDetailsConfigs()
      default:
        return annualBaseDetailsConfigs()
    }
  }

  const onChangeStatus = (status) => {
    updateInventoryMutation.mutate({
      inventoryId: inventoryId,
      status: status,
    })
  }
  const chatChannelHandler = (id) => {
    channelUpdateMutation.mutate({
      inventoryId: inventoryId,
      channelId: id,
    })
  }

  const { data: membersByOrganisation } = useQueryHook(workers, {
    context: { uri: `${PRODUCT_WORKSPACE_URL}/graphql` },
    variables: { organizationID: organizationID, wsIDs: [] },
  })
  const membersByOrg = () => {
    let members = []
    members = membersByOrganisation?.workers?.map((el) => ({
      subject: el?.profile?.subject,
      fullName: el?.profile?.fullName,
    }))

    return members
  }

  const renderActionsByTab = () => {
    switch (currentTabName) {
      case 'base':
        return [
          role === 'regulator' && (
            <>
              <Button
                key="6"
                id="clarify"
                className="top-bar-buttons-list-item-btn discard"
                flat
                primary
                swapTheming
                onClick={() => {
                  // get discussionChannelId from API GET
                  // create and save discussionChannelId
                  !chatId && setShowSelectMembersWorkspaces(true)

                  // if discussionChannelId exists open chat
                  chatId &&
                    dispatch(
                      messengerAct.openChat({
                        channelId: chatId,
                        type: 'group',
                      }),
                    )
                }}
              >
                Clarify
              </Button>
              <Button
                key="7"
                id="support"
                className="top-bar-buttons-list-item-btn discard"
                flat
                primary
                swapTheming
                onClick={() => {}}
              >
                View Support Documents
              </Button>
              {inventoryData?.metaData?.status === 'APPROVED' ||
              inventoryData?.metaData?.status === 'ACCEPTED' ? (
                  <Button
                    key="8"
                    id="reject"
                    className="top-bar-buttons-list-item-btn approve"
                    flat
                    primary
                    swapTheming
                    disabled
                    iconEl={<FontIcon>check_circle</FontIcon>}
                    onClick={() => onChangeStatus('ACCEPTED')}
                  >
                  Accepted
                  </Button>
                ) : (
                inventoryData?.metaData?.status === 'SUBMITTED' && (
                  <>
                    {' '}
                    <Button
                      key="5"
                      id="reject"
                      className="top-bar-buttons-list-item-btn reject"
                      flat
                      primary
                      swapTheming
                      onClick={() => onChangeStatus('REJECTED')}
                    >
                      Reject
                    </Button>
                    <Button
                      key="3"
                      id="approve"
                      className="top-bar-buttons-list-item-btn approve"
                      flat
                      primary
                      swapTheming
                      onClick={() => onChangeStatus('ACCEPTED')}
                    >
                      Accept
                    </Button>
                  </>
                  )
                )}
            </>
          ),

          role === 'operator' && (
            <>
              <Button
                key="3"
                id="clarify"
                className="top-bar-buttons-list-item-btn view-doc"
                flat
                swapTheming
                onClick={() => {
                  // get discussionChannelId from API GET
                  // create and save discussionChannelId
                  !chatId && setShowSelectMembersWorkspaces(true)

                  // if discussionChannelId exists open chat
                  chatId &&
                    dispatch(
                      messengerAct.openChat({
                        channelId: chatId,
                        type: 'group',
                      }),
                    )
                }}
              >
                Clarify
              </Button>
              <Button
                key="2"
                id="edit"
                className="top-bar-buttons-list-item-btn discard"
                flat
                primary
                swapTheming
                onClick={() => {
                  downloadOriginalFile(
                    inventoryData?.metaData?.originalFileId,
                    inventoryData?.metaData?.originalFileName,
                  )
                }}
              >
                Download Original File
              </Button>
              <Button
                key="1"
                id="viewDoc"
                className="top-bar-buttons-list-item-btn view-doc"
                flat
                swapTheming
                onClick={() => {
                  setShowSupportedDocumentDialog(true)
                }}
              >
                Upload documents
              </Button>
            </>
          ),
        ]
      case 'base-consumption':
      case 'base-surplus':
        return [
          role === 'regulator' && (
            <>
              <Button
                key="6"
                id="clarify"
                className="top-bar-buttons-list-item-btn discard"
                flat
                primary
                swapTheming
                onClick={() => {
                  // get discussionChannelId from API GET
                  // create and save discussionChannelId
                  !chatId && setShowSelectMembersWorkspaces(true)

                  // if discussionChannelId exists open chat
                  chatId &&
                    dispatch(
                      messengerAct.openChat({
                        channelId: chatId,
                        type: 'group',
                      }),
                    )
                }}
              >
                Clarify
              </Button>
              <Button
                key="7"
                id="support"
                className="top-bar-buttons-list-item-btn discard"
                flat
                primary
                swapTheming
                onClick={() => {}}
              >
                View Support Documents
              </Button>
              {inventoryData?.metaData?.status === 'APPROVED' ? (
                <Button
                  key="8"
                  id="reject"
                  className="top-bar-buttons-list-item-btn approve"
                  flat
                  primary
                  swapTheming
                  disabled
                  iconEl={<FontIcon>check_circle</FontIcon>}
                  onClick={() => {}}
                >
                  Approved
                </Button>
              ) : (
                <>
                  {' '}
                  <Button
                    key="5"
                    id="reject"
                    className="top-bar-buttons-list-item-btn reject"
                    flat
                    primary
                    swapTheming
                    onClick={() => onChangeStatus('REJECTED')}
                  >
                    Reject
                  </Button>
                  <Button
                    key="3"
                    id="approve"
                    className="top-bar-buttons-list-item-btn approve"
                    flat
                    primary
                    swapTheming
                    onClick={() => onChangeStatus('APPROVED')}
                  >
                    Approve
                  </Button>
                </>
              )}
            </>
          ),

          role === 'operator' && (
            <>
              <Button
                key="1"
                id="viewDoc"
                className="top-bar-buttons-list-item-btn discard"
                flat
                swapTheming
                onClick={() => {
                  setShowSupportedDocumentDialog(true)
                }}
              >
                Upload documents
              </Button>

              <Button
                key="2"
                id="edit"
                className="top-bar-buttons-list-item-btn reject"
                flat
                primary
                swapTheming
                onClick={() => {
                  navigate(`/ams/inventory`)
                }}
              >
                Discard
              </Button>
              <Button
                key="3"
                id="edit"
                className="top-bar-buttons-list-item-btn approve"
                flat
                primary
                swapTheming
                onClick={() => {
                  onSubmitInventory()
                }}
              >
                Submit
              </Button>
            </>
          ),
        ]
      case 'assetDisposalRequestProcess':
        return []
      default:
        return [
          <Button
            key="2"
            id="edit"
            className="top-bar-buttons-list-item-btn"
            flat
            primary
            swapTheming
            onClick={() => {
              downloadOriginalFile(
                inventoryData?.metaData?.originalFileId,
                inventoryData?.metaData?.originalFileName,
              )
            }}
          >
            Download Original File
          </Button>,
          <Button
            key="1"
            id="viewDoc"
            className="top-bar-buttons-list-item-btn view-doc"
            flat
            swapTheming
            onClick={() => {
              setShowSupportedDocumentDialog(true)
            }}
          >
            Upload documents
          </Button>,
        ]
    }
  }

  const returnBack = () => {
    switch (currentTabName) {
      case 'base': // annual base tab 0
        return navigate('/ams/inventory/annual-base')
      case 'assetTransferRequestProcess': // Asset Transfer tab 3
        return navigate('/ams/inventory/asset-transfer')
      case 'assetDisposalRequestProcess': // Asset Disposal tab 4
        return navigate('/ams/inventory/asset-disposal')
      case 'base-consumption': // Asset Consumption tab 2
        return navigate('/ams/inventory/asset-consumption')
      case 'base-surplus': // Surplus Declaration tab 1
        return navigate('/ams/inventory/surplus-declaration')
      case 'addition': // Addition tab 5
        return navigate('/ams/inventory/new-asset-addition')
      default:
        return navigate('/ams/inventory/annual-base')
    }
  }

  const topBarDetail = () => {
    switch (currentTabName) {
      case 'base': // annual base tab 0
        return {
          title: `Annual Base | Block ${inventoryData?.metaData?.block}`,
          companyAllRoles: true,
          companyName: `${inventoryData?.metaData?.company}`,
          status: ` ${inventoryData?.metaData?.status}`,
          submittedBy: `${inventoryData?.metaData?.createdBy?.name}`,
        }
      case 'assetTransferRequestProcess': // Asset Transfer tab 3
        return {
          title: `Asset Consumption | Block ${inventoryData?.metaData?.block}`,
          companyAllRoles: true,
          companyName: `${inventoryData?.metaData?.company}`,
          status: ` ${inventoryData?.metaData?.status}`,
          submittedBy: `${inventoryData?.metaData?.createdBy?.name}`,
        }
      case 'assetDisposalRequestProcess': // Asset Disposal tab 4
        return {
          title: `Asset Disposal | Block ${inventoryData?.metaData?.block}`,
          companyAllRoles: true,
          companyName: `${inventoryData?.metaData?.company}`,
          status: ` ${inventoryData?.metaData?.status}`,
          submittedBy: `${inventoryData?.metaData?.createdBy?.name}`,
        }
      case 'base-consumption': // Asset Consumption tab 2
        return {
          title: `Declare Consumption | Block ${inventoryAcceptedData?.metaData?.block}`,
          companyAllRoles: true,
          companyName: `${inventoryAcceptedData?.metaData?.company}`,
          status: ` ${inventoryAcceptedData?.metaData?.status}`,
          submittedBy: `${inventoryAcceptedData?.metaData?.createdBy?.name}`,
        }
      case 'base-surplus': // Surplus Declaration tab 1
        return {
          title: `Declare Consumption | Block ${inventoryAcceptedData?.metaData?.block}`,
          companyAllRoles: true,
          companyName: `${inventoryAcceptedData?.metaData?.company}`,
          status: ` ${inventoryAcceptedData?.metaData?.status}`,
          submittedBy: `${inventoryAcceptedData?.metaData?.createdBy?.name}`,
        }
      case 'addition': // Addition tab 5
        return {
          title: `Addition | Block ${inventoryData?.metaData?.block}`,
          companyAllRoles: true,
          companyName: `${inventoryData?.metaData?.company}`,
          status: ` ${inventoryData?.metaData?.status}`,
          submittedBy: `${inventoryData?.metaData?.createdBy?.name}`,
        }
      default:
        break
    }
  }
  return (
    <div className="inventory-details">
      <TopBarDetail
        onClickBack={returnBack}
        actions={renderActionsByTab()}
        detailData={topBarDetail()}
      />
      <div className="inventory-details-table">
        <Mht
          configs={renderCurrentTabConfigs()}
          tableData={renderCurrentTabData()}
          withSearch
          commonActions
          withSubColumns
          hideTotal={false}
          withFooter
          headerTemplate={
            currentTabName === 'base' ? (
              <SelectField
                id="base-version"
                menuItems={snaps}
                block
                position={SelectField.Positions.BELOW}
                value={selectFieldValue}
                onChange={(v) => {
                  if (v === 'latest') {
                    setSelectFieldValue(v)
                  } else {
                    setSelectFieldValue(v)
                    refetchSnapshotBase()
                  }
                }}
                simplifiedMenu={false}
              />
            ) : (
              ''
            )
          }
        />
      </div>
      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          readOnly
          processInstanceId={
            inventoryData?.metaData?.processInstanceId ||
            showSupportedDocumentDialog?.processInstanceId
          }
          // onSaveUpload={(data) => {
          //   handleSupportingDocs(data)
          // }
          // }
        />
      )}
      {showSelectMembersWorkspaces && (
        <SelectWorkspacesMembersDialog
          visible={showSelectMembersWorkspaces}
          setShowSelectMembersWorkspaces={setShowSelectMembersWorkspaces}
          onHide={() => setShowSelectMembersWorkspaces(false)}
          members={membersByOrg() || []}
          addGroup={addGroup}
          // setId={setId}
          chatChannelHandler={chatChannelHandler}
        />
      )}
    </div>
  )
}
export default InventoryDetails
