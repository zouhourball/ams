import CardLayout from '../card-layout'
import okrSVG from 'images/apps/okrs.svg'
import './styles.scss'

const OkrCard = ({ onDefineObj, onDefineObjBtn, className, ...rest }) => {
  const actions = [
    {
      label: 'Define New Objective',
      mdIcon: 'mdi mdi-playlist-check',
      onClick: () => {
        onDefineObj && onDefineObj()
      },
      onBtnClick: () => {
        onDefineObjBtn && onDefineObjBtn()
      },
    },
  ]
  return (
    <CardLayout
      actions={actions}
      className="ws-popupcard-okr"
      title="OKR"
      background="#03A5EF"
      description="Meera OKR will manage your Organization OKR, your workspace OKR and  your personal OKR in a highly interactive, user friendly graphical interface. Track your progress and check the report any time you want"
      iconSrc={okrSVG}
      {...rest}
    />
  )
}

export default OkrCard
