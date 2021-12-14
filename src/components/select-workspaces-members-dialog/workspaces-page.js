import { useState } from 'react'
import { SelectField } from 'react-md'
import { uniqBy } from 'lodash-es'

// import { getPublicUrl } from 'libs/utils/custom-function'
// import { getWorkspacesByOrgId } from 'libs/api/api-prime'

// import WksCard from 'components/wks-card'
// import UserInfoBySubject from 'components/user-info-by-subject'

const WorkspacesPage = ({ workspaces, informations, setInformations }) => {
  const [onSelectWs, setSnSelectWs] = useState()

  const listWorkspace = uniqBy(
    workspaces?.map(({ name, id }) => ({
      label: name,
      value: id,
    })),
    (e) => e.label,
  )
  const streams = workspaces?.find(
    (WorkspaceId) => WorkspaceId.id === onSelectWs,
  )
  const listStreams = uniqBy(
    streams?.streams?.streams?.map(({ name, id }) => ({
      label: name,
      value: id,
    })),
    (e) => e.label,
  )
  // let workspacesList = workspaces
  // if (searchWorkspace) {
  //   const expr = new RegExp(searchWorkspace, 'i')
  //   workspacesList = workspacesList.filter((nal) => expr.test(nal['name']))
  // }

  return (
    <div className="workspace-page">
      <SelectField
        id="select-workspace"
        className="workspace-page-selectField"
        label="Select Workspace"
        value={informations.workspace}
        menuItems={listWorkspace}
        position={SelectField.Positions.BELOW}
        simplifiedMenu={false}
        block
        onChange={(v) => {
          setInformations({ ...informations, workspace: v })
          setSnSelectWs(v)
        }}
      />
      <SelectField
        id="select-stream"
        className="workspace-page-selectField"
        label="Select stream"
        value={informations.stream}
        menuItems={listStreams}
        position={SelectField.Positions.BELOW}
        simplifiedMenu={false}
        block
        onChange={(v) => {
          setInformations({ ...informations, stream: v })
        }}
      />
    </div>
  )
}

export default WorkspacesPage
