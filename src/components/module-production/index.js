import SupportedDocument from 'components/supported-document'

const Production = () => {
  return (
    <div>
      <SupportedDocument onSaveUpload={(files, filesToDelete) => { console.log('files:', files, 'files to delete:', filesToDelete, 'here') }}/>
    </div>
  )
}
export default Production
