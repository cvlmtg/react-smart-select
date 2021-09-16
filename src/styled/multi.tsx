import styled from 'styled-components';
import Option from './option';

// ---------------------------------------------------------------------

export default styled(Option)`
input[type=checkbox] + label .check {
  display: inline-block;
  position: relative;
  height: 1rem;
  width: 1rem;
  top: 0.3rem;

  border: 2px solid #6200ee;
  background: transparent;
  border-radius: 3px;
  margin-right: 8px;
}

input[type=checkbox]:checked + label .check {
  background: #6200ee;

  &:after {
    position: absolute;
    height: 0.6rem;
    width: 0.3rem;
    left: 0.25rem;
    content: "";

    border-bottom: 3px solid white;
    border-right: 3px solid white;
    transform: rotate(45deg);
    border-left: none;
    border-top: none;
  }
}
`;
