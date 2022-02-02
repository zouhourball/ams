import { Button, FontIcon } from 'react-md'

import './styles.scss'

const AgendaContainerFooter = ({
  className,
  onEdit,
  onAttachFiles,
  onEmoji,
  onImage,
  onAddTask,
}) => {
  return (
    <div className={`agenda-container-footer ${className}`}>
      {onEdit && (
        <Button
          onClick={() => {
            onEdit('onEdit')
          }}
        >
          <FontIcon iconClassName="mdi mdi-pencil-circle" /> Edit
        </Button>
      )}
      {onEmoji && (
        <Button
          onClick={() => {
            onEmoji('onEmoji')
          }}
        >
          <FontIcon icon iconClassName="mdi mdi-emoticon" />
        </Button>
      )}
      {onImage && (
        <Button
          onClick={() => {
            onImage('onImage')
          }}
        >
          <FontIcon icon iconClassName="mdi mdi-image" />
        </Button>
      )}
      {onAttachFiles && (
        <Button
          onClick={() => {
            onAttachFiles('onAttachFiles')
          }}
        >
          <FontIcon iconClassName="mdi mdi-paperclip" /> Attach Files
        </Button>
      )}
      {onAddTask && (
        <Button
          onClick={() => {
            onAddTask('onAddTask')
          }}
        >
          <FontIcon iconClassName="mdi mdi-plus-circle" /> Add Task
        </Button>
      )}
    </div>
  )
}
export default AgendaContainerFooter
