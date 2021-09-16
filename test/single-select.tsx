import { LABEL_CLASS, OPTION_CLASS } from '../src/constants';
import React, { FunctionComponent, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SelectProps, RSSOptions } from '../src/typings';
import Select from '../src/smart-select';
import { expect } from 'chai';

// ---------------------------------------------------------------------

type WrapProps = Omit<SelectProps, 'options' | 'onChange'>

const option = { selector: `.${OPTION_CLASS}` };
const button = { selector: `.${LABEL_CLASS}` };
const value  = { value: 'A', label: 'A' };

const options: RSSOptions = [
  { value: 'A', label: 'A', extra: 1 },
  { value: 'B', label: 'B', extra: 2 }
];

const WrapSelect: FunctionComponent<WrapProps> = (props) => {
  const [ state, setState ] = useState(props.value);

  return (
    <Select value={state} options={options} onChange={setState} />
  );
};

// ---------------------------------------------------------------------

describe('the single select', () => {
  it('renders an empty value', () => {
    render(<WrapSelect />);

    expect(screen.queryByText('A', button)).to.eq(null);
    expect(screen.queryByText('B', button)).to.eq(null);
  });

  it('renders the default value (1)', () => {
    render(<WrapSelect value={value} />);

    expect(screen.queryByText('A', button)).to.be.instanceof(HTMLElement);
    expect(screen.queryByText('B', button)).to.eq(null);
  });

  it('renders the default value (2)', () => {
    const edit = { value: 'B', label: 'B' };

    render(<WrapSelect value={edit} />);

    expect(screen.queryByText('A', button)).to.eq(null);
    expect(screen.queryByText('B', button)).to.be.instanceof(HTMLElement);
  });

  it('selects B', () => {
    render(<WrapSelect value={value} />);

    userEvent.click(screen.getByText('A', button));
    userEvent.click(screen.getByText('B', option));

    expect(screen.queryByText('A', button)).to.eq(null);
    expect(screen.queryByText('B', button)).to.be.instanceof(HTMLElement);
  });

  it('selects A (1)', () => {
    render(<WrapSelect value={value} />);

    userEvent.click(screen.getByText('A', button));
    userEvent.click(screen.getByText('B', option));
    userEvent.click(screen.getByText('B', button));
    userEvent.click(screen.getByText('A', option));

    expect(screen.queryByText('A', button)).to.be.instanceof(HTMLElement);
    expect(screen.queryByText('B', button)).to.eq(null);
  });

  it('selects A (2)', () => {
    render(<WrapSelect value={value} />);

    userEvent.click(screen.getByText('A', button));
    userEvent.click(screen.getByText('A', option));

    expect(screen.queryByText('A', button)).to.be.instanceof(HTMLElement);
    expect(screen.queryByText('B', button)).to.eq(null);
  });
});
