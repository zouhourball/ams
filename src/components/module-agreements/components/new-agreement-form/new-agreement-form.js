import { TextField } from 'react-md'

import HtmlEditor from 'components/module-agreements/components/html-editor'
import { NewAgreementFormLoader } from 'components/module-agreements/components/loaders/loaders'
import { useTranslation } from 'libs/langs'

import './style.scss'

const NewAgreementForm = props => {
  const { t } = useTranslation()
  const {
    role,
    newAgreementData,
    handleNewAgreementData,
    agreementId,
    loading,
    newAgreementError,
  } = props

  return (
    <div className="new-agreement">
      {loading ? (
        <NewAgreementFormLoader />
      ) : (
        <>
          {role !== 'admin' && (
            <div>
              <h2 className="new-agreement-title"> {newAgreementData.title}</h2>
              <h3 className="new-agreement-sub-title"> {t('description')} </h3>
              <p className="new-agreement-content">
                {newAgreementData.description}
              </p>
              <h3 className="new-agreement-sub-title">{t('scope')}</h3>
              <p className="new-agreement-content">{newAgreementData.scope}</p>
            </div>
          )}
          {!agreementId ? (
            <>
              <TextField
                id="new-agreement-name"
                value={newAgreementData.title}
                label="Name"
                onChange={value => handleNewAgreementData('title', value)}
                autoComplete="off"
                className={`${newAgreementError.title &&
                  'error'} new-agreement-textField`}
              />
              <HtmlEditor
                editorLabel={'Description'}
                value={newAgreementData.description}
                onChange={value => handleNewAgreementData('description', value)}
                editorLabelClassName="new-agreement-label"
                wrapperClassName={`${newAgreementError.description &&
                  'error'} new-agreement-description`}
                // maxLength={100}
              />
              <HtmlEditor
                editorLabel={'Scope'}
                value={newAgreementData.scope}
                onChange={value => handleNewAgreementData('scope', value)}
                editorLabelClassName="new-agreement-label"
                wrapperClassName={`${newAgreementError.scope &&
                  'error'} new-agreement-scope`}
                // maxLength={100}
              />
            </>
          ) : (
            <>
              <div className="new-agreement-titleView">
                {newAgreementData.title}
              </div>
              <div className="new-agreement-descriptionView">
                {t('description')}
              </div>
              <div
                className="new-agreement-contentView"
                dangerouslySetInnerHTML={{
                  __html: newAgreementData.description,
                }}
              />
              <div className="new-agreement-descriptionView">{t('scope')}</div>
              <div
                className="new-agreement-contentView"
                dangerouslySetInnerHTML={{ __html: newAgreementData.scope }}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}
export default NewAgreementForm

/* <NewAgreementForm
      role="admin"
      newAgreementData={{
        name: 'test',
        description: 'test',
        scope: 'test',
      }}
      handleNewAgreementData={() => {}}
/> */
