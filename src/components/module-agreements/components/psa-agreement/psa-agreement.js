import { useState, useEffect, useRef } from 'react'
import { navigate } from '@reach/router'
import { Button, DialogContainer, FontIcon, Portal, TextField } from 'react-md'
import { connect } from 'react-redux'
import mutate from 'libs/hocs/mutate'
import { get, flatMap, has, set } from 'lodash-es'
import moment from 'moment'
import { cls } from 'reactutils'

import { configsAddition, configs } from './helpers'
import AddSections from 'components/module-agreements/components/add-sections'
import NavigateMenu from 'components/module-agreements/components/navigate-menu'
import Activities from 'components/module-agreements/components/activities'
import MasterContract from 'components/module-agreements/components/master-contract'
import Parties from 'components/module-agreements/components/parties'
import NewAgreementForm from 'components/module-agreements/components/new-agreement-form'
import BlockDetails from 'components/module-agreements/components/block-details'
import ExplorationCommitment from 'components/module-agreements/components/exploration-commitment'
import LegalTerms from 'components/module-agreements/components/legal-terms'
import Obligations from 'components/module-agreements/components/obligations'
import Attachments from 'components/module-agreements/components/attachments-file'
import DataTableAddition from 'components/module-agreements/components/data-table-addition'
import DataTableAdditionGroup from 'components/module-agreements/components/data-table-addition-group'
import { HeaderOption } from 'components/module-agreements/components/psa-panel'
import ToastMsg from 'components/module-agreements/components/toast-msg'

import * as act from 'modules/mutate/actions'
import * as actApp from 'modules/app/actions'
import { fileManagerUpload } from 'libs/api'
import {
  submitAgreement,
  submitMasterContract,
  submitAttachments,
  getAgreementsById,
  getBlockDetails,
  submitBlockDetails,
  getMasterContract,
  fileManagerDownload,
  getExplorationCommitment,
  getRelinquishments,
  getPolygon,
  getLegalTerms,
  getObligations,
  getFiscalTerms,
  getAttachments,
  submitRelinquishments,
  updateSectionEntity,
  submitParties,
  getParties,
  submitExplorationCommitment,
  submitPolygon,
  submitFiscalTerms,
  submitLegalTerms,
  submitObligations,
  getBlocksList,
  getTimelineHistory,
  getMasterContractHistory,
  getPartiesHistory,
  getBlockDetailsHistory,
  getExplorationHistory,
  getRelinquishmentsHistory,
  getPolygonHistory,
  getLegalTermsHistory,
  getObligationsHistory,
  getFiscalTermsHistory,
  getAttachmentsHistory,
  updateTitle,
} from 'libs/api/api-psa'
import AnchorScroll from 'libs/hocs/anchor-scroll'
import {
  numberToPrettifiedString,
  prettifiedStringToNumber,
} from 'libs/utils/custom-function'

import obligations from 'components/module-agreements/components/add-sections/images/obligations.svg'
import Relinquishments from 'components/module-agreements/components/add-sections/images/relinquishments.svg'
import Block from 'components/module-agreements/components/add-sections/images/block.svg'
import Polygon from 'components/module-agreements/components/add-sections/images/polygon.svg'
import fiscal from 'components/module-agreements/components/add-sections/images/fiscal.svg'
import Exploration from 'components/module-agreements/components/add-sections/images/exploration.svg'
import attachmentIcon from 'components/module-agreements/components/add-sections/images/attachmentIcon.svg'
import CustomExpansionPanel from 'components/module-agreements/components/custom-expansion-panel'
import Remarks from 'components/module-agreements/components/remarks'
import RemarksFooter from 'components/module-agreements/components/remarks-footer'
import { TableLoader } from '../loaders/loaders'
import Warning from 'components/module-agreements/components/warning'
import { listTypes } from '../exploration-commitment/helpers'
import ExpandTabs from 'components/module-agreements/components/expand-tabs'
import icon1 from 'components/module-agreements/images/psaIcon/block details.svg'
import icon2 from 'components/module-agreements/images/psaIcon/explorationCommitments.svg'
import icon3 from 'components/module-agreements/images/psaIcon/docs.svg'
import icon4 from 'components/module-agreements/images/psaIcon/polygon.svg'
import icon5 from 'components/module-agreements/images/psaIcon/fiscal.svg'
import icon6 from 'components/module-agreements/images/psaIcon/settings.svg'
import { useTranslation } from 'libs/langs'

import './style.scss'

const blockDetailsNumberType = [
  { key: ['area'], precision: 3 },
  { key: ['contract_duration', 'iep', 'years'] },
  { key: ['contract_duration', 'iep', 'ext1'] },
  { key: ['contract_duration', 'iep', 'ext2'] },
  { key: ['contract_duration', 'iep', 'ext3'] },
  { key: ['contract_duration', 'faep', 'years'] },
  { key: ['contract_duration', 'faep', 'ext1'] },
  { key: ['contract_duration', 'faep', 'ext2'] },
  { key: ['contract_duration', 'faep', 'ext3'] },
  { key: ['contract_duration', 'saep', 'years'] },
  { key: ['contract_duration', 'saep', 'ext1'] },
  { key: ['contract_duration', 'saep', 'ext2'] },
  { key: ['contract_duration', 'saep', 'ext3'] },
  { key: ['production_bonus'] },
  { key: ['signature_bonus'] },
  { key: ['social_dev_bonus_iep'] },
  { key: ['social_dev_bonus_faep'] },
  { key: ['social_dev_bonus_saep'] },
  { key: ['social_dev_bonus_dev'] },
  { key: ['training_fee_iep'] },
  { key: ['training_fee_faep'] },
  { key: ['training_fee_saep'] },
  { key: ['training_fee_dev'] },
  { key: ['surface_fee_iep'], precision: 2 },
  { key: ['surface_fee_faep'], precision: 2 },
  { key: ['surface_fee_saep'], precision: 2 },
  { key: ['surface_fee_dev'], precision: 2 },
]
const PSAgreement = ({
  clearMutation,
  setIsVisibleTopBar,
  organizationID,
  agreementId,
  user,
  onScroll,
  location: { pathname },
  mutations: {
    submitAgreement,
    fileManagerUploadContract,
    fileManagerUploadAttachment,
    submitMasterContract,
    submitAttachments,
    getAgreementsById,
    getBlockDetails,
    submitBlockDetails,
    getMasterContract,
    fileManagerDownload,
    getExplorationCommitment,
    getRelinquishments,
    getPolygon,
    getLegalTerms,
    getObligations,
    getFiscalTerms,
    getAttachments,
    updateSectionEntity,
    getParties,
    submitRelinquishments,
    submitExplorationCommitment,
    submitPolygon,
    submitFiscalTerms,
    submitLegalTerms,
    submitObligations,
    submitParties,
    getBlocksList,
    getTimelineHistory,
    getMasterContractHistory,
    getPartiesHistory,
    getBlockDetailsHistory,
    getExplorationHistory,
    getRelinquishmentsHistory,
    getPolygonHistory,
    getLegalTermsHistory,
    getObligationsHistory,
    getFiscalTermsHistory,
    getAttachmentsHistory,
    updateTitle,
  },
  submitRelinquishmentsStatus,
  submitPartiesStatus,
  submitExplorationCommitmentStatus,
  submitPolygonStatus,
  submitFiscalTermsStatus,
  submitLegalTermsStatus,
  submitObligationsStatus,
  submitMasterContractStatus,
  submitAttachmentsStatus,
  submitBlockDetailsStatus,
  getAgreementsByIdStatus,
  fileManagerUploadContractStatus,
  fileManagerUploadAttachmentStatus,
  getBlockDetailsStatus,
  getBlockDetailsHistoryStatus,
  getMasterContractStatus,
  getMasterContractHistoryStatus,
  getExplorationCommitmentStatus,
  getExplorationHistoryStatus,
  getRelinquishmentsStatus,
  getRelinquishmentsHistoryStatus,
  getPolygonStatus,
  getPolygonHistoryStatus,
  getLegalTermsStatus,
  getLegalTermsHistoryStatus,
  getObligationsStatus,
  getObligationsHistoryStatus,
  getFiscalTermsStatus,
  getFiscalTermsHistoryStatus,
  getAttachmentsStatus,
  getAttachmentsHistoryStatus,
  getPartiesStatus,
  getPartiesHistoryStatus,
  getBlocksListStatus,
  updateSectionEntityStatus,
  addToast,
  submitAgreementStatus,
  activityId,
  activityName,
  getTimelineHistoryStatus,
  updateTitleStatus,
}) => {
  const { t } = useTranslation()
  const [explorationCommitmentData, setExplorationCommitmentData] = useState({
    values: {},
  })
  const [
    modifiedExplorationCommitment,
    setModifiedExplorationCommitment,
  ] = useState(false)
  const [newAgreementData, setNewAgreementData] = useState({})
  const [, setSectionToShow] = useState([])
  const [legalTermsData, setLegalTermsData] = useState('')
  const [obligationData, setObligationData] = useState('')
  const [polygon, setPolygon] = useState({ polygons: [] })
  const [uploadedFile, setUploadedFile] = useState([])
  const [blockDetails, setBlockDetails] = useState({})
  const [relinquishments, setRelinquishments] = useState({
    relinquishments: null,
  })
  const [modifiedRelinquishments, setModifiedRelinquishments] = useState(false)
  const [fiscalTerms, setFiscalTerms] = useState([])
  const [attachments, setAttachments] = useState({})
  const [parties, setParties] = useState({
    operators: [],
    shareholders: [],
    contractors: [],
    service_providers: [],
  })
  const [visibilityRemarksDialog, setVisibilityRemarksDialog] = useState(false)
  const [sectionToApproveAmend, setSectionToApproveAmend] = useState('')
  const [sectionNameToApproveAmend, setSectionNameToApproveAmend] = useState('')
  const [searchCompanies, setSearchCompanies] = useState('')
  const [fiscalTermsUpdateStatus, setFiscalTermsUpdateStatus] = useState()
  const [polygonUpdateStatus, setPolygonUpdateStatus] = useState()
  const [submitSectionsStatuses, setSubmitSectionsStatuses] = useState([])
  const [
    relinquishmentsUpdateStatus,
    setRelinquishmentsUpdateStatus,
  ] = useState()
  const [submitDialog, setSubmitDialog] = useState(false)
  const [submitDialogVisible, setSubmitDialogVisible] = useState(false)
  const [allowOpenDialog, setAllowOpenDialog] = useState(true)
  const [visiblePortal, setVisiblePortal] = useState(false)
  const [dirtySections, setDirtySections] = useState([])
  const [visibleWarning, setVisibleWarning] = useState(false)
  const [amendedAgreement, setAmendedAgreement] = useState(false)
  const [newAgreementError, setNewAgreementError] = useState({
    title: false,
    description: false,
    scope: false,
  })
  const [deleteFile, setDeleteFile] = useState(false)
  const [expandTop, setExpandTop] = useState(true)

  const getSectionData = sectionName => {
    switch (sectionName) {
      case 'Master Contract':
        // return activityId ? activityName === sectionName ? getMasterContractHistoryStatus : {} : getMasterContractStatus
        return activityId
          ? getMasterContractHistoryStatus
          : getMasterContractStatus
      case 'Parties':
        return activityId ? getPartiesHistoryStatus : getPartiesStatus
      case 'Block Details':
        return activityId ? getBlockDetailsHistoryStatus : getBlockDetailsStatus
      case 'Exploration Commitments':
        return activityId
          ? getExplorationHistoryStatus
          : getExplorationCommitmentStatus
      case 'Relinquishments & new Areas':
        return activityId
          ? getRelinquishmentsHistoryStatus
          : getRelinquishmentsStatus
      case 'Polygon':
        return activityId ? getPolygonHistoryStatus : getPolygonStatus
      case 'Legal Terms Obligations':
        return activityId ? getLegalTermsHistoryStatus : getLegalTermsStatus
      case 'Obligations':
        return activityId ? getObligationsHistoryStatus : getObligationsStatus
      case 'Fiscal Terms':
        return activityId ? getFiscalTermsHistoryStatus : getFiscalTermsStatus
      case 'Attachments':
        return activityId ? getAttachmentsHistoryStatus : getAttachmentsStatus
    }
  }

  const addDirtySections = sectionName => {
    if (!dirtySections.includes(sectionName)) {
      setDirtySections([...dirtySections, sectionName])
    }
  }
  /// ////////////////////////////////////
  const usePrevious = value => {
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }
  const prevUpdateTitleStatus = usePrevious({
    ...updateTitleStatus,
  })
  useEffect(() => {
    if (
      updateTitleStatus &&
      updateTitleStatus.data &&
      prevUpdateTitleStatus &&
      !updateTitleStatus.pending &&
      prevUpdateTitleStatus.pending
    ) {
      getAgreementsById(organizationID, agreementId)
    }
  }, [updateTitleStatus])

  useEffect(() => {
    let success = []
    let error = []
    if (
      submitObligationsStatus &&
      !submitObligationsStatus.pending &&
      submitDialog &&
      submitDialog.readyToSubmit.includes('Obligations')
    ) {
      if (submitObligationsStatus.data && !submitObligationsStatus.data.error) {
        success = [...success, 'Obligations']
        getObligations(organizationID, agreementId)
      } else error = [...error, 'Obligations']
    }

    if (
      submitMasterContractStatus &&
      !submitMasterContractStatus.pending &&
      submitDialog &&
      submitDialog.readyToSubmit.includes('Master Contract')
    ) {
      if (
        submitMasterContractStatus.data &&
        !submitMasterContractStatus.data.error
      ) {
        success = [...success, 'Master Contract']
        getMasterContract(organizationID, agreementId)
      } else {
        error = [...error, 'Master Contract']
      }
    }
    if (
      submitBlockDetailsStatus &&
      !submitBlockDetailsStatus.pending &&
      submitDialog &&
      submitDialog.readyToSubmit.includes('Block Details')
    ) {
      if (
        submitBlockDetailsStatus.data &&
        !submitBlockDetailsStatus.data.error
      ) {
        success = [...success, 'Block Details']
        getBlockDetails(organizationID, agreementId)
      } else error = [...error, 'Block Details']
    }
    if (
      submitRelinquishmentsStatus &&
      !submitRelinquishmentsStatus.pending &&
      submitDialog &&
      submitDialog.readyToSubmit.includes('Relinquishments & new Areas')
    ) {
      if (
        submitRelinquishmentsStatus.data &&
        !submitRelinquishmentsStatus.data.error
      ) {
        success = [...success, 'Relinquishments & new Areas']
        getRelinquishments(organizationID, agreementId)
      } else error = [...error, 'Relinquishments & new Areas']
    }
    if (
      submitPartiesStatus &&
      !submitPartiesStatus.pending &&
      submitDialog &&
      submitDialog.readyToSubmit.includes('Parties')
    ) {
      if (submitPartiesStatus.data && !submitPartiesStatus.data.error) {
        success = [...success, 'Parties']
        getParties(organizationID, agreementId)
      } else error = [...error, 'Parties']
    }
    if (
      submitLegalTermsStatus &&
      !submitLegalTermsStatus.pending &&
      submitDialog &&
      submitDialog.readyToSubmit.includes('Legal Terms Obligations')
    ) {
      if (submitLegalTermsStatus.data && !submitLegalTermsStatus.data.error) {
        success = [...success, 'Legal Terms Obligations']
        getLegalTerms(organizationID, agreementId)
      } else error = [...error, 'Legal Terms Obligations']
    }
    if (
      submitExplorationCommitmentStatus &&
      !submitExplorationCommitmentStatus.pending &&
      submitDialog &&
      submitDialog.readyToSubmit.includes('Exploration Commitments')
    ) {
      if (
        submitExplorationCommitmentStatus.data &&
        !submitExplorationCommitmentStatus.data.error
      ) {
        success = [...success, 'Exploration Commitments']
        getExplorationCommitment(organizationID, agreementId)
      } else error = [...error, 'Exploration Commitments']
    }
    if (
      submitPolygonStatus &&
      !submitPolygonStatus.pending &&
      submitDialog &&
      submitDialog.readyToSubmit.includes('Polygon')
    ) {
      if (submitPolygonStatus.data && !submitPolygonStatus.data.error) {
        success = [...success, 'Polygon']
        getPolygon(organizationID, agreementId)
      } else error = [...error, 'Polygon']
    }
    if (
      submitFiscalTermsStatus &&
      !submitFiscalTermsStatus.pending &&
      submitDialog &&
      submitDialog.readyToSubmit.includes('Fiscal Terms')
    ) {
      if (submitFiscalTermsStatus.data && !submitFiscalTermsStatus.data.error) {
        success = [...success, 'Fiscal Terms']
        getFiscalTerms(organizationID, agreementId)
      } else error = [...error, 'Fiscal Terms']
    }
    if (
      submitAttachmentsStatus &&
      !submitAttachmentsStatus.pending &&
      submitDialog &&
      submitDialog.readyToSubmit.includes('Attachments')
    ) {
      if (submitAttachmentsStatus.data && !submitAttachmentsStatus.data.error) {
        success = [...success, 'Attachments']
        getAttachments(organizationID, agreementId)
      } else error = [...error, 'Attachments']
    }

    if (
      submitDialog &&
      submitDialog.readyToSubmit &&
      [...success].length === submitDialog.readyToSubmit.length
    ) {
      navigate('/agreement/content')
    } else {
      setSubmitDialogVisible(false)
      setSubmitSectionsStatuses([...error])
      success.forEach(v => {
        setDirtySections(removeFromArray(dirtySections, v))
      })
      setAmendedAgreement(false)
      if (agreementId) {
        getAgreementsById(organizationID, agreementId)
      }
    }
  }, [
    submitRelinquishmentsStatus,
    submitPartiesStatus,
    submitExplorationCommitmentStatus,
    submitPolygonStatus,
    submitFiscalTermsStatus,
    submitLegalTermsStatus,
    submitObligationsStatus,
    submitMasterContractStatus,
    submitAttachmentsStatus,
    submitBlockDetailsStatus,
  ])
  /// ////////////////////////////
  const formatExplorationCommitmentTable = table => {
    const precision = 2
    const unitsTable = table
      .filter(
        ({ unit }, index, self) =>
          index === self.findIndex(elem => elem.unit === unit),
      )
      .map(({ unit }) => ({ unit }))
    table.forEach(({ year, unit, value }) => {
      const unitObject = unitsTable.find(elem => elem.unit === unit)
      if (unitObject) {
        const formattedValue = numberToPrettifiedString(value, precision)
        Object.assign(unitObject, { [year]: formattedValue })
      }
    })
    return unitsTable
  }
  const formatExplorationCommitmentBody = () => {
    const precision = 2
    const maxNumberLength = 12
    const formatStructure = table =>
      flatMap(
        table.map(elem =>
          Object.keys(elem)
            .filter(key => key !== 'unit')
            .map(key => ({
              unit: elem.unit,
              year: +key,
              value: +prettifiedStringToNumber(
                elem[key],
                precision,
                maxNumberLength,
              ),
            })),
        ),
        value => value,
      )
    return Object.assign(
      {},
      ...listTypes.map(({ id }) => ({
        [id]: formatStructure(
          get(explorationCommitmentData, `values.${id}`, []),
        ),
      })),
    )
    // {
    //   ...explorationCommitmentData,
    //   values: Object.assign(
    //     {},
    //     ...listTypes.map(({ id }) => ({
    //       [id]: formatStructure(
    //         get(explorationCommitmentData, `values.${id}`, []),
    //       ),
    //     })),
    //   ),
    // }
  }

  useEffect(() => {
    if (!getSectionData('Parties').pending && getSectionData('Parties').data) {
      let partiesData = get(getSectionData('Parties'), 'data', {
        operators: [],
        shareholders: [],
        contractors: [],
        service_providers: [],
      })

      if (!partiesData.operators) {
        partiesData.operators = []
      }
      if (!partiesData.shareholders) {
        partiesData.shareholders = []
      }
      if (!partiesData.contractors) {
        partiesData.contractors = []
      }
      if (!partiesData.service_providers) {
        partiesData.service_providers = []
      }

      setParties(partiesData)
    }
  }, [getSectionData('Parties')])

  useEffect(() => {
    if (!submitAgreementStatus.pending && submitAgreementStatus.data) {
      window.location.href = `/agreement/content/current/${submitAgreementStatus.data.id}`
    }
  }, [submitAgreementStatus])

  useEffect(() => {
    if (
      !fileManagerUploadContractStatus.pending &&
      fileManagerUploadContractStatus.data
    ) {
      const currentFile = get(
        fileManagerUploadContractStatus,
        'data.files.[0]',
        {},
      )
      const { filename, size, url, contentType } = currentFile

      const currentFiles = {
        id: 1,
        file_name: filename,
        url: url,
        size: size,
        content_type: contentType,
        canDelete: true,
      }
      setUploadedFile([currentFiles])
    }
  }, [fileManagerUploadContractStatus])

  const getUploadedFiles = file => {
    fileManagerUploadContract(file, 'upload')
    addDirtySections('Master Contract')
  }

  const handleNewAgreementData = (key, value) => {
    newAgreementData[key] = value
    setNewAgreementData(newAgreementData)
  }

  const prevUpdateSectionEntityStatus = usePrevious({
    ...updateSectionEntityStatus,
  })
  useEffect(() => {
    if (
      updateSectionEntityStatus &&
      updateSectionEntityStatus.data &&
      prevUpdateSectionEntityStatus &&
      !updateSectionEntityStatus.pending &&
      prevUpdateSectionEntityStatus.pending
    ) {
      getAgreementsById(organizationID, agreementId)
    }
  }, [updateSectionEntityStatus])
  useEffect(() => {
    if (
      updateSectionEntityStatus &&
      updateSectionEntityStatus.data &&
      updateSectionEntityStatus.data.section ===
        get(fiscalTerms, 'section_entity.id', '') &&
      prevUpdateSectionEntityStatus &&
      !updateSectionEntityStatus.pending &&
      prevUpdateSectionEntityStatus.pending
    ) {
      setFiscalTermsUpdateStatus(
        !updateSectionEntityStatus.data.error ? 'success' : 'error',
      )
      setTimeout(() => {
        setFiscalTermsUpdateStatus(false)
      }, 10000)
    }
  }, [updateSectionEntityStatus])

  useEffect(() => {
    if (
      updateSectionEntityStatus &&
      updateSectionEntityStatus.data &&
      updateSectionEntityStatus.data.section ===
        get(polygon, 'section_entity.id', '') &&
      prevUpdateSectionEntityStatus &&
      !updateSectionEntityStatus.pending &&
      prevUpdateSectionEntityStatus.pending
    ) {
      setPolygonUpdateStatus(
        !updateSectionEntityStatus.data.error ? 'success' : 'error',
      )
      setTimeout(() => {
        setPolygonUpdateStatus(false)
      }, 10000)
    }
  }, [updateSectionEntityStatus])

  useEffect(() => {
    if (
      updateSectionEntityStatus &&
      updateSectionEntityStatus.data &&
      updateSectionEntityStatus.data.section ===
        get(relinquishments, 'section_entity.id', '') &&
      prevUpdateSectionEntityStatus &&
      !updateSectionEntityStatus.pending &&
      prevUpdateSectionEntityStatus.pending
    ) {
      setRelinquishmentsUpdateStatus(
        !updateSectionEntityStatus.data.error ? 'success' : 'error',
      )
      setTimeout(() => {
        setRelinquishmentsUpdateStatus(false)
      }, 10000)
    }
  }, [updateSectionEntityStatus])

  useEffect(() => {
    if (
      updateSectionEntityStatus &&
      prevUpdateSectionEntityStatus &&
      !updateSectionEntityStatus.pending &&
      prevUpdateSectionEntityStatus.pending &&
      !updateSectionEntityStatus.data.error
    ) {
      setVisibilityRemarksDialog(false)
      setSectionToApproveAmend('')
      refetchSectionRelated()
    }
  }, [updateSectionEntityStatus])

  useEffect(() => {
    setIsVisibleTopBar(false)
    getBlocksList()
    if (agreementId) {
      getAgreementsById(organizationID, agreementId)
      getTimelineHistory(organizationID, agreementId)
    }
    return () => {
      clearMutation()
    }
  }, [])
  const testSectionToShow = sectionName => {
    return (
      isWritable(sectionName) &&
      isWritable(sectionName).find(
        elem => elem.id === 1 || elem.id === 2 || elem.id === 3,
      )
    )
  }
  useEffect(() => {
    if (
      getAgreementsByIdStatus &&
      getAgreementsByIdStatus.data &&
      !getAgreementsByIdStatus.pending &&
      get(user, 'subject', null)
    ) {
      if (testSectionToShow('Block Details') && !activityId) {
        getBlockDetails(organizationID, agreementId)
      }
      if (testSectionToShow('Master Contract') && !activityId) {
        getMasterContract(organizationID, agreementId)
      }
      if (testSectionToShow('Exploration Commitments') && !activityId) {
        getExplorationCommitment(organizationID, agreementId)
      }
      if (testSectionToShow('Relinquishments & new Areas') && !activityId) {
        getRelinquishments(organizationID, agreementId)
      }
      if (testSectionToShow('Polygon') && !activityId) {
        getPolygon(organizationID, agreementId)
      }
      if (testSectionToShow('Legal Terms Obligations') && !activityId) {
        getLegalTerms(organizationID, agreementId)
      }
      if (testSectionToShow('Obligations') && !activityId) {
        getObligations(organizationID, agreementId)
      }
      if (testSectionToShow('Fiscal Terms') && !activityId) {
        getFiscalTerms(organizationID, agreementId)
      }
      if (testSectionToShow('Attachments') && !activityId) {
        getAttachments(organizationID, agreementId)
      }
      if (testSectionToShow('Parties') && !activityId) {
        getParties(organizationID, agreementId)
      }
    }
  }, [getAgreementsByIdStatus, user])

  useEffect(() => {
    if (
      !getSectionData('Master Contract').pending &&
      getSectionData('Master Contract').data
    ) {
      setUploadedFile([get(getSectionData('Master Contract'), 'data', {})])
    }
  }, [getSectionData('Master Contract')])

  useEffect(() => {
    if (
      !getSectionData('Block Details').pending &&
      getSectionData('Block Details').data
    ) {
      const blockDetailsFormatted = {
        ...get(getSectionData('Block Details'), 'data', {}),
      }
      blockDetailsNumberType.forEach(({ key, precision }) => {
        if (has(blockDetailsFormatted, key.join('.'))) {
          set(
            blockDetailsFormatted,
            key.join('.'),
            numberToPrettifiedString(
              get(blockDetailsFormatted, key.join('.'), 0),
              precision || 0,
            ),
          )
        }
      })
      setBlockDetails(blockDetailsFormatted)
    }
  }, [getSectionData('Block Details')])

  useEffect(() => {
    if (!getAgreementsByIdStatus.pending && getAgreementsByIdStatus.data) {
      const details = get(getAgreementsByIdStatus, 'data', {})
      setNewAgreementData({
        title: details.title,
        description: details.description,
        scope: details.scope,
      })
    }
  }, [getAgreementsByIdStatus])
  useEffect(() => {
    if (
      !getSectionData('Exploration Commitments').pending &&
      getSectionData('Exploration Commitments').data
    ) {
      const data = get(getSectionData('Exploration Commitments'), 'data', {})
      const values = {
        ...listTypes
          .filter(({ id }) => get(data, `values.${id}`, null))
          .reduce(
            (prev, { id }) =>
              Object.assign(prev, {
                [id]: formatExplorationCommitmentTable(
                  get(data, `values.${id}`, []),
                ),
              }),
            {},
          ),
      }
      setExplorationCommitmentData({ ...data, values })
      setModifiedExplorationCommitment(false)
    }
  }, [getSectionData('Exploration Commitments')])

  useEffect(() => {
    if (
      !getSectionData('Relinquishments & new Areas').pending &&
      getSectionData('Relinquishments & new Areas').data
    ) {
      let formattedRelinquishments = get(
        getSectionData('Relinquishments & new Areas'),
        'data',
        {
          relinquishments: null,
        },
      )
      if (formattedRelinquishments.relinquishments) {
        formattedRelinquishments = {
          ...formattedRelinquishments,
          relinquishments: formattedRelinquishments.relinquishments.map(
            elem => ({
              ...elem,
              area_by_contract: numberToPrettifiedString(
                elem.area_by_contract,
                3,
              ),
            }),
          ),
        }
      }
      setRelinquishments(formattedRelinquishments)
      setModifiedRelinquishments(false)
    }
  }, [getSectionData('Relinquishments & new Areas')])
  useEffect(() => {
    if (!getSectionData('Polygon').pending && getSectionData('Polygon').data) {
      const formattedPolygons = (
        get(getSectionData('Polygon'), 'data', {
          polygons: [],
        }).polygons || []
      ).map(elem => ({
        ...elem,
        x: numberToPrettifiedString(elem.x, 6),
        y: numberToPrettifiedString(elem.y, 6),
      }))
      setPolygon({ polygons: formattedPolygons })
    }
  }, [getSectionData('Polygon')])

  useEffect(() => {
    if (
      !getSectionData('Legal Terms Obligations').pending &&
      getSectionData('Legal Terms Obligations').data
    ) {
      setLegalTermsData(
        get(getSectionData('Legal Terms Obligations'), 'data', ''),
      )
    }
  }, [getSectionData('Legal Terms Obligations')])

  useEffect(() => {
    if (
      !getSectionData('Obligations').pending &&
      getSectionData('Obligations').data
    ) {
      setObligationData(get(getSectionData('Obligations'), 'data', ''))
    }
  }, [getSectionData('Obligations')])

  useEffect(() => {
    if (
      !getSectionData('Fiscal Terms').pending &&
      getSectionData('Fiscal Terms').data
    ) {
      let fiscal = get(getSectionData('Fiscal Terms'), 'data', {})
      // if (fiscal && fiscal.profit_sharing) {
      //   fiscal = {
      //     ...fiscal,
      //     profit_option: 1,
      //   }
      // }
      // if (fiscal && fiscal.profit_r_factor) {
      //   fiscal = {
      //     ...fiscal,
      //     profit_option: 2,
      //   }
      // }
      // setFiscalTerms(get(getFiscalTermsStatus, 'data', []))
      setFiscalTerms({
        ...fiscal,
        costs: get(fiscal, 'costs', []).map(elem => ({
          ...elem,
          value: elem.value,
        })),
      })
    }
  }, [getSectionData('Fiscal Terms')])

  const attachmentCategoryList = [
    {
      label: 'Block Details',
      icon: icon1,
    },
    {
      label: 'Minimum Work and Obligations',
      icon: icon2,
    },
    {
      label: 'Relinquishments',
      icon: icon1,
    },
    {
      label: 'New Areas',
      icon: icon3,
    },
    {
      label: 'Polygon',
      icon: icon4,
    },
    {
      label: 'Fiscal Terms',
      icon: icon5,
    },
    {
      label: 'Addendums',
      icon: icon3,
    },
    {
      label: 'Miscellaneous',
      icon: icon6,
    },
  ]
  useEffect(() => {
    if (
      !getSectionData('Attachments').pending &&
      getSectionData('Attachments').data
    ) {
      const newDocs = get(getSectionData('Attachments'), 'data', [])
      if (!newDocs.attachments) {
        newDocs.attachments = []
      }
      setAttachments({
        ...newDocs,
        attachments: attachmentCategoryList.map(cat => {
          const fileList = newDocs.attachments.filter(
            elem => elem.category === cat.label,
          )
          return {
            category: cat,
            files: fileList,
          }
        }),
      })
    }
  }, [getSectionData('Attachments')])
  // useEffect(() => {
  //   if (
  //     !fileManagerUploadAttachmentStatus.pending &&
  //     fileManagerUploadAttachmentStatus.data
  //   ) {
  //     const documents = get(fileManagerUploadAttachmentStatus, 'data.files', [])
  //     const docs = documents.map(doc => {
  //       return {
  //         file_name: doc.filename,
  //         url: doc.url,
  //         size: doc.size,
  //         content_type: doc.contentType,
  //       }
  //     })
  //     attachments &&
  //       attachments.attachments &&
  //       setAttachments({
  //         ...attachments,
  //         attachments: [...attachments.attachments, ...docs],
  //       })
  //   }
  // }, [fileManagerUploadAttachmentStatus])

  useEffect(() => {
    if (activityName === 'Master Contract') {
      getMasterContractHistory(organizationID, agreementId, activityId)
    }
    if (activityName === 'Parties') {
      getPartiesHistory(organizationID, agreementId, activityId)
    }
    if (activityName === 'Block Details') {
      getBlockDetailsHistory(organizationID, agreementId, activityId)
    }
    if (activityName === 'Exploration Commitments') {
      getExplorationHistory(organizationID, agreementId, activityId)
    }
    if (activityName === 'Relinquishments & new Areas') {
      getRelinquishmentsHistory(organizationID, agreementId, activityId)
    }
    if (activityName === 'Polygon') {
      getPolygonHistory(organizationID, agreementId, activityId)
    }
    if (activityName === 'Legal Terms Obligations') {
      getLegalTermsHistory(organizationID, agreementId, activityId)
    }
    if (activityName === 'Obligations') {
      getObligationsHistory(organizationID, agreementId, activityId)
    }
    if (activityName === 'Fiscal Terms') {
      getFiscalTermsHistory(organizationID, agreementId, activityId)
    }
    if (activityName === 'Attachments') {
      getAttachmentsHistory(organizationID, agreementId, activityId)
    }
  }, [activityId])

  const uploadDocs = (file, cat) => {
    let newFileList = get(attachments, 'attachments', [])
    const findFileCategory = get(attachments, 'attachments', []).find(
      el => el.category.label === cat,
    )
    if (findFileCategory) {
      setAttachments({
        ...attachments,
        attachments: get(attachments, 'attachments', []).map(elem => {
          if (elem.category.label === cat) {
            return { category: elem.category, files: [...elem.files, ...file] }
          } else {
            return elem
          }
        }),
      })
    } else {
      newFileList = [
        ...newFileList,
        {
          category: cat,
          files: file,
        },
      ]
      setAttachments({
        ...attachments,
        attachments: [...attachments.attachments, ...newFileList],
      })
    }
    addDirtySections('Attachments')
  }

  const handleExplorationCommitmentData = data => {
    setExplorationCommitmentData(data)
    setModifiedExplorationCommitment(true)
    addDirtySections('Exploration Commitments')
  }

  const handleLegalTermsData = data => {
    setLegalTermsData(data)
    addDirtySections('Legal Terms Obligations')
  }
  const handleObligationData = data => {
    setObligationData(data)
    addDirtySections('Obligations')
  }

  const isWritable = sectionName => {
    let roles = false
    const sections = get(getAgreementsByIdStatus, 'data.sections_details', [])
    if (sections) {
      const findSection = sections.find(
        sct => sct.section_entity.section.name === sectionName,
      )

      if (findSection) {
        const isMember = findSection.members.find(
          mem => mem.user_sub === get(user, 'subject', null),
        )

        if (isMember) {
          roles = isMember.roles
        }
      }
    }
    return roles
  }
  const approve = (e, sectionId) => {
    e.stopPropagation()
    updateSectionEntity(organizationID, agreementId, sectionId, 'APPROVE')
  }
  const amend = (e, sectionId, sectionName) => {
    e.stopPropagation()
    setVisibilityRemarksDialog(true)
    setSectionToApproveAmend(sectionId)
    setSectionNameToApproveAmend(sectionName)
  }

  const renderPanelActions = section => {
    if (!activityId) {
      const sections = get(getAgreementsByIdStatus, 'data.sections_details', [])
      const findSection = sections
        ? sections.find(elem => elem.section_entity.section.name === section)
        : {}
      const sectionId = get(findSection, 'section_entity.id')
      const sectionName = get(findSection, 'section_entity.section.name')
      return (
        <>
          <Button
            className="editButton"
            icon
            primary
            key={1}
            onClick={e => amend(e, sectionId, sectionName)}
          >
            edit
          </Button>
          <Button
            className="checkButton"
            icon
            primary
            swapTheming
            key={2}
            onClick={e => approve(e, sectionId)}
          >
            check
          </Button>
        </>
      )
    }
  }
  const updateAgreementTitle = () => {
    if (
      newAgreementData.title !==
        get(getAgreementsByIdStatus, 'data.title', '') &&
      !updateTitleStatus.pending
    ) {
      updateTitle(organizationID, agreementId, newAgreementData)
    }
  }
  const renderTree = [
    {
      name: 'Agreement',
      link: () => navigate('/agreement/content'),
    },
    {
      name: (
        <TextField
          className="psa-agreement-title-textField"
          block
          onChange={title =>
            setNewAgreementData({ ...newAgreementData, title })
          }
          autoComplete="off"
          value={get(newAgreementData, 'title', '')}
          onKeyDown={e => e.key === 'Enter' && updateAgreementTitle()}
          onBlur={() => updateAgreementTitle()}
        />
      ),
    },
  ]
  const submitNew = () => {
    const titleErr = newAgreementData.title
    const scopeErr =
      newAgreementData.scope && newAgreementData.scope !== '<p></p>\n'
    const descriptionErr =
      newAgreementData.description &&
      newAgreementData.description !== '<p></p>\n'

    if (titleErr && scopeErr && descriptionErr) {
      submitAgreement(organizationID, newAgreementData)
    } else {
      setNewAgreementError({
        title: !titleErr,
        description: !descriptionErr,
        scope: !scopeErr,
      })
    }
  }
  const submitEdit = () => {
    submitSectionRelated()
    // setSubmitDialog(false)
  }
  const verifyAllStatus = () => {
    let validAmendement = true
    const sectionsStatus = get(
      getAgreementsByIdStatus,
      'data.sections_details',
      [],
    )
    if ((sectionsStatus && sectionsStatus.length === 0) || amendedAgreement) {
      validAmendement = false
    }

    if (sectionsStatus) {
      sectionsStatus.forEach(item => {
        if (item.section_entity.status !== 'APPROVED') {
          validAmendement = false
        }
      })
    }

    return validAmendement
  }

  const renderActions = [
    {
      label: t('discard'),
      action: () => {
        navigate('/agreement/content')
      },
      isVisible: true,
      swapTheming: false,
      active: true,
      icon: 'close',
    },
    !verifyAllStatus()
      ? {
        label: t('submit'),
        action: () => {
          // console.log('salut')
          agreementId ? renderSectionsRolesToSubmit() : submitNew()
        },
        isVisible: !activityId,
        swapTheming: true,
        active: true,
        icon: 'send',
      }
      : {
        label: 'New Amendement',
        action: () => setVisibleWarning(true),
        isVisible: true,
        swapTheming: true,
        active: true,
        icon: 'edit',
      },
  ]

  const renderSectionsRolesToSubmit = () => {
    let readyToSubmit = []
    let notReadyToSubmit = []
    for (let section of sections) {
      const currentRole = isWritable(section.label)
      const networkSections = get(
        getAgreementsByIdStatus,
        'data.sections_details',
      )
      const findSection = networkSections.find(
        sct => sct.section_entity.section.name === section.label,
      )
      if (findSection) {
        if (
          currentRole &&
          currentRole.map(cr => cr.name).includes('Uploader') &&
          (findSection.section_entity.status === 'NOT SUBMITTED' ||
            findSection.section_entity.status === 'SUBMITTED' ||
            findSection.section_entity.status === 'AMENDED' ||
            amendedAgreement)
        ) {
          if (dirtySections.includes(section.label) && section.validate()) {
            readyToSubmit.push(section.label)
          } else {
            notReadyToSubmit.push(section.label)
          }
        }
      }
    }
    setSubmitDialog({ readyToSubmit, notReadyToSubmit })
    setSubmitDialogVisible(true)
  }
  const onDelete = (file, cat) => {
    let agreementFiles = attachments.attachments
    const findDeletedCategory = agreementFiles.find(
      item => item.category.label === cat.label,
    )
    if (findDeletedCategory) {
      const newFilesCat = findDeletedCategory.files.filter(
        item => item.file_name !== file.name,
      )
      setAttachments({
        ...attachments,
        attachments: [
          ...agreementFiles.filter(item => item.category.label !== cat.label),
          {
            category: cat,
            files: newFilesCat,
          },
        ],
      })
    }
    addDirtySections('Attachments')
  }

  const validExplorationCommitment = () => {
    let res = true
    if (!Object.keys(get(explorationCommitmentData, `values`, {})).length) {
      res = false
    } else {
      listTypes.forEach(({ id }) => {
        const keys = flatMap(
          get(
            explorationCommitmentData,
            `values.${id}`,
            [],
          ).map(({ unit, ...years }) => Object.keys(years)),
          e => e.map(year => +year),
        )
        const start = Math.min(...keys)
        const end = Math.max(...keys)

        const yearsConfig = Array.from(
          { length: end - start + 1 },
          (data, index) => start + index,
        )
        get(explorationCommitmentData, `values.${id}`, []).forEach(element => {
          res =
            res &&
            yearsConfig.filter(
              year => !isNaN(+prettifiedStringToNumber(element[year], 2, 12)),
            ).length === yearsConfig.length
        })
      })
    }
    return res
  }
  // const getRelinquishmentsData = dataIndex => {
  //   setRelinquishments({
  //     ...relinquishments,
  //     relinquishments: (relinquishments.relinquishments || []).filter(
  //       (elem, position) => position !== dataIndex,
  //     ),
  //   })
  //   setModifiedRelinquishments(true)
  // }

  const validateParties = () => {
    if (parties) {
      if (
        get(parties, 'operators.length', 0) === 0 &&
        get(parties, 'shareholders.length', 0) === 0 &&
        get(parties, 'contractors.length', 0) === 0 &&
        get(parties, 'service_providers.length', 0) === 0
      ) {
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  }

  const validateMasterContract = () => {
    if (uploadedFile) {
      if (uploadedFile.length > 0 && uploadedFile[0].file_name) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
  const formatPartiesBody = () => {
    return {
      ...parties,
      operators: parties.operators.map(elem => ({
        ...elem,
        id: +elem.id,
      })),
      shareholders: parties.shareholders.map(elem => ({
        ...elem,
        id: +elem.id,
      })),
      service_providers: parties.service_providers.map(elem => ({
        ...elem,
        id: +elem.id,
      })),
      contractors: parties.contractors.map(elem => ({ ...elem, id: +elem.id })),
    }
  }

  const validBlockDetails = () => {
    const blockName = blockDetails.block_name
    const blockId = blockDetails.block_id
    const operatorName = blockDetails.operator_name
    const operatorId = blockDetails.operator_id
    const blockSignatureDate = blockDetails.block_signature_date
    const blockOriginalPscDate = blockDetails.block_original_psc_date
    const blockEffectiveDate = blockDetails.block_effective_date
    const blockExpirationDate = blockDetails.block_expiration_date
    const area = blockDetails.area
    const contractDurationIepYears = blockDetails.contract_duration.iep.years
    const contractDurationIepExt1 = blockDetails.contract_duration.iep.ext1
    const contractDurationIepExt2 = blockDetails.contract_duration.iep.ext2
    const contractDurationIepExt3 = blockDetails.contract_duration.iep.ext3
    const contractDurationFaepYears = blockDetails.contract_duration.faep.years
    const contractDurationFaepExt1 = blockDetails.contract_duration.faep.ext1
    const contractDurationFaepExt2 = blockDetails.contract_duration.faep.ext2
    const contractDurationFaepExt3 = blockDetails.contract_duration.faep.ext3
    const contractDurationSaepYears = blockDetails.contract_duration.saep.years
    const contractDurationSaepExt1 = blockDetails.contract_duration.saep.ext1
    const contractDurationSaepExt2 = blockDetails.contract_duration.saep.ext2
    const contractDurationSaepExt3 = blockDetails.contract_duration.saep.ext3
    const surfaceFeeIep = blockDetails.surface_fee_iep
    const surfaceFeeFaep = blockDetails.surface_fee_faep
    const surfaceFeeSaep = blockDetails.surface_fee_saep
    if (
      blockName &&
      blockId &&
      operatorName &&
      operatorId &&
      blockSignatureDate &&
      blockOriginalPscDate &&
      blockEffectiveDate &&
      blockExpirationDate &&
      (area || area === 0) &&
      (contractDurationIepYears || contractDurationIepYears === 0) &&
      (contractDurationIepExt1 || contractDurationIepExt1 === 0) &&
      (contractDurationIepExt2 || contractDurationIepExt2 === 0) &&
      (contractDurationIepExt3 || contractDurationIepExt3 === 0) &&
      (contractDurationFaepYears || contractDurationFaepYears === 0) &&
      (contractDurationFaepExt1 || contractDurationFaepExt1 === 0) &&
      (contractDurationFaepExt2 || contractDurationFaepExt2 === 0) &&
      (contractDurationFaepExt3 || contractDurationFaepExt3 === 0) &&
      (contractDurationSaepYears || contractDurationSaepYears === 0) &&
      (contractDurationSaepExt1 || contractDurationSaepExt1 === 0) &&
      (contractDurationSaepExt2 || contractDurationSaepExt2 === 0) &&
      (contractDurationSaepExt3 || contractDurationSaepExt3 === 0) &&
      (surfaceFeeIep || surfaceFeeIep === 0) &&
      (surfaceFeeFaep || surfaceFeeFaep === 0) &&
      (surfaceFeeSaep || surfaceFeeSaep === 0)
    ) {
      return true
    }
    return false
  }
  const renderFiscalTerms = () => {
    return {
      costs: fiscalTerms.costs.map(elem => ({
        ...elem,
        value: elem.value,
      })),
      // profit_option: fiscalTerms.profit_option,
      // profit_r_factor: fiscalTerms.profit_r_factor,
      // profit_sharing: fiscalTerms.profit_sharing,
      // second_tiers: fiscalTerms.second_tiers,
    }
  }
  const formatBlockDetailsNumbers = () => {
    const maxNumberLength = 12
    const newBlockDetails = { ...blockDetails }
    blockDetailsNumberType.forEach(({ key, precision = 0 }) => {
      if (has(newBlockDetails, key.join('.'))) {
        set(
          newBlockDetails,
          key.join('.'),
          +prettifiedStringToNumber(
            get(newBlockDetails, key.join('.'), 0),
            precision,
            maxNumberLength,
          ),
        )
      }
    })
    return newBlockDetails
  }
  const sections = [
    {
      id: 5,
      label: 'Relinquishments & new Areas',
      action: () =>
        submitRelinquishments(
          organizationID,
          agreementId,
          relinquishments.relinquishments.map(elem => ({
            ...elem,
            area_by_contract: +prettifiedStringToNumber(
              elem.area_by_contract,
              3,
              12,
            ),
          })),
          amendedAgreement,
        ),
      validate: () =>
        modifiedRelinquishments &&
        get(relinquishments, 'relinquishments.length', 0) > 0,
      refetch: () => getRelinquishments(organizationID, agreementId),
    },

    {
      id: 3,
      label: 'Block Details',
      action: () =>
        submitBlockDetails(
          organizationID,
          agreementId,
          formatBlockDetailsNumbers(),
          amendedAgreement,
        ),
      validate: validBlockDetails,
      refetch: () => getBlockDetails(organizationID, agreementId),
    },
    {
      id: 2,
      label: 'Parties',
      action: () =>
        submitParties(
          organizationID,
          agreementId,
          formatPartiesBody(),
          amendedAgreement,
        ),
      validate: () => validateParties(),
      refetch: () => getParties(organizationID, agreementId),
    },
    {
      id: 1,
      label: 'Master Contract',
      action: () =>
        submitMasterContract(
          organizationID,
          agreementId,
          uploadedFile[0],
          amendedAgreement,
        ),
      validate: () => validateMasterContract(),
      refetch: () => getMasterContract(organizationID, agreementId),
    },
    {
      id: 4,
      label: 'Exploration Commitments',
      action: () =>
        submitExplorationCommitment(
          organizationID,
          agreementId,
          formatExplorationCommitmentBody(),
          amendedAgreement,
        ),
      validate: () =>
        modifiedExplorationCommitment && validExplorationCommitment(),
      refetch: () => getExplorationCommitment(organizationID, agreementId),
    },
    {
      id: 6,
      label: 'Polygon',
      action: () =>
        submitPolygon(
          organizationID,
          agreementId,
          polygon.polygons.map(elem => ({
            ...elem,
            x: +prettifiedStringToNumber(elem.x, 6, 9),
            y: +prettifiedStringToNumber(elem.y, 6, 9),
          })),
          amendedAgreement,
        ),
      validate: () => {
        const statusOn = get(polygon, 'polygons', []).filter(
          item => item.status === 'ON',
        )
        if (statusOn.length < 3) {
          setAllowOpenDialog(false)
          addToast(
            <ToastMsg
              text={'You must add at least 3 polygons with the status ON'}
              type={'warning'}
            />,
            'hide',
          )
        } else {
          setAllowOpenDialog(true)
        }
        return get(polygon, 'polygons.length', 0) > 0 && statusOn.length >= 3
      },
      refetch: () => getPolygon(organizationID, agreementId),
    },
    {
      id: 9,
      label: 'Fiscal Terms',
      action: () =>
        submitFiscalTerms(
          organizationID,
          agreementId,
          renderFiscalTerms(),
          amendedAgreement,
        ),
      validate: () => validateFiscalTerms(),
      refetch: () => getFiscalTerms(organizationID, agreementId),
    },
    {
      id: 8,
      label: 'Legal Terms Obligations',
      action: () =>
        submitLegalTerms(
          organizationID,
          agreementId,
          legalTermsData.content,
          amendedAgreement,
        ),
      validate: () => validateLegalTerms(),
      refetch: () => getLegalTerms(organizationID, agreementId),
    },
    {
      id: 7,
      label: 'Obligations',
      action: () =>
        submitObligations(
          organizationID,
          agreementId,
          obligationData.content,
          amendedAgreement,
        ),
      validate: () => validateObligations(),
      refetch: () => getObligations(organizationID, agreementId),
    },
    {
      id: 10,
      label: 'Attachments',
      action: () =>
        submitAttachments(
          organizationID,
          agreementId,
          attachments.attachments.map(elem => ({
            ...elem,
            category: elem.category.label,
          })),
          amendedAgreement,
        ),
      validate: () => get(attachments, 'attachments.length', 0) > 0,
      refetch: () => getAttachments(organizationID, agreementId),
    },
  ]

  const submitSectionRelated = () => {
    for (let section of sections) {
      const role = isWritable(section.label)
      const apiSections = get(
        getAgreementsByIdStatus,
        'data.sections_details',
        [],
      )

      const findSection = apiSections.find(
        sct => sct.section_entity.section.id === section.id,
      )
      if (
        role &&
        role.find(elem => elem.id === 2) &&
        findSection &&
        (findSection.section_entity.status === 'NOT SUBMITTED' ||
          findSection.section_entity.status === 'SUBMITTED' ||
          findSection.section_entity.status === 'AMENDED' ||
          amendedAgreement)
      ) {
        if (dirtySections.includes(section.label) && section.validate()) {
          // REVIEW  we should remove the section from the list dirtySections here
          section.action()
        }
      }
    }
  }
  const refetchSectionRelated = () => {
    for (let section of sections) {
      const role = isWritable(section.label)
      if (role && role.find(elem => elem.id === 1)) {
        section.refetch()
      }
    }
  }
  const validateFiscalTerms = () => {
    let valid = true
    if (
      !fiscalTerms.costs ||
      (fiscalTerms.costs && fiscalTerms.costs.length === 0)
    ) {
      valid = false
    }
    // if (!fiscalTerms.profit_r_factor && !fiscalTerms.profit_sharing) {
    //   valid = false
    // }
    // if (
    //   fiscalTerms.profit_r_factor &&
    //   fiscalTerms.profit_r_factor.length === 0
    // ) {
    //   valid = false
    // }
    // if (fiscalTerms.profit_sharing && fiscalTerms.profit_sharing.length === 0) {
    //   valid = false
    // }
    return valid
  }
  const validateLegalTerms = () => {
    let valid = true
    const legalTermsString = get(legalTermsData, 'content', '').replace(
      /(<([^>]+)>)/gi,
      '',
    )
    if (legalTermsString.length < 2) {
      valid = false
    }

    return valid
  }
  const validateObligations = () => {
    let valid = true
    const legalTermsString = get(obligationData, 'content', '').replace(
      /(<([^>]+)>)/gi,
      '',
    )
    if (legalTermsString.length < 2) {
      valid = false
    }

    return valid
  }

  const handleDownload = file => {
    // const file = get(getSectionData('Master Contract'), 'data')
    const url = file.url
      .split('/')
      .slice(2)
      .join('/')
    const name = file.file_name
    fileManagerDownload(url, name)
  }

  const handleDialogSave = (type, companies) => {
    setParties({ ...parties, [type]: companies })
    addDirtySections('Parties')
  }

  const addFiscalTermsRow = (section, rows) => {
    switch (section) {
      case 'cost':
        setFiscalTerms({
          ...fiscalTerms,
          costs: rows.map(row => {
            return {
              category: row.category,
              sub_category: row.subCategory,
              uom: row.valueUmo,
              value: row.value,
            }
          }),
        })
        break
      // case 'profit_op1':
      //   setFiscalTerms({
      //     ...fiscalTerms,
      //     profit_option: 1,
      //     profit_r_factor: null,
      //     profit_sharing: rows.map(row => {
      //       return {
      //         production_level: row.productionLevel,
      //         sensitivity: parseInt(row.sensivity),
      //         effective: parseInt(row.effective),
      //         contractor_share: parseInt(row.contractorShare),
      //       }
      //     }),
      //   })
      //   break
      // case 'profit_op2':
      //   setFiscalTerms({
      //     ...fiscalTerms,
      //     profit_option: 2,
      //     profit_sharing: null,
      //     profit_r_factor: rows.map(row => {
      //       return {
      //         contractor_share: parseInt(row.contractorShare),
      //         ratio: parseInt(row.ratio),
      //         taxation: parseInt(row.taxation),
      //       }
      //     }),
      //   })
      //   break
      // case 'second_tiers':
      //   setFiscalTerms({
      //     ...fiscalTerms,
      //     second_tiers: rows.map(row => {
      //       return {
      //         windfall_rate: parseInt(row.windfallRate),
      //         threshold_price: parseInt(row.thresholdPrice),
      //         transfer_location: row.transferLocation,
      //       }
      //     }),
      //   })
      //   break
    }
    addDirtySections('Fiscal Terms')
  }
  // const onCheckSharing = checkedLabel => {
  //   if (checkedLabel === 'sharing') {
  //     setFiscalTerms({
  //       ...fiscalTerms,
  //       profit_option: 1,
  //       profit_r_factor: null,
  //     })
  //   } else if (checkedLabel === 'rFactor') {
  //     setFiscalTerms({
  //       ...fiscalTerms,
  //       profit_option: 2,
  //       profit_sharing: null,
  //     })
  //   }
  // }
  // const onCheckSecond = checked => {
  //   if (!checked) {
  //     setFiscalTerms({
  //       ...fiscalTerms,
  //       second_tiers: null,
  //     })
  //   }
  // }
  const member = {
    subject: user && user.subject,
  }
  const onAdd = ({ type, date, referenceNumber, area }) => {
    setRelinquishments({
      ...relinquishments,
      relinquishments: [
        ...(relinquishments.relinquishments || []),
        {
          type,
          date: moment(date, 'DD/MM/YYYY'),
          reference_number: referenceNumber,
          area_by_contract: area,
          // area_by_polygon: +area,
        },
      ],
    })
    setModifiedRelinquishments(true)
    addDirtySections('Relinquishments & new Areas')
  }
  const getPolygonData = () => {
    const polygonData = get(polygon, 'polygons', []) || []
    return polygonData.map(el => {
      return {
        startDate: el.start_date,
        status: el.status,
        serial: el.serial,
        xAxis: el.x,
        yAxis: el.y,
      }
    })
  }
  const onAddPolygon = row => {
    setPolygon({
      ...polygon,
      polygons: [
        ...(polygon.polygons || []),
        {
          status: row.status,
          serial: row.serial,
          start_date: moment(row.startDate, 'DD/MM/YYYY'),
          x: row.xAxis,
          y: row.yAxis,
        },
      ],
    })
    addDirtySections('Polygon')
  }
  const updateRemarks = remarks => {
    updateSectionEntity(
      organizationID,
      agreementId,
      sectionToApproveAmend,
      'AMEND',
      remarks,
    )
  }
  const showActionTest = (section, dataFromApi) => {
    return (
      isWritable(section) &&
      isWritable(section).find(elem => elem.id === 1) &&
      get(dataFromApi, 'data.section_entity.status', '') === 'SUBMITTED'
    )
  }

  const actionsSubmitDialog = [
    {
      onClick: () => {
        setSubmitDialogVisible(false)
      },
      primary: true,
      children: 'Cancel',
    },
    {
      onClick: () => submitEdit(),
      primary: true,
      children: 'Confirm',
      disabled: submitDialog && submitDialog.readyToSubmit.length === 0,
    },
  ]
  const actionsErrorDialog = [
    {
      onClick: () => {
        setSubmitSectionsStatuses([])
      },
      primary: true,
      children: 'Discard',
    },
  ]
  const actionsDeleteFile = [
    {
      onClick: () => setDeleteFile(false),
      primary: true,
      children: 'Discard',
    },
    {
      onClick: () => {
        setUploadedFile([])
        setDeleteFile(false)
      },
      primary: true,
      children: 'Confirm',
    },
  ]
  const renderErrorSections = () => {
    let message = []
    const error = submitSectionsStatuses.map((nrs, index) => (
      <div key={index}>{nrs}</div>
    ))
    message.push(
      <>
        <h3>Error while submitting these fields:</h3>
        {error}
      </>,
    )

    return message
  }
  const renderSectionTitle = title => {
    let dataTitle = title
    if (title === 'Exploration Commitments') {
      dataTitle = 'Minimum Exploration Work and Expenditure Obligations'
    } else if (title === 'Obligations') {
      dataTitle = 'Obligations of the Contractor'
    }
    return dataTitle
  }
  const renderSubmitSections = onClickSection => {
    let message = []
    if (submitDialog && submitDialog.readyToSubmit.length > 0) {
      const submitted = submitDialog.readyToSubmit.map((nrs, index) => (
        <div key={index} className="submitSection-items">
          {renderSectionTitle(nrs)}
        </div>
      ))
      message.push(
        <>
          <div className="submitSection-title">You are submitting:</div>
          {submitted}
        </>,
      )
    } else {
      message.push(
        <div className="submitSection-msg">
          <FontIcon secondary className="warningIcon">
            warning
          </FontIcon>
          <div>No sections to submit</div>
        </div>,
      )
    }

    if (submitDialog && submitDialog.notReadyToSubmit.length > 0) {
      const notSubmitted = submitDialog.notReadyToSubmit.map((nrs, index) => (
        <div
          onClick={() => onClickSection(nrs)}
          key={index}
          className="submitSection-items notSub"
        >
          {renderSectionTitle(nrs)}
        </div>
      ))
      message.push(
        <>
          <div className="submitSection-title">You are not submitting:</div>
          {notSubmitted}
        </>,
      )
    }

    return message
  }
  const onDeleteRow = row => {
    setPolygon({
      ...polygon,
      polygons: polygon.polygons
        ? polygon.polygons.filter(
          (el, index) => index !== parseInt(row.indexId),
        )
        : [],
    })
  }

  const onDeleteRowRelinquishments = row => {
    setRelinquishments({
      ...relinquishments,
      relinquishments: relinquishments.relinquishments
        ? relinquishments.relinquishments.filter(
          (el, index) => index !== parseInt(row.indexId),
        )
        : [],
    })
  }

  const showSideBar = () => {
    if (
      !testSectionToShow('Master Contract') &&
      !testSectionToShow('Parties')
    ) {
      return false
    } else {
      return true
    }
  }

  const onDeleteUploadedFile = () => {
    setDeleteFile(true)
    // getMasterContract(organizationID, agreementId)
  }

  const mainRef = useRef()
  const blockRef = useRef()
  const explRef = useRef()
  const reliqRef = useRef()
  const polygonRef = useRef()
  const legRef = useRef()
  const obRef = useRef()
  const fisRef = useRef()
  const attRef = useRef()

  const onClickSection = section => {
    setSubmitDialogVisible(false)
    setVisiblePortal(false)

    switch (section) {
      case 'Block Details':
        onScroll(blockRef, mainRef)
        break
      case 'Exploration Commitments':
        onScroll(explRef, mainRef)
        break
      case 'Relinquishments & new Areas':
        onScroll(reliqRef, mainRef)
        break
      case 'Polygon':
        onScroll(polygonRef, mainRef)
        break
      case 'Legal Terms Obligations':
        onScroll(legRef, mainRef)
        break
      case 'Obligations':
        onScroll(obRef, mainRef)
        break
      case 'Fiscal Terms':
        onScroll(fisRef, mainRef)
        break
      case 'Attachments':
        onScroll(attRef, mainRef)
        break
      default:
        break
    }
  }

  const activityNavigate = ind => {
    let path = ''
    if (pathname.split('/').length === 5) {
      path = pathname
    } else {
      path = pathname
        .split('/')
        .slice(0, -2)
        .join('/')
    }
    window.location.href = `${path}/${ind.id}/${ind.title}`
  }

  const todayNavigate = () => {
    if (pathname.split('/').length === 7) {
      const path = pathname
        .split('/')
        .slice(0, -2)
        .join('/')
      window.location.href = `${path}`
    }
  }

  const renderBlockDetailsSection = () => (
    <BlockDetails
      // ref={blockRef}
      amendedAgreement={amendedAgreement}
      collapsePanelLabel={
        <>
          BLOCK DETAILS
          <Button
            onClick={e => {
              e.stopPropagation()
              if (visiblePortal) {
                setVisiblePortal(false)
              } else {
                setVisiblePortal('renderBlockDetailsSection')
              }
            }}
            icon
            className="expandButton"
            iconClassName={`mdi mdi-arrow-${
              visiblePortal ? 'collapse' : 'expand'
            }`}
          />
        </>
      }
      leftIcon={Block}
      iconColor="blue"
      blockDetails={blockDetails}
      setBlockDetails={addBlockDetails}
      organizationID={organizationID}
      role={isWritable('Block Details')}
      showAction={showActionTest(
        'Block Details',
        getSectionData('Block Details'),
      )}
      actions={renderPanelActions('Block Details')}
      agreementId={agreementId}
      getBlocksListStatus={getBlocksListStatus}
      loading={getSectionData('Block Details').pending}
      updateSectionEntityStatus={updateSectionEntityStatus}
      activityId={activityId}
    />
  )

  const renderExplorationCommitmentSection = () => (
    <ExplorationCommitment
      amendedAgreement={amendedAgreement}
      collapsePanelLabel={
        <>
          MINIMUM EXPLORATION WORK AND EXPENDITURE OBLIGATIONS
          <Button
            onClick={e => {
              e.stopPropagation()
              if (visiblePortal) {
                setVisiblePortal(false)
              } else {
                setVisiblePortal('renderExplorationCommitmentSection')
              }
            }}
            icon
            className="expandButton"
            iconClassName={`mdi mdi-arrow-${
              visiblePortal ? 'collapse' : 'expand'
            }`}
          />
        </>
      }
      leftIcon={Exploration}
      explorationCommitmentData={explorationCommitmentData}
      handleExplorationCommitmentData={handleExplorationCommitmentData}
      iconColor="yellow"
      role={isWritable('Exploration Commitments')}
      showAction={showActionTest(
        'Exploration Commitments',
        getSectionData('Exploration Commitments'),
      )}
      actions={renderPanelActions('Exploration Commitments')}
      agreementId={agreementId}
      getBlocksListStatus={getBlocksListStatus}
      loading={getSectionData('Exploration Commitments').pending}
      updateSectionEntityStatus={updateSectionEntityStatus}
      activityId={activityId}
    />
  )

  const renderRelinquishmentsSection = () => (
    <CustomExpansionPanel
      defaultExpanded={agreementId}
      className={cls('relinquishments', relinquishmentsUpdateStatus || '')}
      header={
        <HeaderOption
          label={
            <>
              RELINQUISHMENTS & NEW AREAS
              <Button
                onClick={e => {
                  e.stopPropagation()
                  if (visiblePortal) {
                    setVisiblePortal(false)
                  } else {
                    setVisiblePortal('renderRelinquishmentsSection')
                  }
                }}
                icon
                className="expandButton"
                iconClassName={`mdi mdi-arrow-${
                  visiblePortal ? 'collapse' : 'expand'
                }`}
              />
            </>
          }
          icon={Relinquishments}
          iconColor="teal"
          showAction={showActionTest(
            'Relinquishments & new Areas',
            getSectionData('Relinquishments & new Areas'),
          )}
          actions={renderPanelActions('Relinquishments & new Areas')}
        />
      }
      body={
        getSectionData('Relinquishments & new Areas').pending ? (
          <TableLoader />
        ) : (
          agreementId && (
            <>
              {get(
                getSectionData('Relinquishments & new Areas'),
                'data.section_entity.remarks',
                '',
              ) && (
                <RemarksFooter
                  remark={get(
                    getSectionData('Relinquishments & new Areas'),
                    'data.section_entity.remarks',
                    '',
                  )}
                />
              )}
              <DataTableAddition
                config={configs(
                  onDeleteRowRelinquishments,
                  get(
                    getSectionData('Relinquishments & new Areas'),
                    'data.section_entity.status',
                    '',
                  ),
                  isWritable('Relinquishments & new Areas'),
                )}
                role={isWritable('Relinquishments & new Areas')}
                amendedAgreement={amendedAgreement}
                data={relinquishments.relinquishments || []}
                canAddRows={true}
                onAdd={onAdd}
                activityId={activityId}
                status={get(
                  getSectionData('Relinquishments & new Areas'),
                  'data.section_entity.status',
                  '',
                )}
              />
            </>
          )
        )
      }
    />
  )

  const renderPolygonSection = () => (
    <CustomExpansionPanel
      defaultExpanded={agreementId}
      className={cls('polygon', polygonUpdateStatus || '')}
      header={
        <HeaderOption
          label={
            <>
              POLYGON
              <Button
                onClick={e => {
                  e.stopPropagation()
                  if (visiblePortal) {
                    setVisiblePortal(false)
                  } else {
                    setVisiblePortal('renderPolygonSection')
                  }
                }}
                icon
                className="expandButton"
                iconClassName={`mdi mdi-arrow-${
                  visiblePortal ? 'collapse' : 'expand'
                }`}
              />
            </>
          }
          icon={Polygon}
          iconColor="red"
          showAction={showActionTest('Polygon', getSectionData('Polygon'))}
          actions={renderPanelActions('Polygon')}
          role={isWritable('Polygon')}
        />
      }
      body={
        getSectionData('Polygon').pending ? (
          <TableLoader />
        ) : (
          agreementId && (
            <>
              {get(
                getSectionData('Polygon'),
                'data.section_entity.remarks',
                '',
              ) && (
                <RemarksFooter
                  remark={get(
                    getSectionData('Polygon'),
                    'data.section_entity.remarks',
                    '',
                  )}
                />
              )}
              <DataTableAddition
                amendedAgreement={amendedAgreement}
                config={configsAddition(
                  onDeleteRow,
                  get(
                    getSectionData('Polygon'),
                    'data.section_entity.status',
                    '',
                  ),
                  isWritable('Polygon'),
                )}
                role={isWritable('Polygon')}
                data={getPolygonData()}
                canAddRows={true}
                status={get(
                  getSectionData('Polygon'),
                  'data.section_entity.status',
                  '',
                )}
                onAdd={onAddPolygon}
                activityId={activityId}
              />
            </>
          )
        )
      }
    />
  )

  const renderLegalTermsSection = () => (
    <LegalTerms
      key={1}
      amendedAgreement={amendedAgreement}
      collapsePanelLabel={
        <>
          LEGAL TERMS
          <Button
            onClick={e => {
              e.stopPropagation()
              if (visiblePortal) {
                setVisiblePortal(false)
              } else {
                setVisiblePortal('renderLegalTermsSection')
              }
            }}
            icon
            className="expandButton"
            iconClassName={`mdi mdi-arrow-${
              visiblePortal ? 'collapse' : 'expand'
            }`}
          />
        </>
      }
      leftIcon={Relinquishments}
      legalTermsData={legalTermsData}
      handleLegalTermsData={handleLegalTermsData}
      iconColor="green"
      role={isWritable('Legal Terms Obligations')}
      showAction={showActionTest(
        'Legal Terms Obligations',
        getSectionData('Legal Terms Obligations'),
      )}
      actions={renderPanelActions('Legal Terms Obligations')}
      agreementId={agreementId}
      updateSectionEntityStatus={updateSectionEntityStatus}
      loading={getSectionData('Legal Terms Obligations').pending}
      activityId={activityId}
    />
  )

  const renderObligationsSection = () => (
    <Obligations
      amendedAgreement={amendedAgreement}
      collapsePanelLabel={
        <>
          OBLIGATIONS OF THE CONTRACTOR
          <Button
            onClick={e => {
              e.stopPropagation()
              if (visiblePortal) {
                setVisiblePortal(false)
              } else {
                setVisiblePortal('renderObligationsSection')
              }
            }}
            icon
            className="expandButton"
            iconClassName={`mdi mdi-arrow-${
              visiblePortal ? 'collapse' : 'expand'
            }`}
          />
        </>
      }
      leftIcon={obligations}
      iconColor="teal"
      obligationData={obligationData}
      handleObligationData={handleObligationData}
      role={isWritable('Obligations')}
      showAction={showActionTest('Obligations', getSectionData('Obligations'))}
      actions={renderPanelActions('Obligations')}
      agreementId={agreementId}
      loading={getSectionData('Obligations').pending}
      updateSectionEntityStatus={updateSectionEntityStatus}
      activityId={activityId}
    />
  )

  const renderFiscalTermsSection = () => (
    <CustomExpansionPanel
      defaultExpanded={agreementId}
      className={cls('fiscal-terms', fiscalTermsUpdateStatus || '')}
      header={
        <HeaderOption
          label={
            <>
              FISCAL TERMS
              <Button
                onClick={e => {
                  e.stopPropagation()
                  if (visiblePortal) {
                    setVisiblePortal(false)
                  } else {
                    setVisiblePortal('renderFiscalTermsSection')
                  }
                }}
                icon
                className="expandButton"
                iconClassName={`mdi mdi-arrow-${
                  visiblePortal ? 'collapse' : 'expand'
                }`}
              />
            </>
          }
          icon={fiscal}
          iconColor="light-green"
          showAction={showActionTest(
            'Fiscal Terms',
            getSectionData('Fiscal Terms'),
          )}
          actions={renderPanelActions('Fiscal Terms')}
        />
      }
      body={
        getSectionData('Fiscal Terms').pending ? (
          <TableLoader />
        ) : (
          agreementId && (
            <DataTableAdditionGroup
              amendedAgreement={amendedAgreement}
              fiscalTerms={fiscalTerms}
              role={isWritable('Fiscal Terms')}
              onAddRow={addFiscalTermsRow}
              // onCheckSharing={onCheckSharing}
              // onCheckSecond={onCheckSecond}
              activityId={activityId}
            />
          )
        )
      }
    />
  )

  const renderAttachmentsSection = () => (
    <Attachments
      categoryList={attachmentCategoryList}
      uploadDocs={(file, cat) => uploadDocs(file, cat)}
      listUploadedFile={attachments}
      onDelete={onDelete}
      amendedAgreement={amendedAgreement}
      collapsePanelLabel={
        <>
          ATTACHMENTS
          <Button
            onClick={e => {
              e.stopPropagation()
              if (visiblePortal) {
                setVisiblePortal(false)
              } else {
                setVisiblePortal('renderAttachmentsSection')
              }
            }}
            icon
            className="expandButton"
            iconClassName={`mdi mdi-arrow-${
              visiblePortal ? 'collapse' : 'expand'
            }`}
          />
        </>
      }
      role={isWritable('Attachments')}
      leftIcon={attachmentIcon}
      iconColor="blue"
      showAction={showActionTest('Attachments', getSectionData('Attachments'))}
      actions={renderPanelActions('Attachments')}
      agreementId={agreementId}
      loading={getSectionData('Attachments').pending}
      updateSectionEntityStatus={updateSectionEntityStatus}
      activityId={activityId}
    />
  )
  const sectionToRender = section => {
    switch (section) {
      case 'renderBlockDetailsSection':
        return renderBlockDetailsSection()
      case 'renderExplorationCommitmentSection':
        return renderExplorationCommitmentSection()
      case 'renderRelinquishmentsSection':
        return renderRelinquishmentsSection()
      case 'renderPolygonSection':
        return renderPolygonSection()
      case 'renderLegalTermsSection':
        return renderLegalTermsSection()
      case 'renderObligationsSection':
        return renderObligationsSection()
      case 'renderFiscalTermsSection':
        return renderFiscalTermsSection()
      case 'renderAttachmentsSection':
        return renderAttachmentsSection()
      default:
        return null
    }
  }
  const addBlockDetails = values => {
    setBlockDetails(values)
    addDirtySections('Block Details')
  }
  const renderActivitiesColor = sectionName => {
    switch (sectionName) {
      case 'Master Contract':
        return 'yellow'
      case 'Parties':
        return 'orange'
      case 'Block Details':
        return 'pink'
      case 'Exploration Commitments':
        return 'light-green'
      case 'Relinquishments & new Areas':
        return 'purple'
      case 'Polygon':
        return 'green'
      case 'Legal Terms Obligations':
        return 'red'
      case 'Obligations':
        return 'blue'
      case 'Fiscal Terms':
        return 'turquoise'
      case 'Attachments':
        return 'brown'
    }
  }
  const renderActivities = () => {
    const timelineData = get(getTimelineHistoryStatus, 'data', []).map(el => {
      return {
        date: new Date(el.created_at).getTime(),
        title: el.section,
        id: el.id,
        color: renderActivitiesColor(el.section),
      }
    })
    return [
      ...timelineData,
      {
        date: new Date().getTime(),
        title: 'today',
        id: 'today',
      },
    ]
  }

  return (
    <>
      <NavigateMenu tree={renderTree} actions={renderActions} />
      <div className="psa-agreement" id="mainContent">
        <ExpandTabs position="top" expand={expandTop} onChange={setExpandTop}>
          <div className="psa-agreement-top">
            <div className="psa-agreement-top-title">Activities</div>
            <Activities
              activities={renderActivities()}
              onClickIndicator={ind => activityNavigate(ind)}
              onClickToday={todayNavigate}
            />
          </div>
        </ExpandTabs>
        <div className={`psa-agreement-content ${expandTop ? '' : 'full'}`}>
          {showSideBar() && (
            <ExpandTabs>
              <div className="psa-agreement-sideBar psa-agreement-left">
                {testSectionToShow('Master Contract') && (
                  <MasterContract
                    amendedAgreement={amendedAgreement}
                    getUploadedFiles={getUploadedFiles}
                    uploadedFile={uploadedFile}
                    collapsePanelLabel={t('master_contract')}
                    role={isWritable('Master Contract')}
                    member={member}
                    AgreementFiles={uploadedFile[0]}
                    leftIcon={attachmentIcon}
                    iconColor="gris"
                    onClickDownload={handleDownload}
                    agreementId={agreementId}
                    showAction={showActionTest(
                      'Master Contract',
                      getSectionData('Master Contract'),
                    )}
                    getMasterContractStatus={getSectionData('Master Contract')}
                    actions={renderPanelActions('Master Contract')}
                    loading={getSectionData('Master Contract').pending}
                    updateSectionEntityStatus={updateSectionEntityStatus}
                    activityId={activityId}
                    onDeleteUploadedFile={onDeleteUploadedFile}
                  />
                )}

                {testSectionToShow('Parties') && (
                  <Parties
                    amendedAgreement={amendedAgreement}
                    title={t('parties')}
                    companies={parties}
                    role={isWritable('Parties')}
                    onDialogSave={handleDialogSave}
                    agreementId={agreementId}
                    searchCompanies={searchCompanies}
                    setSearchCompanies={setSearchCompanies}
                    setParties={(type, companies) => {
                      setParties({ ...parties, [type]: companies })
                      addDirtySections('Parties')
                    }}
                    showAction={showActionTest(
                      'Parties',
                      getSectionData('Parties'),
                    )}
                    actions={renderPanelActions('Parties')}
                    loading={getSectionData('Parties').pending}
                    updateSectionEntityStatus={updateSectionEntityStatus}
                    remark={get(
                      getSectionData('Parties'),
                      'data.section_entity.remarks',
                      '',
                    )}
                    activityId={activityId}
                  />
                )}
              </div>
            </ExpandTabs>
          )}
          <div ref={mainRef} className="psa-agreement-main">
            <NewAgreementForm
              role="admin"
              newAgreementData={newAgreementData}
              handleNewAgreementData={handleNewAgreementData}
              agreementId={agreementId}
              loading={getAgreementsByIdStatus.pending}
              newAgreementError={newAgreementError}
            />
            <Portal
              className="fakeDialog"
              visible={visiblePortal}
              renderNode={document.getElementById('mainContent')}
            >
              <div className="fakeDialog-content">
                {sectionToRender(visiblePortal)}
              </div>
            </Portal>
            {testSectionToShow('Block Details') && (
              <div ref={blockRef}>
                {sectionToRender('renderBlockDetailsSection')}
              </div>
            )}

            {testSectionToShow('Exploration Commitments') && (
              <div ref={explRef}>
                {sectionToRender('renderExplorationCommitmentSection')}
              </div>
            )}

            {testSectionToShow('Relinquishments & new Areas') && (
              <div ref={reliqRef}>
                {sectionToRender('renderRelinquishmentsSection')}
              </div>
            )}

            {testSectionToShow('Polygon') && (
              <div ref={polygonRef}>
                {sectionToRender('renderPolygonSection')}
              </div>
            )}
            {testSectionToShow('Legal Terms Obligations') && (
              <div ref={legRef}>
                {sectionToRender('renderLegalTermsSection')}
              </div>
            )}

            {testSectionToShow('Obligations') && (
              <div ref={obRef}>
                {sectionToRender('renderObligationsSection')}
              </div>
            )}
            {testSectionToShow('Fiscal Terms') && (
              <div ref={fisRef}>
                {sectionToRender('renderFiscalTermsSection')}
              </div>
            )}
            {testSectionToShow('Attachments') && (
              <div ref={attRef}>
                {sectionToRender('renderAttachmentsSection')}
              </div>
            )}
          </div>
          <ExpandTabs
            position="right"
            className={`${visiblePortal ? 'right-side-over-portal' : ''}`}
            expand={!visiblePortal}
          >
            <div className="psa-agreement-sideBar psa-agreement-right">
              <AddSections
                role={isWritable}
                handleSectionToShow={sectionToShow => {
                  setSectionToShow(sectionToShow)
                }}
                sectionsList={get(
                  getAgreementsByIdStatus,
                  'data.sections_details',
                  [],
                )}
                loading={getSectionData('Attachments').pending}
                onClickSection={onClickSection}
              />
            </div>
          </ExpandTabs>
        </div>
      </div>
      {visibilityRemarksDialog && (
        <Remarks
          closeDialog={() => setVisibilityRemarksDialog(false)}
          onAdd={remarks => updateRemarks(remarks)}
          section={sectionNameToApproveAmend}
        />
      )}
      {submitDialogVisible && allowOpenDialog && (
        <DialogContainer
          id="dialog-confirm-submission"
          className="submitDialog"
          title="Confirm"
          visible={!!submitDialogVisible && allowOpenDialog}
          width="30%"
          onHide={() => null}
          modal
          actions={actionsSubmitDialog}
        >
          {renderSubmitSections(onClickSection)}
        </DialogContainer>
      )}
      {submitSectionsStatuses.length > 0 && (
        <DialogContainer
          id="dialog-confirm-submission"
          className="submitDialog"
          title="Warning"
          visible={!!submitDialog}
          width="30%"
          onHide={() => null}
          modal
          actions={actionsErrorDialog}
        >
          {renderErrorSections()}
        </DialogContainer>
      )}
      {visibleWarning && (
        <Warning
          visible={visibleWarning}
          onSave={() => {
            setAmendedAgreement(true)
            setVisibleWarning(false)
          }}
          closeDialog={() => setVisibleWarning(false)}
        />
      )}
      <DialogContainer
        id="dialog-confirm-delete"
        className="deleteDialog"
        title="Confirm"
        visible={deleteFile}
        width="30%"
        onHide={() => setDeleteFile(false)}
        modal
        actions={actionsDeleteFile}
      >
        {'Do you want delete this file ?'}
      </DialogContainer>
    </>
  )
}

export default connect(
  ({ query, shell }) => ({
    organizationID: shell.organizationId,
    user: get(query, 'DEFAULT.me.data.user'),
  }),
  {
    clearMutation: act.clearMutation,
    addToast: actApp.addToast,
  },
)(
  mutate({
    moduleName: 'agreement',
    mutations: {
      submitAgreement,
      fileManagerUploadContract: fileManagerUpload,
      fileManagerUploadAttachment: fileManagerUpload,
      submitMasterContract,
      submitAttachments,
      getAgreementsById,
      getBlockDetails,
      submitBlockDetails,
      getMasterContract,
      fileManagerDownload,
      getExplorationCommitment,
      getRelinquishments,
      getPolygon,
      getLegalTerms,
      getObligations,
      getFiscalTerms,
      getAttachments,
      submitRelinquishments,
      updateSectionEntity,
      submitParties,
      getParties,
      submitExplorationCommitment,
      submitPolygon,
      submitFiscalTerms,
      submitLegalTerms,
      submitObligations,
      getBlocksList,
      getTimelineHistory,
      getMasterContractHistory,
      getPartiesHistory,
      getBlockDetailsHistory,
      getExplorationHistory,
      getRelinquishmentsHistory,
      getPolygonHistory,
      getLegalTermsHistory,
      getObligationsHistory,
      getFiscalTermsHistory,
      getAttachmentsHistory,
      updateTitle,
    },
  })(AnchorScroll(PSAgreement)),
)

const removeFromArray = (arr, value) => {
  return arr.filter(ele => ele !== value)
}
