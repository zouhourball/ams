import { useEffect, useState } from 'react'
import { Button } from 'react-md'
import { useQuery, useMutation } from 'react-query'
import { navigate } from '@reach/router'
import moment from 'moment'

import GenericForm from 'components/generic-form-permit'
import TopBar from 'components/top-bar'

import getBlocks from 'libs/hooks/get-blocks'
import { addPermit, getPermitDetail, savePermit } from 'libs/api/permit-api'

import { validForm } from '../validate-form-fields'

import './style.scss'

const DrillReport = ({ drillReportId }) => {
  const [formData, setFormData] = useState({
    data: {
      plannedSpudDate: new Date(),
    },
  })

  const { data: detailData } = useQuery(
    ['drillReportById', 'Drill', drillReportId],
    drillReportId && getPermitDetail,
  )
  useEffect(() => {
    if (localStorage.getItem('drill-report')) {
      const drillReport = JSON.parse(localStorage.getItem('drill-report'))
      setFormData({
        ...formData,
        metaData: {
          ...formData,
          block: drillReport?.block,
          company: drillReport?.company,
          permitType: drillReport?.permitType,
        },
        data: {
          plannedSpudDate: drillReport.date,
        },
      })
    }
  }, [])

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
          wellName: detailData?.metaData?.wellName,
        },
        data,
      })
    }
  }, [detailData])
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
      id: 'plannedSpudDate',
      title: 'Planned spud date',
      cellWidth: 'md-cell md-cell--6',
      input: 'date',
      type: 'date',
      onChange: (value) => onEditValue('plannedSpudDate', value),
      value: formData?.data?.plannedSpudDate,
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
      id: 'rigName',
      title: 'Rig Name',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('rigName', value),
      type: 'string',
      value: formData?.data?.rigName,
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
      id: 'aFECost',
      title: 'AFE Cost, mm$',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('aFECost', value),
      type: 'string',
      value: formData?.data?.aFECost,
    },
    {
      id: 'afeDays',
      title: 'AFE Days',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('afeDays', value),
      type: 'double',
      value: formData?.data?.afeDays,
    },
    {
      id: 'afeDepth',
      title: 'AFE Depth(m)',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      required: true,
      onChange: (value) => onEditValue('afeDepth', value),
      type: 'double',
      value: formData?.data?.afeDepth,
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
      id: 'emergencyPlansAvailable',
      title: 'Emergency Plans Available?',
      cellWidth: 'md-cell md-cell--4',
      input: 'checkbox',
      onChange: (value) => onEditValue('emergencyPlansAvailable', value),
      type: 'customBoolean',
      value: formData?.data?.emergencyPlansAvailable,
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
      id: 'remarks',
      title: 'Remarks',
      cellWidth: 'md-cell md-cell--12',
      input: 'textField',
      // required: true,
      onChange: (value) => onEditValue('remarks', value),
      type: 'string',
      value: formData?.data?.remarks,
    },
  ]

  const addPermitDrill = useMutation(addPermit, {
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
  const formatData = () => {
    return Object.keys(formData?.data).map((el) => {
      return {
        id: el,
        value:
          fields.find((elem) => elem.id === el)?.type === 'date'
            ? moment(formData?.data[el]).format('yyyy-MM-DD')
            : formData?.data[el],
        name: fields.find((elem) => elem.id === el)?.title,
        type: fields.find((elem) => elem.id === el)?.type,
        datePattern:
          fields.find((elem) => elem.id === el)?.type === 'date'
            ? 'yyyy-MM-dd'
            : null,
      }
    })
  }
  const onAdd = () => {
    // console.log(formData);
    addPermitDrill.mutate({
      body: { ...formData, id: detailData?.id, data: formatData() },
    })
  }
  const onSaveReport = () => {
    savePermitDrill.mutate({
      body: { ...formData, id: detailData?.id, data: formatData() },
    })
  }

  const actions = [
    <Button
      key="1"
      id="discard"
      className="top-bar-buttons-list-item-btn discard"
      flat
      onClick={() => {
        navigate(`/ams/permitting/dr`)
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
      onClick={onAdd}
      disabled={validForm(fields)}
    >
      Submit
    </Button>,
  ]
  return (
    <div className="drill-report">
      <TopBar title="Permit to Drill Report" actions={actions} />
      <GenericForm fields={fields} />
    </div>
  )
}
export default DrillReport
