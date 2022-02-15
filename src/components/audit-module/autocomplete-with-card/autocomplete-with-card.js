import { useState } from 'react'
import { FontIcon, Autocomplete, Avatar } from 'react-md'
import { cls } from 'reactutils'

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
          (el) => !selectedMembers?.includes(el?.subject),
        )}
        value={participant}
        dataValue={'subject'}
        dataLabel={'name'}
        onChange={setParticipant}
        onAutocomplete={(v) => {
          setSelectedMembers([...selectedMembers, v])
          setParticipant('')
        }}
        rightIcon={<FontIcon>search</FontIcon>}
      />
      {selectedMembers?.map((el) => (
        <div key={el} className={cls('autocomplete', cardClassName)}>
          <div>
            <Avatar
              src={membersList?.find((item) => item?.subject === el)?.avatar}
            />
            <div>
              <div>
                {membersList?.find((item) => item?.subject === el)?.name}
              </div>
              <div>
                {membersList?.find((item) => item?.subject === el)?.email}
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
