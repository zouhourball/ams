import { useState } from 'react'
import { DialogContainer, Button, TextField, Checkbox } from 'react-md'

import './styles.scss'

function AddComment ({
  visible = true,
  onHideDialog,
  onSubmitDialog,
  type,
  onSubmitDialogClarify,
  proposalStatus,
}) {
  const [comment, setComment] = useState('')
  const [checkedFiles, setCheckedFiles] = useState([])

  const hideDialog = () => {
    onHideDialog()
    setComment('')
  }
  const submitCreateProposal = () => {
    type !== 'request-information'
      ? onSubmitDialog(comment)
      : onSubmitDialogClarify({ comment, checkedFiles })
    setComment('')
  }
  const listFiles = ['Performa', 'Tender Strategy form', 'Other attachments']
  const actions = []
  actions.push(
    <div>
      <Button flat className="md-text--secondary" onClick={hideDialog}>
        DISCARD
      </Button>
      <Button flat primary disabled={!comment} onClick={submitCreateProposal}>
        SEND
      </Button>
    </div>,
  )

  return (
    <DialogContainer
      id="newComment"
      title={'Add Comment'}
      className="newComment"
      visible={visible}
      onHide={onHideDialog}
      actions={actions}
    >
      <div className="newProposal-dialog-body">
        <div className="md-grid">
          {type === 'request-information' && (
            <>
              <div className="md-cell md-cell--12">Proposal Attachments</div>
              {listFiles.map((el) => (
                <Checkbox
                  key={el}
                  className="md-cell md-cell--4"
                  checked={checkedFiles.includes(el)}
                  label={el}
                  onClick={() =>
                    setCheckedFiles((prev) => {
                      if (prev.includes(el)) {
                        return prev.filter((item) => item !== el)
                      } else return [...prev, el]
                    })
                  }
                  onChange={(e) => e.preventDefault()}
                />
              ))}
            </>
          )}
          <TextField
            id="comment"
            label={'Add Comment'}
            rows="10"
            placeholder={'Add Comment Here...'}
            className="newComment-textField md-cell md-cell--6"
            value={comment}
            onChange={setComment}
            required
          />
        </div>
      </div>
    </DialogContainer>
  )
}

export default AddComment
