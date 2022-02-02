import { PureComponent } from 'react'
import { ExpansionList, ExpansionPanel, Button, FontIcon } from 'react-md'

import './styles.scss'

export default class FilesSidebar extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      selected: [],
    }
  }
  onClickButton = (item, element) => {
    const { onClickButton } = this.props
    if (onClickButton) {
      onClickButton(item, element)
    }
  }
  renderWs = () => {
    const { worksSpaces } = this.props
    return worksSpaces.map((elem, index) => {
      return (
        <ExpansionPanel
          key={index}
          label={elem.name}
          footer={null}
          className="filesSidebar-item"
          expanderIcon={<FontIcon>arrow_drop_down</FontIcon>}
        >
          <Button
            flat
            onClick={() => this.onClickButton('apps', elem)}
            iconClassName="mdi mdi-application"
            className="filesSidebar-button"
          >
            Apps
          </Button>
          <Button
            flat
            onClick={() => this.onClickButton('meetings', elem)}
            iconClassName="mdi mdi-account-network"
            className="filesSidebar-button"
          >
            Meetings
          </Button>
          <Button
            flat
            onClick={() => this.onClickButton('tasks', elem)}
            iconClassName="mdi mdi-file-document"
            className="filesSidebar-button"
          >
            Tasks
          </Button>
          <Button
            flat
            onClick={() => this.onClickButton('data-pool', elem)}
            iconClassName="mdi mdi-cloud"
            className="filesSidebar-button"
          >
            Data Pool
          </Button>
          <Button
            flat
            onClick={() => this.onClickButton('personal-files', elem)}
            iconClassName="mdi mdi-file"
            className="filesSidebar-button"
          >
            Personal Files
          </Button>
          <Button
            flat
            onClick={() => this.onClickButton('add')}
            iconClassName="mdi mdi-plus-circle"
            className="filesSidebar-button"
          >
            Add New
          </Button>
        </ExpansionPanel>
      )
    })
  }
  render () {
    return (
      <ExpansionList className="filesSidebar">{this.renderWs()}</ExpansionList>
    )
  }
}
