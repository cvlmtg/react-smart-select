import styled from 'styled-components';

// ---------------------------------------------------------------------

export default styled.li`
background: inherit;
padding: 0;
margin: 0;

> input {
  pointer-events: none;
  position:absolute;
  z-index: -9999;
  opacity: 0;
}

input:focus-visible + label {
  outline: auto;
}

> label {
  cursor: pointer;
  display: block;

  padding: .75rem 1rem;
  white-space: nowrap;
  text-align: inherit;
  font-size: inherit;
  margin: 0;

  background: transparent;
  font-family: inherit;
  text-align: inherit;
  font-size: inherit;
  color: inherit;

  &.selected:hover {
    background: rgba(98,0,238,.16);
  }

  &.selected {
    background: rgba(98,0,238,.08);
  }

  &:hover {
    background: rgba(0,0,0,.05);
  }
}
`;
