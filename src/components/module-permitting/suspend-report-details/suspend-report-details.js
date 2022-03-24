import { navigate } from '@reach/router'
import { Button } from 'react-md'
import { useQuery, useMutation } from 'react-query'
import moment from 'moment'
import { useState } from 'react'

import TopBarDetail from 'components/top-bar-detail'
import DetailsPermit from 'components/details-permit'
import SupportedDocument from 'components/supported-document'

import { handlePrint } from '../print-component'
import { getPermitDetail, updatePermit } from 'libs/api/permit-api'
import useRole from 'libs/hooks/use-role'

import './style.scss'

const SuspendReportDetails = ({ suspendReportId }) => {
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const { data: detailData } = useQuery(
    ['suspendReportById', 'Suspend', suspendReportId],
    getPermitDetail,
  )
  const updatePermitMutation = useMutation(updatePermit, {
    onSuccess: (res) => {
      if (!res.error) {
        navigate('/ams/permitting')
      } else {
      }
    },
  })
  const role = useRole('permitting')
  const acknowledge = (status) => {
    updatePermitMutation.mutate({ id: suspendReportId, status: status })
  }
  const clickHandler = (status) => {
    if (role === 'operator') {
      navigate(`/ams/permitting/suspend-report/edit/${suspendReportId}`)
    } else {
      acknowledge(status)
    }
  }
  const actions = [
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
      View documents
    </Button>,
    !(role === 'operator' && detailData?.metaData?.status !== 'DRAFT') && (
      <Button
        key="2"
        id="edit"
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
          clickHandler()
        }}
        // disabled={role === 'operator' && detailData?.metaData?.status !== 'DRAFT'}
      >
        Edit Details
      </Button>
    ),
    <Button
      key="5"
      id="print"
      className="top-bar-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() =>
        handlePrint(
          'Permit to Suspend',
          detailData?.metaData?.company,
          detailData?.metaData?.createdBy?.name,
          moment(detailData?.metaData?.createdAt).format('DD MMM, YYYY'),
        )
      }
    >
      Print
    </Button>,
    detailData?.metaData?.status === 'DRAFT' && (
      <Button
        key="6"
        id="submit"
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
          acknowledge('SUBMITTED')
        }}
      >
        Submit
      </Button>
    ),
    role === 'regulator' && detailData?.metaData?.status === 'SUBMITTED' && (
      <>
        <Button
          key="4"
          id="accept"
          className="top-bar-buttons-list-item-btn"
          flat
          primary
          swapTheming
          onClick={() => {
            clickHandler('ACCEPTED')
          }}
        >
          Accept
        </Button>
        <Button
          key="4"
          id="reject"
          className="top-bar-buttons-list-item-btn"
          flat
          primary
          swapTheming
          onClick={() => {
            clickHandler('REJECTED')
          }}
        >
          Reject
        </Button>
      </>
    ),
  ]
  return (
    <div className="suspend-report-details">
      <TopBarDetail
        onClickBack={() => navigate('/ams/permitting/sr')}
        actions={actions}
        detailData={{
          title: 'Permit to Suspend',
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
            id: 'plannedSuspendDate',
            title: 'Planned Suspension Date',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find(
              (el) => el.id === 'plannedSuspendDate',
            )?.value,
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
            id: 'fieldName',
            title: 'Field Name',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'fieldName')?.value,
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
            id: 'tvdM',
            title: 'TVD, m',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'tvdM')?.value,
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
            id: 'rigHoistNumber',
            title: 'Rig/Hoist Number',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'rigHoistNumber')
              ?.value,
          },
          {
            id: 'rigHostContractor',
            title: 'Rig/Hoist Contractor',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'rigHostContractor')
              ?.value,
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
            id: 'wellType',
            title: 'Well Type',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'wellType')?.value,
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
            id: 'onShoreOffShore',
            title: 'Onshore/Offshore',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'onShoreOffShore')
              ?.value,
          },
          {
            id: 'suspensionCost',
            title: 'AFE Suspension Cost, mm$',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'suspensionCost')
              ?.value,
          },
          {
            id: 'wellDepth',
            title: 'Well Depth',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'wellDepth')?.value,
          },
          {
            id: 'intelStandards',
            title: 'intel Standards followed',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'intelStandards')
              ?.value,
          },
          {
            id: 'cumulativeProductionG',
            title: 'Cumulative Gas Production, bcf',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find(
              (el) => el.id === 'cumulativeProductionG',
            )?.value,
          },
          {
            id: 'cumulativeProductionO',
            title: 'Cumulative Oil/Cond Production, mmbbl',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find(
              (el) => el.id === 'cumulativeProductionO',
            )?.value,
          },
          {
            id: 'remainingReservesO',
            title: 'Remaining Well Oil/Cond Reserves, mmbbl',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find(
              (el) => el.id === 'remainingReservesO',
            )?.value,
          },
          {
            id: 'remainingReservesG',
            title: 'Remaining Well Gas Reserves, bcf',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find(
              (el) => el.id === 'remainingReservesG',
            )?.value,
          },
          {
            id: 'lastWellTest',
            title: 'Last Well Test, bbl Oil/d, mmscf/d',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'lastWellTest')
              ?.value,
          },
          {
            id: 'reservoirPressure',
            title: 'Reservoir Pressure, psi',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'reservoirPressure')
              ?.value,
          },
          {
            id: 'suspensionDurationMonths',
            title: 'Suspension duration, months',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find(
              (el) => el.id === 'suspensionDurationMonths',
            )?.value,
          },
          {
            id: 'h2Sppm',
            title: 'H2S ppm',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'h2Sppm')?.value,
          },
          {
            id: 'co2',
            title: 'Co2 %',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'co2')?.value,
          },
          {
            id: 'wellIntegrityStatus',
            title: 'Well Integrity Status',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find(
              (el) => el.id === 'wellIntegrityStatus',
            )?.value,
          },
          {
            id: 'justification',
            title: 'Justification for Suspension',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value: detailData?.data?.find((el) => el.id === 'justification')
              ?.value,
          },
          {
            id: 'mogSuspensionProcedure',
            title: 'MOG Suspension Procedures followed?',
            cellWidth: 'md-cell md-cell-4',
            input: 'textField',
            required: true,
            value:
              detailData?.data?.find((el) => el.id === 'mogSuspensionProcedure')
                ?.value || 'no',
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
            id: 'mogAttProgChecklist',
            title: 'Attach Suspension Program',
            cellWidth: 'md-cell md-cell-12',
            input: 'fileInput',
            required: true,
            value:
              detailData?.data?.find((el) => el?.id === 'mogAttProgChecklist')
                ?.value || '',
          },
          {
            id: 'currWellSchema',
            title: 'Current Well Schematic',
            cellWidth: 'md-cell md-cell-12',
            input: 'fileInput',
            required: true,
            value:
              detailData?.data?.find((el) => el?.id === 'currWellSchema')
                ?.value || '',
          },
        ]}
      />
      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          readOnly
          processInstanceId={
            detailData?.id || showSupportedDocumentDialog?.processInstanceId
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
export default SuspendReportDetails
