import { Component } from 'react'

import { PropTypes } from 'prop-types'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import { stateFromHTML } from 'draft-js-import-html'
import { convertToRaw, EditorState } from 'draft-js'
import { withTranslationEx } from 'libs/langs'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './editorStyle.scss'

@withTranslationEx
class HtmlEditor extends Component {
  constructor (props) {
    super(props)
    const { value } = this.props
    this.state = {
      value: EditorState.createWithContent(stateFromHTML(value)),
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    return {
      ...prevState,
      editorState: EditorState.createWithContent(
        stateFromHTML(nextProps.value),
      ),
    }
  }

  static defaultProps = {
    value: '',
    editorLabel: '',
    editorLabelClassName: '',
    readOnly: false,
    toolbarClassName: '',
    wrapperClassName: '',
    editorClassName: '',
  }
  onEditorStateChange = (value) => {
    const { onChange } = this.props
    this.setState({ value })
    const htmlValue = draftToHtml(convertToRaw(value.getCurrentContent()))
    if (typeof onChange === 'function') {
      // onChange is not required
      onChange(htmlValue)
    }
  }

  render () {
    const {
      readOnly,
      editorLabel,
      maxLength,
      value: propValue,
      editorLabelClassName,
      toolbarClassName,
      wrapperClassName,
      editorClassName,
      t,
      customToolbar,
    } = this.props

    const { value } = this.state

    const readOnlyClassname = readOnly
      ? 'readOnlyClassname'
      : 'editModeClassname'

    return (
      <div className="HtmlEditor">
        {editorLabel && (
          <label className={`editorLabel ${editorLabelClassName}`}>
            {editorLabel}
          </label>
        )}
        <Editor
          placeholder={'Write Meeting Objective here...'}
          toolbarClassName={`editorToolbar ${readOnlyClassname} ${toolbarClassName}`}
          wrapperClassName={`editorWrapper ${wrapperClassName}`}
          editorClassName={`editorContent ${readOnlyClassname} ${editorClassName}`}
          editorState={value}
          onEditorStateChange={this.onEditorStateChange}
          readOnly={readOnly}
          editorStyle={{ height: '200px' }}
          toolbar={customToolbar}
        />
        {maxLength && (
          <div className="maxLengthWrapper">
            {propValue.length <
            0.7 *
              parseFloat(
                maxLength,
              ) ? null /* <span className="safeLength">under character limit</span> */ : propValue.length <
              parseFloat(maxLength) ? (
                  <span className="warningLength">{t('warningLength')}</span>
                ) : (
                  <span className="dangerLength">{t('warningLengthLimit')}</span>
                )}
          </div>
        )}
      </div>
    )
  }
}

HtmlEditor.propTypes = {
  onChange: PropTypes.func, // only required if readOnly false
  value: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired, // The HtmlEditor only shows the label if it set
  maxLength: PropTypes.number, // includes the html tags and special characters
  editorLabel: PropTypes.string, // The HtmlEditor only shows the label if it set
  // ================== Classname
  editorLabelClassName: PropTypes.string,
  toolbarClassName: PropTypes.string,
  wrapperClassName: PropTypes.string,
  editorClassName: PropTypes.string,
}

export default HtmlEditor
