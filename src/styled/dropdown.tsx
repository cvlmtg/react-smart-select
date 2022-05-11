import { MOBILE_BREAKPOINT } from '../constants';
import type { StyleProps } from '../typings';
import styled from 'styled-components';

// ---------------------------------------------------------------------

export default styled.ul<StyleProps>`
box-shadow: 0 5px 5px -3px rgb(0 0 0 / 20%),
  0 8px 10px 1px rgb(0 0 0 / 14%),
  0 3px 14px 2px rgb(0 0 0 / 12%);

display: none;

border-radius: 0 0 4px 4px;
min-width: 100%;
z-index: 1000;
border: 0;

list-style: none;
padding: 0;
margin: 0;

background: inherit;
font-family: inherit;
text-align: inherit;
font-size: inherit;
color: inherit;

@media (max-width: ${MOBILE_BREAKPOINT}px) {
  inset: 50% 1rem auto 1rem !important;
  transform: translateY(-50%) !important;
  position: fixed !important;

  max-height: calc(85% - 1rem);
  min-width: unset;
  min-height: 50%;
  height: auto;
  width: auto;

  border-radius: 4px;
  overflow: auto;
}
`;
