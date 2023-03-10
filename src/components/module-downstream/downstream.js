import { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation } from 'react-query'
import { Button, DialogContainer, SelectField, TextField } from 'react-md'

import Mht, {
  setSelectedRow as setSelectedRowAction,
} from '@target-energysolutions/mht'

import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

import {
  listLpgDownstreamByLoggedUser,
  listNgDownstreamByLoggedUser,
  listRsDownstreamByLoggedUser,
  uploadLpg,
  uploadNg,
  uploadRs,
  commitLoadDownstreamLpg,
  commitLoadDownstreamNg,
  commitLoadDownstreamRs,
  overrideDownstreamLpg,
  overrideDownstreamNg,
  overrideDownstreamRs,
  deleteLpg,
  deleteNg,
  deleteRs,
  saveLpg,
  saveNg,
  saveRs,
  updateDownstreamLpg,
  updateDownstreamNg,
  updateDownstreamRs,
  deleteAllDownstream,
} from 'libs/api/downstream-api'
import { addToast } from 'modules/app/actions'

import documents from 'libs/hooks/documents'
import useRole from 'libs/hooks/use-role'
import {
  downloadOriginalFile,
  downloadTemp,
} from 'libs/api/supporting-document-api'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'
// import { userRole } from 'components/shared-hook/get-roles'
import MHTDialog from 'components/mht-dialog'
import SupportedDocument from 'components/supported-document'
// import getOrganizationInfos from 'libs/hooks/get-organization-infos'
import ToastMsg from 'components/toast-msg'

import {
  liquefiedPetroleumGasConfigs,
  naturalGasConfigs,
  petroleumProductsConfigs,
  // liquefiedPetroleumGasData,
  // naturalGasData,
  // petroleumProductsData,
  actionsHeader,
} from './helpers'
import {
  configsLpgDialogMht,
  configsRsDialogMht,
  configsNgDialogMht,
} from './mht-helper-dialog'

import './style.scss'
import DeleteDialog from 'components/delete-dialog'
import getCompanyInfos from 'libs/hooks/get-company-infos'
const Downstream = ({ subkey }) => {
  const dispatch = useDispatch()

  const [currentTab, setCurrentTab] = useState(
    subkey === 'lpg' ? 0 : subkey === 'ng' ? 1 : 2,
  )
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [dataDisplayedMHT, setDataDisplayedMHT] = useState({})
  const [filesList, setFileList] = useState([])
  const [commitData, setCommitData] = useState({})
  const [overrideDialog, setOverrideDialog] = useState(false)
  const [overrideId, setOverrideId] = useState()
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20)
  const [selectedValue, setSelectedValue] = useState()

  const selectedRowSelector = useSelector(
    (state) => state?.selectRowsReducers?.selectedRows,
  )

  const setSelectedRow = (data) => dispatch(setSelectedRowAction(data))
  useEffect(() => {
    setSelectedRow([])
  }, [])
  const { addSupportingDocuments } = documents()

  // const company = getOrganizationInfos()

  const companyOrg = getCompanyInfos()

  const role = useRole('downstream')

  const { data: listLiquefiedPetroleumGas, refetch: refetchLpgList } = useQuery(
    'listLpgDownstreamByLoggedUser',
    () =>
      listLpgDownstreamByLoggedUser({
        queryKey: [
          currentTab === 0 && {
            size,
            page,
          },
        ],
      }),
  )
  const { data: ListNaturalGas, refetch: refetchNgList } = useQuery(
    'listNgDownstreamByLoggedUser',
    () =>
      listNgDownstreamByLoggedUser({
        queryKey: [
          currentTab === 1 && {
            size,
            page,
          },
        ],
      }),
  )
  const { data: LisPetroleumProducts, refetch: refetchRsList } = useQuery(
    'listRsDownstreamByLoggedUser',
    () =>
      listRsDownstreamByLoggedUser({
        queryKey: [
          currentTab === 2 && {
            size,
            page,
          },
        ],
      }),
  )

  const { mutate: uploadLpgMutate, data: responseUploadLpg } =
    useMutation(uploadLpg)
  const { mutate: uploadNgMutate, data: responseUploadNg } =
    useMutation(uploadNg)
  const { mutate: uploadRsMutate, data: responseUploadRs } =
    useMutation(uploadRs)
  useEffect(() => {
    setSelectedValue(responseUploadRs?.data?.data?.[0]?.governorat)
  }, [responseUploadRs])
  const commitLpgMutation = useMutation(commitLoadDownstreamLpg)
  const commitNgMutate = useMutation(commitLoadDownstreamNg)
  const commitRsMutate = useMutation(commitLoadDownstreamRs)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const overrideLpgMutation = useMutation(overrideDownstreamLpg)
  const overrideNgMutation = useMutation(overrideDownstreamNg)
  const overrideRsMutation = useMutation(overrideDownstreamRs)

  const deleteLpgMutation = useMutation(deleteLpg)
  const deleteNgMutation = useMutation(deleteNg)
  const deleteRsMutation = useMutation(deleteRs)

  const onSaveLpgMutate = useMutation(saveLpg)
  const onSaveNgMutate = useMutation(saveNg)
  const onSaveRsMutate = useMutation(saveRs)

  const updateDownstreamLpgMutation = useMutation(updateDownstreamLpg, {
    onSuccess: (res) => {
      refetchLpgList()
    },
  })
  const updateDownstreamNgMutation = useMutation(updateDownstreamNg, {
    onSuccess: (res) => {
      refetchNgList()
    },
  })
  const updateDownstreamRsMutation = useMutation(updateDownstreamRs, {
    onSuccess: (res) => {
      refetchRsList()
    },
  })
  useEffect(() => {
    setPage(0)
  }, [currentTab])
  useEffect(() => {
    if (currentTab === 0) {
      refetchLpgList()
    } else if (currentTab === 1) {
      refetchNgList()
    } else if (currentTab === 2) {
      refetchRsList()
    }
  }, [page])

  const submitDraft = (subModule, objectId) => {
    const body = {
      subModule: subModule,
      objectId: objectId,
      status: 'SUBMITTED',
    }
    switch (currentTab) {
      case 0:
        return updateDownstreamLpgMutation.mutate(body)
      case 1:
        return updateDownstreamNgMutation.mutate(body)
      case 2:
        return updateDownstreamRsMutation.mutate(body)
      default:
        break
    }
  }

  const renderSectionKey = () => {
    switch (currentTab) {
      case 0:
        return {
          name: 'lpg',
          refetch: () => refetchLpgList(),
        }
      case 1:
        return {
          name: 'ng',
          refetch: () => refetchNgList(),
        }
      case 2:
        return {
          name: 'rs',
          refetch: () => refetchRsList(),
        }
      default:
        break
    }
  }
  const liquefiedPetroleumGasActionsHelper = [
    {
      title: 'Attach Spreadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('downstream', 'lpgDownstream')
      },
    },
  ]

  const naturalGasActionsHelper = [
    {
      title: 'Attach Spreadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('downstream', 'ngDownstream')
      },
    },
  ]

  const petroleumProductsActionsHelper = [
    {
      title: 'Attach Spreadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('downstream', 'rsDownstream')
      },
    },
  ]
  const closeDialog = (resp) => {
    resp &&
      resp[0]?.statusCode === 'OK' &&
      setShowSupportedDocumentDialog(false)
  }
  const downstreamSuppDocs = (data) => {
    addSupportingDocuments(
      data,
      selectedRow[0]?.processInstanceId ||
        showSupportedDocumentDialog?.processInstanceId,
      closeDialog,
    )
  }

  const handleSupportingDocs = (data) => {
    downstreamSuppDocs(data)
  }

  const onAddReport = (body, uuid) => {
    switch (currentTab) {
      case 0:
        return uploadLpgMutate(
          {
            body: {
              company: companyOrg?.company,
              file: body?.file[0],
              month: moment(body?.referenceDate?.timestamp).format('MMMM'),
              processInstanceId: uuid,
              year: moment(body?.referenceDate?.timestamp).format('YYYY'),
            },
          },
          {
            onSuccess: (res) => {
              if (!res?.error) {
                refetchLpgList()
                setCommitData(res?.data)
                onDisplayMHT(...res.values)
              }
            },
          },
        )
      case 1:
        return uploadNgMutate(
          {
            body: {
              company: companyOrg?.company,
              file: body?.file[0],
              month: moment(body?.referenceDate?.timestamp).format('MMMM'),
              processInstanceId: uuid,
              year: moment(body?.referenceDate?.timestamp).format('YYYY'),
            },
          },
          {
            onSuccess: (res) => {
              if (!res?.error) {
                refetchNgList()
                setCommitData(res?.data)
                onDisplayMHT(...res.values)
              }
            },
          },
        )
      case 2:
        return uploadRsMutate(
          {
            body: {
              company: companyOrg?.company,
              file: body?.file[0],
              month: moment(body?.referenceDate?.timestamp).format('MMMM'),
              processInstanceId: uuid,
              year: moment(body?.referenceDate?.timestamp).format('YYYY'),
              category: body?.type,
            },
          },
          {
            onSuccess: (res) => {
              if (!res?.error) {
                refetchRsList()
                setCommitData(res?.data)
                onDisplayMHT(...res.values)
              }
            },
          },
        )
      default:
        break
    }
  }
  const onCommitRapport = () => {
    switch (currentTab) {
      case 0:
        return commitLpgMutation.mutate(
          {
            body: commitData,
          },
          {
            onSuccess: (res) => {
              if (!res?.error) {
                if (res?.msg === 'exist') {
                  setOverrideDialog(true)
                  setShowUploadMHTDialog(false)
                  setShowUploadRapportDialog(false)
                  setOverrideId(res?.overrideId)
                } else {
                  setShowUploadRapportDialog(false)
                  setShowUploadMHTDialog(false)
                  refetchLpgList()
                }
              }
            },
          },
        )
      case 1:
        return commitNgMutate.mutate(
          {
            body: commitData,
          },
          {
            onSuccess: (res) => {
              if (!res?.error) {
                if (res?.msg === 'exist') {
                  setOverrideDialog(true)
                  setShowUploadMHTDialog(false)
                  setShowUploadRapportDialog(false)
                  setOverrideId(res?.overrideId)
                } else {
                  setShowUploadRapportDialog(false)
                  setShowUploadMHTDialog(false)
                  refetchNgList()
                }
              }
            },
          },
        )
      case 2:
        return commitRsMutate.mutate(
          {
            body: commitData,
          },
          {
            onSuccess: (res) => {
              if (!res?.error) {
                if (res?.msg === 'exist') {
                  setOverrideDialog(true)
                  setShowUploadMHTDialog(false)
                  setShowUploadRapportDialog(false)
                  setOverrideId(res?.overrideId)
                } else {
                  setShowUploadRapportDialog(false)
                  setShowUploadMHTDialog(false)
                  refetchRsList()
                }
              }
            },
          },
        )
      default:
        break
    }
  }
  const onSaveDownstream = () => {
    switch (currentTab) {
      case 0:
        return onSaveLpgMutate.mutate(
          {
            body: commitData,
          },
          {
            onSuccess: (res) => {
              if (res?.msg === 'commited') {
              }
              return !res?.error && refetchLpgList()
            },
          },
        )
      case 1:
        return onSaveNgMutate.mutate(
          {
            body: commitData,
          },
          {
            onSuccess: (res) => {
              if (res?.msg === 'commited') {
              }
              return !res?.error && refetchNgList()
            },
          },
        )
      case 2:
        return onSaveRsMutate.mutate(
          {
            body: commitData,
          },
          {
            onSuccess: (res) => {
              if (res?.msg === 'commited') {
              }
              return !res?.error && refetchRsList()
            },
          },
        )
      default:
        break
    }
  }
  const onOverrideDownstream = (overrideId) => {
    switch (currentTab) {
      case 0:
        return overrideLpgMutation.mutate(
          {
            body: commitData,
            overrideId: overrideId,
          },
          {
            onSuccess: (res) => {
              if (!res?.error) {
                if (res?.msg === 'saved') {
                  setOverrideDialog(false)
                  refetchLpgList()
                }
              }
            },
          },
        )
      case 1:
        return overrideNgMutation.mutate(
          {
            body: commitData,
            overrideId: overrideId,
          },
          {
            onSuccess: (res) => {
              if (!res?.error) {
                setOverrideDialog(false)
                refetchNgList()
              }
            },
          },
        )
      case 2:
        return overrideRsMutation.mutate(
          {
            body: commitData,
            overrideId: overrideId,
          },
          {
            onSuccess: (res) => {
              if (!res?.error) {
                setOverrideDialog(false)
                refetchRsList()
              }
            },
          },
        )
      default:
        break
    }
  }

  // const handleDeleteProduction = () => {
  //   deleteReport(showDeleteDialog, renderSectionKey().name).then((res) => {
  //     if (res?.success) {
  //       setSelectedRow([])
  //       dispatch(
  //         addToast(
  //           <ToastMsg text={'Successfully deleted'} type="success" />,
  //           'hide',
  //         ),
  //       )
  //       return section?.refetch()
  //     } else {
  //       dispatch(
  //         addToast(
  //           <ToastMsg text={'Something went wrong'} type="error" />,
  //           'hide',
  //         ),
  //       )
  //     }
  //   })
  // }

  const handleDeleteDownstream = (row = selectedRow[0]) => {
    setSelectedRow([])
    switch (currentTab) {
      case 0:
        return deleteLpgMutation.mutate(
          {
            objectId: row?.id,
          },
          {
            onSuccess: (res) => {
              refetchLpgList()
              setShowDeleteDialog(false)
            },
          },
        )
      case 1:
        return deleteNgMutation.mutate(
          {
            objectId: row?.id,
          },
          {
            onSuccess: (res) => {
              refetchNgList()
              setShowDeleteDialog(false)
            },
          },
        )
      case 2:
        return deleteRsMutation.mutate(
          {
            objectId: row?.id,
          },
          {
            onSuccess: (res) => {
              refetchRsList()
              setShowDeleteDialog(false)
            },
          },
        )
      default:
        break
    }
  }
  const createActionsByCurrentTab = (actionsList = []) => {
    return actionsList.map((btn, index) => (
      <Button
        key={`top-bar-btn-${index}`}
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
          btn.onClick()
        }}
      >
        {btn?.title}
      </Button>
    ))
  }

  const renderActionsByCurrentTab = () => {
    switch (currentTab) {
      case 0:
        return createActionsByCurrentTab(liquefiedPetroleumGasActionsHelper)
      case 1:
        return createActionsByCurrentTab(naturalGasActionsHelper)
      case 2:
        return createActionsByCurrentTab(petroleumProductsActionsHelper)
      default:
        break
    }
  }
  // const tabsList = [
  //   'Liquefied Petroleum Gas (LPG)',
  //   'Natural Gas (NG)',
  //   'Petroleum Products',
  // ]
  const tabsList = [
    {
      linkToNewTab: `/ams/downstream/lpg`,
      label: 'Liquefied Petroleum Gas (LPG)',
      key: 0,
    },

    {
      linkToNewTab: `/ams/downstream/ng`,
      label: 'Natural Gas (NG)',
      key: 1,
    },
    {
      linkToNewTab: `/ams/downstream/rs`,
      label: 'Petroleum Products',
      key: 2,
    },
  ]
  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 0:
        return (
          listLiquefiedPetroleumGas?.content?.map((el) => ({
            id: el?.id,
            originalFileId: el?.metaData?.originalFileId,
            fileName: el?.metaData?.originalFileName,
            company: el?.metaData?.company,
            submittedDate: moment(el?.metaData?.createdAt).format(
              'DD MMM, YYYY',
            ),
            submittedBy: el?.metaData?.createdBy?.name,
            statusDate: el?.metaData?.updatedAt
              ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
              : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
            status: el?.metaData?.status,
            processInstanceId: el?.metaData?.processInstanceId,
            referenceDate: `${el?.metaData?.month}, ${el?.metaData?.year}`,
          })) || []
        )
      case 1:
        return (
          ListNaturalGas?.content?.map((el) => ({
            id: el?.id,
            originalFileId: el?.metaData?.originalFileId,
            fileName: el?.metaData?.originalFileName,
            company: el?.metaData?.company,
            submittedDate: moment(el?.metaData?.createdAt).format(
              'DD MMM, YYYY',
            ),
            submittedBy: el?.metaData?.createdBy?.name,
            statusDate: el?.metaData?.updatedAt
              ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
              : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'), // 26587511
            status: el?.metaData?.status,
            processInstanceId: el?.metaData?.processInstanceId,
            referenceDate: `${el?.metaData?.month}, ${el?.metaData?.year}`,
          })) || []
        )
      case 2:
        return (
          LisPetroleumProducts?.content?.map((el) => ({
            id: el?.id,
            originalFileId: el?.metaData?.originalFileId,
            fileName: el?.metaData?.originalFileName,
            company: el?.metaData?.company,
            submittedDate: moment(el?.metaData?.createdAt).format(
              'DD MMM, YYYY',
            ),
            submittedBy: el?.metaData?.createdBy?.name,
            statusDate: el?.metaData?.updatedAt
              ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
              : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
            category: el?.metaData?.category,
            status: el?.metaData?.status,
            processInstanceId: el?.metaData?.processInstanceId,
            referenceDate: `${el?.metaData?.month}, ${el?.metaData?.year}`,
          })) || []
        )
      default:
        return (
          listLiquefiedPetroleumGas?.content?.map((el) => ({
            id: el?.id,
            originalFileId: el?.metaData?.originalFileId,
            fileName: el?.metaData?.originalFileName,
            company: el?.metaData?.company,
            submittedDate: moment(el?.metaData?.createdAt).format(
              'DD MMM, YYYY',
            ),
            submittedBy: el?.metaData?.createdBy?.name,
            statusDate: el?.metaData?.updatedAt
              ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
              : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
            status: el?.metaData?.status,
            processInstanceId: el?.metaData?.processInstanceId,
          })) || []
        )
    }
  }
  const selectedRow = selectedRowSelector.map(
    (id) => renderCurrentTabData()[id],
  )

  const UploadSupportedDocumentFromTable = (row) => {
    setShowSupportedDocumentDialog(row)
  }

  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 0:
        return liquefiedPetroleumGasConfigs(UploadSupportedDocumentFromTable)
      case 1:
        return naturalGasConfigs(UploadSupportedDocumentFromTable)
      case 2:
        return petroleumProductsConfigs(UploadSupportedDocumentFromTable)

      default:
        return liquefiedPetroleumGasConfigs(UploadSupportedDocumentFromTable)
    }
  }

  const downstreamRespData = () => {
    switch (currentTab) {
      case 0:
        return (
          responseUploadLpg?.data?.data?.map((el) => ({
            company: el?.company,
            quota: el?.quota,
            lifting: [
              { source1: el?.actualLifted[0]?.value },
              { source2: el?.actualLifted[1]?.value },
            ],
            total: el?.totalLifted,
            remarks: el?.remarks,
            variance: el?.variance,
          })) || []
        )
      case 1:
        return (
          responseUploadNg?.data?.data?.map((el) => ({
            terminalType: el?.terminalTypes,
            consumerSupplier: el?.nameTerminal,
            January: [
              { jGD: el?.listOnSpecGas[0]?.value },
              { jCG: el?.listOnSpecGas[1]?.value },
              { jSG: el?.listOnSpecGas[2]?.value },
            ],
            February: [
              { fGD: el?.listOnSpecGas[3]?.value },
              { fCG: el?.listOnSpecGas[4]?.value },
              { fSG: el?.listOnSpecGas[5]?.value },
            ],
            March: [
              { mGD: el?.listOnSpecGas[6]?.value },
              { mCG: el?.listOnSpecGas[7]?.value },
              { mSG: el?.listOnSpecGas[8]?.value },
            ],
            April: [
              { aGD: el?.listOnSpecGas[9]?.value },
              { aCG: el?.listOnSpecGas[10]?.value },
              { aSG: el?.listOnSpecGas[11]?.value },
            ],
            May: [
              { myGD: el?.listOnSpecGas[12]?.value },
              { myCG: el?.listOnSpecGas[13]?.value },
              { mySG: el?.listOnSpecGas[14]?.value },
            ],
            June: [
              { jGD: el?.listOnSpecGas[15]?.value },
              { jCG: el?.listOnSpecGas[16]?.value },
              { jSG: el?.listOnSpecGas[17]?.value },
            ],
            July: [
              { juGD: el?.listOnSpecGas[18]?.value },
              { juCG: el?.listOnSpecGas[19]?.value },
              { juSG: el?.listOnSpecGas[20]?.value },
            ],
            August: [
              { auGD: el?.listOnSpecGas[21]?.value },
              { auCG: el?.listOnSpecGas[22]?.value },
              { auSG: el?.listOnSpecGas[23]?.value },
            ],
            September: [
              { sGD: el?.listOnSpecGas[24]?.value },
              { sCG: el?.listOnSpecGas[25]?.value },
              { sSG: el?.listOnSpecGas[26]?.value },
            ],
            October: [
              { oGD: el?.listOnSpecGas[27]?.value },
              { oCG: el?.listOnSpecGas[28]?.value },
              { oSG: el?.listOnSpecGas[29]?.value },
            ],
            November: [
              { nGD: el?.listOnSpecGas[30]?.value },
              { nCG: el?.listOnSpecGas[31]?.value },
              { nSG: el?.listOnSpecGas[32]?.value },
            ],
            December: [
              { dGD: el?.listOnSpecGas[33]?.value },
              { dCG: el?.listOnSpecGas[34]?.value },
              { dSG: el?.listOnSpecGas[35]?.value },
            ],
          })) || []
        )
      case 2:
        return (
          responseUploadRs?.data?.data
            ?.find((el) => el?.governorat === selectedValue)
            ?.dataGov?.map((el) => ({
              gov: el?.wiliyat,
              sn: el?.stationNumber,
              product: [
                { m95: el?.saleQuantityM95 },
                { m91: el?.saleQuantityM91 },
                { kerosen: el?.saleQuantityKerosen },
                { jet: el?.saleQuantityJet },
                { gas: el?.saleQuantityGasOil },
                { m98: el?.saleQuantityM98 },

                { totalProduct: el?.saleQuantityTotal },
              ],
            })) || []
        )

      default:
    }
  }
  const configsMht = () => {
    switch (currentTab) {
      case 0:
        return configsLpgDialogMht()
      case 1:
        return configsNgDialogMht()
      case 2:
        return configsRsDialogMht()
      default:
        return configsLpgDialogMht()
    }
  }
  const dataMht = useMemo(() => {
    return downstreamRespData()
  }, [responseUploadLpg, responseUploadNg, responseUploadRs, selectedValue])

  const renderDialogData = (data) => {
    const uuid = uuidv4()
    switch (currentTab) {
      case 0:
        return {
          title: 'Attach Spreadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            onAddReport(data, uuid)
            addSupportingDocuments(data?.optionalFiles, uuid)
          },
        }
      case 1:
        return {
          title: 'Attach Spreadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            onAddReport(data, uuid)
            addSupportingDocuments(data?.optionalFiles, uuid)
          },
        }
      case 2:
        return {
          title: 'Attach Spreadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onUpload: () => {
            onAddReport(data, uuid)
            addSupportingDocuments(data?.optionalFiles, uuid)
          },
        }

      default:
        break
    }
  }

  const onDisplayMHT = (file) => {
    setShowUploadMHTDialog(true)
    setShowUploadRapportDialog(false)
    setDataDisplayedMHT(file)
  }
  const subModule = () => {
    switch (currentTab) {
      case 0:
        return 'lpg'
      case 1:
        return 'ng'
      case 2:
        return 'rs'
      default:
        break
    }
  }
  const paginationData = () => {
    switch (currentTab) {
      case 0:
        return {
          data: listLiquefiedPetroleumGas,
          totalPages: listLiquefiedPetroleumGas?.totalPages,
          totalElements: listLiquefiedPetroleumGas?.totalElements,
        }
      case 1:
        return {
          data: ListNaturalGas,
          totalPages: ListNaturalGas?.totalPages,
          totalElements: ListNaturalGas?.totalElements,
        }
      case 2:
        return {
          data: LisPetroleumProducts,
          totalPages: LisPetroleumProducts?.totalPages,
          totalElements: LisPetroleumProducts?.totalElements,
        }
      default:
        break
    }
  }

  return (
    <>
      <TopBar
        title="Downstream"
        actions={role === 'operator' ? renderActionsByCurrentTab() : []}
        menuItems={() => {
          const ids = selectedRow?.map((el) => el?.id)
          return [
            /* { key: 1, primaryText: 'Edit', onClick: () => null }, */
            {
              key: 1,
              primaryText: 'Delete',
              onClick: () =>
                selectedRow?.length > 0 &&
                deleteAllDownstream(subkey, ids).then((res) => {
                  if (res) {
                    dispatch(
                      addToast(
                        <ToastMsg
                          text={'Successfully deleted'}
                          type="success"
                        />,
                        'hide',
                      ),
                    )
                    renderSectionKey().refetch()
                    setSelectedRow([])
                  } else {
                    dispatch(
                      addToast(
                        <ToastMsg text={'Something went wrong'} type="error" />,
                        'hide',
                      ),
                    )
                  }
                }),
            },
          ]
        }}
        role={role}
      />
      <div className="subModule">
        <NavBar
          tabsList={tabsList}
          activeTab={currentTab}
          setActiveTab={(tab) => {
            setCurrentTab(tab)
            setSelectedRow([])
          }}
        />
        <div className="subModule--table-wrapper">
          <Mht
            configs={renderCurrentTabConfigs()}
            tableData={renderCurrentTabData()}
            withSearch={selectedRow?.length === 0}
            commonActions={selectedRow?.length === 0}
            // onSelectRows={setSelectedRow}
            withDownloadCsv
            defaultCsvFileTitle={renderSectionKey().name}
            footerTemplate={
              paginationData()?.totalPages > 1 && (
                <>
                  &nbsp;|&nbsp;Page
                  <TextField
                    id="page_num"
                    lineDirection="center"
                    block
                    type={'number'}
                    className="page"
                    value={page + 1}
                    onChange={(v) =>
                      v >= paginationData()?.totalPages
                        ? setPage(paginationData()?.totalPages - 1)
                        : setPage(parseInt(v) - 1)
                    }
                    // disabled={status === 'closed'}
                  />
                  of {paginationData()?.totalPages}
                  &nbsp;|&nbsp;Show
                  <TextField
                    id="el_num"
                    lineDirection="center"
                    block
                    placeholder={`Max number is ${
                      paginationData()?.totalElements
                    }`}
                    className="show"
                    value={size}
                    onChange={(v) =>
                      v > paginationData()?.totalElements
                        ? setSize(paginationData()?.totalElements)
                        : setSize(v)
                    }
                    // disabled={status === 'closed'}
                    onBlur={() => {
                      currentTab === 0 && refetchLpgList()
                      currentTab === 1 && refetchNgList()
                      currentTab === 2 && refetchRsList()
                    }}
                  />
                </>
              )
            }
            withChecked
            singleSelect
            hideTotal={false}
            withFooter
            selectedRow={selectedRow}
            headerTemplate={
              selectedRow?.length === 1 && (
                <HeaderTemplate
                  title={`${selectedRow?.length} Row Selected`}
                  actions={actionsHeader(
                    'downstream-details',
                    selectedRow[0]?.id,
                    subModule(),

                    role,
                    setShowSupportedDocumentDialog,
                    setShowDeleteDialog,
                    selectedRow[0]?.originalFileId,
                    downloadOriginalFile,
                    selectedRow[0]?.fileName,
                    submitDraft,
                    selectedRow[0]?.status,
                  )}
                />
              )
            }
          />
        </div>
      </div>
      {showUploadMHTDialog && (
        <MHTDialog
          headerTemplate={
            <div className="selector">
              <SelectField
                id="select-field-2"
                placeholder="Select Governorate"
                className="selectField md-cell md-cell--4"
                value={selectedValue}
                menuItems={responseUploadRs?.data?.data?.map(
                  (el) => el?.governorat,
                )}
                onChange={setSelectedValue}
                simplifiedMenu={true}
                block
                position={SelectField.Positions.BELOW}
              />
            </div>
          }
          visible={showUploadMHTDialog}
          onHide={() => {
            setShowUploadMHTDialog(false)
            setShowUploadRapportDialog(true)
          }}
          propsDataTable={dataMht}
          propsConfigs={configsMht()}
          onCommit={() => {
            onCommitRapport()
            // setShowUploadMHTDialog(false)
            // setShowUploadRapportDialog(true)
            setFileList([...filesList, dataDisplayedMHT])
          }}
          onSave={() => {
            onSaveDownstream()
            setShowUploadMHTDialog(false)
            // setShowUploadRapportDialog(true)
            setFileList(dataDisplayedMHT)
            setShowUploadRapportDialog(false)
          }}
        />
      )}
      {showUploadRapportDialog && (
        <UploadReportDialog
          setFileList={setFileList}
          ReportingType={currentTab === 2}
          TypeList={[
            'Commercial',
            'Government',
            'Retail Sales',
            'Crusher & Quarries',
            'Marine',
          ]}
          filesList={filesList}
          hideBlock
          onDisplayMHT={onDisplayMHT}
          title={renderDialogData().title}
          optional={renderDialogData().optional}
          visible={showUploadRapportDialog}
          onHide={() => {
            setShowUploadRapportDialog(false)
            setFileList([])
          }}
          onSave={(data) => {
            renderDialogData(data).onUpload()
          }}
          formatDate="month"
        />
      )}
      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          processInstanceId={
            selectedRow[0]?.processInstanceId ||
            showSupportedDocumentDialog?.processInstanceId
          }
          onSaveUpload={(data) => {
            handleSupportingDocs(data)
          }}
          readOnly={role === 'regulator'}
        />
      )}
      {overrideDialog && (
        <DialogContainer
          id="override"
          visible={confirm}
          title="Override"
          modal
          actions={[
            {
              children: 'Yes, Override It',
              primary: false,
              flat: true,
              swapTheming: true,
              onClick: () => onOverrideDownstream(overrideId),
            },
            {
              children: 'No Thanks',
              primary: true,
              flat: true,
              swapTheming: true,
              onClick: () => setOverrideDialog(false),
            },
          ]}
        >
          <p id="override-description" className="md-color--secondary-text">
            This file already exists. Would you like to override it ?
          </p>
        </DialogContainer>
      )}
      {showDeleteDialog && (
        <DeleteDialog
          onDiscard={() => setShowDeleteDialog(false)}
          visible={showDeleteDialog}
          title="Confirm delete Proposal "
          text=" Are you sure you want to delete this proposal ? "
          hideDialog={() => setShowDeleteDialog(false)}
          handleDeleteProduction={() => handleDeleteDownstream()}
        />
      )}
    </>
  )
}
export default Downstream
