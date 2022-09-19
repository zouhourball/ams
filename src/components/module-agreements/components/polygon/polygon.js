import { useState } from 'react'
import { MenuButton, ListItem, Button } from 'react-md'

import { HeaderOption } from 'components/psa-panel'
import DataTableAddition from 'components/data-table-addition'
import CustomExpansionPanel from 'components/module-agreements/components/custom-expansion-panel'
import { useTranslation } from 'libs/langs'

import './style.scss'

const Polygon = ({ collapsePanelLabel, leftIcon, iconColor, data, onAdd }) => {
  const [polygon, setPolygon] = useState('')
  const { t } = useTranslation()
  const renderPanelActions = () => {
    switch (polygon) {
      case '':
        return (
          <>
            <Button
              icon
              primary
              key={1}
              onClick={e => {
                e.stopPropagation()
                setPolygon('amend')
              }}
            >
              {t('req_amend')}
            </Button>
            <Button
              flat
              primary
              key={2}
              swapTheming
              onClick={e => {
                e.stopPropagation()
                setPolygon('approve')
              }}
            >
              {t('approve')}
            </Button>
          </>
        )

      case 'approve':
        return (
          <>
            <Button
              flat
              primary
              key={1}
              className="approved"
              swapTheming
              disabled
              onClick={e => {
                e.stopPropagation()
              }}
            >
              {t('approved')}
            </Button>
          </>
        )

      case 'amend':
        return (
          <>
            <Button
              flat
              primary
              key={1}
              className="amend"
              swapTheming
              disabled
              onClick={e => {
                e.stopPropagation()
              }}
            >
              {t('amend')}
            </Button>
          </>
        )
    }
  }
  return (
    <CustomExpansionPanel
      className=""
      header={
        <HeaderOption
          label={collapsePanelLabel}
          icon={leftIcon}
          iconColor={iconColor}
          showAction={false}
          actions={renderPanelActions()}
        />
      }
      body={
        <DataTableAddition
          config={[
            {
              name: 'Start Date',
              width: 120,
              dataKey: 'startDate',
              align: 'left',
              type: 'date', // one of [date, text, select, autocomplete]
            },
            {
              name: 'Status',
              dataKey: 'status',
              align: 'left',
              type: 'select', // one of [date, text, select, autocomplete]
              items: [
                {
                  label: 'ON',
                  value: 'ON',
                },
                {
                  label: 'OFF',
                  value: 'OFF',
                },
              ],
            },
            {
              name: 'Serial',
              dataKey: 'serial',
              align: 'left',
              type: 'text', // one of [date, text, select, autocomplete]
            },
            {
              name: 'X Axis',
              dataKey: 'xAxis',
              align: 'left',
              type: 'text', // one of [date, text, select, autocomplete]
            },
            {
              name: 'Y Axis',
              dataKey: 'yAxis',
              align: 'left',
              type: 'text', // one of [date, text, select, autocomplete]
            },
            {
              name: '',
              dataKey: 'action',
              // eslint-disable-next-line react/display-name
              render: () => {
                return (
                  <MenuButton
                    id="menu-button-2"
                    icon
                    menuItems={[<ListItem key={1} primaryText="remove" />]}
                    listInline
                    centered
                    anchor={{
                      x: MenuButton.HorizontalAnchors.CENTER,
                      y: MenuButton.VerticalAnchors.CENTER,
                    }}
                  >
                    more_vert
                  </MenuButton>
                )
              },
            },
          ]}
          data={data}
          canAddRows={true}
          onAdd={onAdd}
        />
      }
    />
  )
}

export default Polygon
