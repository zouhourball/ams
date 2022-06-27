import { useState, useEffect } from 'react'
import { IconSeparator, Avatar, FontIcon, Tooltipped } from 'react-md'
import { get } from 'lodash-es'
import { connect } from 'react-redux'
import { cls } from 'reactutils'

import { SectionLoader } from 'components/module-agreements/components/loaders/loaders'
import UserInfos from 'components/module-agreements/components/user-Infos'
import { sections, listOfRoles } from './helpers'
import icon from './addSection.svg'
import { getPublicUrl } from 'libs/utils/custom-function'
import { useTranslation } from 'libs/langs'

import './style.scss'

const Item = ({ label, children, className }) => (
  <IconSeparator
    label={label}
    iconBefore
    component="li"
    className={cls(className)}
  >
    {children}
  </IconSeparator>
)

const AddSections = ({
  role,
  me,
  handleSectionToShow,
  sectionsList,
  loading,
  onClickSection,
}) => {
  const [sectionToShow, setSectionToShow] = useState([])
  const { t } = useTranslation()
  const renderMaxUsers = sectionMembers => {
    let maxUsers = []
    if (sections) {
      maxUsers = sectionMembers.slice(0, 3)
      return maxUsers
    } else {
      return []
    }
  }
  const renderBackgroundStatus = status => {
    let ColorStatus = ''
    switch (status) {
      case 'SUBMITTED':
        ColorStatus = 'submitted'
        break

      case 'APPROVED':
        ColorStatus = 'approved'
        break

      case 'AMENDED':
        ColorStatus = 'amended'
        break
    }
    return ColorStatus
  }

  const onchangeSection = sections => {
    return (
      sections &&
      sections.map(section => {
        if (get(me, 'user.subject')) {
          if (section.subjects.includes(me.user.subject)) {
            sectionToShow.push({ section })
            setSectionToShow([...sectionToShow])

            handleSectionToShow(sectionToShow)
          }
        }
      })
    )
  }

  useEffect(() => {
    onchangeSection(sections)
  }, [])

  const testHasRole = roles => {
    if (roles) {
      const userRoles = roles.map(el => el.name)
      return listOfRoles.some(role => userRoles.indexOf(role) !== -1)
    }
    return false
  }
  const renderSectionTitle = title => {
    let dataTitle = title
    if (title === 'Exploration Commitments') {
      dataTitle = t('minimum_exploration')
    } else if (title === 'Obligations') {
      dataTitle = t('obligations_contractor')
    }
    return dataTitle
  }
  return (
    <div className="md-paper md-paper--1 commonContainer section_card_paper">
      <div className="commonContainer_header">
        <div className="commonContainer_title">
          <img
            src={icon}
            width={'15px'}
            className="commonContainer_title_icon"
          />
          <h3>{t('sections')}</h3>
        </div>
      </div>
      <div className="profile-section-card-sections-list">
        <ul className="section_item">
          {loading ? (
            <div>
              <SectionLoader />
              <SectionLoader />
              <SectionLoader />
              <SectionLoader />
              <SectionLoader />
              <SectionLoader />
            </div>
          ) : (
            sections.map((section, index) => {
              const currentRole = role(section.name)
              const hasRole = testHasRole(currentRole)
              const sectionFormApi =
                sectionsList && sectionsList.length > 0
                  ? sectionsList.find(elem => {
                    const sectionName = get(
                      elem,
                      'section_entity.section.name',
                      '',
                    )
                    return sectionName === section.name
                  })
                  : {}
              return (
                <Item
                  key={index}
                  className={cls(hasRole ? 'selected' : '')}
                  label={
                    <div>
                      <label
                        className="section-name"
                        onClick={() => onClickSection(section.name)}
                      >
                        {section && renderSectionTitle(section.name)}
                      </label>
                      <div className="section-description">
                        <div className="section-members">
                          {get(sectionFormApi, 'members', []) &&
                          get(sectionFormApi, 'members', []).length > 0
                            ? renderMaxUsers(
                              sectionFormApi.members.map(
                                elem => elem.user_sub,
                              ),
                            ).map((member, indexMember) => {
                              return (
                                <UserInfos
                                  key={indexMember}
                                  subject={member || ''}
                                >
                                  {user => {
                                    return (
                                        <>
                                          <Tooltipped
                                            label={user.fullName}
                                            position="left"
                                            setPosition
                                            key={indexMember}
                                          >
                                            <span
                                              key={indexMember}
                                              className="contract-footer-details"
                                            >
                                              {get(user, 'photo.aPIID') ? (
                                                <Avatar
                                                  src={getPublicUrl(
                                                    user.photo.aPIID,
                                                  )}
                                                  role="presentation"
                                                />
                                              ) : (
                                                <Avatar
                                                  icon={
                                                    <FontIcon>person</FontIcon>
                                                  }
                                                />
                                              )}
                                            </span>
                                          </Tooltipped>
                                        </>
                                    )
                                  }}
                                </UserInfos>
                              )
                            })
                            : ''}
                          {get(sectionFormApi, 'members', []) &&
                          get(sectionFormApi, 'members', []).length > 3 ? (
                              <Tooltipped
                                label={`${sectionFormApi.members.length -
                                3} ${'more'}`}
                                position="bottom"
                                setPosition
                              >
                                <span
                                  key="abc"
                                  className="contract-footer-details"
                                >
                                  <Avatar
                                    className="list_person"
                                    role="presentation"
                                  >
                                    <span className="list_remained_members">
                                    +{sectionFormApi.members.length - 3}
                                    </span>
                                  </Avatar>
                                </span>
                              </Tooltipped>
                            ) : (
                              ''
                            )}
                        </div>

                        {sectionFormApi && (
                          <label
                            className={`status-label ${renderBackgroundStatus(
                              get(sectionFormApi, 'section_entity.status', ''),
                            )}`}
                          >
                            {get(sectionFormApi, 'section_entity.status', '')}
                          </label>
                        )}
                      </div>
                    </div>
                  }
                >
                  <Avatar
                    className={cls(
                      'section_item-avatar',
                      hasRole ? section.color : 'disabled',
                    )}
                    icon={
                      <img
                        className={`md-avatar-img ${
                          hasRole ? 'active' : 'notActive'
                        }`}
                        src={section && section.icon}
                      />
                    }
                    role="presentation"
                    onClick={() => onClickSection(section.name)}
                  />
                </Item>
              )
            })
          )}
        </ul>
      </div>
    </div>
  )
}
export default connect(({ query, shell }) => ({
  me: get(query, 'DEFAULT.me.data', []),

  organizationId: get(shell, 'organizationId', null),
}))(AddSections)
