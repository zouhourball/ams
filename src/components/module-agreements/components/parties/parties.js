import { useState, useEffect, useRef } from 'react'
import { Button, FontIcon, MenuButton, ListItem } from 'react-md'
import { get } from 'lodash-es'
import { connect } from 'react-redux'
import moment from 'moment'
import { cls } from 'reactutils'
import { getCompanies } from 'libs/api/api-psa'
import query from '@target-energysolutions/react-hoc-query'

import AddDialog from './components/add-dialog'
import AddDialogShareholders from './components/add-dialog-shareholders'
import CompanyInfoById from 'components/module-agreements/components/companies-info-by-id'
// import CustomExpansionPanel from 'components/custom-expansion-panel'
// import { HeaderOption } from 'components/psa-panel/psa-panel'
import { PartiesLoader } from 'components/module-agreements/components/loaders/loaders'
import RemarksFooter from 'components/module-agreements/components/remarks-footer'

import { getPublicUrl } from 'libs/utils/custom-function'
import avatarCompany from 'components/module-agreements/images/avatarCompany.png'

import './parties.scss'
import CompaniesInfoById from 'components/module-agreements/components/company-info-by-id'
import { useTranslation } from 'libs/langs'

function Parties ({
  title,
  role,
  companies,
  onDialogSave,
  agreementId,
  allCompanies,
  organizationID,
  setSearchCompanies,
  setParties,
  showAction,
  actions,
  loading,
  updateSectionEntityStatus,
  remark,
  activityId,
  amendedAgreement,
}) {
  const { t } = useTranslation()
  const [addDialogVisible, setAddDialogVisible] = useState(false)
  const [type, setType] = useState('')
  const [updateStatus, setUpdateStatus] = useState(false)

  const usePrevious = value => {
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }
  const prevUpdateSectionEntityStatus = usePrevious({
    ...updateSectionEntityStatus,
  })
  useEffect(() => {
    if (
      updateSectionEntityStatus &&
      updateSectionEntityStatus.data &&
      updateSectionEntityStatus.data.section ===
        get(companies, 'section_entity.id', '') &&
      prevUpdateSectionEntityStatus &&
      !updateSectionEntityStatus.pending &&
      prevUpdateSectionEntityStatus.pending
    ) {
      setUpdateStatus(
        !updateSectionEntityStatus.data.error ? 'success' : 'error',
      )
      setTimeout(() => {
        setUpdateStatus(false)
      }, 10000)
    }
  }, [updateSectionEntityStatus])
  const status = get(companies, 'section_entity.status', '')

  const disableButton =
    activityId ||
    !(role && role.find(elem => elem.id === 2)) ||
    (role &&
      role.find(elem => elem.id === 2) &&
      status === 'APPROVED' &&
      !amendedAgreement)

  const onSave = (data, type) => {
    const dataDialog = data.map(dataValue => {
      const noc = allCompanies.data.content.find(
        el => el.id === dataValue.company_id,
      )?.noc
      return {
        ...dataValue,
        noc,
      }
    })
    onDialogSave(type, dataDialog)
  }

  return (
    <div className={cls('parties', updateStatus || '')}>
      <div className="parties-title">
        <FontIcon iconClassName="mdi mdi-account-multiple-outline"></FontIcon>
        <h3> {title} </h3>
        {showAction && <div className="psaPanel_rightButtons">{actions}</div>}
      </div>

      {agreementId && (
        <div>
          {remark && <RemarksFooter remark={remark} />}
          <div className="parties-section">
            <header className="parties-section-header">
              <h4>
                {t('operators')} (
                {companies && companies.operators
                  ? companies.operators.length
                  : 0}
                )
              </h4>
              {!disableButton && (
                <Button
                  icon
                  onClick={() => {
                    setAddDialogVisible(true)
                    setType('operators')
                  }}
                >
                  add
                </Button>
              )}
            </header>
            <div className="parties-section-body">
              {loading ? (
                <PartiesLoader />
              ) : (
                <CompaniesInfoById
                  organisationIDs={(
                    get(companies, 'operators', []) || []
                  ).map(elem =>
                    elem.company_id ? elem.company_id.toString() : '',
                  )}
                >
                  {organizations =>
                    renderCards(
                      companies && companies.operators,
                      role,
                      data => setParties('operators', data),
                      organizations,
                      false,
                    )
                  }
                </CompaniesInfoById>
              )}
            </div>
          </div>
          <div className="parties-section">
            <header className="parties-section-header">
              <h4>
                {t('shareholders')}(
                {companies && companies.shareholders
                  ? companies.shareholders.length
                  : 0}
                )
              </h4>
              {!disableButton && (
                <Button
                  icon
                  onClick={() => {
                    setAddDialogVisible(true)
                    setType('shareholders')
                  }}
                >
                  add
                </Button>
              )}
            </header>
            <div className="parties-section-body">
              {loading ? (
                <PartiesLoader />
              ) : (
                <CompaniesInfoById
                  organisationIDs={(
                    get(companies, 'shareholders', []) || []
                  ).map(elem =>
                    elem.company_id ? elem.company_id.toString() : '',
                  )}
                >
                  {organizations =>
                    renderCards(
                      companies && companies.shareholders,
                      role,
                      data => setParties('shareholders', data),
                      organizations,
                    )
                  }
                </CompaniesInfoById>
              )}
            </div>
          </div>
          <div className="parties-section">
            <header className="parties-section-header">
              <h4>
                {t('contractors')} (
                {companies && companies.contractors
                  ? companies.contractors.length
                  : 0}
                )
              </h4>
              {!disableButton && (
                <Button
                  icon
                  onClick={() => {
                    setAddDialogVisible(true)
                    setType('contractors')
                  }}
                >
                  add
                </Button>
              )}
            </header>
            {loading ? (
              <PartiesLoader />
            ) : (
              <CompaniesInfoById
                organisationIDs={(
                  get(companies, 'contractors', []) || []
                ).map(elem =>
                  elem.company_id ? elem.company_id.toString() : '',
                )}
              >
                {organizations =>
                  renderCards(
                    companies && companies.contractors,
                    role,
                    data => setParties('contractors', data),
                    organizations,
                  )
                }
              </CompaniesInfoById>
            )}
          </div>
          <div className="parties-section">
            <header className="parties-section-header">
              <h4>
                {t('service_providers')}(
                {companies && companies.service_providers
                  ? companies.service_providers.length
                  : 0}
                )
              </h4>
              {!disableButton && (
                <Button
                  icon
                  onClick={() => {
                    setAddDialogVisible(true)
                    setType('service_providers')
                  }}
                >
                  add
                </Button>
              )}
            </header>
            {loading ? (
              <PartiesLoader />
            ) : (
              <CompaniesInfoById
                organisationIDs={(
                  get(companies, 'service_providers', []) || []
                ).map(elem =>
                  elem.company_id ? elem.company_id.toString() : '',
                )}
              >
                {organizations =>
                  renderCards(
                    companies && companies.service_providers,
                    role,
                    data => setParties('service_providers', data),
                    organizations,
                  )
                }
              </CompaniesInfoById>
            )}
          </div>
        </div>
      )}
      {addDialogVisible && (
        <CompaniesInfoById
          organisationIDs={(
            get(allCompanies, 'data.content', []) || []
          ).map(elem => (elem.id ? elem.id.toString() : ''))}
        >
          {organizations => {
            return type === 'shareholders' ? (
              <AddDialogShareholders
                companies={get(companies, `shareholders`, []) || []}
                shareholdersList={
                  organizations.map(elem => {
                    return { ...elem, company_id: elem.organisationID }
                  }) || []
                }
                visible={addDialogVisible}
                organizationID={organizationID}
                onHide={() => {
                  setAddDialogVisible(false)
                }}
                onSave={data => {
                  onSave(data, type)
                }}
                onSearchShareHolders={setSearchCompanies}
              />
            ) : (
              <AddDialog
                type={type}
                companies={type ? get(companies, `${type}`, []) : []}
                shareholdersList={
                  organizations.map(elem => {
                    return { ...elem, company_id: elem.organisationID }
                  }) || []
                }
                visible={addDialogVisible}
                organizationID={organizationID}
                onHide={() => {
                  setAddDialogVisible(false)
                }}
                onSave={data => {
                  onSave(data, type)
                }}
                onSearchShareHolders={setSearchCompanies}
              />
            )
          }}
        </CompaniesInfoById>
      )}
    </div>
  )
}

const renderCards = (
  items,
  role,
  setItems,
  organizations,
  showPercentage = true,
) => {
  return (
    items &&
    items.map((el, key) => (
      <CompanyInfoById
        key={key}
        organisationID={el.company_id ? el.company_id.toString() : ''}
      >
        {organization => {
          return (
            organization && (
              <div className="parties-card" key={key}>
                <div className="parties-card-element">
                  {role && role.id === 2 && (
                    <MenuButton
                      id="menu-button-2"
                      icon
                      menuItems={[
                        <ListItem
                          key={1}
                          primaryText="Remove"
                          onClick={() =>
                            setItems(
                              items.filter((elem, index) => index !== key),
                            )
                          }
                        />,
                      ]}
                      centered
                    >
                      more_vert
                    </MenuButton>
                  )}
                  <div className="parties-card-element-logo">
                    <img
                      src={
                        get(organizations[key], 'companyLogo.aPIID', null)
                          ? getPublicUrl(organizations[key].companyLogo.aPIID)
                          : avatarCompany
                      }
                      width={50}
                      height={50}
                    />
                  </div>
                  <div className="parties-card-element-content">
                    <h5>{el.company_name} </h5>
                    <div className="parties-card-element-content-type">
                      {el.company_industry}
                    </div>
                    <div className="parties-card-element-footer">
                      <label>
                        <i className="mdi mdi-calendar-text" />
                        {moment(el.start_date).format('DD/MM/YYYY') +
                          ' - ' +
                          moment(el.end_date).format('DD/MM/YYYY')}
                      </label>
                      {showPercentage && <span> {el.percentage}% </span>}
                    </div>
                  </div>
                </div>
                {/* <CustomExpansionPanel
                  className="parties-card-comments"
                  header={<HeaderOption label={'View Comments (4)'} />}
                  body={'comments'}
                /> */}
              </div>
            )
          )
        }}
      </CompanyInfoById>
    ))
  )
}

export default connect(
  ({ shell }) => ({
    organizationID: shell.organizationId,
  }),
  null,
)(
  query({
    key: 'getCompanies',
    op: getCompanies,
    name: 'allCompanies',
  })(Parties),
)
