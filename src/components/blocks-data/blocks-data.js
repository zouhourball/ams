import { useState } from 'react'
import { Button, TextField } from 'react-md'

import ConfiguratorCard from 'components/configurator-card'

import icon from 'images/block-icon.png'

import './style.scss'

const BlocksData = ({
  blocks,
  onAdd,
  status,
  onDeleteBlock,
  onUpdateBlock,
}) => {
  const [currentItem, setCurrentItem] = useState(blocks[0]?.id)
  const [blockTitle, setBlockTitle] = useState('')

  const renderHeader = () => {
    return (
      <div className="blocks-data-header">
        <TextField
          id="search"
          lineDirection="center"
          block
          placeholder="Type here to add company"
          className="blocks-data-header-textField"
          value={blockTitle}
          onChange={(v) => setBlockTitle(v)}
          // disabled={status === 'closed'}
        />

        <Button
          primary
          icon
          className="blocks-data-header-btn"
          onClick={() => {
            onAdd(blockTitle)
            setBlockTitle('')
          }}
          disabled={!blockTitle || !status}
        >
          add
        </Button>
      </div>
    )
  }

  const renderCompanies = () => {
    return blocks && blocks?.length > 0 ? (
      blocks.map((comp, index) => (
        <ConfiguratorCard
          key={index}
          id={comp?.id}
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
          title={comp?.block}
          onDelete={onDeleteBlock}
          onEdit={onUpdateBlock}
        />
      ))
    ) : (
      <div className="empty-block">
        <img src={icon} />
        Select company to add blocks
      </div>
    )
  }
  return (
    <div className="blocks-data">
      {renderHeader()}
      {renderCompanies()}
    </div>
  )
}
export default BlocksData

BlocksData.defaultProps = {
  blocks: [
    // {
    //   id: '1',
    //   title: 'Block A',
    // },
    // {
    //   id: '2',
    //   title: 'Block B',
    // },
    // {
    //   id: '3',
    //   title: 'Block C',
    // },
  ],
}
