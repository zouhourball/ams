import { useState, useRef, useEffect } from 'react'
import { isEmpty, get, has } from 'lodash-es'
import { DialogContainer, FontIcon } from 'react-md'
import { connect } from 'react-redux'
import Mht from '@target-energysolutions/mht'
import GenericCard from 'components/module-agreements/components//generic-card'
import mutate from 'libs/hocs/mutate'
import { configs } from './helpers'
import {
  getAgreements,
  deleteAgreementById,
  removeAgreementById,
  undoDeleteAgreementById,
} from 'libs/api/api-psa'
import * as act from 'modules/app/actions'
import { useTranslation } from 'libs/langs'
import { navigate } from '@reach/router'

import {
  ContentManagerCardLoader,
  ContentManagerTableLoader,
} from 'components/module-agreements/components/loaders/loaders'

import disableImage from './images/disableImage.svg'
import restoreImage from './images/restore.svg'

import './style.scss'

const MainContentManager = ({
  mutations: {
    getAgreements,
    deleteAgreementById,
    removeAgreementById,
    undoDeleteAgreementById,
  },
  organizationID,
  getAgreementsStatus,
  deleteAgreementByIdStatus,
  removeAgreementByIdStatus,
  undoDeleteAgreementByIdStatus,
  view,
  addToast,
}) => {
  const { t } = useTranslation()
  const cardsContainer = useRef(null)
  const [page, setPage] = useState(0)
  const [deletePool, setDeletePool] = useState(null)
  const [deleteAgreement, setDeleteAgreement] = useState(false)
  const [agreementId, setAgreementId] = useState()

  useEffect(() => {
    if (!deleteAgreementByIdStatus.pending) {
      if (has(deleteAgreementByIdStatus, 'error')) {
        if (has(deleteAgreementByIdStatus, 'error.body')) {
          addToast(
            get(
              deleteAgreementByIdStatus,
              'error.body',
              'An error has occurred',
            ),
            'hide',
          )
        } else {
          addToast(
            get(
              deleteAgreementByIdStatus,
              'error.message',
              'An error has occurred',
            ),
            'hide',
          )
        }
      } else {
        getAgreements(organizationID)
      }
    }
  }, [deleteAgreementByIdStatus])

  useEffect(() => {
    if (!removeAgreementByIdStatus.pending) {
      if (has(removeAgreementByIdStatus, 'error')) {
        if (has(removeAgreementByIdStatus, 'error.body')) {
          addToast(
            get(
              removeAgreementByIdStatus,
              'error.body',
              'An error has occurred',
            ),
            'hide',
          )
        } else {
          addToast(
            get(
              removeAgreementByIdStatus,
              'error.message',
              'An error has occurred',
            ),
            'hide',
          )
        }
      } else {
        getAgreements(organizationID)
      }
    }
  }, [removeAgreementByIdStatus])

  useEffect(() => {
    if (!undoDeleteAgreementByIdStatus.pending) {
      if (has(undoDeleteAgreementByIdStatus, 'error')) {
        if (has(undoDeleteAgreementByIdStatus, 'error.body')) {
          addToast(
            get(
              undoDeleteAgreementByIdStatus,
              'error.body',
              'An error has occurred',
            ),
            'hide',
          )
        } else {
          addToast(
            get(
              undoDeleteAgreementByIdStatus,
              'error.message',
              'An error has occurred',
            ),
            'hide',
          )
        }
      } else {
        getAgreements(organizationID)
      }
    }
  }, [undoDeleteAgreementByIdStatus])

  useEffect(() => {
    getAgreements(organizationID)
  }, [])

  useEffect(() => {
    getAgreements(organizationID)
  }, [organizationID])
  const onRemove = id => {}

  const actions = [
    {
      onClick: () => {
        setDeletePool(null)
        setDeleteAgreement(false)
      },
      flat: true,
      children: t('no'),
    },
    {
      onClick: () => {
        deletePool && onRemove(deletePool.id)
        deleteAgreement === 'delete' &&
          deleteAgreementById(organizationID, agreementId)
        deleteAgreement === 'remove' &&
          removeAgreementById(organizationID, agreementId)
        deleteAgreement === 'undo' &&
          undoDeleteAgreementById(organizationID, agreementId)
        setDeletePool(null)
        setDeleteAgreement(false)
      },
      flat: true,
      primary: true,
      children: t('yes'),
    },
  ]

  const agreements = get(getAgreementsStatus, 'data', [])
  const loading = getAgreementsStatus && getAgreementsStatus.pending

  const agreementAction = (id, action) => {
    setDeleteAgreement(action)
    setAgreementId(id)
  }

  const renderCard = () => {
    return (
      <>
        {isEmpty(agreements) && (
          <div className="empty-content md-cell md-cell--12">
            <div>
              <FontIcon className="empty-content-icon">
                <i className="mdi mdi-file-document"></i>
                <p className="emptyText">{t('no_agreement')}</p>
              </FontIcon>
            </div>
          </div>
        )}
        {agreements &&
          agreements.map((agreement, index) => (
            <GenericCard
              key={index}
              genericCardData={agreement}
              className="md-cell md-cell--3"
              onClickCard={() =>
                !agreement.deleted &&
                navigate(`/ams/agreement/content/current/${agreement.id}`)
              }
              onClickDelete={agreementId => {
                agreementAction(agreementId, 'delete')
              }}
              onClickUndo={agreementId => {
                agreementAction(agreementId, 'undo')
              }}
              onClickRemove={agreementId => {
                agreementAction(agreementId, 'remove')
              }}
            />
          ))}
      </>
    )
  }
  const renderDataTableData = () => {
    return agreements.map(elem => {
      let members = []
      elem.sections_details.forEach(item => {
        members = [...members, ...item.members.map(mem => mem.user_sub)]
      })

      return {
        ...elem,
        members: members.filter((item, pos) => {
          return members.indexOf(item) === pos
        }),
      }
    })
  }

  const dialogText = () => {
    if (deleteAgreement === 'remove') {
      return t('sure_remove_it')
    } else if (deleteAgreement === 'undo') {
      return t('sure_undo_it')
    } else {
      return t('sure_delete_it')
    }
  }

  const dialogTitle = () => {
    if (deleteAgreement === 'remove') {
      return t('remove_dialog_title')
    } else if (deleteAgreement === 'undo') {
      return t('undo_dialog_title')
    } else {
      return t('delete_dialog_title')
    }
  }

  const dialogImage = () => {
    if (deleteAgreement === 'undo') {
      return restoreImage
    } else {
      return disableImage
    }
  }
  return (
    <div
      className="main-content-manager"
      ref={cardsContainer}
      onScroll={() => {
        if (
          cardsContainer.current.scrollHeight -
            cardsContainer.current.scrollTop ===
          cardsContainer.current.clientHeight
        ) {
          setPage(page + 1)
        }
      }}
    >
      {view === 'card' &&
        (loading ? (
          <div className="list-cardloader md-grid">
            <ContentManagerCardLoader />
            <ContentManagerCardLoader />
            <ContentManagerCardLoader />
            <ContentManagerCardLoader />
            <ContentManagerCardLoader />
            <ContentManagerCardLoader />
            <ContentManagerCardLoader />
            <ContentManagerCardLoader />
          </div>
        ) : (
          <div className="main-content-manager-card-wrapper md-grid">
            {renderCard()}
          </div>
        ))}

      {view === 'grid' &&
        (loading ? (
          <div className="list-cardloader md-grid">
            <ContentManagerTableLoader />
          </div>
        ) : (
          <Mht
            selectedLanguage="en"
            configs={configs(agreementAction)}
            tableData={renderDataTableData()}
            withSearch
            commonActions
            // onExpand={data => {
            //   setCurrentUser(data)
            //   setVisibleMemberDetails(true)
            // }}
            // onSearch={() => {}}
            onSelectRows={() => {}}
          />
        ))}
      {deletePool ||
        (deleteAgreement && (
          <DialogContainer
            id="dialog-confirm-delete"
            className="delete-agreement-dialog"
            title={dialogTitle()}
            visible={deletePool || deleteAgreement}
            onHide={() => null}
            modal
            actions={actions}
            // renderNode={document.body}
          >
            {}
            <img src={dialogImage()} height="85px" />
            <div>{dialogText()}</div>
          </DialogContainer>
        ))}
    </div>
  )
}
export default connect(
  ({ shell }) => ({
    organizationID: shell.organizationId,
  }),
  {
    addToast: act.addToast,
  },
)(
  mutate({
    moduleName: 'agreement',
    mutations: {
      getAgreements,
      deleteAgreementById,
      undoDeleteAgreementById,
      removeAgreementById,
    },
  })(MainContentManager),
)
