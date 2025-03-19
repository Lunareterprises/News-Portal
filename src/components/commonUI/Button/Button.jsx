import React from 'react'

function Button({className, label}) {
  return (
    <div>
      <button className={className}>
        {label}
      </button>
    </div>
  )
}

export default Button
