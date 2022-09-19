import { useState, useEffect } from 'react'
import {
  // SelectionControl,
  MenuButton,
  ListItem,
  // Radio,
} from 'react-md'
import { get, flatMap } from 'lodash-es'

import DataTableAddition from 'components/module-agreements/components//data-table-addition'

import './data-table-addition-group'
import RemarksFooter from 'components/module-agreements/components//remarks-footer'

import './data-table-addition-group.scss'
import { categories } from './helper'
import { useTranslation } from 'libs/langs'

function DataTableAdditionGroup ({
  fiscalTerms,
  role,
  onAddRow,
  // onCheckSharing,
  // onCheckSecond,
  activityId,
  amendedAgreement,
}) {
  // const [option, setOption] = useState('')
  const { t } = useTranslation()
  const [costRow, setCostRow] = useState([])
  // const [profitOp1, setProfitOp1] = useState([])
  // const [profitOp2, setProfitOp2] = useState([])
  // const [secondTier, setSecondTier] = useState([])
  const remark = get(fiscalTerms, 'section_entity.remarks', '')

  // const [checked, setChecked] = useState(
  //   get(fiscalTerms, 'second_tiers.length', 0) > 0,
  // )
  useEffect(() => {
    const costs = fiscalTerms.costs
      ? fiscalTerms.costs.map(el => {
        return {
          category: el.category,
          subCategory: el.sub_category,
          value: el.value,
          valueUmo: el.uom,
        }
      })
      : []
    setCostRow(costs)
  }, [fiscalTerms.costs])

  // useEffect(() => {
  //   const profit1 = fiscalTerms.profit_sharing
  //     ? fiscalTerms.profit_sharing.map(el => {
  //       return {
  //         productionLevel: el.production_level,
  //         sensivity: el.sensitivity,
  //         effective: el.effective,
  //         contractorShare: el.contractor_share,
  //       }
  //     })
  //     : []
  //   setProfitOp1(profit1)
  //   if (get(fiscalTerms, 'profit_sharing.length', 0) > 0) {
  //     setOption('sharing')
  //   }
  // }, [fiscalTerms.profit_sharing])

  // useEffect(() => {
  //   const profit2 = fiscalTerms.profit_r_factor
  //     ? fiscalTerms.profit_r_factor.map(el => {
  //       return {
  //         contractorShare: el.contractor_share,
  //         ratio: el.ratio,
  //         taxation: el.taxation,
  //       }
  //     })
  //     : []
  //   setProfitOp2(profit2)
  //   if (get(fiscalTerms, 'profit_r_factor.length', 0) > 0) {
  //     setOption('rFactor')
  //   }
  // }, [fiscalTerms.profit_r_factor])

  // useEffect(() => {
  //   const second = fiscalTerms.second_tiers
  //     ? fiscalTerms.second_tiers.map(el => {
  //       return {
  //         windfallRate: el.windfall_rate,
  //         thresholdPrice: el.threshold_price,
  //         transferLocation: el.transfer_location,
  //       }
  //     })
  //     : []
  //   setSecondTier(second)
  //   setChecked(get(fiscalTerms, 'second_tiers.length', 0) > 0)
  // }, [fiscalTerms.second_tiers])

  const onDeleteCostRow = row => {
    setCostRow(costRow.filter((el, index) => index !== parseInt(row.indexId)))
  }
  // const onDeleteProfit1Row = row => {
  //   setProfitOp1(
  //     profitOp1.filter((el, index) => index !== parseInt(row.indexId)),
  //   )
  // }
  // const onDeleteProfit2Row = row => {
  //   setProfitOp2(
  //     profitOp2.filter((el, index) => index !== parseInt(row.indexId)),
  //   )
  // }
  // const onDeleteSecondRow = row => {
  //   setSecondTier(
  //     secondTier.filter((el, index) => index !== parseInt(row.indexId)),
  //   )
  // }
  return (
    <div className="data-table-addition-group">
      {remark && <RemarksFooter remark={remark} />}
      <h2>{t('terms')}</h2>
      <DataTableAddition
        amendedAgreement={amendedAgreement}
        config={[
          {
            label: 'Category',
            key: 'category',
            align: 'left',
            type: 'autocomplete', // one of [date, text, select, autocomplete]
            width: '140',
            items: categories.map(({ label, value }) => ({ label, value })),
            required: true,
            toClearOnUpdate: ['subCategory', 'valueUmo', 'value'],
          },
          {
            label: 'Sub Category',
            key: 'subCategory',
            align: 'left',
            type: 'autocomplete', // one of [date, text, select, autocomplete]
            width: '140',
            relatedTo: ['category'],
            toClearOnUpdate: ['valueUmo', 'value'],
            items: flatMap(categories, elem =>
              elem.subCategories.map(({ label, value }) => ({
                label,
                value,
                category: elem.value,
              })),
            ),
            required: true,
          },
          {
            label: 'Value_UOM',
            key: 'valueUmo',
            align: 'left',
            type: 'autocomplete', // one of [date, text, select, autocomplete]
            items: flatMap(categories, elem =>
              flatMap(
                elem.subCategories.map(subCategory =>
                  subCategory.uom.map(({ label, value }) => ({
                    label,
                    value,
                    subCategory: subCategory.value,
                    category: elem.value,
                  })),
                ),
                elem => elem,
              ),
            ),
            required: true,
            width: '140',
            relatedTo: ['category', 'subCategory'],
            toClearOnUpdate: ['value'],
          },
          {
            label: 'Value',
            key: 'value',
            align: 'left',
            type: 'dynamic',
            defaultType: 'text', // one of [date, text, select, autocomplete]
            textType: 'number',
            items: flatMap(categories, categoryElem =>
              flatMap(categoryElem.subCategories, subCategoryElem =>
                flatMap(
                  subCategoryElem.uom.map(uomElem =>
                    (uomElem.switch || []).map(({ label, value }) => ({
                      label,
                      value,
                      valueUmo: uomElem.value,
                      subCategory: subCategoryElem.value,
                      category: categoryElem.value,
                    })),
                  ),
                  elem => elem,
                ),
              ),
            ),
            relatedTo: ['category', 'subCategory', 'valueUmo'],
            precision: 2,
            maxNumberLength: 13,
            required: true,
            width: '140',
          },
          {
            label: '',
            key: 'action',
            // eslint-disable-next-line react/display-name
            width: '140',
            render: row => {
              return (
                <MenuButton
                  id="cost-menu-button"
                  icon
                  menuItems={[
                    <ListItem
                      key={1}
                      primaryText={t('remove')}
                      onClick={() => onDeleteCostRow(row)}
                    />,
                  ]}
                  listInline
                  anchor={{
                    x: MenuButton.HorizontalAnchors.INNER_LEFT,
                    y: MenuButton.VerticalAnchors.TOP,
                  }}
                  position={MenuButton.Positions.TOP_LEFT}
                  disabled={
                    activityId ||
                    !(role && role.find(elem => elem.id === 2)) ||
                    (role &&
                      role.find(elem => elem.id === 2) &&
                      get(fiscalTerms, 'section_entity.status', '') ===
                        'APPROVED' &&
                      !amendedAgreement)
                  }
                >
                  more_vert
                </MenuButton>
              )
            },
          },
        ]}
        role={role}
        status={get(fiscalTerms, 'section_entity.status', '')}
        data={costRow}
        canAddRows={true}
        activityId={activityId}
        onAdd={row => {
          setCostRow([...costRow, row])
          onAddRow('cost', [...costRow, row])
        }}
      />
      {/* <h2>PROFIT</h2>

      <Radio
        id="custom-checkbox-icon-1"
        name="using-custom-icons"
        type="radio"
        label="Option 1 (% Sharing)"
        value="sharing"
        onChange={value => {
          setOption(value)
          onCheckSharing(value)
        }}
        checked={option === 'sharing'}
        disabled={
          activityId ||
          !(role && role.find(elem => elem.id === 2)) ||
          (role &&
            role.find(elem => elem.id === 2) &&
            (get(fiscalTerms, 'section_entity.status', '') === 'SUBMITTED' ||
              get(fiscalTerms, 'section_entity.status', '') === 'APPROVED') &&
            !amendedAgreement)
        }
      />
      <DataTableAddition
        config={[
          {
            label: 'Production Level (KBPD)',
            key: 'productionLevel',
            align: 'left',
            type: 'text', // one of [date, text, select, autocomplete]
            required: true,
            width: '140',
          },
          {
            label: 'Sensivity (KBPD)',
            key: 'sensivity',
            align: 'left',
            type: 'text', // one of [date, text, select, autocomplete]
            textType: 'number',
            required: true,
            width: '140',
          },
          {
            label: 'Effective (Auto)',
            key: 'effective',
            align: 'left',
            type: 'text', // one of [date, text, select, autocomplete]
            textType: 'number',
            required: true,
            width: '140',
          },
          {
            label: 'Contractor Share (%)',
            key: 'contractorShare',
            align: 'left',
            type: 'text', // one of [date, text, select, autocomplete]
            textType: 'number',
            required: true,
            width: '140',
          },
          {
            label: '',
            key: 'action',
            // eslint-disable-next-line react/display-name
            width: '140',
            render: row => {
              return (
                <MenuButton
                  id="profit1-menu-button"
                  icon
                  menuItems={[
                    <ListItem
                      key={1}
                      primaryText="Remove"
                      onClick={() => onDeleteProfit1Row(row)}
                    />,
                  ]}
                  listInline
                  anchor={{
                    x: MenuButton.HorizontalAnchors.INNER_LEFT,
                    y: MenuButton.VerticalAnchors.TOP,
                  }}
                  position={MenuButton.Positions.TOP_LEFT}
                  disabled={
                    activityId ||
                    !(role && role.find(elem => elem.id === 2)) ||
                    (role &&
                      role.find(elem => elem.id === 2) &&
                      (get(fiscalTerms, 'section_entity.status', '') ===
                        'SUBMITTED' ||
                        get(fiscalTerms, 'section_entity.status', '') ===
                          'APPROVED') &&
                      !amendedAgreement)
                  }
                >
                  more_vert
                </MenuButton>
              )
            },
          },
        ]}
        role={role}
        data={profitOp1}
        amendedAgreement={amendedAgreement}
        canAddRows={true}
        disabled={option !== 'sharing'}
        status={get(fiscalTerms, 'section_entity.status', '')}
        onAdd={row => {
          setProfitOp1([...profitOp1, row])
          onAddRow('profit_op1', [...profitOp1, row])
        }}
      />

      <Radio
        id="custom-checkbox-icon-2"
        name="using-custom-icons"
        type="radio"
        label="Option 2 (R-Factor)"
        value="rFactor"
        onChange={value => {
          setOption(value)
          onCheckSharing(value)
        }}
        checked={option === 'rFactor'}
        disabled={
          activityId ||
          !(role && role.find(elem => elem.id === 2)) ||
          (role &&
            role.find(elem => elem.id === 2) &&
            (get(fiscalTerms, 'section_entity.status', '') === 'SUBMITTED' ||
              get(fiscalTerms, 'section_entity.status', '') === 'APPROVED') &&
            !amendedAgreement)
        }
      />

      <DataTableAddition
        config={[
          {
            label: 'Ratio',
            key: 'ratio',
            align: 'left',
            type: 'text', // one of [date, text, select, autocomplete]
            textType: 'number',
            required: true,
            width: '140',
          },
          {
            label: 'Contractor Share (%)',
            key: 'contractorShare',
            align: 'left',
            type: 'text', // one of [date, text, select, autocomplete]
            textType: 'number',
            required: true,
            width: '140',
          },
          {
            label: 'Taxation',
            key: 'taxation',
            align: 'left',
            type: 'text', // one of [date, text, select, autocomplete]
            textType: 'number',
            required: true,
            width: '140',
          },
          {
            label: '',
            key: 'action',
            // eslint-disable-next-line react/display-name
            width: '140',
            render: row => {
              return (
                <MenuButton
                  id="profit2-menu-button"
                  icon
                  menuItems={[
                    <ListItem
                      key={1}
                      primaryText="Remove"
                      onClick={() => onDeleteProfit2Row(row)}
                    />,
                  ]}
                  listInline
                  anchor={{
                    x: MenuButton.HorizontalAnchors.INNER_LEFT,
                    y: MenuButton.VerticalAnchors.TOP,
                  }}
                  position={MenuButton.Positions.TOP_LEFT}
                  disabled={
                    activityId ||
                    !(role && role.find(elem => elem.id === 2)) ||
                    (role &&
                      role.find(elem => elem.id === 2) &&
                      (get(fiscalTerms, 'section_entity.status', '') ===
                        'SUBMITTED' ||
                        get(fiscalTerms, 'section_entity.status', '') ===
                          'APPROVED') &&
                      !amendedAgreement)
                  }
                >
                  more_vert
                </MenuButton>
              )
            },
          },
        ]}
        role={role}
        data={profitOp2}
        canAddRows={true}
        amendedAgreement={amendedAgreement}
        disabled={option !== 'rFactor'}
        status={get(fiscalTerms, 'section_entity.status', '')}
        onAdd={row => {
          setProfitOp2([...profitOp2, row])
          onAddRow('profit_op2', [...profitOp2, row])
        }}
      />

      <SelectionControl
        id="checkbox-read-documentation-page"
        name="simple-checkboxes[]"
        label="Amend Second Tier Amount"
        type="checkbox"
        value="documentation"
        checked={checked}
        onChange={value => {
          setChecked(value)
          onCheckSecond(value)
        }}
        disabled={
          activityId ||
          !(role && role.find(elem => elem.id === 2)) ||
          (role &&
            role.find(elem => elem.id === 2) &&
            (get(fiscalTerms, 'section_entity.status', '') === 'SUBMITTED' ||
              get(fiscalTerms, 'section_entity.status', '') === 'APPROVED') &&
            !amendedAgreement)
        }
      />

      <DataTableAddition
        config={[
          {
            label: 'Windfall Rate (%)',
            key: 'windfallRate',
            align: 'left',
            type: 'text', // one of [date, text, select, autocomplete]
            textType: 'number',
            required: true,
            width: '140',
          },
          {
            label: 'Threshold Price ($)',
            key: 'thresholdPrice',
            align: 'left',
            type: 'text', // one of [date, text, select, autocomplete]
            textType: 'number',
            required: true,
            width: '140',
          },
          {
            label: 'Transfer Location',
            key: 'transferLocation',
            align: 'left',
            type: 'text', // one of [date, text, select, autocomplete]
            required: true,
            width: '140',
          },
          {
            label: '',
            key: 'action',
            // eslint-disable-next-line react/display-name
            width: '140',
            render: row => {
              return (
                <MenuButton
                  id="second-menu-button"
                  icon
                  menuItems={[
                    <ListItem
                      key={1}
                      primaryText="Remove"
                      onClick={() => onDeleteSecondRow(row)}
                    />,
                  ]}
                  listInline
                  anchor={{
                    x: MenuButton.HorizontalAnchors.INNER_LEFT,
                    y: MenuButton.VerticalAnchors.TOP,
                  }}
                  position={MenuButton.Positions.TOP_LEFT}
                  disabled={
                    activityId ||
                    !(role && role.find(elem => elem.id === 2)) ||
                    (role &&
                      role.find(elem => elem.id === 2) &&
                      (get(fiscalTerms, 'section_entity.status', '') ===
                        'SUBMITTED' ||
                        get(fiscalTerms, 'section_entity.status', '') ===
                          'APPROVED') &&
                      !amendedAgreement)
                  }
                >
                  more_vert
                </MenuButton>
              )
            },
          },
        ]}
        role={role}
        data={secondTier}
        amendedAgreement={amendedAgreement}
        status={get(fiscalTerms, 'section_entity.status', '')}
        canAddRows={true}
        disabled={!checked}
        onAdd={row => {
          setSecondTier([...secondTier, row])
          onAddRow('second_tiers', [...secondTier, row])
        }}
      /> */}
    </div>
  )
}

export default DataTableAdditionGroup
