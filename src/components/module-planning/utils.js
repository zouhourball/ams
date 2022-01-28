export const buildObjectFromArray = (arr, key = 'year') => {
  const keys = arr.map((el) => el[key] + '')
  let object = {}

  keys.forEach((key, index) => {
    object = { ...object, [key]: arr[index]?.value || '' }
  })

  return object
}
