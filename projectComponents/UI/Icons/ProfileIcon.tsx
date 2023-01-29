import React from 'react'

export type ProfileIconProps = {
  fill: string
  className: string
  textColor: string
  onClick: any
}

const ProfileIcon = (props: ProfileIconProps) => {

  const {
    fill,
    className,
    textColor,
    onClick
  } = props
  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', gap: '4px'}} onClick={onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={className}>
        <path 
            fill={fill}
            d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
        />
    </svg>
    <div style={{color: textColor}}>
        Log in
    </div>
    </div>
  )
}

export default ProfileIcon