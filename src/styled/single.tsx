import styled from 'styled-components';
import Option from './option';

// ---------------------------------------------------------------------

export default styled(Option)`
input[type=checkbox] + label .check {
  display: none;
}
`;
