export const validForm = (fields) => {
  const emptyFields = fields.filter((field) => !field?.value && field.required)
  return !!emptyFields?.length
}
