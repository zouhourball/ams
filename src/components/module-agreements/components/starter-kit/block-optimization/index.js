import React from 'react'
import { Button } from 'react-md'
import OptimizationSvg from 'images/starter-kit/optimization.svg'
import './style.scss'

export default function StarterOptimization ({ onClickOptimization }) {
  return (
    <div className="starter-kit-optimization-container">
      <div className="starter-kit-optimization-inner">
        <img className="starter-kit-optimization-logo" src={OptimizationSvg} />
        <h2 className="starter-kit-optimization-title">Optimization</h2>
        <p className="starter-kit-optimization-desp">Meera Optimization App</p>
        <Button
          className="starter-kit-optimization-new"
          onClick={onClickOptimization}
        >
          Optimize Now
        </Button>
      </div>
    </div>
  )
}
