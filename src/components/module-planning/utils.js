export const buildObjectFromArray = (arr) => {
  const keys = arr.map((el) => el.year + '')
  let object = {}

  keys.forEach((key, index) => {
    object = { ...object, [key]: arr[index]?.value || '' }
  })

  return object
}
