import { useState, useEffect } from 'react'
import { Avatar, Button } from 'react-md'
import { graphql } from 'react-apollo'
import { get } from 'lodash-es'
import { useSelector } from 'react-redux'

import CustomSelectField from 'components/module-agreements/components/custom-select-field'

import { getPublicUrl } from 'libs/utils/custom-function'
import seeUserProfileBySubject from 'libs/queries/userprofile-by-subject.gql'
import { useTranslation } from 'libs/langs'

import './style.scss'

const CardMember = ({
  member,
  onRemoveUser,
  userProfile,
  addUpdateStream,
  deleteStream,
  showListOnTop,
  visibilityTester,
}) => {
  const [visible, setVisible] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    setVisible(visibilityTester.test(userProfile?.label))
  }, [visibilityTester])

  const roles = useSelector(({ query }) =>
    get(query, 'DEFAULT.getAvailableRoles.data', []),
  )
  const [role, setRole] = useState(
    member.roles
      ? member.roles.map((role) => ({ ...role, label: role.name }))
      : [],
  )
  return (
    <div className={`cardMember ${visible ? '' : 'hidden'}`}>
      <Button
        icon
        iconClassName="mdi mdi-close"
        onClick={() => onRemoveUser(member)}
        className="cardMember-delete-button"
      />
      {userProfile?.img ? (
        <Avatar
          src={getPublicUrl(userProfile?.img)}
          role="presentation"
          className="cardMember-avatar"
        />
      ) : (
        <Avatar role="presentation" className="cardMember-avatar">
          {userProfile?.label ? userProfile?.label[0] : ''}
        </Avatar>
      )}
      <div className="cardMember-details">
        <div className="cardMember-details-label">{userProfile?.label}</div>
        <div className="cardMember-details-status">
          {userProfile?.status || 'N/A'}
        </div>
      </div>
      <div>
        <span>Role:</span>
        <CustomSelectField
          id="member"
          items={roles.map(({ id, name }) => ({ id, label: name }))}
          selectedItemsArray={role}
          onClickItem={(roles) => {
            if (roles.length > role.length) {
              const roleToAdd = roles.find(
                ({ id }) => !role.find((elem) => elem.id === id),
              )
              addUpdateStream(roleToAdd.id, member)
            } else {
              const roleToDelete = role.find(
                ({ id }) => !roles.find((elem) => elem.id === id),
              )
              deleteStream(roleToDelete.id, member)
            }

            setRole(roles)
          }}
          hideAvatar
          hideSearch
          hideSecondaryLabel
          listInvoker={(visibility, listVisible) => (
            <Button
              flat
              iconBefore={false}
              iconChildren="arrow_drop_down"
              onClick={() => listVisible(!visibility)}
              className="selectApprover-selector-button"
            >
              {role.length
                ? role.map(({ label }) => label).join(', ')
                : t('assign_role')}
            </Button>
          )}
          showListOnTop={showListOnTop}
        />
      </div>
    </div>
  )
}

export default graphql(seeUserProfileBySubject, {
  options: (props) => ({
    context: { uri: `${PRODUCT_APP_URL_PROFILE}/graphql` },
    notifyOnNetworkStatusChange: true,
    variables: { subject: get(props, 'member.subject', '') },
  }),
  props: (response) => {
    const user = get(response, 'data.seeUserProfileBySubject.user', {})

    return {
      userProfile: {
        img: user?.photo?.aPIID,
        label: user?.fullName,
        status: user?.title,
        subject: user?.subject,
      },
    }
  },
  skip: (props) => !get(props, 'member.subject', null),
})(CardMember)
