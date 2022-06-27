import React from 'react'
import { Button } from 'react-md'
import cover from 'images/apps/workspace.jpg'
import PropTypes from 'prop-types'

import './styles.scss'

export default function BlockWorkspace (props) {
  const { title, desc, onClick, onCreateClick } = props
  return (
    <section
      className="app-starterkit-blockworkspace-container"
      onClick={onClick}
    >
      <img className="app-starterkit-blockworkspace-cover" src={cover} />
      <h2 className="app-starterkit-blockworkspace-title">{title}</h2>
      <p className="app-starterkit-blockworkspace-desc">{desc}</p>
      <Button
        flat
        primary
        className="app-starterkit-blockworkspace-btncreate"
        onClick={e => {
          e.stopPropagation()
          onCreateClick()
        }}
      >
        Create Your First Workspace
      </Button>
    </section>
  )
}

BlockWorkspace.defaultProps = {
  title: 'Workspace',
  desc: 'Start manage your projects in workspace',
}

BlockWorkspace.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  onClick: PropTypes.func,
  onCreateClick: PropTypes.func,
}
