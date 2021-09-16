import styled from 'styled-components';
import Common from './common';

// ---------------------------------------------------------------------

export default styled(Common)`
input[type=checkbox] + label .check {
  display: none;
}
`;
