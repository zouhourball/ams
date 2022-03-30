const fileDataFormatter = (files) =>
  files?.map((file) => ({
    apiID: file?.id,
    url: file?.url,
    size: file?.size,
    bucket: file?.bucket,
    filename: file?.filename,
    subject: file?.subject,
    contentType: file?.contentType,
  }))

export default fileDataFormatter
