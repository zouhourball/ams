import React from 'react'
import { Button } from 'react-md'
import RoadSafetySvg from 'images/starter-kit/road_safety.svg'
import './style.scss'

export default function StarterRoadSafety ({ onClickRoadSafety }) {
  return (
    <div className="starter-kit-road-safety-container">
      <div className="starter-kit-road-safety-inner">
        <h2 className="starter-kit-road-safety-title">Road Safety</h2>
        <p className="starter-kit-road-safety-desp">Meera Road Safty App</p>
        <Button
          className="starter-kit-road-safety-launch"
          onClick={onClickRoadSafety}
        >
          Launch Application
        </Button>
        <img className="starter-kit-road-safety-logo" src={RoadSafetySvg} />
      </div>
    </div>
  )
}
