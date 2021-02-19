import styled from 'styled-components'
import {LIGHT_GRAY, MEDIUM_BLUE} from '../../colors'

export const ToggleButton = styled.button`
  border-width: 0;
  background-color: ${(props) => (props.isActive ? MEDIUM_BLUE : LIGHT_GRAY)};
  color: white;
  border-radius: ${(props) => (props.isLeft ? '12px 0px 0px 12px' : '0px 12px 12px 0px')};
  height: 28px;
  width: 115px;
  outline: none;
  cursor: pointer;
`

export const Button = styled.button`
  border-width: 0;
  background-color: ${(props) => props.color};
  margin-right: 15px;
  padding: 1rem;
  display: ${(props) => (props.show ? 'flex' : 'none')};
`