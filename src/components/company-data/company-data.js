import { Button, TextField } from 'react-md'

import ConfiguratorCard from 'components/configurator-card'

import iconCompany from 'images/company-icon.png'

import './style.scss'

const CompanyData = ({
  companies,
  setCompanies,
  companyTitle,
  setCompanyTitle,
  currentItem,
  setCurrentItem,
}) => {
  const addCompanies = () => {
    const updatedCompanies = [...companies, companyTitle]
    setCompanyTitle('')
    return setCompanies(updatedCompanies)
  }

  const validData = () => {
    if (companyTitle !== '') {
      return false
    }
    return true
  }

  const renderHeader = () => {
    return (
      <div className="company-data-header">
        <TextField
          id="search"
          lineDirection="center"
          block
          placeholder="Type here to add company"
          className="company-data-header-textField"
          value={companyTitle}
          onChange={(v) => setCompanyTitle(v)}
        />

        <Button
          primary
          icon
          className="company-data-header-btn"
          disabled={validData()}
          onClick={addCompanies}
        >
          add
        </Button>
      </div>
    )
  }

  const renderCompanies = () => {
    return companies && companies?.length > 0 ? (
      companies.map((comp, index) => (
        <ConfiguratorCard
          key={index}
          id={comp?.id}
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
          title={comp}
        />
      ))
    ) : (
      <div className="empty-block">
        <img src={iconCompany} />
        You have not add yet any company
      </div>
    )
  }
  return (
    <div className="company-data">
      {renderHeader()}
      {renderCompanies()}
    </div>
  )
}
export default CompanyData
