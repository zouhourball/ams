import { Button } from 'react-md'
import ReportSvg from 'images/starter-kit/regulation_reporting.svg'
import './style.scss'

export default function StarterReport ({ onClickReport }) {
  return (
    <div className="starter-kit-report-container">
      <div className="starter-kit-report-inner">
        <h2 className="starter-kit-report-title">Regulation & Reporting</h2>
        <Button className="starter-kit-report-new" onClick={onClickReport}>
          Create New Report
        </Button>
        <img className="starter-kit-report-logo" src={ReportSvg} />
      </div>
    </div>
  )
}
