import { navigate } from '@reach/router'

export const config = [
  {
    label: 'Company Name',
    key: 'companyName',
    width: 300,
    render: (row) => (
      <div
        className="pointer"
        onClick={() => navigate(`/tendering/fbp/${row.companyId}`)}
      >
        {row.companyName}
      </div>
    ),
    displayInCsv: true,
  },
  {
    label: 'Block',
    key: 'blockNumber',
    width: 200,
    render: (row) => (
      <div
        className="pointer"
        onClick={() => navigate(`/tendering/fbp/${row.companyId}`)}
      >
        {row.blockNumber}
      </div>
    ),
    displayInCsv: true,
  },
  {
    label: 'Total Proposals',
    key: 'totalProposals',
    type: 'number',
    width: 200,
    render: (row) => (
      <div
        className="pointer"
        onClick={() => navigate(`/tendering/fbp/${row.companyId}`)}
      >
        {row.totalProposals}
      </div>
    ),
    displayInCsv: true,
  },
  {
    label: 'Approved Proposals',
    key: 'approvedProposals',
    type: 'number',
    width: 200,
    render: (row) => (
      <div
        className="pointer"
        onClick={() => navigate(`/tendering/fbp/${row.companyId}`)}
      >
        {row.approvedProposals}
      </div>
    ),
    displayInCsv: true,
  },
  {
    label: 'Pending Proposals',
    key: 'pendingProposals',
    type: 'number',
    width: 200,
    render: (row) => (
      <div
        className="pointer"
        onClick={() => navigate(`/tendering/fbp/${row.companyId}`)}
      >
        {row.pendingProposals}
      </div>
    ),
    displayInCsv: true,
  },
  {
    label: 'Rejected Proposals',
    key: 'rejectedProposals',
    type: 'number',
    width: 200,
    render: (row) => (
      <div
        className="pointer"
        onClick={() => navigate(`/tendering/fbp/${row.companyId}`)}
      >
        {row.rejectedProposals}
      </div>
    ),
    displayInCsv: true,
  },
]
