import { useState, useEffect } from 'react'
import { Button } from 'react-md'
import { useMutation } from 'react-query'
import { navigate } from '@reach/router'

import GenericForm from 'components/generic-form-permit'
import TopBar from 'components/top-bar'

import getBlocks from 'libs/hooks/get-blocks'
import { addPermit, savePermit } from 'libs/api/permit-api'
import { validForm } from '../validate-form-fields'
import { fileManagerUpload } from 'libs/api/api-file-manager'

import './style.scss'

const SuspendReport = ({ suspendReportId }) => {
  const [formData, setFormData] = useState({
    metaData: {
      company: 'ams-org',
      permitType: 'Suspend',
    },
    data: {
      plannedSuspendDate: '2021-02-01',
    },
  })
  const [loading, setLoading] = useState(false)
  const [currentUploadedFile, setCurrentUploadedFile] = useState({})
  useEffect(() => {
    if (localStorage.getItem('suspend-report')) {
      const drillReport = JSON.parse(localStorage.getItem('suspend-report'))
      setFormData({
        ...formData,
        metaData: {
          ...formData.metaData,
          block: drillReport.block,
        },
        data: {
          plannedSuspendDate: drillReport.date,
        },
      })
    }
  }, [])
  const blockList = getBlocks()
  const fields = [
    {
      id: 'block',
      title: 'Block',
      cellWidth: 'md-cell md-cell--6',
      input: 'select',
      menuItems: blockList?.map((el) => el.block),
      required: true,
      onChange: (value) => onEditValue('block', value, true),
      value: formData?.metaData?.block,
    },
    {
      id: 'plannedSuspendDate',
      title: 'Planned Suspension date',
      cellWidth: 'md-cell md-cell--6',
      input: 'date',
      type: 'date',
      onChange: (value) => onEditValue('plannedSuspendDate', value),
      value: formData?.data?.plannedSuspendDate,
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
      onChange: (value) =>
        onEditValue('wellSurfaceLocationCoordinatesNorth', value),
      type: 'string',
      value: formData?.data?.wellSurfaceLocationCoordinatesNorth,
    },
    {
      id: 'wellSurfaceLocationCoordinatesEast',
      title: 'well Surface Coordinates - East',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) =>
        onEditValue('wellSurfaceLocationCoordinatesEast', value),
      type: 'string',
      value: formData?.data?.wellSurfaceLocationCoordinatesEast,
    },
    {
      id: 'wellSubsurfaceTargetCoordinateNorth',
      title: 'Well Subsurface Target Coordinate - North',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) =>
        onEditValue('wellSubsurfaceTargetCoordinateNorth', value),
      type: 'string',
      value: formData?.data?.wellSubsurfaceTargetCoordinateNorth,
    },
    {
      id: 'wellSubsurfaceTargetCoordinateEast',
      title: 'Well Subsurface Target Coordinate - East',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) =>
        onEditValue('wellSubsurfaceTargetCoordinateEast', value),
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
      onChange: (value) => onEditValue('wellObjective', value),
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
      onChange: (value) => onEditValue('wellType', value),
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
      onChange: (value) => onEditValue('wellRiskCategory', value),
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
      onChange: (value) => onEditValue('onShoreOffShore', value),
      type: 'enum',
      value: formData?.data?.onShoreOffShore,
    },
    {
      id: 'suspensionCost',
      title: 'AFE Suspension Cost, mm$',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('suspensionCost', value),
      type: 'string',
      value: formData?.data?.suspensionCost,
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
      type: 'double',
      value: formData?.data?.reservoirPressure,
    },
    {
      id: 'suspensionDurationMonths',
      title: 'Suspension duration, months',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('suspensionDurationMonths', value),
      type: 'double',
      value: formData?.data?.suspensionDurationMonths,
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
      id: 'wellIntegrityStatus',
      title: 'Well Integrity Status',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('wellIntegrityStatus', value),
      type: 'string',
      value: formData?.data?.wellIntegrityStatus,
    },
    {
      id: 'justification',
      title: 'Justification for Suspension',
      cellWidth: 'md-cell md-cell--4',
      input: 'select',
      menuItems: [
        'Well Integrity Failure',
        'Uneconomic Well at Submission Date',
        'Waiting for Production Facility',
        'Other',
      ],
      required: true,
      onChange: (value) => onEditValue('justification', value),
      type: 'selectWithOther',
      value: formData?.data?.justification,
    },
    {
      id: 'mogSuspensionProcedure',
      title: 'MOG Suspension Procedures followed?',
      cellWidth: 'md-cell md-cell--4',
      input: 'checkbox',
      onChange: (value) => onEditValue('mogSuspensionProcedure', value),
      type: 'customBoolean',
      value: formData?.data?.mogSuspensionProcedure,
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
      id: 'suspensionProgram',
      title: 'Attach Suspension Program',
      cellWidth: 'md-cell md-cell--12',
      input: 'fileInput',
      required: true,
      onDrop: (value) => {
        // console.log(value)
        if (value?.length > 0) {
          setLoading(true)

          fileManagerUpload(value).then((res) => {
            setLoading(false)
            onEditValue('suspensionProgram', res?.files[0]?.url)
            setCurrentUploadedFile({
              ...currentUploadedFile,
              suspensionProgram: res?.files[0],
            })
          })
        } else {
          onEditValue('suspensionProgram', '')
          setCurrentUploadedFile({
            ...currentUploadedFile,
            suspensionProgram: {},
          })
        }
      },
      file: currentUploadedFile?.suspensionProgram,
      loading: loading,
      value: currentUploadedFile?.suspensionProgram,
    },
    {
      id: 'wellSchematic',
      title: 'Current Well Schematic',
      cellWidth: 'md-cell md-cell--12',
      input: 'fileInput',
      required: true,
      onDrop: (value) => {
        setLoading(true)
        fileManagerUpload(value).then((res) => {
          onEditValue('wellSchematic', res?.files[0]?.url)
          setLoading(false)
          setCurrentUploadedFile({
            ...currentUploadedFile,
            wellSchematic: res?.files[0],
          })
        })
      },
      file: currentUploadedFile?.wellSchematic,
      loading: loading,
      value: currentUploadedFile?.wellSchematic,
    },
  ]

  const addPermitSuspend = useMutation(addPermit, {
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
  const data = Object.keys(formData?.data).map((el) => {
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
    addPermitSuspend.mutate({
      body: { ...formData, data },
    })
  }
  const onSaveReport = () => {
    savePermitDrill.mutate({
      body: { ...formData, data },
    })
  }

  const actions = [
    <Button
      key="1"
      id="discard"
      className="top-bar-buttons-list-item-btn discard"
      flat
      onClick={() => {
        navigate(`/ams/permitting`)
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
    <div className="suspend-report">
      <TopBar title="Permit to Suspend" actions={actions} />
      <GenericForm fields={fields} />
    </div>
  )
}
export default SuspendReport
