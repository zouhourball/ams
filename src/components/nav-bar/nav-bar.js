import './style.scss'
import { navigate } from '@reach/router'

const NavBar = ({ tabsList, activeTab, setActiveTab, onSelectRows }) => {
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
                  onSelectRows([])
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
                  onSelectRows([])
                  setActiveTab && setActiveTab(el.key)
                  navigate(el?.linkToNewTab)
                }}
              >
                {el?.label}
              </div>
            )
          })}
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
