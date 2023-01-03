import { useEffect } from 'react'

import ProcessHistorian from '../../components/process-historian'

import { getProposalHistory } from 'libs/api/api-tendering'
import mutate from 'libs/hocs/mutate'
import { get } from 'lodash-es'
import moment from 'moment'

// import listData from './helpers'

import './styles.scss'

function ProcessHistorianSection ({
  id,
  mutations: { getProposalHistory },
  getProposalHistoryStatus,
}) {
  useEffect(() => {
    // setIsVisibleTopBar && setIsVisibleTopBar(true)
    if (id) {
      getProposalHistory(id)
    }
  }, [])

  // useEffect(() => {
  //   return () => {
  //     setIsVisibleTopBar && setIsVisibleTopBar(false)
  //   }
  // }, [])

  const renderHistoryData = (state) => {
    return [
      {
        id: 0,
        title: 'Operator',
        status: [
          'New',
          'Clarify',
          'Clarified',
          'UnderReview',
          'PassedToAgenda',
          'Approved',
          'Rejected',
          'ApprovedPublished',
        ].includes(state)
          ? 'PassedToAgenda'
          : '',
        members: [],
        cardData: get(
          getProposalHistoryStatus,
          'data.data.history.operatorStage',
          [],
        ).map((el) => {
          return {
            fullName: el.userSubject,
            createdAt: '12/06/2019 05:33 PM',
            description: get(
              getProposalHistoryStatus,
              'data.data.proposal.contractTitle',
              [],
            ),
            avatar: '',
            status: el.proposalCurrentState,
          }
        }),
      },
      {
        id: 1,
        status: ['New', 'Clarify', 'Clarified', 'UnderReview'].includes(state)
          ? 'UnderReview'
          : [
            'PassedToAgenda',
            'Approved',
            'Rejected',
            'ApprovedPublished',
          ].includes(state)
            ? 'PassedToAgenda'
            : '',
        title: 'Checklist Process',
        members: [],
        cardData: get(
          getProposalHistoryStatus,
          'data.data.history.checkListProcessStage',
          [],
        ).map((el) => {
          return {
            fullName: el.userSubject,
            createdAt: moment(el.actionTimeStamp).format('DD/MM/YYYY HH:MM'),
            description: get(
              getProposalHistoryStatus,
              'data.data.proposal.contractTitle',
              [],
            ),
            avatar: '',
            status: el.proposalCurrentState,
          }
        }),
      },
      {
        id: 2,
        status: ['New', 'Clarify', 'Clarified', 'UnderReview'].includes(state)
          ? 'UnderReview'
          : [
            'PassedToAgenda',
            'Approved',
            'Rejected',
            'ApprovedPublished',
          ].includes(state)
            ? 'PassedToAgenda'
            : '',
        title: 'Pre-TBC Meeting',
        members: [],
        cardData: get(
          getProposalHistoryStatus,
          'data.data.history.preTbcMeetingStage',
          [],
        ).map((el) => {
          return {
            fullName: el.userSubject,
            createdAt: moment(el.actionTimeStamp).format('DD/MM/YYYY HH:MM'),
            description: get(
              getProposalHistoryStatus,
              'data.data.proposal.contractTitle',
              [],
            ),
            avatar: '',
            status: el.proposalCurrentState,
          }
        }),
      },
      {
        id: 3,
        status: ['PassedToAgenda'].includes(state)
          ? 'UnderReview'
          : ['Approved', 'Rejected', 'ApprovedPublished'].includes(state)
            ? 'PassedToAgenda'
            : '',
        title: 'MEM TBC Meeting',
        members: [],
        cardData: get(
          getProposalHistoryStatus,
          'data.data.history.mogTbcMeetingStage',
          [],
        ).map((el) => {
          return {
            fullName: el.userSubject,
            createdAt: moment(el.actionTimeStamp).format('DD/MM/YYYY HH:MM'),
            description: get(
              getProposalHistoryStatus,
              'data.data.proposal.contractTitle',
              [],
            ),
            avatar: '',
            status: el.proposalCurrentState,
          }
        }),
      },
      {
        id: 4,
        status: ['Approved', 'Rejected', 'ApprovedPublished'].includes(state)
          ? 'PassedToAgenda'
          : '',
        title: 'Post MEM TBC',
        members: [],
        cardData: get(
          getProposalHistoryStatus,
          'data.data.history.postMogTbcStage',
          [],
        ).map((el) => {
          return {
            fullName: el.userSubject,
            createdAt: moment(el.actionTimeStamp).format('DD/MM/YYYY HH:MM'),
            description: get(
              getProposalHistoryStatus,
              'data.data.proposal.contractTitle',
              [],
            ),
            avatar: '',
            status: el.proposalCurrentState,
          }
        }),
      },
    ]
  }

  return (
    <div className="ProcessHistorianSection">
      {renderHistoryData(
        get(
          getProposalHistoryStatus,
          'data.data.proposal.proposalStateEnum',
          null,
        ),
      ).map((ele, i) => (
        <ProcessHistorian key={i} process={ele} />
      ))}
    </div>
  )
}

export default mutate({
  moduleName: 'proposalHistory',
  mutations: {
    getProposalHistory,
  },
})(ProcessHistorianSection)
