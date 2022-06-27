import React from 'react'
import moment from 'moment'
import { Button } from 'react-md'
export const configs = (onDelete, status, role) => [
  {
    label: 'Type',
    key: 'type',
    width: '140',
    // align: 'left',
    type: 'select', // one of [date, text, select, autocomplete]
    items: [
      {
        label: 'Relinquishment - IEP',
        value: 'Relinquishment - IEP',
      },
      {
        label: 'New Area - IEP',
        value: 'New Area - IEP',
      },
      {
        label: 'Relinquishment - FAEP',
        value: 'Relinquishment - FAEP',
      },
      {
        label: 'New Area - FAEP',
        value: 'New Area - FAEP',
      },
      {
        label: 'Relinquishment - SAEP',
        value: 'Relinquishment - SAEP',
      },
      {
        label: 'New Area - SAEP',
        value: 'New Area - SAEP',
      },
      {
        label: 'Relinquishment - DEV',
        value: 'Relinquishment - DEV',
      },
      {
        label: 'New Area - DEV',
        value: 'New Area - DEV',
      },
    ],
    required: true,
  },
  {
    label: 'Date',
    key: 'date',
    width: '140',
    align: 'left',
    type: 'date', // one of [date, text, select, autocomplete]
    render: ({ date }) => (date ? moment(date).format('DD/MM/YYYY') : ''),
    required: true,
  },
  {
    label: 'Reference Number',
    key: 'referenceNumber',
    align: 'left',
    width: '140',
    type: 'text', // one of [date, text, select, autocomplete]
    hide: true,
    textType: 'text',
    required: true,
  },
  {
    label: 'Reference Number',
    key: 'reference_number',
    align: 'left',
    width: '140',
  },
  {
    label: 'Area (KM2)',
    key: 'area',
    align: 'center',
    width: '140',
    type: 'text', // one of [date, text, select, autocomplete]
    hide: true,
    textType: 'number',
    required: true,
    precision: 3,
    maxNumberLength: 12,
  },
  {
    label: 'Area By Contract',
    key: 'area_by_contract',
    align: 'center',
    width: '140',
  },
  // {
  //   label: 'Area By Polygon (Calculated)',
  //   key: 'area_by_polygon',
  //   align: 'left',
  //   width: '140',
  // },
  {
    label: '',
    key: 'action',
    width: '140',
    render: row =>
      role &&
      role.find(elem => elem.id === 2) &&
      role &&
      role.find(elem => elem.id === 2) &&
      status !== 'APPROVED' && (
        <Button
          id="relinquishments-remove-button"
          icon
          onClick={() => onDelete(row)}
          primary
        >
          delete
        </Button>
      ),
    // eslint-disable-next-line react/display-label
    /* render: (row, { dataIndex }) => {
      return (
        <MenuButton
          id="menu-button-2"
          icon
          menuItems={[
            <ListItem
              key={1}
              primaryText="remove"
              onClick={() => getRelinquishmentsData(dataIndex)}
            />,
          ]}
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
        }, */
  },
]
export const configsAddition = (onDelete, status, role) => [
  {
    label: 'Start Date',
    key: 'startDate',
    align: 'left',
    type: 'date',
    render: ({ startDate }) =>
      startDate ? moment(startDate).format('DD/MM/YYYY') : '',
    required: true,
    width: '140',
  },
  {
    label: 'Status',
    key: 'status',
    align: 'left',
    type: 'select',
    required: true,
    width: '140',
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
    label: 'Serial',
    key: 'serial',
    align: 'left',
    type: 'text',
    width: '140',
    required: true,
  },
  {
    label: 'X Axis',
    key: 'xAxis',
    align: 'left',
    type: 'text',
    textType: 'number',
    precision: 6,
    maxNumberLength: 9,
    required: true,
    width: '140',
  },
  {
    label: 'Y Axis',
    key: 'yAxis',
    align: 'left',
    type: 'text',
    textType: 'number',
    precision: 6,
    maxNumberLength: 9,
    required: true,
    width: '140',
  },
  {
    label: '',
    key: 'action',
    // eslint-disable-next-line react/display-label
    width: '140',
    render: row => {
      return (
        <Button
          id="polygon-remove-button"
          icon
          disabled={
            !(role && role.find(elem => elem.id === 2)) ||
            (role && role.find(elem => elem.id === 2) && status === 'APPROVED')
          }
          onClick={() => onDelete(row)}
          primary
        >
          delete
        </Button>
      )
    },
  },
]
