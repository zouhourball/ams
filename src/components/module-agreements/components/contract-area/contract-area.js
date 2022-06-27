import React from 'react'

import { MeeraMap } from '@target-energysolutions/gis-map'
import icon from './contact.svg'
import { useTranslation } from 'libs/langs'

import './style.scss'

export default function ContractArea () {
  const { t } = useTranslation()
  return (
    <div className="md-paper md-paper--1 commonContainer section_card_paper">
      <div className="commonContainer_header">
        <div className="commonContainer_title">
          <img
            src={icon}
            width={'15px'}
            className="commonContainer_title_icon"
          />
          <h3>{t('contact_area')}</h3>
        </div>
      </div>
      <div className="profile-section-card-showmore-list">
        <MeeraMap />
      </div>
    </div>
  )
}
