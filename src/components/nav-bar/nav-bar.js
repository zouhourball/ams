import './style.scss'

const NavBar = ({ tabsList, activeTab, setActiveTab }) => {
  return (
    <div className="navBar">
      <div className="navBar-list">
        {tabsList &&
          tabsList.map((el, index) => {
            const id = index
            return (
              <div
                key={id}
                className={`navBar-list-title ${
                  activeTab === index ? 'active' : ''
                }`}
                onClick={() => setActiveTab && setActiveTab(index)}
              >
                {el}
              </div>
            )
          })}
      </div>
    </div>
  )
}
export default NavBar
NavBar.defaultProps = {
  tabsList: ['Permit to Drill', 'Permit to Suspend ', 'Permit to Abandon'],
  activeTab: 1,
}