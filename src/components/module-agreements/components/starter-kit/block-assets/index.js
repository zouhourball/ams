import React from 'react'
import { Button } from 'react-md'
import AssetsSvg from 'images/starter-kit/assets.svg'
import './style.scss'

export default function StarterAssets ({ onClickAssets }) {
  return (
    <div className="starter-kit-assets-container">
      <div className="starter-kit-assets-inner">
        <img className="starter-kit-assets-logo" src={AssetsSvg} />
        <h2 className="starter-kit-assets-title">Assets</h2>
        <p className="starter-kit-assets-desp">Meera Assets Management App</p>
        <Button className="starter-kit-assets-new" onClick={onClickAssets}>
          <i className="mdi mdi-cloud-upload starter-kit-assets-icon" />
          Upload Assets Files
        </Button>
      </div>
    </div>
  )
}
