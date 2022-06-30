import { Router, Redirect } from '@reach/router'

const NotFound = () => {
  return (
    <Router>
      <Redirect from="/" to="/" noThrow />
    </Router>
  )
}

export default NotFound
