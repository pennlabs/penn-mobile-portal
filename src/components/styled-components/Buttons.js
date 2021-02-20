import styled from 'styled-components'
import colors from '../../colors'

export const ToggleButton = styled.button`
  border-width: 0;
  background-color: ${(props) => (props.isActive ? colors.MEDIUM_BLUE : colors.LIGHT_GRAY)};
  color: white;
  border-radius: ${(props) => (props.isLeft ? '12px 0px 0px 12px' : '0px 12px 12px 0px')};
  height: 28px;
  width: 115px;
  outline: none;
  cursor: pointer;
`

export const Button = styled.button`
  margin: 16px 8px 0px 0px;
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
`
