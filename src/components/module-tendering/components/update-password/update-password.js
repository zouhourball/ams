import { PureComponent } from 'react'
import { DialogContainer, Button, TextField } from 'react-md'
import { connect } from 'react-redux'

import mutate from 'libs/hocs/mutate'
import { updateMyPassword } from 'libs/api'
import * as act from 'modules/app/actions'

import './style.scss'

@connect(({ query }) => ({
  userInfo:
    query.DEFAULT && query.DEFAULT.userInfo ? query.DEFAULT.userInfo : null,
}))
@connect(null, {
  addToast: act.addToast,
})
@mutate({
  moduleName: 'user',
  mutations: {
    updateMyPassword,
  },
})
export default class UpdatePassword extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      password: '',
      newPassword: '',
      repeatNewPassword: '',
    }
  }

  componentDidUpdate (prevProps) {
    const { updateMyPasswordStatus, onHide, addToast } = this.props
    if (prevProps.updateMyPasswordStatus !== updateMyPasswordStatus) {
      if (!updateMyPasswordStatus.pending) {
        if (
          updateMyPasswordStatus.data &&
          updateMyPasswordStatus.data.success
        ) {
          addToast('Password updated successfully', 'Hide')
          this.setState({
            password: '',
            newPassword: '',
            repeatNewPassword: '',
          })
          onHide()
        } else if (
          updateMyPasswordStatus.data &&
          updateMyPasswordStatus.data &&
          updateMyPasswordStatus.data.error &&
          updateMyPasswordStatus.data.error.body &&
          updateMyPasswordStatus.data.error.body.error
        ) {
          addToast(updateMyPasswordStatus.data.error.body.error, 'Hide')
        }
      }
    }
  }
  onHide = () => {
    const { onHide } = this.props
    onHide()
  }
  onChangeField = (field) => (value) => {
    this.setState({ [field]: value })
  }
  isValid = () => {
    const { newPassword, repeatNewPassword } = this.state
    let isValid = false
    if (
      newPassword &&
      newPassword.length >= 8 &&
      newPassword === repeatNewPassword
    ) {
      isValid = true
    }
    return isValid
  }
  handleSubmit = () => {
    const { newPassword, password } = this.state
    const {
      mutations: { updateMyPassword },
      userInfo,
    } = this.props
    const subject = userInfo && userInfo.data ? userInfo.data.sub : null
    updateMyPassword({
      password: newPassword,
      subject,
      old_password: password,
    })
  }
  render () {
    const { visible } = this.props
    const { newPassword, repeatNewPassword, password } = this.state
    const actions = []
    actions.push(
      <div>
        <Button
          flat
          secondary
          className="md-text--secondary"
          onClick={this.onHide}
        >
          Cancel
        </Button>
        <Button
          flat
          primary
          onClick={this.handleSubmit}
          disabled={!this.isValid()}
        >
          Update
        </Button>
      </div>,
    )
    return (
      <DialogContainer
        id="new-meeting-dialog"
        visible={visible}
        onHide={this.hideDialog}
        actions={actions}
        title="Update your password"
        className="update-password"
        disableScrollLocking
        modal
      >
        <TextField
          id="your-password"
          label="Enter your password"
          type="password"
          value={password}
          onChange={this.onChangeField('password')}
        />

        <TextField
          id="new-password"
          label="Enter your new password"
          type="password"
          value={newPassword}
          onChange={this.onChangeField('newPassword')}
        />
        <TextField
          id="repeat-new-password"
          label="Repeat your new password"
          type="password"
          value={repeatNewPassword}
          onChange={this.onChangeField('repeatNewPassword')}
        />
      </DialogContainer>
    )
  }
}
