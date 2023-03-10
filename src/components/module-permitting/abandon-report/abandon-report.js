import { useState, useEffect } from 'react'
import { Button } from 'react-md'
import { useMutation, useQuery } from 'react-query'
import { navigate } from '@reach/router'

import GenericForm from 'components/generic-form-permit'
import TopBar from 'components/top-bar'

import getBlocks from 'libs/hooks/get-blocks'
import { addPermit, savePermit, getPermitDetail } from 'libs/api/permit-api'
import { fileManagerUpload } from 'libs/api/api-file-manager'
import { validForm } from '../validate-form-fields'

import './style.scss'

const AbandonReport = ({ abandonReportId }) => {
  const [loading, setLoading] = useState(false)
  const [currentUploadedFile, setCurrentUploadedFile] = useState({})
  const [inputFileMEM, showInputFile] = useState(false)
  const [formData, setFormData] = useState({
    data: {
      plannedAbandonDate: new Date(),
    },
  })

  const { data: detailData } = useQuery(
    ['abandonReportById', 'Abandon', abandonReportId],
    abandonReportId & getPermitDetail,
  )
  useEffect(() => {
    if (detailData) {
      let data = formData.data
      ;(detailData?.data || []).forEach((el) => {
        data = {
          ...data,
          [el.id]: el.value,
        }
      })
      setFormData({
        ...formData,
        metaData: {
          permitType: detailData?.metaData?.permitType,
          block: detailData?.metaData?.block,
          company: detailData?.metaData?.company,
        },
        data,
      })
    }
  }, [detailData])
  useEffect(() => {
    if (localStorage.getItem('abandon-report')) {
      const drillReport = JSON.parse(localStorage.getItem('abandon-report'))
      setFormData({
        ...formData,
        metaData: {
          company: drillReport?.company,
          permitType: drillReport?.permitType,
          block: drillReport.block,
        },
        data: {
          plannedAbandonDate: drillReport.date,
        },
      })
    }
  }, [])

  const blockList = getBlocks()
  const justificationOptions = [
    'Well Integrity Failure',
    'Uneconomic Well at Submission Date',
    'Waiting for Production Facility',
    'Other',
  ]
  const wellCoordinatesFirstNonEmptyValue = [
    formData?.data?.wellSurfaceLocationCoordinatesNorth,
    formData?.data?.wellSubsurfaceTargetCoordinateNorth,
    formData?.data?.wellSubsurfaceTargetCoordinateEast,
    formData?.data?.wellSurfaceLocationCoordinatesEast,
  ].filter((el) => el)
  const setWellValue = (value) => ({
    wellSurfaceLocationCoordinatesNorth: value,
    wellSubsurfaceTargetCoordinateNorth: value,
    wellSubsurfaceTargetCoordinateEast: value,
    wellSurfaceLocationCoordinatesEast: value,
  })
  const fields = [
    {
      id: 'block',
      title: 'Block',
      cellWidth: 'md-cell md-cell--6',
      input: 'select',
      menuItems: Array.isArray(blockList)
        ? blockList?.map((el) => el.block)
        : [],
      required: true,
      onChange: (value) => onEditValue('block', value, true),
      value: formData?.metaData?.block,
    },
    {
      id: 'plannedAbandonDate',
      title: 'Planned P/A Date',
      cellWidth: 'md-cell md-cell--6',
      input: 'date',
      type: 'date',
      onChange: (value) => onEditValue('plannedAbandonDate', value),
      value: formData?.data?.plannedAbandonDate,
    },
    {
      id: 'fieldName',
      title: 'Field Name',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('fieldName', value),
      type: 'string',
      value: formData?.data?.fieldName,
    },
    {
      id: 'wellName',
      title: 'well Name',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('wellName', value, true),
      type: 'string',
      value: formData?.metaData?.wellName,
    },
    {
      id: 'tvdM',
      title: 'TVD, m',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('tvdM', value),
      type: 'string',
      value: formData?.data?.tvdM,
    },
    {
      id: 'wellSurfaceLocationCoordinatesNorth',
      title: 'well Surface Coordinates - North',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => {
        if (formData?.data?.wellType === 'vertical') {
          setFormData({
            ...formData,
            data: {
              ...formData.data,
              ...setWellValue(value),
            },
          })
        } else onEditValue('wellSurfaceLocationCoordinatesNorth', value)
      },
      type: 'string',
      value: formData?.data?.wellSurfaceLocationCoordinatesNorth,
    },
    {
      id: 'wellSurfaceLocationCoordinatesEast',
      title: 'well Surface Coordinates - East',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => {
        if (formData?.data?.wellType === 'vertical') {
          setFormData({
            ...formData,
            data: {
              ...formData.data,
              ...setWellValue(value),
            },
          })
        } else onEditValue('wellSurfaceLocationCoordinatesEast', value)
      },
      type: 'string',
      value: formData?.data?.wellSurfaceLocationCoordinatesEast,
    },
    {
      id: 'wellSubsurfaceTargetCoordinateNorth',
      title: 'Well Subsurface Target Coordinate - North',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => {
        if (formData?.data?.wellType === 'vertical') {
          setFormData({
            ...formData,
            data: {
              ...formData.data,
              ...setWellValue(value),
            },
          })
        } else onEditValue('wellSubsurfaceTargetCoordinateNorth', value)
      },
      type: 'string',
      value: formData?.data?.wellSubsurfaceTargetCoordinateNorth,
    },
    {
      id: 'wellSubsurfaceTargetCoordinateEast',
      title: 'Well Subsurface Target Coordinate - East',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => {
        if (formData?.data?.wellType === 'vertical') {
          setFormData({
            ...formData,
            data: {
              ...formData.data,
              ...setWellValue(value),
            },
          })
        } else onEditValue('wellSubsurfaceTargetCoordinateEast', value)
      },
      type: 'string',
      value: formData?.data?.wellSubsurfaceTargetCoordinateEast,
    },
    {
      id: 'rigHoistNumber',
      title: 'Rig/Hoist Number',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('rigHoistNumber', value),
      type: 'string',
      value: formData?.data?.rigHoistNumber,
    },
    {
      id: 'rigHostContractor',
      title: 'Rig/Hoist Contractor',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('rigHostContractor', value),
      type: 'string',
      value: formData?.data?.rigHostContractor,
    },
    {
      id: 'wellObjective',
      title: 'well Objective',
      cellWidth: 'md-cell md-cell--4',
      input: 'select',
      menuItems: [
        { label: 'Oil Development', value: 'oilDevelopment' },
        { label: 'Oil exploration', value: 'oilExploration' },
        { label: 'Oil appraisal', value: 'oilAppraisal' },
        { label: 'Water injector', value: 'waterInjector' },
        { label: 'Steam injector', value: 'steamInjector' },
        { label: 'Water disposal', value: 'waterDisposal' },
        { label: 'Gas development', value: 'gasDevelopment' },
        { label: 'Gas exploration', value: 'gasExploration' },
        { label: 'Gas appraisal', value: 'gasAppraisal' },
        { label: 'Other', value: 'Other' },
      ],
      required: true,
      onChange: (value) => {
        onEditValue('wellObjective', value)
        if (value === 'oilExploration' || value === 'gasExploration') {
          showInputFile(true)
        } else {
          showInputFile(false)
        }
        if (
          value === 'oilExploration' ||
          value === 'gasExploration' ||
          formData?.data?.onShoreOffShore === 'Offshore'
        ) {
          setFormData({
            ...formData,
            data: {
              ...formData.data,
              wellObjective: value,
              wellRiskCategory: 'High',
            },
          })
        } else onEditValue('wellObjective', value)
      },
      type: 'selectWithOther',
      value: formData?.data?.wellObjective,
    },
    {
      id: 'wellType',
      title: 'well Type',
      cellWidth: 'md-cell md-cell--4',
      input: 'select',
      menuItems: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Deviated', value: 'deviated' },
        { label: 'Other', value: 'Other' },
      ],
      required: true,
      onChange: (value) => {
        value === 'vertical' && wellCoordinatesFirstNonEmptyValue[0]
          ? setFormData({
            ...formData,
            data: {
              ...formData.data,
              wellType: value,
              ...setWellValue(wellCoordinatesFirstNonEmptyValue[0]),
            },
          })
          : onEditValue('wellType', value)
      },
      type: 'selectWithOther',
      value: formData?.data?.wellType,
    },
    {
      id: 'wellRiskCategory',
      title: 'well Risk Category',
      cellWidth: 'md-cell md-cell--4',
      input: 'select',
      menuItems: ['Low', 'Medium', 'High'],
      required: true,
      disabled:
        formData?.data?.wellObjective === 'oilExploration' ||
        formData?.data?.wellObjective === 'gasExploration' ||
        formData?.data?.onShoreOffShore === 'Offshore',
      onChange: (value) => {
        if (
          formData?.data?.wellObjective === 'oilExploration' ||
          formData?.data?.wellObjective === 'gasExploration' ||
          formData?.data?.onShoreOffShore === 'Offshore'
        ) {
          onEditValue('wellRiskCategory', 'High')
        } else onEditValue('wellRiskCategory', value)
      },
      type: 'enum',
      value: formData?.data?.wellRiskCategory,
    },
    {
      id: 'onShoreOffShore',
      title: 'Onshore/Offshore',
      cellWidth: 'md-cell md-cell--4',
      input: 'select',
      menuItems: ['Offshore', 'Onshore'],
      required: true,
      onChange: (value) => {
        if (
          formData?.data?.wellObjective === 'oilExploration' ||
          formData?.data?.wellObjective === 'gasExploration' ||
          value === 'Offshore'
        ) {
          setFormData({
            ...formData,
            data: {
              ...formData.data,
              onShoreOffShore: value,
              wellRiskCategory: 'High',
            },
          })
        } else onEditValue('onShoreOffShore', value)
      },
      type: 'enum',
      value: formData?.data?.onShoreOffShore,
    },
    {
      id: 'abandonmentCost',
      title: 'Abandonment Cost, mm$',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('abandonmentCost', value),
      type: 'string',
      value: formData?.data?.abandonmentCost,
    },
    {
      id: 'abandonmentDays',
      title: 'Abandonment Days',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('abandonmentDays', value),
      type: 'double',
      value: formData?.data?.abandonmentDays,
    },
    {
      id: 'wellDepth',
      title: 'Well Depth, m',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('wellDepth', value),
      type: 'double',
      value: formData?.data?.wellDepth,
    },
    {
      id: 'intelStandards',
      title: 'intel Standards followed',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('intelStandards', value),
      type: 'string',
      value: formData?.data?.intelStandards,
    },
    {
      id: 'cumulativeProductionG',
      title: 'Cumulative Gas Production, bcf',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('cumulativeProductionG', value),
      type: 'string',
      value: formData?.data?.cumulativeProductionG,
    },
    {
      id: 'cumulativeProductionO',
      title: 'Cumulative Oil/Cond Production, mmbbl',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('cumulativeProductionO', value),
      type: 'string',
      value: formData?.data?.cumulativeProductionO,
    },
    {
      id: 'remainingReservesO',
      title: 'Remaining Well Oil/Cond Reserves, mmbbl',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('remainingReservesO', value),
      type: 'string',
      value: formData?.data?.remainingReservesO,
    },
    {
      id: 'remainingReservesG',
      title: 'Remaining Well Gas Reserves, bcf',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('remainingReservesG', value),
      type: 'string',
      value: formData?.data?.remainingReservesG,
    },
    {
      id: 'lastWellTest',
      title: 'Last Well Test, bbl Oil/d, mmscf/d',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('lastWellTest', value),
      type: 'string',
      value: formData?.data?.lastWellTest,
    },
    {
      id: 'reservoirPressure',
      title: 'Reservoir Pressure, psi',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('reservoirPressure', value),
      type: 'string',
      value: formData?.data?.reservoirPressure,
    },
    {
      id: 'h2Sppm',
      title: 'H2S ppm',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('h2Sppm', value),
      type: 'string',
      value: formData?.data?.h2Sppm,
    },
    {
      id: 'co2',
      title: 'Co2 %',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('co2', value),
      type: 'string',
      value: formData?.data?.co2,
    },
    {
      id: 'justification',
      title: 'Justification for Abandon',
      cellWidth: 'md-cell md-cell--4',
      input:
        justificationOptions
          .slice(0, justificationOptions?.length - 1)
          .includes(formData?.data?.justification) ||
        !formData?.data?.justification
          ? 'select'
          : 'textField',
      menuItems: justificationOptions,
      required: true,
      onChange: (value) => onEditValue('justification', value),
      type: 'selectWithOther',
      value: formData?.data?.justification,
    },
    {
      id: 'mogAbdProcedure',
      title: 'MOG P/A Procedures followed?',
      cellWidth: 'md-cell md-cell--4',
      input: 'checkbox',
      onChange: (value) => onEditValue('mogAbdProcedure', value),
      type: 'customBoolean',
      value: formData?.data?.mogAbdProcedure,
    },
    {
      id: 'riskAssessmentsDone',
      title: 'Risk Assessments Done',
      cellWidth: 'md-cell md-cell--4',
      input: 'checkbox',
      onChange: (value) => onEditValue('riskAssessmentsDone', value),
      type: 'customBoolean',
      value: formData?.data?.riskAssessmentsDone,
    },
    {
      id: 'emergencyPlansAvailable',
      title: 'Emergency Plans Available?',
      cellWidth: 'md-cell md-cell--4',
      input: 'checkbox',
      onChange: (value) => onEditValue('emergencyPlansAvailable', value),
      type: 'customBoolean',
      value: formData?.data?.emergencyPlansAvailable,
    },
    {
      id: 'mogAttProgChecklist',
      title: 'Attach P/A Program',
      cellWidth: 'md-cell md-cell--12',
      input: 'fileInput',
      type: 'attachment',
      required: true,
      onDrop: (value) => {
        // console.log(value)
        if (value?.length > 0) {
          setLoading(true)

          fileManagerUpload(value).then((res) => {
            setLoading(false)
            onEditValue('mogAttProgChecklist', res?.files[0]?.url)
            setCurrentUploadedFile({
              ...currentUploadedFile,
              mogAttProgChecklist: res?.files[0],
            })
          })
        } else {
          onEditValue('mogAttProgChecklist', '')
          setCurrentUploadedFile({
            ...currentUploadedFile,
            mogAttProgChecklist: '',
          })
        }
      },
      file: currentUploadedFile?.mogAttProgChecklist,
      setFile: setCurrentUploadedFile,
      loading: loading,
      value: currentUploadedFile?.mogAttProgChecklist,
    },
    {
      id: 'currWellSchema',
      title: 'Current Well Schematic',
      cellWidth: 'md-cell md-cell--12',
      input: 'fileInput',
      type: 'attachment',
      required: true,
      onDrop: (value) => {
        // console.log(value)
        if (value?.length > 0) {
          setLoading(true)

          fileManagerUpload(value).then((res) => {
            setLoading(false)
            onEditValue('currWellSchema', res?.files[0]?.url)
            setCurrentUploadedFile({
              ...currentUploadedFile,
              currWellSchema: res?.files[0],
            })
          })
        } else {
          onEditValue('currWellSchema', '')
          setCurrentUploadedFile({
            ...currentUploadedFile,
            currWellSchema: '',
          })
        }
      },
      file: currentUploadedFile?.currWellSchema,
      setFile: setCurrentUploadedFile,
      loading: loading,
      value: currentUploadedFile?.currWellSchema,
    },
  ]

  const addPermitAbandon = useMutation(addPermit, {
    onSuccess: (res) => {
      if (!res.error) {
        navigate('/ams/permitting')
      } else {
      }
    },
  })
  const savePermitDrill = useMutation(savePermit, {
    onSuccess: (res) => {
      if (!res.error) {
        navigate('/ams/permitting')
      } else {
      }
    },
  })
  const onEditValue = (key, value, isMetaData) => {
    if (isMetaData) {
      setFormData({
        ...formData,
        metaData: {
          ...formData.metaData,
          [key]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        data: {
          ...formData.data,
          [key]: value,
        },
      })
    }
  }
  const formatData = () =>
    Object.keys(formData?.data).map((el) => {
      return {
        id: el,
        value: formData?.data[el],
        name: fields.find((elem) => elem.id === el)?.title,
        type: fields.find((elem) => elem.id === el)?.type,
        datePattern:
          fields.find((elem) => elem.id === el)?.type === 'date'
            ? 'yyyy-MM-dd'
            : null,
      }
    })
  const onSave = () => {
    addPermitAbandon.mutate({
      body: {
        ...formData,
        id: detailData?.id,
        data: formatData(),
        metaData: {
          ...formData.metaData,
          status: 'AUTO_APPROVED',
        },
      },
    })
  }
  const onSaveReport = () => {
    savePermitDrill.mutate({
      body: { ...formData, id: detailData?.id, data: formatData() },
    })
  }
  const fileField = {
    id: 'mem',
    title: 'MEM',
    cellWidth: 'md-cell md-cell--12',
    input: 'fileInput',
    type: 'attachment',
    required: true,
    onDrop: (value) => {
      // console.log(value)
      if (value?.length > 0) {
        setLoading(true)

        fileManagerUpload(value).then((res) => {
          setLoading(false)
          onEditValue('mem', res?.files[0]?.url)
          setCurrentUploadedFile({
            ...currentUploadedFile,
            mem: res?.files[0],
          })
        })
      } else {
        onEditValue('mem', '')
        setCurrentUploadedFile({
          ...currentUploadedFile,
          mem: '',
        })
      }
    },
    file: currentUploadedFile?.mem,
    setFile: setCurrentUploadedFile,
    loading: loading,
    value: currentUploadedFile?.mem,
  }
  const allfields = inputFileMEM ? [...fields, fileField] : fields
  const actions = [
    <Button
      key="1"
      id="discard"
      className="top-bar-buttons-list-item-btn discard"
      flat
      onClick={() => {
        navigate(`/ams/permitting/ar`)
      }}
    >
      Discard
    </Button>,
    <Button
      key="2"
      id="save"
      className="top-bar-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={onSaveReport}
    >
      Save
    </Button>,
    <Button
      key="3"
      id="submit"
      className="top-bar-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={onSave}
      disabled={validForm(fields)}
    >
      Submit
    </Button>,
  ]
  return (
    <div className="abandon-report">
      <TopBar title="Permit to Abandon" actions={actions} />
      <GenericForm fields={allfields} />
    </div>
  )
}
export default AbandonReport
