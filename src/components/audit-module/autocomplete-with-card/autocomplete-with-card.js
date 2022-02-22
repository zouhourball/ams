import { useState } from 'react'
import { FontIcon, Autocomplete, Avatar } from 'react-md'
import { cls } from 'reactutils'

import './style.scss'

const AutocompleteWithCard = ({
  membersList,
  selectedMembers,
  setSelectedMembers,
  className,
  cardClassName,
  placeholder,
}) => {
  const [participant, setParticipant] = useState('')

  return (
    <>
      <Autocomplete
        focusInputOnAutocomplete
        id={'autocomplete-suggestion'}
        className={cls('autoComplete-field', className)}
        // filter={Autocomplete.caseInsensitiveFilter}
        placeholder={placeholder}
        data={membersList?.filter(
          (el) =>
            !selectedMembers.some(
              (selectedEl) => el.subject === selectedEl.subject,
            ),
        )}
        value={participant}
        dataValue={'subject'}
        dataLabel={'name'}
        onChange={setParticipant}
        simplifiedMenu={false}
        onAutocomplete={(suggestion, suggestionIndex, matches) => {
          setSelectedMembers([...selectedMembers, matches[suggestionIndex]])
          setParticipant('')
        }}
        rightIcon={<FontIcon>search</FontIcon>}
      />
      {selectedMembers?.map((el) => (
        <div key={el} className={cls('autocomplete', cardClassName)}>
          <div className="member-card">
            <Avatar
              src={
                membersList?.find((item) => item?.subject === el?.subject)
                  ?.avatar
              }
            />
            <div className="info-section">
              <div className="name">
                {
                  membersList?.find((item) => item?.subject === el?.subject)
                    ?.name
                }
              </div>
              <div className="email">
                {
                  membersList?.find((item) => item?.subject === el?.subject)
                    ?.email
                }
              </div>
            </div>
            <FontIcon
              onClick={() =>
                setSelectedMembers(
                  selectedMembers?.filter((item) => item !== el),
                )
              }
            >
              close
            </FontIcon>
          </div>
        </div>
      ))}
    </>
  )
}
export default AutocompleteWithCard
