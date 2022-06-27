/* eslint-disable react/display-name */
import moment from 'moment'
import UsersAvatarList from 'components/module-agreements/components/user-avatar-list'
import { get } from 'lodash-es'
import UserInfoBySubject from 'components/module-agreements/components/user-info-by-subject'
import { Avatar, FontIcon, Button } from 'react-md'
import { getPublicUrl } from 'libs/utils/custom-function'
import { navigate } from '@reach/router'

import obligations from 'components/module-agreements/components/add-sections/images/obligations.svg'
import relinquishments from 'components/module-agreements/components/add-sections/images/relinquishments.svg'
import block from 'components/module-agreements/components/add-sections/images/block.svg'
import polygon from 'components/module-agreements/components/add-sections/images/polygon.svg'
import fiscal from 'components/module-agreements/components/add-sections/images/fiscal.svg'
import exploration from 'components/module-agreements/components/add-sections/images/exploration.svg'
import attachmentIcon from 'components/module-agreements/components/add-sections/images/attachmentIcon.svg'
import masterContract from 'components/module-agreements/components/add-sections/images/masterContract.svg'
import parties from 'components/module-agreements/components/add-sections/images/parties.svg'
export const agreements = [
  {
    genericCardData: {
      id: 1,
      title:
        'Production Sharing Agreement for Petroleum Exploration and Production',
      description:
        'Some description about the plan can be mentioned here, some description about the plan can be mentioned here. Some description about the plan can be',
      sections: [
        { name: 'ENTITLEMENTS', icon: '', submitted: true },
        { name: 'FISCAL TERMS', icon: '', submitted: false },
      ],
      companies: [
        {
          name: 'test',
          avatar: '',
        },
        {
          name: 'test',
          avatar: '',
        },
        {
          name: 'test',
          avatar: '',
        },
      ],
    },
  },
  {
    genericCardData: {
      id: 2,
      title:
        'Production Sharing Agreement for Petroleum Exploration and Production',
      description:
        'Some description about the plan can be mentioned here, some description about the plan can be mentioned here. Some description about the plan can be',
      sections: [
        { name: 'ENTITLEMENTS', icon: '', submitted: true },
        { name: 'FISCAL TERMS', icon: '', submitted: false },
      ],
      companies: [
        {
          name: 'test',
          avatar: '',
        },
        {
          name: 'test',
          avatar: '',
        },
        {
          name: 'test',
          avatar: '',
        },
      ],
    },
  },
]
export const configs = (agreementAction) => [
  {
    label: 'Title',
    key: 'title',
    width: '200',
    icon: 'mdi mdi-spellcheck',
  },
  {
    label: 'Description',
    key: 'description',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    render: (row) => {
      return <div dangerouslySetInnerHTML={{ __html: row.description }} />
    },
  },
  {
    label: 'Members',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    expand: true,
    render: (row) => {
      const members = get(row, 'members', [])
      return <UsersAvatarList maxParticipants={3} memberList={members} />
    },
    expandTemplate: (row) => {
      const members = get(row, 'members', [])

      return members.map((member, index) => (
        <div className="members-list" key={index}>
          <UserInfoBySubject subject={member}>
            {(res) => {
              return (
                <>
                  {res.photo ? (
                    <Avatar
                      className="members-list-avatar"
                      src={getPublicUrl(res.photo.aPIURL)}
                      role="presentation"
                    />
                  ) : (
                    <Avatar
                      className="members-list-avatar"
                      icon={<FontIcon>person</FontIcon>}
                    />
                  )}
                  {res.fullName}
                </>
              )
            }}
          </UserInfoBySubject>
        </div>
      ))
    },
  },
  {
    label: 'Created at',
    width: '200',
    icon: 'mdi mdi-spellcheck',
    render: (row) => {
      return moment(new Date(row.created_at)).format('DD MMM, YYYY')
    },
  },
  {
    label: 'Sections',
    width: '600',
    icon: 'mdi mdi-spellcheck',
    expand: true,
    render: (row) => {
      return (
        <div
          onScroll={(e) => e.stopPropagation()}
          className="generic-card-list-row"
        >
          {renderSections(row)}
        </div>
      )
    },
  },
  {
    label: 'Actions',
    render: (row) => (
      <>
        {!row.deleted && (
          <Button
            icon
            primary
            iconClassName="mdi mdi-eye-outline"
            className="main-content-manager-button"
            onClick={() => navigate(`/agreement/content/current/${row.id}`)}
          />
        )}
        {!row.deleted && (
          <Button
            icon
            primary
            iconClassName="mdi mdi-delete"
            className="main-content-manager-button"
            onClick={() => {
              agreementAction(row.id, 'delete')
            }}
          />
        )}
        {row.deleted && (
          <Button
            icon
            primary
            iconClassName="mdi mdi-undo"
            className="main-content-manager-button"
            onClick={() => {
              agreementAction(row.id, 'undo')
            }}
          />
        )}
        {row.deleted && (
          <Button
            icon
            primary
            iconClassName="mdi mdi-bookmark-remove"
            className="main-content-manager-button"
            onClick={() => {
              agreementAction(row.id, 'remove')
            }}
          />
        )}
        {row.deleted && <div className="deleted">Deleted</div>}
      </>
    ),
    width: '250',
    icon: 'mdi mdi-gesture-double-tap',
  },
]

const renderSections = (row) => {
  const sections = get(row, 'sections_details', [])
  let sectionsList = []
  if (sections) {
    sectionsList = sections.map((sec) => {
      return {
        name: sec.section_entity.section.name,
        submitted: sec.section_entity.status,
        icon: RenderIcon(sec.section_entity.section.name),
      }
    })
  }
  return sectionsList.map(({ name, submitted, icon }, index) => {
    return (
      <div className="sections" key={index}>
        <div className="sections-icon">
          <img src={icon} width="12px" />
        </div>
        <div className="sections-name">{name}</div>
        <div
          className={`sections-status sections-status-${submitted
            .toLowerCase()
            .replace(/ /g, '-')}`}
        >
          {submitted}
        </div>
      </div>
    )
  })
}
const RenderIcon = (section) => {
  switch (section) {
    case 'Block Details':
      return block
    case 'Obligations':
      return obligations
    case 'Attachments':
      return attachmentIcon
    case 'Fiscal Terms':
      return fiscal
    case 'Polygon':
      return polygon
    case 'Exploration Commitments':
      return exploration
    case 'Relinquishments & new Areas':
      return relinquishments
    case 'Parties':
      return parties
    case 'Master Contract':
      return masterContract
    case 'Legal Terms Obligations':
      return relinquishments
    default:
      break
  }
}
