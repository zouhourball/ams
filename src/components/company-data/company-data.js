import { Button, Autocomplete } from 'react-md'

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
  companiesSource,
  onAddCompany,
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
        <Autocomplete
          id="Type here to add company"
          label="Type here to add company"
          placeholder="Type here to add company"
          data={companiesSource}
          filter={Autocomplete.caseInsensitiveFilter}
          dataLabel="name"
          dataValue="id"
          onAutocomplete={(suggestion, suggestionIndex, matches) => {
            onAddCompany(matches[0])
          }}
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
          setCurrentItem={() => setCurrentItem(comp?.id)}
          title={comp?.company}
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
