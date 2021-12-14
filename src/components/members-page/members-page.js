import { useState } from 'react'
import { TextField, FontIcon } from 'react-md'

import { getPublicUrl } from 'libs/utils/custom-function'

import UserInfoBySubject from 'components/user-info-by-subject'
import CardMember from 'components/card-member'

import './style.scss'
const MembersPage = ({
  members,
  setSelectedMembers,
  selectedMembers,
  setWorkspaceName,
  workspaceName,
  customSearch,
}) => {
  const [searchMember, setSearchMember] = useState('')

  const membersList = () => {
    let items = members

    if (searchMember) {
      const expr = new RegExp(searchMember, 'i')
      items = items.filter((nal) => expr.test(nal['fullName']))
    }
    return items?.map((el) => (
      <UserInfoBySubject key={el?.subject} subject={el?.subject}>
        {(userProfile) => (
          <CardMember
            key={el?.subject}
            onSelectItem={(item) =>
              setSelectedMembers((prev) =>
                !prev?.map((el) => el?.subject)?.includes(item.subject)
                  ? [...prev, item]
                  : prev.filter((el) => el?.subject !== item.subject),
              )
            }
            data={{
              ...userProfile,
              image: getPublicUrl(userProfile?.photo?.aPIURL),
            }}
            selected={selectedMembers
              ?.map((elem) => elem.subject)
              ?.includes(el?.subject)}
            className={`md-cell md-cell--4 ${
              selectedMembers
                ?.map((elem) => elem.subject)
                ?.includes(el?.subject)
                ? 'selected'
                : ''
            }`}
          />
        )}
      </UserInfoBySubject>
    ))
  }

  return (
    <div className="member-page">
      {!customSearch && (
        <>
          <div className="member-page-create-form md-grid">
            <TextField
              label="Group Title"
              id="group-name-id"
              onChange={setWorkspaceName}
              value={workspaceName}
              className="member-page-create-form-textField md-cell md-cell--6"
            />
          </div>
          <div className="member-page-search">
            <h3>{`Add Member`}</h3>
            <div className="member-page-search-right">
              <TextField
                block
                value={searchMember}
                onChange={setSearchMember}
                placeholder="Search Member"
                rightIcon={<FontIcon>search</FontIcon>}
                className="member-page-search-right-searchField"
              />
            </div>
          </div>
        </>
      )}
      <div className="member-page-grid-card md-grid">{membersList()}</div>
    </div>
  )
}

export default MembersPage
