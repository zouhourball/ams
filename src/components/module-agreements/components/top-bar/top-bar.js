import { Component } from 'react'
import { cls } from 'reactutils'
import { Button } from 'react-md'
import { navigate } from '@reach/router'
import EamTopBar from '@target-energysolutions/eam-top-bar'

import agreementManager from 'components/module-agreements/images/topBar/agreement-Manager.svg'
// import Visualiser from 'images/topBar/Visualiser.svg'
// import positionIcon from 'images/positionIcon.svg'
// import { modules } from 'libs/consts'

import { withTranslationEx } from 'libs/langs'
import './style.scss'

@withTranslationEx
export default class TopBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      source: 'Position',
      textSearch: '',
    }
  }

  static getDerivedStateFromProps (props) {
    const { location } = props
    if (location && location.pathname) {
      const sub = location.pathname.lastIndexOf('/')
      return {
        moduleName: location.pathname.substring(
          sub + 1,
          location.pathname.length,
        ),
      }
    } else {
      return { moduleName: 'wellSequenceOptimisation' }
    }
  }

  // handleClick = () => {
  //   const { pathWord, history } = this.props
  //   switch (pathWord) {
  //     case 'positions':
  //       history.push('/cadre/positions/new')
  //       this.setState({ textSearch: '' })
  //       break
  //   }
  // }

  // renderLabelActionButton = () => {
  //   const { source } = this.state
  //   let topBarActionButton = {}
  //   switch (source) {
  //     case 'Position':
  //       topBarActionButton = {
  //         label: 'Create New Position',
  //       }
  //       break
  //   }
  //   return topBarActionButton
  // }
  // onSearch = textSearch => {
  //   this.setState({ textSearch })
  // }

  // renderIcon = () => {
  //   const { source } = this.state
  //   let dropDownIcon = ''
  //   switch (source) {
  //     case 'Position':
  //       dropDownIcon = positionIcon
  //       break
  //   }
  //   return dropDownIcon
  // }

  // JobsList = () =>
  //   modules
  //     .flatMap(({ submodules }) => submodules)
  //     .map(({ label, key, path }) => ({
  //       label: (
  //         <Button
  //           flat
  //           className="top-bar_button"
  //           iconEl={<img src={wellIcon} width="18px" height="18px" />}
  //         >
  //           {label}
  //         </Button>
  //       ),
  //       value: key,
  //       path,
  //     }))
  /* renderMenus = () => {
    return [
      {
        label: 'Pool Viewer',
      },
    ]
  } */

  render () {
    const {
      view,
      onSwitchView,
      withSwitch,

      subSection,
      subSectionLabel,
      actionButtons,
      t,
    } = this.props

    // const { label } = this.renderLabelActionButton()

    // const subSection = [
    //   <ListItem
    //     key={1}
    //     primaryText={'Position'}
    //     leftIcon={<img src={positionIcon} width="18px" />}
    //     onClick={() => {
    //       // onChangeSource('Position')
    //       this.setState({
    //         dropDownLabel: 'Position',
    //         dropDownSubLabel: '',
    //       })
    //     }}
    //   />,
    // ]

    return (
      // <div className="top-bar">
      <EamTopBar
        currentModule={
          <div className="title">
            <img src={agreementManager} width="18px" />
            {t('agree_manager')}
          </div>
        }
        subModules={subSection || []}
        currentSubModule={subSectionLabel}
        primaryActions={actionButtons}
        secondaryActions={
          <>
            <div className="top-bar_viewSwitch">
              {withSwitch && (
                <>
                  <Button
                    icon
                    className={cls(
                      'infoIcon',
                      view === 'card' ? 'selected' : '',
                    )}
                    iconClassName="mdi mdi-view-grid"
                    onClick={() => onSwitchView('card')}
                  />
                  <Button
                    icon
                    className={cls(
                      'infoIcon',
                      view === 'grid' ? 'selected' : '',
                    )}
                    iconClassName="mdi mdi-grid"
                    onClick={() => onSwitchView('grid')}
                  />
                </>
              )}
            </div>
            <Button
              className="top-bar_close-btn"
              icon
              onClick={() => {
                navigate(`${PRODUCT_WORKSPACE_URL}`, { replace: true })
                window.close()
              }}
            >
              exit_to_app
            </Button>
          </>
        }
      />
      // <div className="top-bar_subSection">
      //   <div className="top-bar_selectFieldWrapper">
      //     <SelectField
      //       id="selectFieldWrapper"
      //       menuItems={studioList}
      //       className="top-bar_selectField"
      //       position={SelectField.Positions.BELOW}
      //       defaultValue="Agreement Manager"
      //     />
      //   </div>
      //   {subSection && (
      //     <DropdownMenu
      //       id="dropDown"
      //       menuItems={subSection}
      //       className="top-bar-select-section"
      //       cascading
      //       anchor={{
      //         x: DropdownMenu.HorizontalAnchors.CENTER,
      //         y: DropdownMenu.VerticalAnchors.OVERLAP,
      //       }}
      //       position={DropdownMenu.Positions.BELOW}
      //       sameWidth
      //     >
      //       <AccessibleFakeButton
      //         className="section-fake-button"
      //         component={IconSeparator}
      //         iconBefore
      //         label={
      //           <IconSeparator
      //             label={subSectionLabel && subSectionLabel.label}
      //           >
      //             <FontIcon>arrow_drop_down</FontIcon>
      //           </IconSeparator>
      //         }
      //       >
      //         {subSectionLabel.leftIcon}
      //       </AccessibleFakeButton>
      //     </DropdownMenu>
      //   )}
      // </div>
      // // <div className="searchFieldWrapper">
      // //   <TextField
      // //     className="top-bar_searchField"
      // //     rightIcon={<FontIcon>search</FontIcon>}
      // //     value={textSearch}
      // //     onChange={this.onSearch}
      // //     block
      // //   />
      // // </div>
      // <div className="top-bar_subSection">
      //   <div id="top-bar_filter-btn" className="top-bar_filter-btn">
      //     // <Button
      //     //   className="filter-btn"
      //     //   icon
      //     //   onClick={() => {
      //     //     onClickFilter()
      //     //   }}
      //     // >
      //     //   tune
      //     // </Button>
      //     <Button
      //       className="top-bar_close-btn"
      //       flat
      //       onClick={() => {
      //         navigate(`${PRODUCT_WORKSPACE_URL}`, { replace: true })
      //         window.close()
      //       }}
      //     >
      //       {t('exit')}
      //     </Button>
      //   </div>
      //   <div className="top-bar_viewSwitch">
      //     {withSwitch && (
      //       <>
      //         <Button
      //           icon
      //           className={cls('infoIcon', view === 'card' ? 'selected' : '')}
      //           iconClassName="mdi mdi-view-grid"
      //           onClick={() => onSwitchView('card')}
      //         />
      //         <Button
      //           icon
      //           className={cls('infoIcon', view === 'grid' ? 'selected' : '')}
      //           iconClassName="mdi mdi-grid"
      //           onClick={() => onSwitchView('grid')}
      //         />
      //       </>
      //     )}
      //   </div>
      //   //  <Button
      //   //   flat
      //   //   primary
      //   //   swapTheming
      //   //   className="position-btn"
      //   //   iconEl={
      //   //     <img src={recruitmentWhiteIcon} width="16px" height="14px" />
      //   //   }
      //   //   onClick={() => this.handleClick()}
      //   // >
      //   //   {label}
      //   // </Button>
      // </div>

    // </div>
    )
  }
}
