import React from 'react'
import styled from 'styled-components'

export const CardStyle = styled.div`
  border-radius: 10px;
  margin: 12px 0px 24px 0px;
  box-shadow: 0 0 8px 3px #d9d9d9;
  padding: 24px;
  background-color: #ffffff;
`

export const CardLabel = styled.div`
  margin: 12px 0px;
  font-size: 20px;
  text-align: left !important;
  font-weight: bold;
`

export const FormLabel = styled.div`
  margin: 6px 0px;
  font-size: 16px;
  text-align: left;
  font-weight: 600;
`

export const Card = ({ title, info, children }) => (
  <>
    <CardLabel>
      {title}
      {info && (
        <span
          style={{
            marginLeft: 21,
            fontSize: 12,
            color: '#999999',
            fontWeight: 500,
            letterSpacing: 0.2,
          }}
        >
          <span className="icon">
            <i className="fas fa-info-circle"></i>
          </span>
          {info}
        </span>
      )}
    </CardLabel>
    <CardStyle>{children}</CardStyle>
  </>
)

export const FormField = ({ label, children }) => {
  return (
    <div style={{ margin: '12px 0px' }}>
      {label && <FormLabel>{label}</FormLabel>}
      {children}
    </div>
  )
}

export const FormInput = ({ name, value, updateState, placeholder }) => {
  return (
    <input
      className="input"
      type="text"
      name={name}
      value={value || ''}
      placeholder={placeholder}
      onChange={(e) => updateState({ [e.target.name]: e.target.value })}
      style={{
        border: 'solid 1px #e6e6e6',
        fontSize: '14px',
      }}
    />
  )
}
