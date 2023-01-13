import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const PageNotFound = () => {
  const redirect = useRouter();
  return (
    <div>
      Oops! Page not found
      <div style={{cursor: 'pointer'}} onClick={() => redirect.push('/')}>Go back to Home</div>
    </div>
  )
}

export default PageNotFound