import { Component } from 'react'
import { Button, TextField, Avatar, Checkbox, FontIcon } from 'react-md'
import onClickOutside from 'react-onclickoutside'
import { get } from 'lodash-es'

import avatarCompany from 'components/module-agreements/images/avatarCompany.png'
import avatar from 'components/module-agreements/images/avatar.png'
import { getPublicUrl } from 'libs/utils/custom-function'

import './styles.scss'

@onClickOutside
export default class AutocompleteWithButton extends Component {
  constructor (props) {
    super(props)

    this.state = {
      listVisible: false,
      search: '',
      selectedItem: null,
      selectedItemsArray: [],
    }
  }
  componentDidUpdate = (prevProps, prevState) => {
    const { selectedItemsArray, items, singlePick, onTextChange } = this.props
    const { search } = this.state
    const selectedCompany =
      selectedItemsArray && selectedItemsArray.length > 0
        ? items.find(elem => elem.id === selectedItemsArray[0])
        : null
    const prevPropsSelectedCompany =
      prevProps.selectedItemsArray && prevProps.selectedItemsArray.length > 0
        ? prevProps.items.find(
          elem => elem.id === prevProps.selectedItemsArray[0],
        )
        : null
    if (
      get(selectedCompany, 'id', null) !==
      get(prevPropsSelectedCompany, 'id', null)
    ) {
      this.setState({
        selectedItem: selectedCompany,
        search: singlePick
          ? selectedCompany
            ? selectedCompany.label
            : ''
          : search,
      })
      if (onTextChange) {
        onTextChange(
          singlePick ? (selectedCompany ? selectedCompany.label : '') : search,
        )
      }
    }
  }
  handleClickOutside = () => {
    const { selectedItem, search } = this.state
    const { singlePick, onTextChange } = this.props
    this.setState({ listVisible: false })
    if (singlePick || search !== '') {
      this.setState({
        search: selectedItem && singlePick ? selectedItem.label : '',
      })
      if (onTextChange) {
        onTextChange(selectedItem && singlePick ? selectedItem.label : '')
      }
    }
  }
  renderItemsMultiPick = () => {
    const { items, onClickItem, selectedItemsArray } = this.props
    const { search } = this.state
    let filteredData = search
      ? items.filter(item =>
        item.label.toLowerCase().includes(search.toLowerCase()),
      )
      : items
    // if (selectedItemsArray.length > 0) {
    //   filteredData = filteredData.filter(item2 => selectedItemsArray.includes(item2.id))
    // }
    return filteredData.map(elem => {
      return (
        <div key={elem.id} className="itemMultiPick">

          <div className="list_wrapper_list_items_image">
            <Avatar src={elem.img ? getPublicUrl(elem.img) : avatar} />
          </div>
          <div>
            <div className="list_wrapper_list_items_label">{elem.label}</div>
            <div className="list_wrapper_list_items_position">{elem.label}</div>
          </div>
          <Checkbox
            id={elem.id}
            onChange={val => {
              if (val) {
                // const selected = selectedItemsArray.find(
                //   item => item === elem.id,
                // )
                // !selected &&
                // this.setState({
                //   selectedItemsArray: [...selectedItemsArray, elem.id],
                // })
                onClickItem([...selectedItemsArray, elem.id])
              }
              if (!val) {
                const selected = selectedItemsArray.find(
                  item => item === elem.id,
                )
                // selected &&
                //   this.setState({
                //     selectedItemsArray: selectedItemsArray.filter(
                //       item => selected !== item,
                //     ),
                //   })
                onClickItem(
                  selectedItemsArray.filter(item => selected !== item),
                )
              }
            }}
            name="simple-checkboxes[]"
            checked={selectedItemsArray.includes(elem.id)}
            className="itemMultiPick_checkboxes"
            uncheckedCheckboxIcon={<FontIcon>radio_button_unchecked</FontIcon>}
            checkedCheckboxIcon={<FontIcon primary>check_circle</FontIcon>}
          />
        </div>
      )
    })
  }
  renderItemsSinglePick = () => {
    const { items, onClickItem } = this.props
    const { search } = this.state
    let filteredData = search
      ? items.filter(item =>
        item.label.toLowerCase().includes(search.toLowerCase()),
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
              this.setState({ listVisible: false })
              onClickItem([elem.id])
            }}
          >
            <div className="list_wrapper_list_items_image">
              <Avatar src={elem.img ? getPublicUrl(elem.img) : avatarCompany} />
            </div>
            <div className="list_wrapper_list_items_label">{elem.label}</div>
          </div>
        )
      })
    )
  }
  render () {
    const {
      onClickAdd,
      label,
      singlePick,
      multiplePick,
      textFieldClassName,
      className,
      buttonLabel,
      onTextChange,
    } = this.props
    const { listVisible, search } = this.state
    return (
      <div className={`list_wrapper ${className || ''}`}>
        <TextField
          // id="floating-center-title"
          onClick={() => this.setState({ listVisible: true })}
          lineDirection="center"
          placeholder={label}
          autoComplete="off"
          className={`list_wrapper_textField ${textFieldClassName || ''}`}
          value={
            search
            // singlePick && selectedCompany && selectedCompany.label
            //   ? selectedCompany.label
            //   : search
          }
          inlineIndicator={
            <FontIcon>
              {listVisible ? 'arrow_drop_up' : 'arrow_drop_down'}
            </FontIcon>
          }
          onChange={val => {
            this.setState({
              search: val,
              listVisible: true,
            })
            if (onTextChange) {
              onTextChange(val)
            }
          }}
          block
        />
        {listVisible && (
          <div className="list_wrapper_list  md-paper--1">
            {onClickAdd && buttonLabel && (
              <div className="list_wrapper_list_addSection">
                <Button
                  flat
                  primary
                  onClick={onClickAdd}
                  iconChildren="add_circle_outline"
                >
                  {buttonLabel}
                </Button>
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
