import UserInfoBySubject from 'components/user-info-by-subject'
import WidgetMessage from 'components/widgets/widget-message'

export const Widgets = [
  {
    widgetKey: 'recruiter_invite_to_apply',
    renderNode: (content, usersInfo) => {
      const { widgetKey } = JSON.parse(content.body)
      return (
        <UserInfoBySubject subject={usersInfo?.receiverId}>
          {(user) => (
            <WidgetMessage
              widgetKey={widgetKey}
              widgetMessageData={content}
              receiverName={user?.fullName}
              receiverSubject={usersInfo?.receiverId}
            />
          )}
        </UserInfoBySubject>
      )
    },
  },
  {
    widgetKey: 'recruiter_invite_to_interview',
    renderNode: (content, usersInfo) => {
      const { widgetKey } = JSON.parse(content.body)
      return (
        <UserInfoBySubject subject={usersInfo?.receiverId}>
          {(user) => (
            <WidgetMessage
              widgetKey={widgetKey}
              interview
              widgetMessageData={content}
              receiverName={user?.fullName}
              receiverSubject={usersInfo?.receiverId}
            />
          )}
        </UserInfoBySubject>
      )
    },
  },
  {
    widgetKey: 'recruiter_modify_interview',
    renderNode: (content, usersInfo) => {
      const { widgetKey } = JSON.parse(content.body)
      return (
        <UserInfoBySubject subject={usersInfo?.receiverId}>
          {(user) => (
            <WidgetMessage
              widgetKey={widgetKey}
              interview
              widgetMessageData={content}
              receiverName={user?.fullName}
              receiverSubject={usersInfo?.receiverId}
            />
          )}
        </UserInfoBySubject>
      )
    },
  },
  {
    widgetKey: 'recruiter_sender_offer',
    renderNode: (content, usersInfo) => {
      const { widgetKey } = JSON.parse(content.body)
      return (
        <UserInfoBySubject subject={usersInfo?.receiverId}>
          {(user) => (
            <WidgetMessage
              offer
              widgetKey={widgetKey}
              widgetMessageData={content}
              user={user}
              receiverName={user?.fullName}
              receiverSubject={usersInfo?.receiverId}
            />
          )}
        </UserInfoBySubject>
      )
    },
  },
  {
    widgetKey: 'recruiter_reject_interview',
    renderNode: (content) => <WidgetMessage widgetMessageData={content} />,
  },
]
