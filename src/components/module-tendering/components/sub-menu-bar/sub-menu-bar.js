import { useMemo, useState, useCallback } from 'react'
import { Avatar, Button } from 'react-md'
import EamTopBar from '@target-energysolutions/eam-top-bar'
import { navigate } from '@reach/router'
import { get } from 'lodash-es'

import CompanyInfoByOrg from '../../components/company-info-by-org'

import { withTranslationEx } from 'libs/langs'
import { getPublicUrl } from 'libs/utils/custom-function'
import { useSelector } from 'react-redux'

import submissionimg from '../../components/home/images/busniess_submission.svg'
import processimg from '../../components/home/images/business_process.svg'
import vendorimg from '../../components/home/images/vendor_development.svg'
import tendering from '../../components/home/images/tendering.svg'
import reportsIcon from '../../components/home/images/report.svg'
// import comparisonimg from 'components/home/images/annualComparison.svg'
import annualimg from '../../components/home/images/annual_plan.svg'
import performanceimg from '../../components/home/images/actual_performance.svg'

import './style.scss'
const SubMenuBar = ({
  source,
  subSource,
  section,
  mainButton,
  resetProposal,
  userRole,
}) => {
  const companyName = useSelector(({ mutation }) =>
    get(
      mutation,
      'proposalHistory.getProposalHistoryStatus.data.data.proposal.companyName',
      '',
    ),
  )
  const referenceNumber = useSelector(({ mutation }) =>
    get(
      mutation,
      'proposalHistory.getProposalHistoryStatus.data.data.proposal.referenceNumber',
      '',
    ),
  ).substring(companyName.length + 1)
  const [showSubModules] = useState(true)
  const subModules = [
    {
      key: 'fbp',
      text: 'Function Business Process',
      icon: processimg,
      onClick: () => {
        if (source !== 'fbp') {
          navigate('ams/tendering/fbp')
        }
      },
    },
    {
      key: 'bs',
      text: 'Business Submission',
      icon: submissionimg,
      onClick: () => {
        if (source !== 'bs') {
          navigate('ams/tendering/bs')
        }
      },
      subModules: [
        {
          key: 'plan',
          text: 'Annual Plan',
          icon: annualimg,
          onClick: () => {
            navigate(`ams/tendering/bs/plan`)
          },
        },

        {
          key: 'report',
          text: 'Actual Performance Report',
          icon: performanceimg,
          onClick: () => {
            navigate(`ams/tendering/bs/report`)
          },
        },
        // {
        //   key: 'comparison',
        //   text: 'Annual Comparison',
        //   icon: comparisonimg,
        //   onClick: () => {
        //     navigate(`/tendering/bs/comparison`)
        //   },
        // },
      ],
    },
    {
      key: 'vd',
      text: 'Vendor Development',
      icon: vendorimg,
      onClick: () => {
        if (source !== 'vd') {
          navigate('ams/tendering/vd')
        }
      },
    },
    {
      key: 'rp',
      text: 'Reports',
      icon: reportsIcon,
      onClick: () => {
        if (source !== 'rp') {
          navigate('ams/tendering/rp')
        }
      },
    },
  ]
  const renderTopBarIcons = () => {
    switch (source) {
      case 'fbp':
        return processimg

      case 'bs':
        return submissionimg

      case 'vd':
        return vendorimg
      case 'rp':
        return reportsIcon
    }
  }

  const renderTopBarLabel = () => {
    switch (source) {
      case 'fbp':
        return 'Function Business Process'
      case 'bs':
        return 'Business Submission'
      case 'vd':
        return 'Vendor Development'
      case 'rp':
        return 'Reports'
      default:
        return ''
    }
  }
  const back = (
    <div className="title">
      {/* <Button
        icon
        onClick={() => {
          navigate('/tendering/fbp')
        }}
      >
        arrow_back
      </Button> */}
      <Avatar src={renderTopBarIcons()} />
      {renderTopBarLabel()}
    </div>
  )

  const main = (
    <div className="title">
      <img src={tendering} alt="tendering" height="30px" /> &nbsp; Tendering
    </div>
  )

  const navigationPath = useCallback(
    (content) => (
      <div className="title">
        {/* <Avatar />  */}
        <CompanyInfoByOrg organizationID={[subSource]}>
          {(organization) => (
            <div className="title-content">
              <Avatar
                src={
                  get(organization, '0.companyLogo.aPIID', null)
                    ? getPublicUrl(
                      get(organization, '0.companyLogo.aPIID', null),
                    )
                    : null
                }
              >
                {get(organization, '0.companyLogo.aPIID', null)
                  ? null
                  : get(organization, '0.name.0', '')}
              </Avatar>
              <div>
                <span
                  style={{
                    cursor: userRole !== 'operator' ? 'pointer' : 'default',
                  }}
                  onClick={() =>
                    userRole !== 'operator' && navigate('/tendering/fbp')
                  }
                >
                  {get(organization, '0.name', '')}
                </span>
                {content}
              </div>
            </div>
          )}
        </CompanyInfoByOrg>
      </div>
    ),
    [subSource, userRole],
  )

  const details = useMemo(() => navigationPath('/ Details'), [navigationPath])
  const historian = useMemo(
    () =>
      navigationPath(
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/tendering/fbp/${subSource}`)}
          className="back"
        >
          <Button icon>arrow_back</Button>
          <span>/ {referenceNumber} / Process Historian</span>
        </span>,
      ),
    [navigationPath, userRole, subSource, referenceNumber],
  )

  const newFbp = (
    <div className="title">
      <span
        onClick={() => {
          resetProposal()
          navigate('/tendering/fbp')
        }}
        className="subTitle"
        title={'Return To Function Business Process'}
      >
        Function Business Process &nbsp;
      </span>
      / New Proposal
    </div>
  )
  const ongoingFbp = (
    <div className="title">
      <span
        onClick={() => {
          resetProposal()
          navigate('/tendering/fbp')
        }}
        className="subTitle"
        title={'Return To Function Business Process'}
      >
        Function Business Process &nbsp;
      </span>
      / Ongoing & Close Out Proposal
    </div>
  )
  const closeoutFbp = (
    <div className="title">
      <span
        onClick={() => {
          resetProposal()
          navigate('/tendering/fbp')
        }}
        className="subTitle"
        title={'Return To Function Business Process'}
      >
        Function Business Process &nbsp;
      </span>
      / Close Out Proposal
    </div>
  )
  const renderCurrentModule = useMemo(() => {
    if (source === 'fbp' && typeof subSource !== 'undefined') {
      if (section === 'historian') {
        return historian
      } else {
        return details
      }
    } else if (source === 'newfbp') {
      return newFbp
    } else if (source === 'ongoingfbp') {
      return ongoingFbp
    } else if (source === 'closeoutfbp') {
      return closeoutFbp
    } else if (showSubModules) {
      return main
    } else {
      return back
    }
  }, [
    showSubModules,
    source,
    subSource,
    section,
    historian,
    details,
    newFbp,
    ongoingFbp,
    closeoutFbp,
    main,
    back,
  ])

  const renderActionButton = () => {
    return mainButton
      .filter((elem) => !!elem)
      .map(({ label, icon, onClick, disabled }, i) => (
        <div
          key={i}
          className={`top-bar-btn ${disabled ? 'disabled' : ''}`}
          onClick={() => !disabled && onClick && onClick()}
        >
          <img className="icon" src={icon} height="18px" />
          <span className="text">{label}</span>
        </div>
      ))
  }

  return (
    <div className="top-bar">
      <EamTopBar
        currentModule={renderCurrentModule}
        subModules={
          source === 'newfbp' ||
          source === 'ongoingfbp' ||
          source === 'closeoutfbp'
            ? []
            : showSubModules
              ? subModules
              : (subModules.find(({ key }) => key === source) || {}).subModules ||
              []
        }
        currentSubModule={showSubModules ? source : subSource || ''}
        // primaryActions={
        //   <TextField
        //     className="applications_searchField"
        //     leftIcon={<FontIcon>search</FontIcon>}
        //     placeholder={'Search'}
        //     value={searchValue}
        //     onChange={val => setSearchValue(val)}
        //   />
        // }
        secondaryActions={
          mainButton &&
          mainButton.length > 0 && (
            <div className="secondary-Wrapper">{renderActionButton()}</div>
          )
        }
        // onBack={
        //   showSubModules ||
        //   source === 'newfbp' ||
        //   source === 'ongoingfbp' ||
        //   source === 'closeoutfbp'
        //     ? null
        //     : () => setShowSubModules(true)
        // }
      />
    </div>
  )
}
export default withTranslationEx(SubMenuBar)
