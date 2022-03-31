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
  // {
  //   key: 'new-hse',
  //   roleOp: 'pulse hse operator',
  //   roleRe: 'pulse hse regulator',
  //   path: 'hse',
  // },

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
    roleTecSec: 'TECOM_SECRETARY',
    roleFinSec: 'FINCOM_SECRETARY',
    roleJmcSec: 'JMC_SECRETARY',
    roleTecChair: 'TECOM_CHAIRMAN',
    roleFinChair: 'FINCOM_CHAIRMAN',
    roleJmcChair: 'JMC_CHAIRMAN',
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
    roleAU: 'target:audit:user',
    roleFP: 'target:audit:fp',
    roleAP: 'target:audit:participant',
    path: 'audit',
  },
  {
    key: 'regulation',
    roleOp: 'pulse regulation operator',
    roleRe: 'pulse regulation regulator',
    path: 'regulation',
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
        roleOp: 'pulse flaring operator',
        roleRe: 'pulse flaring regulator',
        key: 'new-hsse',
        path: 'flaring',
      },
      {
        roleOp: 'pulse flaring operator',
        roleRe: 'pulse flaring regulator',
        key: 'new-emissions',
        path: 'flaring',
      },
    ],
  },
]
