import { TextField, FontIcon } from 'react-md'
import { cls } from 'reactutils'

import CardPerson from 'components/card-person'

import './style.scss'

const SelectItemsWithSearch = ({
  label,
  placeholder,
  textFieldClassName,
  items,
  rightIcon,
  selectedItems = [],
  selectItem,
  itemsVisibility,
  setItemsVisibility,
  textSearch,
  setTextSearch,
}) => {
  const getItems = () => {
    return (items || []).map((el) => (
      <div
        key={el.id}
        className="custom-search-itemsWrapper-elem"
        onClick={() => {
          selectItem(el)
        }}
      >
        <CardPerson
          personInfo={el}
          selected={selectedItems.map((el) => el.id)?.includes(el.id)}
          rightIcon={
            selectedItems.map((el) => el.id)?.includes(el.id) ? (
              <FontIcon primary>check</FontIcon>
            ) : (
              ''
            )
          }
        />
      </div>
    ))
  }
  return (
    <div className="custom-search">
      <TextField
        id="test-search"
        label={label}
        value={textSearch}
        placeholder={placeholder}
        onChange={setTextSearch}
        className={cls('custom-search-textField', textFieldClassName)}
        rightIcon={rightIcon}
        onFocus={() => setItemsVisibility(true)}
      />
      {itemsVisibility && (
        <>
          <div
            className="custom-search-outside"
            onClick={() => setItemsVisibility(false)}
          />
          <div className="custom-search-itemsWrapper md-paper md-paper--1">
            {getItems()}
          </div>
        </>
      )}
    </div>
  )
}
export default SelectItemsWithSearch

SelectItemsWithSearch.defaultProps = {
  items: [
    {
      id: 1,
      image: 'https://picsum.photos/100/100',
      fullName: 'Hammad Ahmed',
      companyName: 'OQ',
      companyPicture: 'https://picsum.photos/100/100',
      secondaryLabel: 'Publisher',
    },
    {
      id: 2,
      image: 'https://picsum.photos/100/100',
      fullName: 'Hammad Ahmed',
      companyName: 'OQ',
      companyPicture: 'https://picsum.photos/100/100',
      secondaryLabel: 'Publisher',
    },
    {
      id: 3,
      image: 'https://picsum.photos/100/100',
      fullName: 'Hammad Ahmed',
      companyName: 'OQ',
      companyPicture: 'https://picsum.photos/100/100',
      secondaryLabel: 'Publisher',
    },
  ],
}
