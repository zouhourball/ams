import { Component } from 'react'
import {
  Button,
  FontIcon,
  DropdownMenu,
  AccessibleFakeButton,
  IconSeparator,
} from 'react-md'

import annualimg from './images/annualPlan.svg'
import submissionimg from './images/businessSubmission.svg'
import processimg from './images/businessProcess.svg'
import vendorimg from './images/vendorDevelopment.svg'
import performanceimg from './images/performanceReport.svg'
import comparisonimg from './images/annualComparison.svg'
import reportsIcon from 'images/report-icon.svg'
import { withTranslationEx } from 'libs/langs'

import './style.scss'

@withTranslationEx
export default class SubMenu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dropDownLabel: props.source,
    }
  }

  renderFilterButton = () => {
    const { handleShowFilter } = this.props

    return (
      <>
        <div
          id="application-filter-button"
          className="application-filter-button"
        >
          <Button
            icon
            iconClassName="mdi mdi-tune"
            className="filter-button"
            onClick={handleShowFilter}
          />
        </div>
        {this.filterApplicationButton()}
      </>
    )
  }

  renderTemplateMenu = () => {
    const { handelOnClickItem, t } = this.props
    let templateMenu = [
      {
        primaryText: t('addNewSection'),
        onClick: () => handelOnClickItem('add_new_section'),
      },
      {
        primaryText: t('selectFromTemplates'),
        onClick: () => handelOnClickItem('select_from_template'),
      },
      {
        primaryText: t('createCustom'),
        onClick: () => handelOnClickItem('create_custom'),
      },
    ]

    return templateMenu
  }
  renderApplicationMenu = () => {
    const { handelOnClickItem, t } = this.props
    let applicationMenu = [
      {
        primaryText: t('permit_a'),
        onClick: () => handelOnClickItem('new_application', 'permit_A'),
      },
      {
        primaryText: t('permit_b'),
        onClick: () => handelOnClickItem('new_application', 'permit_B'),
      },
      {
        primaryText: t('RealEstateDevelopmentApp'),
        onClick: () =>
          handelOnClickItem('new_application', 'real_estate_development_app'),
      },
      {
        primaryText: t('permit_c'),
        onClick: () => handelOnClickItem('new_application', 'permit_C'),
      },
    ]

    return applicationMenu
  }
  renderLabelActionButton = () => {
    const { source } = this.props

    // const applicationMenuList = this.renderApplicationMenu()
    // const renderTemplateMenu = this.renderTemplateMenu()

    let topBarActionButton = null
    switch (source) {
      case 'fbp':
        topBarActionButton = {
          label: 'Function Business Process',
          icon: processimg,
          // actionList: { applicationMenuList },
        }
        break
      case 'bs':
        topBarActionButton = {
          label: 'Business Submission',
          icon: submissionimg,
          // actionList: { applicationMenuList },
        }
        break
      case 'vd':
        topBarActionButton = {
          label: 'Vendor Development',
          icon: vendorimg,
          // actionList: { applicationMenuList },
        }
        break
      case 'rp':
        topBarActionButton = {
          label: 'Reports',
          icon: reportsIcon,
          // actionList: { applicationMenuList },
        }
        break
    }
    return topBarActionButton
  }

  renderDropDownLabel = () => {
    const { source } = this.props
    // const { dropDownLabel, dropDownSubLabel } = this.state
    let label = ''
    // if (dropDownSubLabel) {
    //   label = (
    //     <>
    //       {dropDownLabel} <span className="fake-button-sep">&gt;</span>{' '}
    //       {dropDownSubLabel}
    //     </>
    //   )
    // } else {
    //   label = dropDownLabel
    // }
    switch (source) {
      case 'fbp':
        label = 'Function Business Process'
        break
      case 'bs':
        label = 'Business Submission'
        break
      case 'vd':
        label = 'Vendor Development'
        break
      case 'rp':
        label = 'Reports'
        break
    }
    return label
  }

  renderSecondDropDownLabel = () => {
    const { subSource } = this.props
    // const { dropDownLabel, dropDownSubLabel } = this.state
    let label = ''
    // if (dropDownSubLabel) {
    //   label = (
    //     <>
    //       {dropDownLabel} <span className="fake-button-sep">&gt;</span>{' '}
    //       {dropDownSubLabel}
    //     </>
    //   )
    // } else {
    //   label = dropDownLabel
    // }
    switch (subSource) {
      case 'plan':
        label = 'Annual Plan'
        break
      case 'report':
        label = 'Actual Performance Report'
        break
      case 'comparison':
        label = 'Annual Comparison'
        break
    }
    return label
  }

  renderButtonApplicationMenu = () => {
    const { topBarButtons } = this.props
    let menuButton = topBarButtons || {}

    return menuButton
  }
  renderButtons = () => {
    const { actions } = this.renderButtonApplicationMenu()
    const actionsData = actions || []
    return actionsData.map((elem, index) => {
      if (elem.isVisible) {
        return (
          <Button
            key={index}
            flat
            primary
            swapTheming={elem.swapTheming && elem.active}
            onClick={() => elem.action()}
            className="details-top-bar_actions-button"
            disabled={!elem.active}
          >
            {elem.label}
          </Button>
        )
      }
    })
  }
  renderSwitchButton = () => {
    const { source } = this.props
    let newTemplateButton = null
    switch (source) {
      case 'new':
        newTemplateButton = this.renderButtons()

        break
      case 'edit':
        newTemplateButton = this.renderButtons()

        break
    }
    return newTemplateButton
  }
  renderSwitchCase = () => {
    const { source } = this.props
    let menuButton = null
    switch (source) {
      case 'fbp':
        menuButton = this.renderDropDownForMenu()
        break
      case 'bs':
        menuButton = this.renderDropDownForMenu()
        break
    }
    return menuButton
  }
  renderMenuButton = () => {
    const { mainButton } = this.props
    const { label, action } = mainButton
    return (
      <Button
        className="menu-btn"
        flat
        primary
        swapTheming
        onClick={() => action()}
        iconChildren="add_circle"
      >
        {label}
      </Button>
    )
  }
  renderDropDownForMenu = () => {
    const { mainButton } = this.props
    if (mainButton) {
      const { label, icon, actionList, fontIcon } = mainButton
      return (
        <DropdownMenu
          id="dropDown"
          menuItems={actionList || []}
          className="top-bar_addWorkflow"
          anchor={{
            x: DropdownMenu.HorizontalAnchors.CENTER,
            y: DropdownMenu.VerticalAnchors.OVERLAP,
          }}
          position={DropdownMenu.Positions.BELOW}
          sameWidth
        >
          <AccessibleFakeButton
            className="fakeButton"
            component={IconSeparator}
            iconBefore
            label={
              <IconSeparator label={label}>
                <FontIcon>arrow_drop_down</FontIcon>
              </IconSeparator>
            }
          >
            {icon && <img src={icon} width="18px" />}
            {fontIcon && <FontIcon>{fontIcon}</FontIcon>}
          </AccessibleFakeButton>
        </DropdownMenu>
      )
    } else return null
  }
  // clickNewTemplate = () => {
  //   const { history } = this.props
  //   history.push('/new')
  // }

  handleViewStream = () => {
    const { viewStream } = this.props
    viewStream()
  }
  handleShowFilter = () => {
    const { showFilter } = this.props
    showFilter()
  }
  filterApplicationButton = () => {
    const { view } = this.props
    return (
      <div className="application-menu-button">
        <Button
          className={`application-button ${view === 'card' ? 'selected' : ''}`}
          icon
          onClick={() => this.handleViewStream()}
        >
          <i className="material-icons">view_stream</i>
        </Button>
        <Button
          className={`application-button ${
            view === 'location' ? 'selected' : ''
          }`}
          icon
          onClick={() => this.handleLocation()}
        >
          <i className="material-icons">location_on</i>
        </Button>
      </div>
    )
  }
  handleLocation = () => {
    const { showLocation } = this.props
    showLocation()
  }
  renderDropDownItems = () => {
    const { onChangeSource } = this.props

    return [
      {
        primaryText: 'Function Business Process',
        leftIcon: <img src={processimg} width="18px" />,
        onClick: () => {
          onChangeSource('fbp')
          this.setState({
            dropDownLabel: 'Function Business Process',
          })
        },
      },
      {
        primaryText: 'Business Submission',
        leftIcon: <img src={submissionimg} width="18px" />,
        onClick: () => {
          onChangeSource('bs')
          this.setState({
            dropDownLabel: 'Business Submission',
          })
        },
      },
      {
        primaryText: 'Vendor Development',
        leftIcon: <img src={vendorimg} width="18px" />,
        onClick: () => {
          onChangeSource('vd')
          this.setState({
            dropDownLabel: 'Vendor Development',
          })
        },
      },
      {
        primaryText: 'Reports',
        leftIcon: <img src={reportsIcon} width="20px" />,
        onClick: () => {
          onChangeSource('rp')
          this.setState({
            dropDownLabel: 'Reports',
          })
        },
      },
    ]
  }

  renderSecondDropDownItems = () => {
    const { onChangeSubSource } = this.props

    return [
      {
        primaryText: 'Annual Plan',
        leftIcon: <img src={annualimg} width="18px" />,
        onClick: () => {
          onChangeSubSource('plan')
          this.setState({
            secondDropDownLabel: 'Annual Plan',
          })
        },
      },
      {
        primaryText: 'Actual Performance Report',
        leftIcon: <img src={performanceimg} width="18px" />,
        onClick: () => {
          onChangeSubSource('report')
          this.setState({
            secondDropDownLabel: 'Actual Performance Report',
          })
        },
      },
      {
        primaryText: 'Annual Comparison',
        leftIcon: <img src={comparisonimg} width="18px" />,
        onClick: () => {
          onChangeSubSource('comparison')
          this.setState({
            secondDropDownLabel: 'Annual Comparison',
          })
        },
      },
    ]
  }

  renderDropDownIcons = () => {
    const { source } = this.props
    switch (source) {
      case 'fbp':
        return processimg

      case 'bs':
        return submissionimg

      case 'vd':
        return vendorimg
      case 'rp':
        return reportsIcon
    }
  }

  renderSecondDropDownIcons = () => {
    const { subSource } = this.props
    switch (subSource) {
      case 'plan':
        return annualimg

      case 'report':
        return performanceimg

      case 'comparison':
        return comparisonimg
    }
  }

  render () {
    const { withFilter, withSubDropDown } = this.props
    // const { dropDownLabel } = this.state
    //   const { label, icon, actionList } = this.renderLabelActionButton()

    // const Template = [
    //   <ListItem
    //     key={1}
    //     primaryText={'template'}
    //     leftIcon={<img src={''} width="18px" />}
    //     onClick={() => {
    //       onChangeSource('template')
    //       this.setState({
    //         dropDownLabel: 'Template',
    //       })
    //     }}
    //   />,
    //   <ListItem
    //     key={2}
    //     primaryText="application"
    //     leftIcon={<img src={''} width="18px" />}
    //     onClick={() => {
    //       onChangeSource('application')
    //       this.setState({
    //         dropDownLabel: 'Application',
    //       })
    //     }}
    //   />,
    // ]
    return (
      <div className="top-bar">
        <div className="top-bar_subSection">
          <DropdownMenu
            id="dropDown"
            menuItems={this.renderDropDownItems()}
            className="top-bar-select-section"
            cascading
            anchor={{
              x: DropdownMenu.HorizontalAnchors.CENTER,
              y: DropdownMenu.VerticalAnchors.OVERLAP,
            }}
            position={DropdownMenu.Positions.BELOW}
            sameWidth
          >
            <AccessibleFakeButton
              className="section-fake-button"
              component={IconSeparator}
              iconBefore
              label={
                <IconSeparator label={this.renderDropDownLabel()}>
                  <FontIcon>arrow_drop_down</FontIcon>
                </IconSeparator>
              }
            >
              <img src={this.renderDropDownIcons()} width="18px" />
            </AccessibleFakeButton>
          </DropdownMenu>
        </div>
        {withSubDropDown && (
          <div className="top-bar_subSection">
            <DropdownMenu
              id="dropDown"
              menuItems={this.renderSecondDropDownItems()}
              className="top-bar-select-section"
              cascading
              anchor={{
                x: DropdownMenu.HorizontalAnchors.CENTER,
                y: DropdownMenu.VerticalAnchors.OVERLAP,
              }}
              position={DropdownMenu.Positions.BELOW}
              sameWidth
            >
              <AccessibleFakeButton
                className="section-fake-button"
                component={IconSeparator}
                iconBefore
                label={
                  <IconSeparator label={this.renderSecondDropDownLabel()}>
                    <FontIcon>arrow_drop_down</FontIcon>
                  </IconSeparator>
                }
              >
                <img src={this.renderSecondDropDownIcons()} width="18px" />
              </AccessibleFakeButton>
            </DropdownMenu>
          </div>
        )}
        <div className="top-bar_subSection_menu">
          <div className="searchFieldWrapper">
            {this.renderSwitchButton()}
            {withFilter && this.renderFilterButton()}
          </div>
          {this.renderSwitchCase()}
        </div>
      </div>
    )
  }
}
