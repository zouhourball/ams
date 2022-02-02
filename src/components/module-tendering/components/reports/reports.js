import { Component } from 'react'
import { Paper, DialogContainer, Button } from 'react-md'
import { get, isEmpty } from 'lodash-es'
import moment from 'moment'
import { connect } from 'react-redux'

import * as apiR from 'libs/api/api-reports'
import mutate from 'libs/hocs/mutate'

import * as act from 'modules/app/actions'

import DataTable from '@target-energysolutions/data-table'

import SelectBlock from '../../components/select-block'
import ReportsList from '../../components/reports-list'
import ReportsFilePreview from '../../components/reports-file-preview'
import ToastMsg from '../../components/toast-msg'

import { configTable } from './helpers'
import emptyIcon from 'images/empty-icon.svg'
import { withTranslationEx } from 'libs/langs'

import './style.scss'

const category = 'C : Reporting Templates'
const subject = 'MOG-S09-CONTRACTING & PROC'
@mutate({
  moduleName: 'moduleReports',
  mutations: {
    getListTemplates: apiR.getListTemplates,
    addNewTemplate: apiR.addNewTemplate,
    getListOfLinkedReports: apiR.getListOfLinkedReports,
    addLink: apiR.addLink,
    deleteFile: apiR.deleteFile,
  },
})
@connect(
  ({ query }) => ({
    apps: get(query, 'DEFAULT.getInfos.data.apps', []),
  }),
  {
    addToast: act.addToast,
  },
)
@withTranslationEx
export default class Reports extends Component {
  constructor (props) {
    super(props)
    const { apps } = props
    let company = ''
    if (!isEmpty(apps)) {
      const app = apps.find((ap) => ap.appName === 'tendering')
      if (app) {
        company = app.companies[0].name
      }
    }
    this.state = {
      visible: false,
      optionsRow: [],
      showPreviewFile: false,
      block: '',
      file: [],
      templateId: null,
      company,
      linkReportsId: null,
      fileToView: null,
      templateName: '',
      page: 1,
      size: 20,
      visibleDeleteDialogue: false,
    }
  }
  renderTotalCounts = () => {
    const { getListOfLinkedReportsStatus } = this.props
    return get(getListOfLinkedReportsStatus, 'data.total', 0)
  }
  renderTotalPages = () => {
    const { getListOfLinkedReportsStatus } = this.props
    const { size } = this.state
    const totalCount = get(getListOfLinkedReportsStatus, 'data.total', 0)
    return totalCount % size === 0
      ? totalCount / size
      : Math.floor(totalCount / size) + 1
  }
  onSetPage = (p) => {
    const {
      mutations: { getListOfLinkedReports },
    } = this.props
    const { templateId, size } = this.state
    getListOfLinkedReports(
      templateId,
      { textSearch: '', filters: [] },
      p - 1,
      size,
    )
    this.setState({ page: p })
  }
  onSetPerPage = (s) => {
    const {
      mutations: { getListOfLinkedReports },
    } = this.props
    const { templateId } = this.state
    getListOfLinkedReports(templateId, { textSearch: '', filters: [] }, 0, s)
    this.setState({ size: s, page: 1 })
  }

  componentDidMount () {
    const {
      mutations: { getListTemplates },
    } = this.props
    getListTemplates(subject)
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      addNewTemplateStatus,
      addLinkStatus,
      deleteFileStatus,
      mutations: { getListTemplates, getListOfLinkedReports },
    } = this.props
    const { templateId, linkReportsId } = this.state
    if (prevProps.addNewTemplateStatus !== addNewTemplateStatus) {
      if (addNewTemplateStatus && !addNewTemplateStatus.pending) {
        getListTemplates(subject)
      }
    }

    if (prevProps.addLinkStatus !== addLinkStatus) {
      if (
        addLinkStatus &&
        !addLinkStatus.pending &&
        templateId === linkReportsId
      ) {
        getListOfLinkedReports(templateId, { textSearch: '', filters: [] })
      }
    }

    if (prevProps.deleteFileStatus !== deleteFileStatus) {
      if (deleteFileStatus && !deleteFileStatus.pending) {
        getListOfLinkedReports(templateId, { textSearch: '', filters: [] })
      }
    }

    if (templateId && prevState.templateId !== templateId) {
      const { size } = this.state
      getListOfLinkedReports(
        templateId,
        { textSearch: '', filters: [] },
        0,
        size,
      )
    }
  }
  hideDialog = () => {
    this.setState({ visible: false })
  }

  showDialog = (templateId) => {
    this.setState({ visible: true, linkReportsId: templateId })
  }

  showPreview = (row) => {
    this.setState({ showPreviewFile: true, fileToView: { ...row } })
  }

  onDownloadFile = (file) => {
    apiR.fileManagerDownload(file.fileId, file.filename)
  }

  onDelete = (fileId) => {
    this.setState({ visibleDeleteDialogue: true, fileId })
  }

  onRowSelectionChange = (row) => {
    const { t } = this.props
    const dataOption = [
      {
        text: t('delete'),
        icon: 'mdi mdi-close-circle',
        onClick: (row) => this.onDelete(row.id),
      },
      {
        text: 'Preview',
        icon: 'visibility',
        onClick: (row) => this.showPreview(row),
      },
      {
        text: 'Original File',
        icon: 'file_download',
        onClick: (row) => this.onDownloadFile(row),
      },
      // <Button
      //   className="data-table-action-item"
      //   iconClassName="mdi mdi-folder-upload"
      //   key={'buttonArray'}
      //   onClick={() => {}}
      //   flat
      // >
      //   SUPPORTING DOCUMENT
      // </Button>,
    ]

    this.setState({ optionsRow: dataOption })
  }
  // renderActionButtons = rows => {
  //   const { optionsRow } = this.state
  //   if (rows.length === 1) {
  //     return optionsRow
  //   } else {
  //     const showDeleteDialogue = this.showDeleteDialogue
  //     return [
  //       {
  //         text: 'Delete',
  //         icon: 'mdi mdi-close-circle',
  //         onClick() {
  //           showDeleteDialogue(rows, true)
  //         },
  //       },
  //     ]
  //   }
  // }

  onAddTemplate = (files) => {
    const {
      mutations: { addNewTemplate },
    } = this.props
    const body =
      files &&
      files.map((file) => {
        return {
          url: file.url,
          subject,
          category,
          fileId: file.id,
          description: '',
        }
      })
    addNewTemplate(body)
  }

  renderBlocks = () => {
    const { apps } = this.props
    let listBlocks = []
    if (!isEmpty(apps)) {
      const app = apps.find((ap) => ap.appName === 'tendering')
      if (app) {
        const blocks = app.companies[0].blocs
        listBlocks = blocks.map((b) => {
          return b.blocName
        })
      }
    }
    return listBlocks
  }
  onDownloadTemplate = (fileId, fileName) => {
    apiR.fileManagerDownload(fileId, fileName)
  }

  onSelectTemplate = (templateId, templateName) => {
    this.setState({
      templateId,
      templateName: templateName && templateName.split('.')[0],
      page: 1,
    })
  }

  getListOfLink = () => {
    const { getListOfLinkedReportsStatus } = this.props
    const { templateId } = this.state
    let listLink = []
    if (
      templateId &&
      getListOfLinkedReportsStatus &&
      !getListOfLinkedReportsStatus.pending
    ) {
      listLink = get(getListOfLinkedReportsStatus, 'data.data', []).map(
        (link) => {
          return {
            ...link,
            companyName: get(link, 'companies[0]', ''),
            uploadDate: moment(link.uploadDate).format('DD-MM-YYYY'),
            referenceDate: moment(link.referenceDate).format('DD-MM-YYYY'),
          }
        },
      )
    }
    return listLink
  }
  onAddLink = (file, block, selectedDate) => {
    const {
      mutations: { addLink },
    } = this.props
    const { linkReportsId, company } = this.state
    if (linkReportsId) {
      apiR.fileManagerUpload(file).then((res) => {
        if (res.success) {
          const body = {
            url: res.files[0].url,
            fileId: res.files[0].id,
            category,
            subject,
            description: '',
            company,
            block,
            referenceDate: moment(selectedDate).format('YYYY-MM-DD'),
          }
          addLink(linkReportsId, [body])
        }
      })
    }
  }

  renderPermissionAddTemplate = () => {
    const { apps } = this.props
    const accessList = apps.find((ap) => ap.appName === 'Regulation')
    if (accessList) {
      const access = accessList.process.filter(
        (el) =>
          el.workflow === category && el.processName === 'upload new docs',
      )
      return !!access.find((el) => (el.action = 'add'))
    }
  }

  renderPermissionAddLink = () => {
    const { apps } = this.props
    const accessList = apps.find((ap) => ap.appName === 'Regulation')
    if (accessList) {
      const access = accessList.process.filter((el) => el.workflow === category)
      return !!access.find((el) => el.action === 'addLink')
    }
    return false
  }

  hideDeleteDialogue = () => {
    this.setState({ visibleDeleteDialogue: false, fileId: null })
  }

  onConfirmDelete = () => {
    const {
      mutations: { deleteFile },
      addToast,
    } = this.props
    const { fileId } = this.state
    deleteFile(fileId).then((res) => {
      if (res.data[0] && res.data[0].statusCode === 'FORBIDDEN') {
        addToast(
          <ToastMsg
            text={`You dont't have access to delete file`}
            type="info"
          />,
        )
      }
    })
    this.setState({ visibleDeleteDialogue: false, showPreviewFile: false })
  }

  render () {
    const {
      visible,
      showPreviewFile,
      templateId,
      fileToView,
      templateName,
      page,
      size,
      visibleDeleteDialogue,
      optionsRow,
    } = this.state
    const { getListTemplatesStatus, t } = this.props

    const actionsDeleteDialogue = []

    actionsDeleteDialogue.push(
      <Button
        className="button-discard"
        flat
        primary
        onClick={this.hideDeleteDialogue}
      >
        Discard
      </Button>,
    )
    actionsDeleteDialogue.push(
      <Button flat primary swapTheming onClick={this.onConfirmDelete}>
        {t('confirm')}
      </Button>,
    )
    return (
      <div className="reportsContainer">
        {' '}
        <ReportsList
          canAddTemplate={true}
          reportsList={get(getListTemplatesStatus, 'data', [])}
          canAddLink={true}
          // className="md-cell md-cell--3"
          onClickReport={this.onSelectTemplate}
          templateId={templateId}
          onDownloadReport={this.onDownloadTemplate}
          onShowDialog={this.showDialog}
          onUpload={this.onAddTemplate}
        />
        {templateId ? (
          <Paper className="reportsContainer-base-paper">
            <DataTable
              title={templateName}
              withPadding
              useFixedHeader={true}
              // bodyHeight={710}
              columnsConfig={configTable}
              data={this.getListOfLink()}
              showControls
              onRowSelectionChange={this.onRowSelectionChange}
              unselectWhenBlur
              // actionsForMultiSelect={this.renderActionButtons}
              // multiple
              actions={optionsRow}
              paginationProps={{
                page,
                perPage: size,
                totalPages: this.renderTotalPages()
                  ? this.renderTotalPages()
                  : 1,
                perPageOptions: [20, 50, 100, 500, 1000],
                totalCount: this.renderTotalCounts(),
                onSetPage: this.onSetPage,
                onSetPerPage: this.onSetPerPage,
              }}
            />
          </Paper>
        ) : (
          <div className="emptyContent">
            <img src={emptyIcon} className="empty-icon" />
          </div>
        )}
        <SelectBlock
          visible={visible}
          hideDialog={this.hideDialog}
          blockList={this.renderBlocks()}
          getSelectBlockData={this.onAddLink}
        />
        <ReportsFilePreview
          hideDialog={() => this.setState({ showPreviewFile: false })}
          visible={showPreviewFile}
          file={fileToView}
          downloadFile={this.onDownloadTemplate}
          deleteFile={this.onDelete}
        />
        <DialogContainer
          id="delete-dialogue"
          className="deleteFileDialog"
          visible={visibleDeleteDialogue}
          onHide={this.hideDeleteDialogue}
          actions={actionsDeleteDialogue}
          title="Confirm delete link"
          disableScrollLocking={true}
        >
          Are you sure you want to delete this link ?
        </DialogContainer>
      </div>
    )
  }
}
