import { Avatar, MenuButton, ListItem } from 'react-md'
// import { get } from 'lodash-es'

// import obligations from 'components/module-agreements/components/add-sections/images/obligations.svg'
// import relinquishments from 'components/module-agreements/components/add-sections/images/relinquishments.svg'
// import block from 'components/module-agreements/components/add-sections/images/block.svg'
// import polygon from 'components/module-agreements/components/add-sections/images/polygon.svg'
// import fiscal from 'components/module-agreements/components/add-sections/images/fiscal.svg'
// import exploration from 'components/module-agreements/components/add-sections/images/exploration.svg'
// import attachmentIcon from 'components/module-agreements/components/add-sections/images/attachmentIcon.svg'
// import masterContract from 'components/module-agreements/components/add-sections/images/masterContract.svg'
// import parties from 'components/module-agreements/components/add-sections/images/parties.svg'

import avatarCompany from 'components/module-agreements/images/avatarCompany.png'
import add from 'components/module-agreements/images/add.png'

import './style.scss'
import CompaniesInfoById from 'components/module-agreements/components/company-info-by-id'
import { getPublicUrl } from 'libs/utils/custom-function'
import { useTranslation } from 'libs/langs'

const GenericCard = ({
  className,
  onClickCard,
  onClickDelete,
  onClickRemove,
  onClickUndo,
  genericCardData,
}) => {
  const { t } = useTranslation()
  const shareholders = genericCardData.shareholders || []
  const renderAvatars = () => {
    const slicedShareholders = shareholders.slice(0, 3)
    return (
      <>
        <CompaniesInfoById
          organisationIDs={slicedShareholders.map(
            elem => elem.company_id && elem.company_id.toString(),
          )}
        >
          {organizations =>
            organizations && organizations.length ? (
              organizations.map((elem, index) => (
                <>
                  <Avatar
                    key={index}
                    src={
                      elem && elem.companyLogo && elem.companyLogo.aPIID
                        ? getPublicUrl(elem.companyLogo.aPIID)
                        : avatarCompany
                    }
                    role="presentation"
                  />
                </>
              ))
            ) : (
              <>
                <Avatar src={avatarCompany} role="presentation" />
              </>
            )
          }
        </CompaniesInfoById>
        {shareholders.length > 2 && <Avatar src={add} role="presentation" />}
      </>
    )
  }

  // const RenderIcon = section => {
  //   switch (section) {
  //     case 'Block Details':
  //       return block
  //     case 'Obligations':
  //       return obligations
  //     case 'Attachments':
  //       return attachmentIcon
  //     case 'Fiscal Terms':
  //       return fiscal
  //     case 'Polygon':
  //       return polygon
  //     case 'Exploration Commitments':
  //       return exploration
  //     case 'Relinquishments & new Areas':
  //       return relinquishments
  //     case 'Parties':
  //       return parties
  //     case 'Master Contract':
  //       return masterContract
  //     case 'Legal Terms Obligations':
  //       return relinquishments
  //     default:
  //       break
  //   }
  // }

  // const renderSections = () => {
  //   const sections = get(genericCardData, 'sections_details', [])
  //   let sectionsList = []
  //   if (sections) {
  //     sectionsList = sections.map(sec => {
  //       return {
  //         name: sec.section_entity.section.name,
  //         submitted: sec.section_entity.status,
  //         icon: RenderIcon(sec.section_entity.section.name),
  //       }
  //     })
  //   }
  //   const renderSectionTitle = title => {
  //     let dataTitle = title
  //     if (title === 'Exploration Commitments') {
  //       dataTitle = t('minimum_exploration')
  //     } else if (title === 'Obligations') {
  //       dataTitle = t('obligations_contractor')
  //     }
  //     return dataTitle
  //   }
  //   return sectionsList.map(({ name, submitted, icon }, index) => {
  //     return (
  //       <ListItem
  //         key={index}
  //         primaryText={renderSectionTitle(name)}
  //         leftIcon={
  //           icon ? (
  //             <img src={icon} width="16px" />
  //           ) : (
  //             <FontIcon key="data">data_usage</FontIcon>
  //           )
  //         }
  //         rightIcon={
  //           <div
  //             className={`generic-card-label generic-card-label-${submitted
  //               .toLowerCase()
  //               .replace(/ /g, '-')}`}
  //           >
  //             {submitted}
  //           </div>
  //         }
  //         onClick={e => null}
  //       />
  //     )
  //   })
  // }

  const { title, description, deleted } = genericCardData

  const renderDeleteMenu = () => {
    if (genericCardData.deleted === true) {
      return [
        <ListItem
          key={1}
          primaryText={'Undo'}
          onClick={e => {
            e.stopPropagation()
            onClickUndo(genericCardData.id)
          }}
        />,
        <ListItem
          key={2}
          primaryText={'Remove'}
          onClick={e => {
            e.stopPropagation()
            onClickRemove(genericCardData.id)
          }}
        />,
      ]
    } else {
      return [
        <ListItem
          key={1}
          primaryText={t('delete')}
          onClick={e => {
            e.stopPropagation()
            onClickDelete(genericCardData.id)
          }}
        />,
      ]
    }
  }
  return (
    <div
      className={`${className || ''} generic-card`}
      onClick={() => onClickCard && onClickCard()}
    >
      <MenuButton
        // onClose={}
        id="menu-button"
        icon
        onClick={e => e.stopPropagation()}
        menuItems={renderDeleteMenu()}
        centered
        anchor={{
          x: MenuButton.HorizontalAnchors.LEFT,
          y: MenuButton.VerticalAnchors.BOTTOM,
        }}
        menuClassName="generic-card-menuButton"
      >
        more_vert
      </MenuButton>
      {deleted && <div className="deletedFlag">Deleted</div>}
      <div className="generic-card-avatars">{renderAvatars()}</div>

      <h2 className="generic-card-title">{title}</h2>
      <div className="generic-card-description">
        {description.replace(/<\/?[^>]+(>|$)/g, '')}
      </div>
      {/* <div className="generic-card-details">
        <List className="generic-card-list">{renderSections()}</List>
      </div> */}
    </div>
  )
}

export default GenericCard

/* <GenericCard
genericCardData={{
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
}}
/> */
