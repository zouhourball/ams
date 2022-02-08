import { SelectionControl, FontIcon, ListItem, List } from 'react-md'
import './styles.scss'
import { useMemo, useCallback, useState, useRef } from 'react'
import cls from 'classnames'
import { usePopper } from 'react-popper'
import { fromPairs } from 'lodash-es'
import useOutsideClick from '@rooks/use-outside-click'
import APEX from 'images/companies/APEX.png'
import ARA from 'images/companies/ARA.png'
import BP from 'images/companies/BP.png'
import CCED from 'images/companies/CCED.png'
import DNO from 'images/companies/DNO.png'
import Daleel from 'images/companies/Daleel.png'
import HCF from 'images/companies/HCF.png'
import Lasso from 'images/companies/Lasso.png'
import Masirah from 'images/companies/Masirah.png'
import OOCEP from 'images/companies/OOCEP.png'
import OXY from 'images/companies/OXY.png'
import PDO from 'images/companies/PDO.png'
import PetroTel from 'images/companies/PetroTel.png'
import PetrogasKahil from 'images/companies/PetrogasKahil.png'
import medco from 'images/companies/medco.png'
import target from 'images/companies/target.png'
import { createPortal } from 'react-dom'
const images = {
  APEX,
  ARA,
  BP,
  CCED,
  DNO,
  Daleel,
  HCF,
  Lasso,
  Masirah,
  OOCEP,
  OXY,
  PDO,
  PetroTel,
  PetrogasKahil,
  medco,
  target,
}
const OrgItem = ({ name, blocks, selectedBlocks, onChange }) => {
  const menuItems = useMemo(() => {
    return (
      <List className="org-item-ul">
        {blocks.map((b) => (
          <ListItem
            key={b}
            primaryText={b}
            className={
              selectedBlocks.includes(b)
                ? 'clsprefix-edit-task-selection--active'
                : 'clsprefix-edit-task-selection-list'
            }
            rightIcon={selectedBlocks.includes(b) && <FontIcon>check</FontIcon>}
            onClick={() => {
              const newChecked = !selectedBlocks.includes(b)
              if (newChecked) {
                onChange({
                  [name]: {
                    selectedBlocks: selectedBlocks.concat(b),
                  },
                })
              } else {
                onChange({
                  [name]: {
                    selectedBlocks: selectedBlocks.filter((i) => i !== b),
                  },
                })
              }
            }}
          />
        ))}
      </List>
    )
  }, [blocks, selectedBlocks])

  const orgDialogRef = useRef()
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const [menuVisible, setMenuVisible] = useState(false)
  const { styles, attributes } = usePopper(referenceElement, popperElement)

  const outsiceClick = useCallback(() => {
    setMenuVisible(false)
  }, [])

  useOutsideClick(orgDialogRef, outsiceClick)
  const onSelectAllBlock = useCallback(
    (e) => {
      if (e) {
        onChange({
          [name]: {
            selectedBlocks: blocks,
          },
        })
      } else {
        onChange({
          [name]: {
            selectedBlocks: [],
          },
        })
      }
    },
    [name, blocks, onChange],
  )

  const companyPic = images[name]

  const placeholder = useMemo(() => {
    if (!selectedBlocks.length) {
      return 'Select Blocks'
    } else if (selectedBlocks.length && selectedBlocks.length < blocks.length) {
      return `${selectedBlocks.length} Blocks`
    }
    return 'All Blocks'
  }, [selectedBlocks, blocks])

  return (
    <div className="org-item-container">
      <div className="org-item-top">
        {companyPic ? (
          <img src={companyPic} alt="" className="org-item-org-logo" />
        ) : (
          <FontIcon>domain</FontIcon>
        )}
        <span className="org-item-companyname">{name}</span>
        <SelectionControl
          id={`company-${name}`}
          type="switch"
          name={`company-${name}`}
          aria-label={`company-${name}`}
          onChange={onSelectAllBlock}
          checked={blocks.some((i) => selectedBlocks.includes(i))}
          className="selection-control selection-control-small"
        />
      </div>
      <div ref={orgDialogRef} className="">
        <button
          className="org-item-select-block-btn"
          ref={setReferenceElement}
          onClick={() => setMenuVisible((v) => !v)}
        >
          {placeholder}
          <FontIcon
            iconClassName={cls(
              'mdi ',
              menuVisible ? 'mdi-menu-up' : 'mdi-menu-down',
            )}
          ></FontIcon>
        </button>
        {menuVisible &&
          createPortal(
            <div
              ref={setPopperElement}
              style={{ ...styles.popper }}
              {...attributes.popper}
            >
              {menuItems}
            </div>,
            referenceElement?.current || document.querySelector('#root'),
          )}
      </div>
    </div>
  )
}
export const OrgBlockPicker = ({ orgs, onChange }) => {
  const onSelectAllCompany = useCallback(
    (checked) => {
      if (checked) {
        onChange(
          fromPairs(
            orgs.map((c) => [
              c.name,
              {
                selectedBlocks: c.blocks,
              },
            ]),
          ),
        )
      } else {
        onChange(
          fromPairs(
            orgs.map((c) => [
              c.name,
              {
                selectedBlocks: [],
              },
            ]),
          ),
        )
      }
    },
    [orgs, onChange],
  )

  const isCheckAll = useMemo(() => {
    return orgs.every((c) => c.selectedBlocks.length === c.blocks.length)
  }, [orgs])

  return (
    <div className="dashboard-org-picker">
      <div className="dashboard-org-picker-top">
        <h3 className="dashboard-org-picker-top-title">Organisations</h3>
        <div className="dashboard-org-picker-top-right">
          <span>Select All</span>
          <SelectionControl
            id="switch-lights"
            type="switch"
            aria-label="switch-lights"
            name="select-all"
            className="selection-control"
            onChange={onSelectAllCompany}
            checked={isCheckAll}
          />
          {/* <MenuButton
            id="menu-button-2"
            icon
            menuItems={[]}
            // listInline
            centered
            anchor={{
              x: MenuButton.HorizontalAnchors.CENTER,
              y: MenuButton.VerticalAnchors.CENTER,
            }}
          >
            more_vert
          </MenuButton> */}
        </div>
      </div>
      <div className="dashboard-org-picker-bottom">
        {orgs.map((o, index) => (
          <OrgItem key={index} {...o} onChange={onChange} />
        ))}
      </div>
    </div>
  )
}
