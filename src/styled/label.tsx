import type { StyleProps } from '../typings';
import styled from 'styled-components';

// ---------------------------------------------------------------------

export default styled.button<StyleProps>`
transition: color .15s ease-in-out,
  background-color .15s ease-in-out,
  border-color .15s ease-in-out,
  box-shadow .15s ease-in-out;

border-bottom-color: ${({ open }) => (open ? '#6200ee' : 'rgba(0,0,0,.4)')};
border-width: 0 0 2px;

justify-content: space-between;
cursor: pointer;
display: flex;
width: 100%;

letter-spacing: .009375em;
padding: .375rem .75rem;
line-height: 1.75rem;
white-space: nowrap;
margin: 0;

background: inherit;
border-radius: inherit;
font-family: inherit;
text-align: inherit;
font-size: inherit;
color: inherit;

&:hover {
  background: rgba(0,0,0,.15);
}

&:after {
  transform: ${({ open }) => (open ? 'scale(1, -1)' : 'none')};
  font-weight: normal;
  font-style: normal;
  content: "\\25BE";
  text-align: right;
  margin-left: 1em;
  flex-grow: 1;
}
`;
