import { Component } from 'react'

import { Button, TextField, Checkbox, FontIcon } from 'react-md'

import onClickOutside from 'react-onclickoutside'
import './styles.scss'

@onClickOutside
export default class SelectFieldWithButton extends Component {
  constructor (props) {
    super(props)

    this.state = {
      listVisible: false,
      search: '',
      selectedItem: null,
      selectedItemsArray: [],
      onClickAdd: true,
      newCategory: false,
      category: '',
    }
  }
  handleClickOutside = () => {
    this.setState({
      listVisible: false,
      onClickAdd: true,
      newCategory: false,
      category: '',
    })
  }
  renderItemsMultiPick = () => {
    const { items, onClickItem, selectedItemsArray } = this.props
    // const { search } = this.state
    // let filteredData = search
    //   ? items.filter(item =>
    //     item.name.toLowerCase().includes(search.toLowerCase())
    //   )
    //   : items

    return items.map((elem, index) => {
      return (
        <div key={index} className="itemMultiPick">
          <Checkbox
            id={elem.id}
            onChange={(val) => {
              if (val) {
                onClickItem([...selectedItemsArray, elem.id])
              }
              if (!val) {
                const selected = selectedItemsArray.find(
                  (item) => item === elem.id,
                )
                onClickItem(
                  selectedItemsArray.filter((item) => selected !== item),
                )
              }
            }}
            name="simple-checkboxes[]"
            checked={selectedItemsArray.includes(elem.id)}
            className="itemMultiPick_checkboxes"
            // uncheckedCheckboxIcon={<FontIcon>radio_button_unchecked</FontIcon>}
            // checkedCheckboxIcon={<FontIcon primary>check_circle</FontIcon>}
          />
          <div className="list_wrapper_list_items_label">{elem.name}</div>
          {/* <div className="list_wrapper_list_items_position">{elem.name}</div> */}
        </div>
      )
    })
  }
  renderItemsSinglePick = () => {
    const { items, onClickItem } = this.props
    const { search } = this.state
    let filteredData = search
      ? items.filter(
        (item) =>
          item && item.name.toLowerCase().includes(search.toLowerCase()),
      )
      : items

    return (
      filteredData &&
      filteredData.map((elem, index) => {
        return (
          <div
            key={index}
            className="itemSinglePick"
            onClick={() => {
              this.setState({
                listVisible: false,
                onClickAdd: true,
                newCategory: false,
                category: '',
              })
              onClickItem([elem.id])
            }}
          >
            <div className="list_wrapper_list_items_label">{elem.name}</div>
          </div>
        )
      })
    )
  }
  handleAddNew = (category) => {
    const { addCategory } = this.props
    if (category) {
      this.setState({ onClickAdd: true, newCategory: false, category: '' })
      addCategory(category)
    }
  }
  render () {
    const {
      label,
      singlePick,
      multiplePick,
      textFieldClassName,
      // selectedItemsArray,
      className,
      // items,
      buttonLabel,
      selectedItems,
      disabled,
    } = this.props
    const { listVisible, onClickAdd, newCategory, category, search } =
      this.state
    // selectedItemsArray && selectedItemsArray.length > 0
    //   ? items.find(elem => elem.id === selectedItemsArray[0])
    //   : null
    return (
      <div className={`list_wrapper ${className || ''}`}>
        <TextField
          onClick={() =>
            !disabled && this.setState({ listVisible: !listVisible })
          }
          lineDirection="center"
          label={label}
          autoComplete="off"
          className={`list_wrapper_textField ${textFieldClassName || ''}`}
          disabled={disabled}
          value={
            selectedItems || search
            // singlePick && selectedItem && selectedItem.name
            //   ? selectedItem.name || search
            //   : ''
          }
          inlineIndicator={
            <Button
              icon
              onClick={() => this.setState({ listVisible: !listVisible })}
              disabled={disabled}
            >
              {listVisible ? 'arrow_drop_up' : 'arrow_drop_down'}
            </Button>
          }
          onChange={(val) =>
            this.setState({
              search: val,
            })
          }
        />
        {listVisible && (
          <div className="list_wrapper_list  md-paper--1">
            {onClickAdd && buttonLabel && (
              <div className="list_wrapper_list_addSection">
                <Button
                  flat
                  primary
                  onClick={() =>
                    this.setState({ onClickAdd: false, newCategory: true })
                  }
                  iconChildren="add_circle_outline"
                >
                  {buttonLabel}
                </Button>
              </div>
            )}
            {newCategory && (
              <div className="list_wrapper_list_addSection_checkBtn">
                <TextField
                  value={category}
                  block
                  autoComplete="off"
                  onChange={(value) => this.setState({ category: value })}
                  inlineIndicator={
                    <FontIcon onClick={() => this.handleAddNew(category)}>
                      check_circle_outline
                    </FontIcon>
                  }
                />
              </div>
            )}
            <div className="list_wrapper_list_items">
              {singlePick && this.renderItemsSinglePick()}
              {multiplePick && this.renderItemsMultiPick()}
            </div>
          </div>
        )}
      </div>
    )
  }
}
