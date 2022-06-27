import React from 'react'

import helloWorldProto from 'protos/hello-world.proto'

const client = new helloWorldProto.HelloWorldClient(GRPC_API)

const GRPCExample = () => {
  return (
    <>
      Click{' '}
      <button
        onClick={() => {
          const versionRequest = new helloWorldProto.VersionRequest()
          client.getVersion(versionRequest, {}, (err, res) => {
            if (err) {
            } else {
              alert(JSON.stringify(res.toObject()))
            }
          })
        }}
      >
        here
      </button>{' '}
      to get version from GRPC web api.
    </>
  )
}

export default GRPCExample
