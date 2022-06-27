import React, { Fragment } from 'react'
import { Link } from '@reach/router'

const Introduction = () => (
  <Fragment>
    <h1 className="introduction-title">Introduction</h1>
    <h3>
      <Link to="/multi-thread-example">Multi Thread</Link>
    </h3>
    <h3>
      <Link to="/redux-example">Redux Example</Link>
    </h3>
    <h3>
      <Link to="/grpc-example">GRPC Example</Link>
    </h3>
  </Fragment>
)

export default Introduction
