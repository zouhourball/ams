import { useMemo, useCallback, useEffect, useRef } from 'react'
import classnames from 'classnames'
import { BaseDialog } from './base-dialog'
import { Controller, useForm } from 'react-hook-form'
// import { getInvitedUsers } from 'libs/hooks/use-invited-users'

import { ErrorMessage } from '@hookform/error-message'
import { TextField, Button, CircularProgress } from 'react-md'
import CheckCircleIcon from 'mdi-react/CheckCircleIcon'
import AccountPlusIcon from 'mdi-react/AccountPlusIcon'

import AsyncSelect from 'react-select/async-creatable'

import {
  addMinutes,
  formatISO,
  format,
  startOfDay,
  areIntervalsOverlapping,
  formatRFC3339,
  endOfDay,
  isBefore,
  isAfter,
  subDays,
} from 'date-fns'

import {
  map,
  filter,
  some,
  concat,
  every,
  get,
  isEmpty,
  flatMap,
  uniq,
  startsWith,
} from 'lodash-es'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import useSWR from 'swr'

import { RecommendedTime } from './recommend-time'
// import { useOrgId } from './use-org-id'
import { DatePicker } from './date-picker'
import { TimePicker } from './time-picker'
import { RandomPassword } from './random-password'
// import guest from 'images/guest.svg'
import { Avatar } from './avatar.js'

import {
  updateMeeting,
  createScheduleMeeting,
  checkUserAvailable,
  searchMember,
} from 'libs/api/venue'

// import { addToast } from 'modules/app/actions'

// import ToastMsg from 'components/toast-msg'

import './styles.scss'

const mapStateToMeInfo = (state) => state?.query?.DEFAULT?.me?.data || null

export const useMe = () => {
  const me = useSelector(mapStateToMeInfo)
  return me
}
export const validateEmail = (str) => {
  const reg = /^[A-Za-z0-9]+[A-Za-z0-9\-_.]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}$/
  return reg.test(str)
}

export const getAvatar = (avatar) => {
  if (!avatar) {
    return ''
  }
  if (avatar.includes('https://')) {
    return avatar
  }
  if (avatar.includes('svg')) {
    return avatar
  }
  if (avatar.includes('download')) {
    return `${PRODUCT_APP_URL_API}/fm${
      startsWith(avatar, '/') ? avatar : `/${avatar}`
    }`
  }
  return `${PRODUCT_APP_URL_API}/fm/download/${
    startsWith(avatar, '/') ? avatar : `/${avatar}`
  }`
}
const ceilHalfHour = (date) => {
  const min = date.getMinutes()
  const hour = date.getHours()
  if (hour === 23 && min >= 30) return date.getTime()
  return min > 30 ? date.setHours(hour + 1, 0, 0, 0) : date.setMinutes(30, 0, 0)
}

export const reminderOpts = [
  { label: 'Never', value: 0 },
  { label: 'At the time of the meeting', value: 1 },
  { label: '5 minutes before', value: 5 * 60 },
  { label: '15 minutes before', value: 15 * 60 },
  { label: '30 minutes before', value: 30 * 60 },
  { label: '1 hour before', value: 60 * 60 },
  { label: '2 hours before', value: 2 * 60 * 60 },
  { label: '1 day before', value: 24 * 60 * 60 },
]

export const countDownOpts = [
  { label: 'Never', value: 0 },
  { label: '5 minutes', value: 5 * 60 },
  { label: '10 minutes', value: 10 * 60 },
  { label: '15 minutes', value: 15 * 60 },
]

const hourList = [
  '1:00 AM',
  '2:00 AM',
  '3:00 AM',
  '4:00 AM',
  '5:00 AM',
  '6:00 AM',
  '7:00 AM',
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 AM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
  '10:00 PM',
  '11:00 PM',
  '12:00 PM',
]
const MultiValueLabel = (props) => {
  const { avatar, username } = props.data.meta

  return (
    <div className="user-multi-value-label">
      <Avatar
        className="user-multi-value-label-avatar"
        src={avatar && getAvatar(avatar)}
      >
        {username}
      </Avatar>
      <div
        title={username}
        style={{
          maxWidth: 200,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {username}
      </div>
    </div>
  )
}

const AddUserBtn = (props) => {
  return (
    <Button
      iconEl={<AccountPlusIcon size={12} />}
      {...props}
      className={classnames(props.className, 'primary')}
    >
      Add
    </Button>
  )
}

const AcceptedBtn = (props) => {
  const { invited, ...rest } = props
  return (
    <Button
      iconEl={<CheckCircleIcon size={12} />}
      iconBefore
      {...rest}
      className={classnames(props.className, 'accept')}
    >
      {invited ? 'Invited' : 'Added'}
    </Button>
  )
}
const Option = ({ data, innerRef, innerProps, getValue }) => {
  const { avatar, username, email, invitationStatus } = data.meta
  const isSelected = find(getValue(), { value: data?.value })
  return (
    <div ref={innerRef} className="user-option-item" {...innerProps}>
      <Avatar
        className="user-option-item-avatar"
        src={avatar && getAvatar(avatar)}
      >
        {username}
      </Avatar>
      <div className="user-option-item-text">
        <div className="title">{username}</div>
        <div className="desc">{email}</div>
      </div>
      <div>
        {invitationStatus !== 'no_invited' || isSelected ? (
          <AcceptedBtn
            invited={invitationStatus !== 'no_invited'}
          ></AcceptedBtn>
        ) : (
          <AddUserBtn />
        )}
      </div>
    </div>
  )
}

const CELL_HEIGHT = 40
const SelectedTimeSpan = ({
  endTime,
  startTime,
  userAvailableMap,
  meetingDate,
}) => {
  const dateStr = format(meetingDate, 'MM/dd/yyyy')
  const startDate = new Date(dateStr + format(new Date(startTime), ' HH:mm:00'))
  const endDate = new Date(dateStr + format(new Date(endTime), ' HH:mm:00'))
  const height = ((endTime - startTime) / 1000 / 60 / 60) * CELL_HEIGHT
  const startDay = startOfDay(new Date(startTime)).getTime()
  const top = ((startTime - startDay) / 1000 / 60 / 60) * CELL_HEIGHT
  const me = useMe()

  const isOK =
    isEmpty(userAvailableMap) ||
    every(userAvailableMap?.times, (itemList) =>
      every(itemList, (item) => {
        return !areIntervalsOverlapping(
          { start: new Date(item.startTime), end: new Date(item.endTime) },
          { start: startDate, end: endDate },
        )
      }),
    )
  const unsatisfiedUserLen = filter(userAvailableMap?.times, (itemList) =>
    some(itemList, (item) => {
      return areIntervalsOverlapping(
        { start: new Date(item.startTime), end: new Date(item.endTime) },
        { start: startDate, end: endDate },
      )
    }),
  ).length
  const isMeNotOK =
    unsatisfiedUserLen === 1 &&
    some(get(userAvailableMap, `times.${me?.user.subject}`, []), (item) =>
      areIntervalsOverlapping(
        { start: new Date(item.startTime), end: new Date(item.endTime) },
        { start: startDate, end: endDate },
      ),
    )

  const isOKStr = isOK ? 'Available to All.' : ''
  const isMeNotOKStr = isMeNotOK ? 'You are busy.' : ''
  const unsatisfiedUserStr =
    !isMeNotOK && unsatisfiedUserLen > 0
      ? `${unsatisfiedUserLen} are busy.`
      : ''

  return (
    <div
      className={classnames('selected-time-span', { error: !isOK })}
      style={{ height, top }}
    >
      {`${format(startTime, 'HH:mm')}-${format(endTime, 'HH:mm')}`} {isOKStr}
      {isMeNotOKStr}
      {unsatisfiedUserStr}
    </div>
  )
}

const OccupiedSpans = ({ timeRanges }) => {
  return (
    <>
      {map(timeRanges, (item) => {
        return (
          <div
            style={{
              position: 'absolute',
              zIndex: 1,
              width: '100%',
              top: item.startTop,
              height: item.height,
              background: 'rgba(244, 67, 54, 0.1)',
            }}
          ></div>
        )
      })}
    </>
  )
}

const VenueInvite = ({
  meeting,
  visible,
  toggle,
  onSave,
  userProfile,
  email,
  refetch,
}) => {
  const defaultMembers =
    email || useMemo(() => userProfile?.email, [userProfile])
  const maxStartTime = new Date().setHours(23, 30, 0, 0)
  const {
    control,
    handleSubmit,
    watch,
    errors,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      meetingDate: new Date(),
      timeRange: {
        startTime: ceilHalfHour(new Date()),
        endTime:
          ceilHalfHour(new Date()) >= maxStartTime
            ? new Date().setHours(23, 59, 59, 0)
            : addMinutes(ceilHalfHour(new Date()), 30).getTime(),
      },
      members: defaultMembers || undefined,
    },
  })

  // const dispatch = useDispatch()

  useEffect(() => {
    if (!meeting) {
      return
    }
    reset({
      title: meeting?.title,
      password: meeting?.password,
      meetingDate: new Date(meeting?.scheduleStartTime || new Date()),
      timeRange: {
        startTime: new Date(meeting?.scheduleStartTime || new Date()).getTime(),
        endTime: new Date(meeting?.scheduleEndTime || new Date()).getTime(),
      },
      countdown: find(countDownOpts, {
        value: Number(meeting?.countdown),
      }),
      remindTime: find(reminderOpts, {
        value: Number(meeting?.remindTime),
      }),
      members: map(
        filter(
          // getInvitedUsers(meeting),
          (item) => item.subject !== meeting?.hostInfo?.subject,
        ),
        (item) => ({
          label: item.name,
          value: item.email,
          meta: {
            username: item.name,
            email: item.email,
            subject: item.subject,
            avatar: item.pictureUrl,
            invitationStatus: 'invited',
          },
        }),
      ),
    })
  }, [meeting])
  const me = useMe()
  const organizationID = useSelector((state) => state?.shell?.organizationId)

  const meetingDate = watch('meetingDate')
  const timeRange = watch('timeRange')
  const membersValue = watch('members')
  const remindTime = watch('remindTime')
  const countdown = watch('countdown')

  const rightRef = useRef(null)
  // locate the selected time position
  useEffect(() => {
    const startTime = new Date(timeRange.startTime)
    const startDay = startOfDay(startTime)
    const top =
      ((startTime.getTime() - startDay.getTime()) / 1000 / 60 / 60) * 40
    if (rightRef.current) {
      rightRef.current.scrollTop = top
    }
  }, [rightRef, timeRange])
  const subjectList = useMemo(() => {
    return uniq(
      concat(
        [me?.user?.subject],
        // filter(map(membersValue, 'meta.subject'))
      ),
    )
  }, [me, membersValue])
  const userSelectedTime = useMemo(() => {
    const dateStr = format(meetingDate, 'MM/dd/yyyy')
    const startDateStr = formatRFC3339(
      new Date(
        dateStr + format(new Date(timeRange.startTime), ' HH:mm:00'),
      ).getTime(),
    )
    const endDateStr = formatRFC3339(
      new Date(
        dateStr + format(new Date(timeRange.endTime), ' HH:mm:00'),
      ).getTime(),
    )
    return {
      endTime: endDateStr,
      startTime: startDateStr,
      subjects: subjectList,
    }
  }, [timeRange, meetingDate, subjectList])

  const availableUsersParams = useMemo(() => {
    const startDateStr = formatRFC3339(startOfDay(meetingDate))
    const endDateStr = formatRFC3339(endOfDay(meetingDate))
    return {
      endTime: endDateStr,
      startTime: startDateStr,
      subjects: subjectList,
    }
  }, [subjectList, meetingDate])
  const { data: userAvailableMap } = useSWR(
    visible ? [availableUsersParams, 'available-users'] : null,
    checkUserAvailable,
  )
  const loadMembers = useCallback(
    async (keywords) => {
      const params = {
        meetingID: meeting?.id,
        orgID: meeting?.id ? undefined : organizationID,
        keywords,
        offset: 0,
        limit: 50,
      }
      const { data } = await searchMember(0, params)
      return filter(
        map(data, (item) => ({
          label: item.username,
          value: item.email,
          meta: item,
        })),
        (item) => item.value !== me?.email,
      )
    },
    [meeting, organizationID, me],
  )
  const isValidNewOption = useCallback((inputValue, selectValue, options) => {
    if (
      validateEmail(inputValue) &&
      !find(selectValue, { value: inputValue }) &&
      !find(options, { value: inputValue })
    ) {
      return true
    }
    return false
  }, [])
  const getNewOptionData = useCallback((inputValue) => {
    return {
      label: inputValue,
      value: inputValue,
      meta: {
        username: inputValue,
        email: inputValue,
        // avatar: guest,
        invitationStatus: 'no_invited',
      },
    }
  }, [])

  const handleSave = useCallback(
    async (value) => {
      const dateStr = format(value.meetingDate, 'MM/dd/yyyy')
      const startDateStr = formatISO(
        new Date(dateStr + format(value.timeRange.startTime, ' HH:mm:00')),
      )
      const endDateStr = formatISO(
        new Date(dateStr + format(value.timeRange.endTime, ' HH:mm:00')),
      )
      const password = value?.password
      const members = map(value.members, 'meta.email')
      const meetingData = {
        orgId: organizationID,
        title: value.title,
        scheduleStartTime: startDateStr,
        scheduleEndTime: endDateStr,
        members,
        ...(!value.countdown?.value
          ? {}
          : { countdown: String(value.countdown?.value) }),
        ...(!value.remindTime?.value
          ? {}
          : { remindTime: String(value.remindTime?.value) }),
        ...(password ? { password } : {}),
      }
      if (meeting) {
        await updateMeeting(meeting.id, meetingData)
        refetch()
        // addToast({ type: 'confirm', text: t('edit_meeting_successfully') })
      } else {
        await createScheduleMeeting(meetingData)
        toggle(false)
        refetch()
        // addToast({ type: 'confirm', text: t('schedule_successfully') })
      }
      onSave &&
        onSave({
          ...meetingData,
          members: map(value.members, (user) => ({
            subject: user.meta.subject,
            name: user.meta.username,
            email: user.meta.email,
            pictureUrl: getAvatar(user.meta.avatar),
          })),
        })
      toggle(false)
    },
    [organizationID, meeting, onSave, toggle],
  )
  const actions = useMemo(
    () => [
      <Button key={1} flat onClick={toggle}>
        Discard
      </Button>,
      <Button
        key={2}
        flat
        type="submit"
        iconEl={
          isSubmitting ? (
            <CircularProgress scale={0.9} id="submitting-schedule-meeting" />
          ) : undefined
        }
        disabled={isSubmitting}
        onClick={handleSubmit(handleSave)}
        primary
      >
        {meeting ? 'Update meeting' : 'Invite'}
      </Button>,
    ],
    [toggle, handleSubmit, handleSave, isSubmitting],
  )
  const checkAlreadyInvited = useCallback(() => {
    return some(membersValue, (member) => {
      if (member.meta.invitationStatus === 'invited') {
        return true
      }
      return false
    })
  }, [membersValue])
  const isOptionDisabled = useCallback((opt) => {
    return opt.meta.invitationStatus === 'invited'
  }, [])

  const timeRanges = useMemo(() => {
    const list = flatMap(get(userAvailableMap, 'times'))
    const dayStart = startOfDay(meetingDate)
    const dayEnd = endOfDay(meetingDate)
    const listInDay = map(list, (item) => {
      const rs = {
        ...item,
      }
      if (isBefore(new Date(item.startTime), dayStart)) {
        rs.startTime = formatISO(dayStart)
      }
      if (isAfter(new Date(item.endTime), dayEnd)) {
        rs.endTime = formatISO(dayEnd)
      }
      return rs
    })
    const positionList = map(listInDay, (item) => {
      return {
        startTop:
          ((new Date(item.startTime).getTime() - dayStart.getTime()) /
            1000 /
            60 /
            60) *
          CELL_HEIGHT,
        height:
          ((new Date(item.endTime).getTime() -
            new Date(item.startTime).getTime()) /
            1000 /
            60 /
            60) *
          CELL_HEIGHT,
      }
    })
    return positionList
  }, [userAvailableMap, meetingDate])

  return (
    <BaseDialog
      id="new-schedule-meeting-dialog"
      title={meeting ? 'Edit meeting' : 'Schedule meeting'}
      visible={true}
      onHide={toggle}
      width={940}
      height={900}
      actions={actions}
      className={classnames('schedule-meeting-dialog-container')}
      stackedActions={false}
    >
      <div className="schedule-meeting-layout">
        <div className="schedule-meeting-wrapper app-detail">
          <Controller
            name="title"
            as={
              <TextField
                className="schedule-meeting-dialog-text-field"
                label={`Invitation Title`}
                required
                id="schedule-meeting-title"
                error={!!errors?.title}
                errorText={<ErrorMessage errors={errors} name="title" />}
              />
            }
            control={control}
            rules={{
              required: 'Meeting Title is required.',
            }}
          />
          <Controller
            name="members"
            as={
              <AsyncSelect
                isValidNewOption={isValidNewOption}
                isOptionDisabled={isOptionDisabled}
                getNewOptionData={getNewOptionData}
                isClearable={!checkAlreadyInvited()}
                components={{ MultiValueLabel, Option }}
                menuPortalTarget={document.body}
                cacheOptions
                defaultOptions
                backspaceRemovesValue={false}
                loadOptions={loadMembers}
                hideSelectedOptions={false}
                placeholder={'Invite member'}
                className="inviteContainer"
                styles={{
                  menuPortal: (prev) => ({ ...prev, zIndex: 21 }),
                  container: (prev) => ({
                    ...prev,
                    minHeight: 50,
                    marginBottom: 10,
                    ':before': {
                      content: isEmpty(membersValue)
                        ? undefined
                        : `"${'invite member'}*"`,
                      position: 'absolute',
                      top: '-6px',
                      left: '10px',
                      background: '#fff',
                      padding: '0 5px',
                      zIndex: '5',
                      fontSize: '12px',
                      display: 'block',
                    },
                  }),
                  control: (prev) => ({ ...prev, minHeight: 50 }),
                  multiValue: (prev, state) => {
                    const { subject } = state.data.meta
                    const list = get(userAvailableMap, `times.${subject}`) || []
                    const isErr =
                      timeRange.valid &&
                      some(list, (item) =>
                        areIntervalsOverlapping(
                          {
                            start: new Date(item.startTime),
                            end: new Date(item.endTime),
                          },
                          {
                            start: new Date(userSelectedTime.startTime),
                            end: new Date(userSelectedTime.endTime),
                          },
                        ),
                      )
                    const rs = { ...prev, borderRadius: 15 }
                    if (isErr) {
                      rs.backgroundColor = '#f43f32'
                      rs.color = '#fff'
                    }
                    return rs
                  },
                  multiValueRemove: (prev, state) => {
                    const hide = state.data.meta.invitationStatus === 'invited'
                    return {
                      ...prev,
                      borderBottomRightRadius: 15,
                      borderTopRightRadius: 15,
                      ...(hide ? { display: 'none' } : {}),
                    }
                  },
                  valueContainer: (prev) => {
                    return { ...prev, maxHeight: '144px', overflow: 'auto' }
                  },
                }}
                isMulti
              />
            }
            control={control}
            rules={{
              required: 'Meeting Email is required.',
            }}
          />
          <div className="meeting-date-wrapper">
            <Controller
              name="meetingDate"
              as={
                <DatePicker
                  defaultValue={meetingDate}
                  maxDate={meeting ? undefined : subDays(new Date(), 1)}
                  error={!!errors?.meetingDate}
                  errorText={
                    <ErrorMessage name="meetingDate" errors={errors} />
                  }
                />
              }
              control={control}
              rules={{
                required: 'Meeting Date is required',
              }}
            />
            <Controller
              name="timeRange"
              as={
                <TimePicker
                  defaultStart={timeRange.startTime}
                  defaultEnd={timeRange.endTime}
                  dateTest={meetingDate}
                />
              }
              control={control}
              rules={{
                validate: (data) => data.startTime < data.endTime,
              }}
            />
          </div>
          <div>
            <Controller
              name="timeRange"
              as={<RecommendedTime availableUsersParams={userSelectedTime} />}
              control={control}
            />
          </div>
          <div className="meeting-date-wrapper">
            <Controller
              name="remindTime"
              control={control}
              as={
                <Select
                  placeholder={'Reminder'}
                  options={reminderOpts.map((i) => ({ ...i, label: i.label }))}
                  menuPortalTarget={document.body}
                  isClearable={false}
                  className="selectContainer"
                  styles={{
                    container: (prev) => ({
                      ...prev,
                      minHeight: 50,
                      marginBottom: 10,
                      flex: 1,
                      marginRight: 10,
                      ':before': {
                        content: remindTime ? `"Reminder"` : undefined,
                        position: 'absolute',
                        top: '-6px',
                        left: '10px',
                        background: '#fff',
                        padding: '0 5px',
                        zIndex: '5',
                        fontSize: '12px',
                        display: 'block',
                      },
                    }),
                    menuPortal: (prev) => ({ ...prev, zIndex: 21 }),
                  }}
                />
              }
            ></Controller>
            <Controller
              name="countdown"
              control={control}
              as={
                <Select
                  placeholder={'Countdown'}
                  options={countDownOpts.map((i) => ({
                    ...i,
                    label: i.label,
                  }))}
                  menuPortalTarget={document.body}
                  isClearable={false}
                  className="selectContainer"
                  styles={{
                    container: (prev) => {
                      return {
                        ...prev,
                        minHeight: 50,
                        marginBottom: 10,
                        flex: 1,
                        ':before': {
                          content: countdown ? `"Countdown"` : undefined,
                          position: 'absolute',
                          top: '-6px',
                          left: '10px',
                          background: '#fff',
                          padding: '0 5px',
                          zIndex: '5',
                          fontSize: '12px',
                          display: 'block',
                        },
                      }
                    },
                    menuPortal: (prev) => ({ ...prev, zIndex: 21 }),
                  }}
                />
              }
            ></Controller>
          </div>
          {((meeting && meeting.password) || !meeting) && (
            <Controller
              name="password"
              as={<RandomPassword disabled={!!meeting} />}
              control={control}
            />
          )}
        </div>
        <div className="schedule-meeting-right" ref={rightRef}>
          <div className="calender-label">
            {format(meetingDate, 'EEEE, dd MMM yyyy')}
          </div>
          <div className="calendar-hour-list">
            {map(hourList, (hour) => {
              return (
                <div className="calender-hour-box" key={hour}>
                  <div className="hour-info">{hour}</div>
                  <div className="calender-separator"></div>
                </div>
              )
            })}
            <OccupiedSpans timeRanges={timeRanges} />
            <SelectedTimeSpan
              userAvailableMap={userAvailableMap}
              startTime={timeRange.startTime}
              endTime={timeRange.endTime}
              meetingDate={meetingDate}
            />
          </div>
        </div>
      </div>
    </BaseDialog>
  )
}

export default VenueInvite
