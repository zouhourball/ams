import { useState, Fragment, useEffect, useCallback } from 'react'
import cn from 'classnames'
import './random-password.scss'
import { SelectionControl } from 'react-md'
import copy from 'copy-to-clipboard'
import { addToast } from 'modules/app/actions'
import { useDispatch } from 'react-redux'
import ToastMsg from 'components/toast-msg'

export const createRandomNum = (len) => {
  const num = Math.random().toString(36).substr(2, len)
  const numList = num.split('')
  // for (let i = 0; i < len; i++) {
  //   numList[i] = num[i];
  // }
  return numList
}

const CopyPassword = ({ randomList }) => {
  const dispatch = useDispatch()
  const copyList = randomList.join('')
  const handleCopy = useCallback(() => {
    copy(copyList)
    dispatch(
      addToast(
        <ToastMsg text={'Password Copy Successfully.'} type="success" />,
        'hide',
      ),
    )
  }, [dispatch, copyList])
  return (
    <div className="app--random-password-copy">
      <span
        className="app--random-password-copy-text"
        role="button"
        tabIndex={0}
        onClick={handleCopy}
      >
        Copy Password
      </span>
    </div>
  )
}

export const RandomPassword = ({ value, className, onChange, disabled }) => {
  const [showPassword, setShowPassword] = useState(false)
  const counts = 4
  const [randomList, setRandomList] = useState([''])

  useEffect(() => {
    setRandomList((value || '').split(''))
    value && setShowPassword(true)
  }, [value])

  const handleSwitchPwdChange = (showPwd) => {
    setShowPassword(showPwd)
    if (showPwd) {
      const list = createRandomNum(counts)
      const rs = list.join('')
      setRandomList(list)
      onChange && onChange(rs)
    } else {
      onChange && onChange('')
    }
  }

  return (
    <div className={cn('app--random-password-container', className)}>
      <SelectionControl
        id="switch-create-with-password"
        type="switch"
        label={'Password'}
        name="create-with-password"
        disabled={disabled}
        className="app--random-password-switch-control"
        onChange={handleSwitchPwdChange}
        checked={showPassword}
      />
      {showPassword && (
        <Fragment>
          <ul className="app--random-password-number-container">
            {randomList.map((r, index) => {
              const id = index
              return (
                <li key={id} className="app--random-password-list">
                  {r}
                </li>
              )
            })}
          </ul>
          <CopyPassword randomList={randomList} />
        </Fragment>
      )}
    </div>
  )
}
