import { useState } from 'react'
import { Paper, FontIcon } from 'react-md'

import './style.scss'

export const CustomExpansionPanel = ({
  header,
  body,
  className,
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded)
  return (
    <Paper
      id={`${className}`}
      className={`custom-expansion-panel ${className}`}
    >
      <div
        className="custom-expansion-panel_header"
        onClick={() => setExpanded((expanded) => !expanded)}
      >
        {header}
        <FontIcon>{expanded ? 'expand_more' : 'expand_less'}</FontIcon>
      </div>
      <div
        className={`custom-expansion-panel_body ${expanded ? '' : 'hidden'}`}
      >
        {body}
      </div>
    </Paper>
  )
}
