import { Button, Autocomplete } from 'react-md'
import { useState, useRef } from 'react'

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
  const [company, chooseCompany] = useState({})
  const [match, setMatch] = useState([...companies])

  const textInput = useRef()
  const validData = () => {
    if (company?.name) {
      return false
    }
    return true
  }
  const filteredArray = (match) =>
    companies.filter((el) => {
      return match?.id === el?.id.toString()
    })
  const renderHeader = () => {
    return (
      <div className="company-data-header">
        <Autocomplete
          id="Type here to add company"
          // label="Type here to add company"
          ref={textInput}
          placeholder="Type here to add company"
          className="company-data-header-textField"
          data={companiesSource}
          filter={Autocomplete.caseInsensitiveFilter}
          dataLabel="name"
          dataValue="id"
          onChange={(value) => {
            !value && setMatch([])
          }}
          inputValue={company?.name}
          onAutocomplete={(suggestion, suggestionIndex, matches) => {
            chooseCompany(matches[suggestionIndex])
            const existingMatch = filteredArray(matches[suggestionIndex])
            setMatch(existingMatch)
          }}
        />

        <Button
          icon
          className="company-data-header-btn"
          disabled={validData()}
          onClick={() => {
            onAddCompany(company)
            chooseCompany({})
            textInput.current.state.value = ''
          }}
        >
          add
        </Button>
      </div>
    )
  }

  const renderCompanies = (match) => {
    let listCompanies = match?.length > 0 ? match : companies
    return listCompanies && listCompanies?.length > 0 ? (
      listCompanies.map((comp, index) => (
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
      {renderCompanies(match)}
    </div>
  )
}
export default CompanyData
