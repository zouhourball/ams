import './style.scss'
import { navigate } from '@reach/router'
import { Button } from 'react-md'

const NavBar = ({
  tabsList,
  activeTab,
  setActiveTab,
  setIsVisibleTopBar,
  hidePrimaryTopBar,
  onSelectRows,
  actions,
}) => {
  return (
    <div className="navBar">
      <div className="navBar-list">
        {tabsList && typeof tabsList[0] === 'string'
          ? tabsList.map((el, index) => {
            const id = `nav-bar-${index}`
            return (
              <div
                key={id}
                className={`navBar-list-title ${
                  activeTab === index ? 'active' : ''
                }`}
                onClick={() => {
                  setActiveTab && setActiveTab(index)
                  onSelectRows && onSelectRows([])
                }}
              >
                {el}
              </div>
            )
          })
          : tabsList.map((el, index) => {
            const id = `nav-bar-${index}`
            return (
              <div
                key={id}
                className={`navBar-list-title ${
                  activeTab === el.key ? 'active' : ''
                }`}
                onClick={() => {
                  onSelectRows && onSelectRows([])
                  setActiveTab && setActiveTab(el.key)
                  navigate(el?.linkToNewTab)
                }}
              >
                {el?.label}
              </div>
            )
          })}
      </div>

      <div className="buttons-list">
        {actions &&
          actions?.map((el) => (
            <Button
              key={el?.id}
              id={el?.id}
              className="buttons-list-btn"
              primary
              flat
              onClick={el?.onClick}
              disabled={el?.disabled}
            >
              {el?.label}
            </Button>
          ))}
      </div>
    </div>
  )
}
export default NavBar
NavBar.defaultProps = {
  // subModulesList: ['Permit to Drill', 'Permit to Suspend ', 'Permit to Abandon'],
  // subModulesList: [
  //   {
  //     linkToNewTab: `/ams/hse/flaring/daily`,
  //     label: 'Daily',
  //     key: 'daily',
  //   },
  //   {
  //     linkToNewTab: `/ams/hse/flaring/monthly-station`,
  //     label: 'Monthly station',
  //     key: 'monthly-station',
  //   },
  //   {
  //     linkToNewTab: `/ams/hse/flaring/annual-forecast`,
  //     label: 'Annual forecast',
  //     key: 'annual-forecast',
  //   },
  // ],
  activeTab: 1,
}
