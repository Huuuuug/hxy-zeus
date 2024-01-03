import { useRouteError } from 'react-router-dom'

const ErrorBoundary = () => {
  const error = useRouteError()
  return <>{error}</>
}

export default ErrorBoundary
