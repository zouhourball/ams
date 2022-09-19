import { useState, useEffect, useRef } from 'react'
import { FontIcon, DialogContainer, TextField } from 'react-md'
// import { navigate } from '@reach/router'
import { get, uniqBy } from 'lodash-es'
import { graphql } from 'react-apollo'

import CardMember from 'components/module-agreements/components/card-member'
import allUserProfiles from 'libs/queries/all-user-profiles.gql'
import allUsersByOrgAdmin from 'libs/queries/all-users-by-org-admin.gql'
import AutocompleteWithButton from 'components/module-agreements/components/autocomplete-with-button'
import { useTranslation } from 'libs/langs'

import './style.scss'

const isAllUsersByOrgAdmin = false

function usePrevious (value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const AgreementSession = ({
  className,
  onClickCard,
  data,
  userProfiles,
  searchUser,
  addUpdateStream,
  deleteStream,
  removeUser,
  allUsersByOrgAdmin,
  organizationID,
}) => {
  const { t } = useTranslation()
  const [membreitem, setMembres] = useState([])
  const prevData = usePrevious(data.users)
  const [deleteUser, setDeleteUser] = useState(false)
  const [searchedUser, setSearchedUser] = useState('')
  const [searchFieldValue, setSearchFieldValue] = useState('')

  useEffect(() => {
    if (data.users && !data.loading) {
      setMembres([
        ...data.users.map((user) => ({ subject: user.sub, roles: user.roles })),
        ...membreitem.filter(
          (mi) => !data.users.find((user) => user.sub === mi.subject),
        ),
      ])
    }
  }, [prevData])
  const onSearch = (keyword) => {
    searchUser({ fullName: `%${keyword}%`, limit: 20, offset: 0 })
    setSearchedUser(keyword)
  }
  const renderSelect = () => {
    return (
      <AutocompleteWithButton
        onTextChange={onSearch}
        onClickItem={(newList) => {
          const newData = [
            ...membreitem,
            ...newList
              .filter(
                (subject) => !membreitem.find((u) => u.subject === subject),
              )
              .map((subject) => ({ subject })),
          ].filter(({ subject }) => newList.includes(subject))
          if (newList.length < membreitem.length) {
            const userTodDelete = data.users.find(
              ({ sub }) => !newList.includes(sub),
            )
            if (
              userTodDelete &&
              userTodDelete.roles &&
              userTodDelete.roles.length
            ) {
              removeUserDialog({
                subject: userTodDelete.sub,
                roles: userTodDelete.roles,
              })
            } else {
              setMembres(newData)
            }
          } else {
            setMembres(newData)
          }
        }}
        textFieldClassName="newJob_textField"
        multiplePick // or singlePick
        selectedItemsArray={membreitem.map(({ subject }) => subject)}
        label={t('assign_member')}
        items={uniqBy(
          [
            ...(isAllUsersByOrgAdmin ? allUsersByOrgAdmin : userProfiles)
              .map(({ subject, fullName, photo, roles, title }) => ({
                id: subject,
                label: fullName,
                title,
                img: get(photo, 'aPIID', null),
                roles,
              }))
              .filter(
                (userProfile) =>
                  !isAllUsersByOrgAdmin ||
                  userProfile.label
                    .toLowerCase()
                    .includes(searchedUser.toLowerCase()),
              ),
            // ...membreitem.map(({ subject, roles }) => ({
            //   id: subject,
            //   label: subject,
            //   roles,
            // })),
          ],
          'id',
        )}
      />
    )
  }
  const onRemoveUser = () => {
    const newMemberItems = membreitem.filter(
      (mi) => mi.subject !== deleteUser.user_sub,
    )
    setMembres(newMemberItems)
    if (deleteUser.roles.length) {
      deleteUser.roles.forEach((role) =>
        removeUser({ user_sub: deleteUser.user_sub, role_id: role }, data.id),
      )
    }
    setDeleteUser(false)
  }
  const addUpdateStreamAgreement = (roleId, member) => {
    addUpdateStream(roleId, member, data.id)
  }
  const deleteStreamAgreement = (roleId, member) => {
    deleteStream(roleId, member, data.id)
  }
  const removeUserDialog = (member) => {
    setDeleteUser({
      roles: member.role
        ? [member.role.id]
        : (member.roles || []).map(({ id }) => id),
      user_sub: member.subject,
    })
  }
  const actions = [
    {
      onClick: onRemoveUser,
      children: 'Yes',
    },
    {
      onClick: () => setDeleteUser(false),
      primary: true,
      children: 'No',
    },
  ]
  const renderDataTitle = (title) => {
    let dataTitle = title
    if (title === 'Exploration Commitments') {
      dataTitle = t('minimum_exploration')
    } else if (title === 'Obligations') {
      dataTitle = t('obligations_contractor')
    }
    return dataTitle
  }

  const FilteredSelectedMembers = () => {
    return new RegExp(searchFieldValue, 'i')
  }

  return (
    <div className={`${className || ''} agreement-session`}>
      <h2
        className="agreement-session_title"
        // onClick={() => navigate(`/psa/agreement/${data.id}`)}
      >
        {/* {data.icon ? (
          <FontIcon iconClassName={data.icon}></FontIcon>
        ) : (
          <img src={data.image} />
        )}{' '} */}
        <span className="title">{renderDataTitle(data.title)}</span>
        <span>{membreitem?.length}</span>
      </h2>
      <div className="agreement-session_content">
        <div className="agreement-session_content_selectField_main">
          {renderSelect(userProfiles)}
        </div>
        <div className="searchField">
          <TextField
            id={`${data.title}-searchField`}
            value={searchFieldValue}
            onChange={(v) => setSearchFieldValue(v)}
            placeholder="Search Member"
            autoComplete="off"
            leftIcon={<FontIcon>search</FontIcon>}
            rightIcon={
              searchFieldValue !== '' && (
                <FontIcon onClick={() => setSearchFieldValue('')}>
                  clear
                </FontIcon>
              )
            }
          />
        </div>
        <div className="list-cardMember">
          {membreitem?.map(({ subject, roles }, position, self) => (
            <CardMember
              key={subject}
              member={{
                subject,
                roles,
              }}
              onRemoveUser={removeUserDialog}
              addUpdateStream={addUpdateStreamAgreement}
              deleteStream={deleteStreamAgreement}
              showListOnTop={self.length > 2 && position === self.length - 1}
              visibilityTester={FilteredSelectedMembers()}
              // data={{
              //   fullName: 'jkj',
              //   title: 'tetet',
              //   image: '',
              // }}
            />
          ))}
        </div>
      </div>
      <DialogContainer
        id="dialog-confirm-delete"
        className="newDialog"
        title="Warning"
        visible={deleteUser}
        width="30%"
        onHide={() => setDeleteUser(false)}
        modal
        actions={actions}
      >
        <h3>{t('delete_it')}</h3>
      </DialogContainer>
    </div>
  )
}

export default graphql(allUserProfiles, {
  name: 'allUserProfiles',
  options: (props) => ({
    context: { uri: `${PRODUCT_APP_URL_PROFILE}/graphql` },
    notifyOnNetworkStatusChange: true,
    variables: { fullName: `%%`, limit: 5, offset: 0 },
  }),
  props: (response) => ({
    userProfiles: get(
      response,
      'allUserProfiles.allUserProfiles.userProfiles',
      [],
    ),
    searchUser: response.allUserProfiles.refetch,
  }),
})(
  graphql(allUsersByOrgAdmin, {
    name: 'allUsersByOrgAdmin',
    options: (props) => ({
      context: { uri: `${PRODUCT_APP_URL_CONFIGURATOR}/graphql` },
      notifyOnNetworkStatusChange: true,
      variables: { organisationID: props.organizationID },
    }),
    props: (response) => ({
      allUsersByOrgAdmin: get(
        response,
        'allUsersByOrgAdmin.allUsersByOrgAdmin.userItems',
        [],
      ).map((userProfile) => ({
        ...userProfile,
        fullName: userProfile.username,
        photo: { aPIID: userProfile.pictureURL },
      })),
    }),
  })(AgreementSession),
)
