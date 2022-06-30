import { FontIcon, List, ListItem } from 'react-md'

import './documents.scss'

export default function Documents ({ title, documentsList }) {
  return (
    <div className="documents md-paper md-paper--1">
      <div className="title-wrapper">
        <FontIcon iconClassName="mdi mdi-file-document"></FontIcon>
        <h3> {title} </h3>
      </div>

      <List className="documents-list">
        {renderDocumentsList(documentsList)}
      </List>
    </div>
  )
}

const renderDocumentsList = (documentsList) => {
  return documentsList.map((el, key) => (
    <ListItem
      key={key}
      primaryText={el.title}
      rightIcon={el.nested.length}
      expanderLeft
      nestedItems={renderNestedDocumentsList(el.nested)}
      className="documents-list-item"
      expanderIcon={<FontIcon>arrow_right</FontIcon>}
    />
  ))
}

const renderNestedDocumentsList = (nestedDocumentsList) => {
  return nestedDocumentsList.map((el, key) => (
    <ListItem
      key={key}
      primaryText={el}
      className="documents-list-item-details"
    />
  ))
}
