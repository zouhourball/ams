import { Component } from 'react'
import { cls } from 'reactutils'
import { FontIcon } from 'react-md'

import FileUpload from '../../components/file-upload'
import ReportCard from './report-card'
import uploadIcon from 'images/upload.svg'

import './style.scss'
export default class ReportsList extends Component {
  renderReportsList = () => {
    const {
      reportsList,
      canAddLink,
      onClickReport,
      onDownloadReport,
      onShowDialog,
      templateId,
    } = this.props
    return (
      reportsList &&
      reportsList.map((file, index) => (
        <ReportCard
          file={file}
          key={index}
          addFile={canAddLink}
          onClick={onClickReport}
          onDownload={onDownloadReport}
          onAddFile={onShowDialog}
          selected={templateId === file.id}
        />
      ))
    )
  }
  render () {
    const { className, reportsList, canAddTemplate, onUpload } = this.props
    return (
      <div className={cls('reportsList', className)}>
        <header className="reportsList-header">
          <FontIcon
            icon
            iconClassName="mdi mdi-checkbox-multiple-marked-outline"
            className="reportsList-header-icon"
          />
          <h4>Reports {`(${(reportsList && reportsList.length) || 0})`}</h4>
        </header>
        {canAddTemplate && (
          <div className="reportsList-upload">
            <div className="reportsList-upload-label">
              <img src={uploadIcon} className="doc-upload" />
              <h4>Documents</h4>
            </div>
            <FileUpload onUpload={onUpload} />
          </div>
        )}
        <div className="reportsList-list">{this.renderReportsList()}</div>
      </div>
    )
  }
}
