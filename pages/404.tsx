import Link from 'next/link'
import React from 'react'

const PageNotFound = () => {
  return (
    <div>
      Oops! Page not found
      <Link href={'/'}>Go back to Home</Link>
    </div>
  )
}

export default PageNotFound