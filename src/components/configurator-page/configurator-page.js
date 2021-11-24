import { useState, useEffect } from 'react'

import TopBar from 'components/top-bar'
import ConfiguratorBlock from 'components/configurator-block'
import CompanyData from 'components/company-data'
import BlocksData from 'components/blocks-data'

import './style.scss'

const ConfiguratorPage = () => {
  const [companyTitle, setCompanyTitle] = useState('')
  const [blockTitle, setBlockTitle] = useState('')
  const [status, changeStatus] = useState('closed')
  const [currentItem, setCurrentItem] = useState()

  const [companies, setCompanies] = useState([])
  useEffect(() => {
    if (currentItem?.length) {
      changeStatus('open')
    } else changeStatus('closed')
  }, [currentItem])

  return (
    <div className="configurator">
      <TopBar title="Configurator" actions={null} />
      <div className="configurator-content">
        <ConfiguratorBlock title={'Company'}>
          <CompanyData
            companies={companies}
            setCompanies={setCompanies}
            companyTitle={companyTitle}
            setCompanyTitle={setCompanyTitle}
            currentItem={currentItem}
            setCurrentItem={setCurrentItem}
          />
        </ConfiguratorBlock>

        <ConfiguratorBlock status={status} title={'Blocks'}>
          <BlocksData
            blockTitle={blockTitle}
            setBlockTitle={setBlockTitle}
            status={status}
          />
        </ConfiguratorBlock>
      </div>
    </div>
  )
}
export default ConfiguratorPage
