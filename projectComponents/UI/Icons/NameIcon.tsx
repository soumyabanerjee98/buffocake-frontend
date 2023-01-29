import React from 'react'

export type NameIconProps = {
    firstName: string
    lastName: string
    className: string
}

const NameIcon = (props: NameIconProps) => {
    const { 
        firstName,
        lastName,
        className
    } = props
  return (
    <div className={className}>
        {firstName?.split('')[0]}{lastName?.split('')[0]}
    </div>
  )
}

export default NameIcon