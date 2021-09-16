import { MOBILE_BREAKPOINT } from '../constants';
import type { StyleProps } from '../typings';
import styled from 'styled-components';

// ---------------------------------------------------------------------

export default styled.div<StyleProps>`
display: none;

@media (max-width: ${MOBILE_BREAKPOINT}px) {
  display: ${({ open }) => (open ? 'block' : 'none')};
  background: rgba(0,0,0,.5);
  position: fixed;
  z-index: 999;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
}
`;
