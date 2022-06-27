import React, { Component } from 'react'
import { TextField, Avatar, FontIcon } from 'react-md'
import onClickOutside from 'react-onclickoutside'
import PropTypes from 'prop-types'

import avatar from 'images/avatar.png'
import { getPublicUrl } from 'libs/utils/custom-function'

import './styles.scss'

@onClickOutside
export default class CustomSelectField extends Component {
  constructor (props) {
    super(props)
    this.state = {
      listVisible: false,
      search: '',
      selectedItem: null,
      selectedItemsArray: [],
      currentSection:
        props.sections && props.sections.length > 0
          ? props.sections[0].key
          : null,
    }
    this.myRef = React.createRef()
    this.listRef = React.createRef()
  }

  handleClickOutside = () => {
    const { search } = this.state
    const { onTextChange, setListVisibility } = this.props

    setListVisibility
      ? setListVisibility(false)
      : this.setState({ listVisible: false })
    if (search !== '') {
      this.setState({
        search: '',
      })
      if (onTextChange) {
        onTextChange('')
      }
    }
  }

  renderItems = () => {
    const {
      items,
      selectedItemsArray,
      onClickItem,
      singleSelect,
      hideAvatar,
      hideSecondaryLabel,
      setListVisibility,
    } = this.props

    const { search, currentSection } = this.state

    let filteredData = items

    filteredData = currentSection
      ? filteredData.filter(item => item.type === currentSection)
      : filteredData

    filteredData = search
      ? filteredData.filter(item =>
        item.label.toLowerCase().includes(search.toLowerCase()),
      )
      : filteredData
    filteredData = singleSelect
      ? filteredData.filter(
        item => !selectedItemsArray.find(({ id }) => item.id === id),
      )
      : filteredData
    // if (selectedItemsArray.length > 0) {
    //   filteredData = filteredData.filter(item2 => selectedItemsArray.includes(item2.id))
    // }
    return filteredData.map(elem => {
      return (
        <div
          key={elem.id}
          className="itemMultiPick"
          onClick={() => {
            if (!singleSelect) {
              const selected = selectedItemsArray.find(
                item => item.id === elem.id,
              )
              if (selected) {
                onClickItem(
                  selectedItemsArray.filter(item => selected.id !== item.id),
                )
              } else {
                onClickItem([...selectedItemsArray, elem])
              }
            } else {
              onClickItem([elem])
              setListVisibility
                ? setListVisibility(false)
                : this.setState({ listVisible: false })
            }
          }}
        >
          {!singleSelect && (
            <FontIcon
              primary={selectedItemsArray.find(item => item.id === elem.id)}
            >
              {selectedItemsArray.find(item => item.id === elem.id)
                ? 'check_box'
                : 'check_box_outline_blank'}
            </FontIcon>
          )}
          {!hideAvatar && (
            <div className="customSelect_wrapper_list_items_image">
              <Avatar src={elem.img ? getPublicUrl(elem.img) : avatar} />
            </div>
          )}
          <div>
            <div className="customSelect_wrapper_list_items_label">
              {elem.label}
            </div>
            {!hideSecondaryLabel && (
              <div className="customSelect_wrapper_list_items_position">
                {elem.secondaryLabel}
              </div>
            )}
          </div>
        </div>
      )
    })
  }

  renderSelectAllButton = () => {
    const { selectedItemsArray, items, onClickItem } = this.props
    const isAllSelected =
      selectedItemsArray.filter(({ id }) => items.find(item => item.id === id))
        .length === items.length
    return (
      <div
        key={-1}
        className="itemMultiPick"
        onClick={() => {
          if (isAllSelected) {
            onClickItem([])
          } else {
            onClickItem([
              ...selectedItemsArray,
              ...items.filter(
                ({ id }) => !selectedItemsArray.find(item => item.id === id),
              ),
            ])
          }
        }}
      >
        <FontIcon primary={isAllSelected}>
          {isAllSelected ? 'check_box' : 'check_box_outline_blank'}
        </FontIcon>
        <div>
          <div className="customSelect_wrapper_list_items_label">
            {isAllSelected ? 'Unselect All' : 'Select All'}
          </div>
        </div>
      </div>
    )
  }

  render () {
    const {
      searchPlaceholder,
      textFieldClassName,
      className,
      onTextChange,
      fetchMore,
      listInvoker,
      listVisibility,
      hideSearch,
      singleSelect,
      selectAllButton,
      loading,
      sections,
      showListOnTop,
      showListOnLeft,
    } = this.props
    const { listVisible, search, currentSection } = this.state

    const style = Object.assign(
      {},
      showListOnTop ? { bottom: '100%' } : { top: '100%' },
      showListOnLeft ? { right: '100%' } : { right: '0%' },
    )

    return (
      <div className={`customSelect_wrapper ${className || ''}`}>
        {listInvoker &&
          listInvoker(listVisible, visibility =>
            this.setState({ listVisible: visibility }),
          )}
        {(listVisibility || listVisible) && (
          <div
            ref={this.listRef}
            className="customSelect_wrapper_list md-paper--1"
            style={style}
          >
            <div
              className="customSelect_wrapper_list_items"
              ref={this.myRef}
              onScroll={() => {
                if (
                  this.myRef.current.clientHeight !==
                    this.myRef.current.scrollTop &&
                  this.myRef.current.scrollHeight -
                    this.myRef.current.scrollTop ===
                    this.myRef.current.clientHeight &&
                  fetchMore
                ) {
                  fetchMore()
                }
              }}
            >
              {!hideSearch && (
                <TextField
                  placeholder={searchPlaceholder}
                  className={`customSelect_wrapper_textField ${textFieldClassName ||
                    ''}`}
                  value={search}
                  autoComplete="off"
                  leftIcon={<FontIcon>search</FontIcon>}
                  onChange={val => {
                    this.setState({ search: val })
                    if (onTextChange) {
                      onTextChange(val)
                    }
                  }}
                  block
                />
              )}
              {selectAllButton &&
                hideSearch &&
                !singleSelect &&
                this.renderSelectAllButton()}
              {sections && sections.length > 0 && (
                <div className="customSelect_wrapper_tabs">
                  {sections.map(section => (
                    <div
                      className={`customSelect_wrapper_tabs_tab ${
                        section.key === currentSection ? 'selected' : ''
                      }`}
                      key={section.key}
                      onClick={() =>
                        section.key !== currentSection
                          ? this.setState({ currentSection: section.key })
                          : null
                      }
                    >
                      {section.label}
                    </div>
                  ))}
                </div>
              )}
              {(sections &&
                sections.find(({ key }) => key === currentSection) &&
                sections.find(({ key }) => key === currentSection).loading) ||
              loading ? (
                  <FontIcon primary iconClassName="mdi mdi-spin mdi-loading" />
                ) : (
                  this.renderItems()
                )}
            </div>
          </div>
        )}
      </div>
    )
  }
}

CustomSelectField.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      img: PropTypes.string,
      secondaryLabel: PropTypes.string,
    }),
  ).isRequired,
  selectedItemsArray: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string,
      type: PropTypes.string,
      img: PropTypes.string,
      secondaryLabel: PropTypes.string,
    }),
  ).isRequired,
  onClickItem: PropTypes.func.isRequired,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
      loading: PropTypes.bool,
    }),
  ),
  singleSelect: PropTypes.bool,
  hideAvatar: PropTypes.bool,
  hideSecondaryLabel: PropTypes.bool,
  textFieldClassName: PropTypes.string,
  className: PropTypes.string,
  fetchMore: PropTypes.func,
  listInvoker: PropTypes.func,
  setListVisibility: PropTypes.func,
  listVisibility: PropTypes.bool,
  hideSearch: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  onTextChange: PropTypes.func,
  selectAllButton: PropTypes.bool,
  loading: PropTypes.bool,
  showListOnTop: PropTypes.bool,
  showListOnLeft: PropTypes.bool,
}
