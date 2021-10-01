import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { colors } from '../../utils/constants'

const ToggleButtonStyle = styled.button`
  border-width: 0;
  background-color: ${(props) =>
    props.isActive ? colors.MEDIUM_BLUE : colors.LIGHT_GRAY};
  color: white;
  border-radius: ${(props) =>
    props.isLeft ? '12px 0px 0px 12px' : '0px 12px 12px 0px'};
  height: 28px;
  width: 115px;
  outline: none;
  cursor: pointer;
`

export const ToggleButton = ({ post }) => {
  return post ? (
    <div className="level-left" style={{ marginBottom: '24px' }}>
      <ToggleButtonStyle isActive={true} isLeft={true}>
        New Post
      </ToggleButtonStyle>
      <Link to="/polls">
        <ToggleButtonStyle isActive={false} isLeft={false}>
          New Poll
        </ToggleButtonStyle>
      </Link>
    </div>
  ) : (
    <div className="level-left" style={{ marginBottom: '24px' }}>
      <Link to="/post">
        <ToggleButtonStyle isActive={false} isLeft={true}>
          New Post
        </ToggleButtonStyle>
      </Link>
      <ToggleButtonStyle isActive={true} isLeft={false}>
        New Poll
      </ToggleButtonStyle>
    </div>
  )
}

export const Button = styled.button`
  margin: 8px 8px 0px 0px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  border: solid 0 #979797;
  background-color: ${(props) => props.color};
  color: #ffffff;
  border-radius: 5px;
  outline: none;
  padding: 0px 15px 0px 15px;
  display: ${(props) => (props.hide ? 'none' : 'flex')};
  cursor: pointer;
`
