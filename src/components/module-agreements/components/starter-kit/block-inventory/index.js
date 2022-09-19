import { Button } from 'react-md'
import InventorySvg from 'images/starter-kit/inventory.svg'
import './style.scss'

export default function StarterInventory ({ onClickInventory }) {
  return (
    <div className="starter-kit-inventory-container">
      <div className="starter-kit-inventory-inner">
        <img className="starter-kit-inventory-logo" src={InventorySvg} />
        <div className="starter-kit-inventory-left">
          <h2 className="starter-kit-inventory-title">Inventory</h2>
          <Button
            className="starter-kit-inventory-new"
            onClick={onClickInventory}
          >
            Manage Now
            <i className="mdi mdi-arrow-right starter-kit-inventory-icon" />
          </Button>
        </div>
      </div>
    </div>
  )
}
