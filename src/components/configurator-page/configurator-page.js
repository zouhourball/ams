import { useState } from 'react'
import { useQuery as useQueryGraphql } from 'react-apollo'
import { useMutation, useQuery } from 'react-query'

import TopBar from 'components/top-bar'
import ConfiguratorBlock from 'components/configurator-block'
import CompanyData from 'components/company-data'
import BlocksData from 'components/blocks-data'

import allOrganizations from 'libs/queries/all-organisations.gql'
import {
  addNewCompany,
  getConfiguredCompanies,
  getBlockByOrgId,
  addNewBlock,
} from 'libs/api/configurator-api'

import './style.scss'

const ConfiguratorPage = () => {
  const [companyTitle, setCompanyTitle] = useState('')

  const [currentItem, setCurrentItem] = useState()

  // const [companies, setCompanies] = useState([])

  const { data: companies, refetch: reFetchCompany } = useQuery(
    ['getConfiguredCompanies'],
    getConfiguredCompanies,
    {
      refetchOnWindowFocus: false,
    },
  )

  const { data: blocks, refetch: reFetchBlock } = useQuery(
    ['getBlockByOrgId', currentItem],
    getBlockByOrgId,

    {
      refetchOnWindowFocus: false,
      enabled: !!currentItem,
    },
  )

  const { data: companiesSource } = useQueryGraphql(allOrganizations, {
    context: {
      uri: `${PRODUCT_APP_URL_CONFIGURATOR}/graphql`,
    },
    // variables: {
    //   organizationID: orgID,
    //   wsIDs: [],
    // },
  })

  const addNewCompanyMutate = useMutation(addNewCompany, {
    // onError: console.log,
    onSuccess: (res) => {
      if (!res.error) {
        reFetchCompany()
      } else {
      }
    },
  })
  const addNewBlockMutate = useMutation(addNewBlock, {
    // onError: console.log,
    onSuccess: (res) => {
      if (!res.error) {
        reFetchBlock()
      } else {
      }
    },
  })

  const onAddCompany = ({ id: orgId, name: orgName }) => {
    addNewCompanyMutate.mutate({
      orgId: +orgId,
      orgName,
    })
  }

  const onAddBlock = (block) => {
    addNewBlockMutate.mutate({
      companyId: currentItem,
      block,
    })
  }
  return (
    <div className="configurator">
      <TopBar title="Configurator" actions={null} />
      <div className="configurator-content">
        <ConfiguratorBlock title={'Company'}>
          <CompanyData
            companies={companies?.content || []}
            companyTitle={companyTitle}
            setCompanyTitle={setCompanyTitle}
            currentItem={currentItem}
            setCurrentItem={setCurrentItem}
            companiesSource={
              companiesSource?.allOrganisationsBySuperAdmin
                ?.organisationItems || []
            }
            onAddCompany={onAddCompany}
          />
        </ConfiguratorBlock>

        <ConfiguratorBlock status={status} title={'Blocks'}>
          <BlocksData
            status={currentItem}
            blocks={blocks || []}
            onAdd={onAddBlock}
          />
        </ConfiguratorBlock>
      </div>
    </div>
  )
}
export default ConfiguratorPage
