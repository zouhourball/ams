const getFileExtention = (str) => {
  return str.substring(str.lastIndexOf('.') + 1, str.length)
}

const getFileIcon = (str) => {
  switch (getFileExtention(str)) {
    case 'doc':
      return `mdi mdi-file-word `

    case 'pdf':
      return `mdi mdi-file-pdf `

    case 'zip':
      return `mdi mdi-zip-box `

    case 'js':
      return `mdi mdi-language-javascript`

    case 'html':
      return `mdi mdi-language-html5 `

    default:
      return `mdi mdi-file `
  }
}

export default getFileIcon
