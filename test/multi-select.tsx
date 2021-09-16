import React, { FunctionComponent, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SelectProps } from '../src/typings';
import { OPTION_CLASS } from '../src/constants';
import Select from '../src/smart-select';
import { expect } from 'chai';

// ---------------------------------------------------------------------

type WrapProps = Omit<SelectProps, 'options' | 'onChange'>

const option  = { selector: `.${OPTION_CLASS}` };
const options = [
  { value: 'alice', label: 'alice' },
  { value: 'bob', label: 'bob' },
  { value: 'carol', label: 'carol' }
];

const WrapSelect: FunctionComponent<WrapProps> = (props) => {
  const [ state, setState ] = useState(props.value);

  return (
    <Select multi value={state} options={options} onChange={setState} />
  );
};

function isSelected(text: string) {
  const label = screen.queryByText(text, option);

  if (label !== null) {
    const input = label.previousSibling as HTMLInputElement;

    return input ? input.checked : false;
  }

  return false;
}

// ---------------------------------------------------------------------

describe('the multi select', () => {
  it('renders an empty value', () => {
    render(<WrapSelect />);

    expect(screen.queryByText('alice, bob, carol')).to.eq(null);

    expect(isSelected('alice')).to.eq(false);
    expect(isSelected('bob')).to.eq(false);
    expect(isSelected('carol')).to.eq(false);
  });

  it('renders the default value (1)', () => {
    render(<WrapSelect value={options} />);

    expect(screen.queryByText('alice, bob, carol')).to.be.instanceof(HTMLElement);

    expect(isSelected('alice')).to.eq(true);
    expect(isSelected('bob')).to.eq(true);
    expect(isSelected('carol')).to.eq(true);
  });

  it('renders the default value (2)', () => {
    const edit = [
      { value: 'carol', label: 'carol' },
      { value: 'bob', label: 'bob' }
    ];

    render(<WrapSelect value={edit} />);

    expect(screen.queryByText('alice, bob, carol')).to.eq(null);
    expect(screen.queryByText('bob, carol')).to.be.instanceof(HTMLElement);

    expect(isSelected('alice')).to.eq(false);
    expect(isSelected('bob')).to.eq(true);
    expect(isSelected('carol')).to.eq(true);
  });

  it('deselects the whole list', () => {
    render(<WrapSelect value={options} />);

    userEvent.click(screen.getByText('alice, bob, carol'));
    userEvent.click(screen.getByText('alice', option));
    userEvent.click(screen.getByText('bob', option));
    userEvent.click(screen.getByText('carol', option));

    expect(isSelected('alice')).to.eq(false);
    expect(isSelected('bob')).to.eq(false);
    expect(isSelected('carol')).to.eq(false);
    expect(screen.queryByText('alice, bob, carol')).to.eq(null);
  });

  it('selects the whole list', () => {
    render(<WrapSelect />);

    userEvent.click(document.getElementsByTagName('button')[0]);
    userEvent.click(screen.getByText('alice', option));
    userEvent.click(screen.getByText('carol', option));
    userEvent.click(screen.getByText('bob', option));

    expect(isSelected('alice')).to.eq(true);
    expect(isSelected('bob')).to.eq(true);
    expect(isSelected('carol')).to.eq(true);
    expect(screen.queryByText('alice, bob, carol')).to.be.instanceof(HTMLElement);
  });

  it('selects bob', () => {
    render(<WrapSelect />);

    userEvent.click(document.getElementsByTagName('button')[0]);
    userEvent.click(screen.getByText('bob', option));

    expect(isSelected('alice')).to.eq(false);
    expect(isSelected('bob')).to.eq(true);
    expect(isSelected('carol')).to.eq(false);
    expect(screen.queryAllByText('bob')).to.have.length(2);
  });

  it('deselects bob', () => {
    render(<WrapSelect value={options} />);

    userEvent.click(screen.getByText('alice, bob, carol'));
    userEvent.click(screen.getByText('bob', option));

    expect(isSelected('alice')).to.eq(true);
    expect(isSelected('bob')).to.eq(false);
    expect(isSelected('carol')).to.eq(true);
    expect(screen.queryByText('alice, carol')).to.be.instanceof(HTMLElement);
  });

  it('deselects bob and carol', () => {
    render(<WrapSelect value={options} />);

    userEvent.click(screen.getByText('alice, bob, carol'));
    userEvent.click(screen.getByText('bob', option));
    userEvent.click(screen.getByText('carol', option));

    expect(isSelected('alice')).to.eq(true);
    expect(isSelected('bob')).to.eq(false);
    expect(isSelected('carol')).to.eq(false);
    expect(screen.queryAllByText('alice')).to.have.length(2);
  });

  it('deselects bob and selects him again', () => {
    render(<WrapSelect value={options} />);

    userEvent.click(screen.getByText('alice, bob, carol'));
    userEvent.click(screen.getByText('bob', option));
    userEvent.click(screen.getByText('bob', option));

    expect(isSelected('alice')).to.eq(true);
    expect(isSelected('bob')).to.eq(true);
    expect(isSelected('carol')).to.eq(true);
    expect(screen.queryByText('alice, bob, carol')).to.be.instanceof(HTMLElement);
  });

  it('deselects and selects a couple of times', () => {
    render(<WrapSelect value={options} />);

    userEvent.click(screen.getByText('alice, bob, carol'));
    userEvent.click(screen.getByText('bob', option));
    userEvent.click(screen.getByText('carol', option));
    userEvent.click(screen.getByText('bob', option));

    expect(isSelected('alice')).to.eq(true);
    expect(isSelected('bob')).to.eq(true);
    expect(isSelected('carol')).to.eq(false);
    expect(screen.queryByText('alice, bob')).to.be.instanceof(HTMLElement);
  });
});
