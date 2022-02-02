import './styles.scss'

const AgendaContainer = ({ className, children, title }) => {
  return (
    <div className={`agenda-container ${className}`}>
      {title && <div className="agenda-container-header">{title}</div>}
      {children}
    </div>
  )
}
export default AgendaContainer

/*  <AgendaContainer title="Agenda" className>
      <AgendaContainerBody>
        <p>
          To see in depth details of Abc Agenda, we will review the
          following :
        </p>
        <ul>
          <li>1) Estimated Cost and Duration of the tender submitted</li>
          <li>2) Generated 10 viable ideas for proposed agenda</li>
          <li>3) Threshold and Estimated and Approved Budge</li>
        </ul>
      </AgendaContainerBody>
      <AgendaContainerFooter
        onImage={e => {
          console.log(e);
        }}
        onEdit={e => {
          console.log(e);
        }}
        onAtachFiles={e => {
          console.log(e);
        }}
        onEmoji={e => {
          console.log(e);
        }}
        onAddTask={e => {
          console.log(e);
        }}
      />
    </AgendaContainer> */
