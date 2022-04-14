import { Meeting } from '@target-energysolutions/meeting'
import { useMe } from 'components/venue-invite'
import { getLanguage } from 'libs/utils'
import { useParams, navigate } from '@reach/router'
import { useOrgId } from 'components/venue-invite/use-org-id'
import { registerContext } from '@target-energysolutions/task-manager'
import configureApolloClient from 'libs/apollo'
import { getAccessToken } from 'utils/manageTokens'
import { optimisticAPI } from '@target-energysolutions/utils'
import { useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { messengerAct } from '@target-energysolutions/messenger'

const APICtx = optimisticAPI.APICtx
const apolloClient = configureApolloClient
const clients = {
  individual: apolloClient(false),
  enterprise: apolloClient(true),
}
const WsMeeting = () => {
  const me = useMe()
  // console.log(me, 'me')
  const token = getAccessToken()
  const organizationId = useOrgId()
  const { meetingId } = useParams()
  const dispatch = useDispatch()
  const isEnterprise = +organizationId > 0
  const client = clients[isEnterprise ? 'enterprise' : 'individual']
  const apiCtx = useMemo(() => {
    return {
      host: PRODUCT_WORKSPACE_URL,
      apiHost: PRODUCT_APP_URL_API,
      avatarHost: PRODUCT_APP_URL_API,
      taskManagerAPIUrl: `${PRODUCT_WORKSPACE_URL}/graphql`,
      fileHost: PRODUCT_APP_URL_API,
      fmHost: PRODUCT_APP_URL_API,
      edgeHost: `${PRODUCT_APP_URL_EDGE}/edge`,
      profileHost: `${PRODUCT_APP_URL_PROFILE}/profile`,
      cadreHost: PRODUCT_WORKSPACE_URL,
      workspaceApolloClient: client,
      token,
      venueHost: PRODUCT_APP_URL_FLUXBLE_MEETING,
    }
  }, [client, token])

  registerContext({
    getClient () {
      return client
    },
    host: PRODUCT_WORKSPACE_URL,
    token,
    apiHost: PRODUCT_APP_URL_API,
    fileManagerEndpoint: `${PRODUCT_APP_URL_API}/meerafs/grpc`,
    avatarHost: `${PRODUCT_APP_URL_API}/fm`,
    profileHost: `${PRODUCT_APP_URL_PROFILE}/profile`,
  })

  const handleOpenDiscussionGroup = (chat, meeting, organizationId) => {
    dispatch(
      messengerAct.openChat({
        channelId: chat.targetId,
        sub: null,
        type: 'group',
        orgId: organizationId,
      }),
    )()
  }

  const onBackClick = useCallback(() => {
    navigate('/ams/planning/wpb')
  }, [])
  return (
    <APICtx.Provider value={apiCtx}>
      <div className="meeting-container">
        {!me.sub ? (
          'loading'
        ) : (
          <Meeting
            organizationID={organizationId}
            wsMembers={[]}
            onAction={(type, item, meeting) => {
              // handleAction(type, item, meeting, organizationId)
            }}
            onSomethingDone={() => {}}
            onOpenDiscussionGroup={(chat, meeting) => {
              handleOpenDiscussionGroup(chat, meeting, organizationId)
            }}
            // workspace={ {} }
            meetingId={meetingId}
            onMeetingClose={() => {}}
            locale={getLanguage()}
            me={me}
            onCrumbsClick={onBackClick}
          />
        )}
      </div>
    </APICtx.Provider>
  )
}
export default WsMeeting
