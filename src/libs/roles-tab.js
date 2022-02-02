export const rolesTab = [
  {
    key: 'new-reserves',
    roleOp: 'pulse reserve operator',
    roleRe: 'pulse reserve regulator',
    path: 'reserves',
  },
  {
    key: 'production',
    roleOp: 'pulse production operator',
    roleRe: 'pulse production regulator',
    path: 'production',
  },
  {
    key: 'new-hse',
    roleOp: 'pulse hse operator',
    roleRe: 'pulse hse regulator',
    path: 'hse',
  },

  {
    key: 'new-cost-recovery',
    roleOp: 'pulse cost recovery operator',
    roleRe: 'pulse cost recovery regulator',
    path: 'costrecovery',
  },

  {
    key: 'planning',
    roleOp: 'pulse planning operator',
    roleRe: 'pulse planning regulator',
    path: 'planning',
  },
  {
    key: 'permitting',
    roleOp: 'pulse permit operator',
    roleRe: 'pulse permit regulator',
    path: 'permitting',
  },
  {
    key: 'new-downstream',
    roleOp: 'pulse downstream operator',
    roleRe: 'pulse downstream regulator',
    path: 'downstream',
  },
  {
    key: 'new-inventory',
    roleOp: 'pulse inventory operator',
    roleRe: 'pulse inventory regulator',
    path: 'inventory',
  },
  {
    key: 'new-tendering',
    roleOp: 'target:tendering:operator',
    roleRe: 'target:tendering:secretary',
    roleCh: 'target:tendering:chairman',
    path: 'tendering',
  },
  {
    key: 'agreement',
    roleOp: 'pulse agreement operator',
    roleRe: 'pulse agreement regulator',
    path: 'agreement',
  },
  {
    key: 'new-audit',
    roleOp: 'pulse audit operator',
    roleRe: 'pulse audit regulator',
    path: 'audit',
  },
  {
    key: 'new-audit',
    roleOp: 'pulse audit operator',
    roleRe: 'pulse audit regulator',
    path: 'audit',
  },
  {
    key: 'new-HSE',
    path: 'hse',
    hasSubModule: [
      {
        roleOp: 'pulse flaring operator',
        roleRe: 'pulse flaring regulator',
        key: 'new-flaring',
        path: 'flaring',
      },
      {
        roleOp: 'pulse-hsse-operator',
        roleRe: 'pulse hsse regulator',
        key: 'new-hsse',
        path: 'hsse',
      },
      {
        roleOp: 'pulse emissions operator',
        roleRe: 'pulse emissions regulator',
        key: 'new-emissions',
        path: 'emissions',
      },
    ],
  },
]
