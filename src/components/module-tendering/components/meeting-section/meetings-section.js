import { useEffect } from 'react'
import Slider from 'react-slick'
import { connect } from 'react-redux'
import moment from 'moment'

import {
  getProposal,
  getWorkflowMeetings,
  acceptMeeting,
  rejectMeeting,
} from 'libs/api/api-tendering'
import { get } from 'lodash-es'
import mutate from 'libs/hocs/mutate'

import MeetingCard from '../../components/meeting-card'

import './styles.scss'

function MeetingSection ({
  proposalId,
  // meetingsList = dummyMeetingsList,
  // onAcceptMeeting,
  // onRejectMeeting,
  // clickCreateMeeting,
  mutations: { getProposal, getWorkflowMeetings, acceptMeeting, rejectMeeting },
  currentUserSubject,
  getWorkflowMeetingsStatus,
  // role,
  acceptMeetingStatus,
  rejectMeetingStatus,
}) {
  // const [tab, setTab] = useState('Meeting Today')
  // const [date, setDate] = useState(format(new Date(), 'dddd DD/MM/YYYY'))
  // const canCreateMeeting = useMemo(() => role === 'secretary', [role])
  useEffect(() => {
    if (proposalId) {
      getProposal(proposalId)
      getWorkflowMeetings(
        proposalId,
        moment(new Date(), 'dddd DD/MM/YYYY').format('DD-MM-YYYY'),
        '31-12-3000',
      )
    }
  }, [acceptMeetingStatus, rejectMeetingStatus])

  // useEffect(() => {
  //   if (
  //     !getProposalStatus.pending &&
  //     get(getProposalStatus, 'data.data.agenda.agendaId', null)
  //   ) {
  //     getMeeting(getProposalStatus.data.data.agenda.agendaId)
  //   }
  // }, [getProposalStatus])

  const renderMeetingData = () => {
    const meetingData = get(getWorkflowMeetingsStatus, 'data.content', []).map(
      (el) => {
        const participantSubj =
          get(el, 'participants', []).find(
            (el) => el.sub === currentUserSubject,
          ) ||
          (get(el, 'organizer.sub', null) === currentUserSubject
            ? { status: 'JOINNED' }
            : null)
        if (participantSubj) {
          return {
            id: el.id,
            workspaceId: el.workspaceId,
            status: participantSubj.status,
            time: `${moment(el.startDate).format(
              'DD/MM/YYYY - HH:MM ',
            )}- ${moment(el.endDate).format('HH:MM')}`,
            title: el.title,
          }
        }
      },
    )

    return meetingData.filter((elem) => !!elem)
  }

  const renderMeetings = () => {
    return renderMeetingData().map((meeting) => (
      <>
        {' '}
        {meeting && (
          <MeetingCard
            key={meeting.id}
            meetingId={meeting.id}
            status={meeting.status}
            workspaceId={meeting.workspaceId}
            meetingTime={meeting.time}
            meetingTitle={meeting.title}
            members={meeting.members}
            // menuButton={['item1', 'item2']}
            onAcceptMeeting={(id) => {
              acceptMeeting(id)
            }}
            onRejectMeeting={(id) => {
              rejectMeeting(id)
            }}
          />
        )}
      </>
    ))
  }
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }
  return (
    !!renderMeetings().length && (
      <div className="meetings">
        {/* {
        <NavigateBar
          date={date}
          // handleClickAdd={clickCreateMeeting}
          handleStartDate={value =>
            setDate(moment(value.timestamp).format('dddd DD/MM/YYYY'))
          }
          // data={
          //   meetingsList.meetingsList &&
          //   meetingsList.meetingsList.map(({ name, list, date }, key) => {
          //     return {
          //       name,
          //       length: list.length,
          //     }
          //   })
          // }
          // selectedTab={tab}
          // onChangeTab={setTab}
          // canCreateMeeting={canCreateMeeting}
          meetingsCount={renderMeetingData().length}
        />
      } */}
        <Slider {...settings}>{renderMeetings()}</Slider>
      </div>
    )
  )
}

export default connect(
  ({ app }) => ({
    currentUserSubject: get(app, 'userInfos.ssoSubject', ''),
  }),
  null,
)(
  mutate({
    moduleName: 'proposalMeeting',
    mutations: {
      getProposal,
      getWorkflowMeetings,
      acceptMeeting,
      rejectMeeting,
    },
  })(MeetingSection),
)
