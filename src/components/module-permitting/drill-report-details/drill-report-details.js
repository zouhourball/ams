import { navigate } from '@reach/router'
import { Button } from 'react-md'
import { useQuery, useMutation } from 'react-query'
import moment from 'moment'

import TopBarDetail from 'components/top-bar-detail'
import DetailsPermit from 'components/details-permit'

import { getPermitDetail, updatePermit } from 'libs/api/permit-api'
import useRole from 'libs/hooks/use-role'

import './style.scss'

const DrillReportDetails = ({ drillReportId }) => {
  const { data: detailData } = useQuery(
    ['drillReportById', 'Drill', drillReportId],
    getPermitDetail,
  )
  const updatePermitDrill = useMutation(updatePermit, {
    onSuccess: (res) => {
      if (!res.error) {
        navigate('/ams/permitting')
      } else {
      }
    },
  })
  const role = useRole('permitting')
  const acknowledge = () => {
    updatePermitDrill.mutate({ id: drillReportId, status: 'ACKNOWLEDGED' })
  }
  const onHandleClick = () => {
    if (role === 'operator') {
      navigate(`/ams/permitting/drill-report/edit/${drillReportId}`)
    } else {
      acknowledge()
    }
  }
  const actions = [
    <Button
      key="1"
      id="viewDoc"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      swapTheming
      onClick={() => {}}
    >
      View documents
    </Button>,
    <Button
      key="2"
      id="edit"
      className="top-bar-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => onHandleClick()}
      disabled={role === 'operator' && detailData?.metaData?.status !== 'DRAFT'}
    >
      {role === 'operator' ? 'Edit Details' : 'Acknowledge'}
    </Button>,
  ]
  return (
    <div className="drill-report-details">
      <TopBarDetail
        onClickBack={() => navigate('/ams/permitting')}
        actions={actions}
        detailData={{
          title: 'Permit to Drill',
          subTitle: `Block ${detailData?.metaData?.block}`,
          companyName: detailData?.metaData?.company,
          submittedBy: detailData?.metaData?.createdBy?.name,
          submittedDate: moment(detailData?.metaData?.createdAt).format(
            'DD MMM, YYYY',
          ),
        }}
      />
      <DetailsPermit
        fields={[
          {
            id: 'block',
            title: 'Block Number',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: `Block ${detailData?.metaData?.block}`,
          },
          {
            id: 'plannedSpudDate',
            title: 'Planned Spud Date',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'plannedSpudDate')
              ?.value,
          },
          {
            id: '',
            title: '',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: '',
          },
          {
            id: 'wellName',
            title: 'Well Name',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.metaData?.wellName,
          },
          {
            id: 'wellSurfaceLocationCoordinatesNorth',
            title: 'Well Surface Location Coordinates - North',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find(
              (el) => el.id === 'wellSurfaceLocationCoordinatesNorth',
            )?.value,
          },
          {
            id: 'wellSurfaceLocationCoordinatesEast',
            title: 'Well Surface Location Coordinates - East',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find(
              (el) => el.id === 'wellSurfaceLocationCoordinatesEast',
            )?.value,
          },
          {
            id: 'wellSubsurfaceTargetCoordinateNorth',
            title: 'Well Subsurface Target Coordinate - North',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find(
              (el) => el.id === 'wellSubsurfaceTargetCoordinateNorth',
            )?.value,
          },
          {
            id: 'wellSubsurfaceTargetCoordinateEast',
            title: 'Well Subsurface Target Coordinate - East',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find(
              (el) => el.id === 'wellSubsurfaceTargetCoordinateEast',
            )?.value,
          },
          {
            id: 'tvdM',
            title: 'TVD, m',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'tvdM')?.value,
          },
          {
            id: 'fieldName',
            title: 'Field Name',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'fieldName')?.value,
          },
          {
            id: 'rigName',
            title: 'Rig Name',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'rigName')?.value,
          },
          {
            id: 'wellObjective',
            title: 'Well Objective',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'wellObjective')
              ?.value,
          },
          {
            id: 'wellRiskCategory',
            title: 'Well Risk Category',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'wellRiskCategory')
              ?.value,
          },
          {
            id: 'wellType',
            title: 'Well Type',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'wellType')?.value,
          },
          {
            id: 'onShoreOffShore',
            title: 'Onshore/Offshore',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'onShoreOffShore')
              ?.value,
          },
          {
            id: 'aFECost',
            title: 'AFE Cost, mm$',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'aFECost')?.value,
          },
          {
            id: 'afeDays',
            title: 'AFE Days',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'afeDays')?.value,
          },
          {
            id: 'afeDepth',
            title: 'AFE Depth (mm)',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'afeDepth')?.value,
          },
          {
            id: 'intelStandards',
            title: 'Intel Standards Followed',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'intelStandards')
              ?.value,
          },
          {
            id: 'emergencyPlansAvailable',
            title: 'Emergency Plans Available?',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value:
              detailData?.data?.find(
                (el) => el.id === 'emergencyPlansAvailable',
              )?.value || 'no',
          },
          {
            id: 'riskAssessmentsDone',
            title: 'Risk Assessment Done',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value:
              detailData?.data?.find((el) => el.id === 'riskAssessmentsDone')
                ?.value || 'no',
          },
          {
            id: 'remarks',
            title: 'Remarks',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'remarks')?.value,
          },
        ]}
      />
    </div>
  )
}
export default DrillReportDetails
