import React from 'react'

export default function Container({ children, width}) {
  return (
    <div className={`container ${width ? width : 'w-[90%]'}`}>
      {children}
    </div>
  )
}
