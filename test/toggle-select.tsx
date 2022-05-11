import { render, screen, cleanup, act } from '@testing-library/react';
import React, { FunctionComponent, useState } from 'react';
import userEvent from '@testing-library/user-event';
import type { SelectProps } from '../src/typings';
import { OPTION_CLASS } from '../src/constants';
import Select from '../src/smart-select';
import { expect } from 'chai';

// ---------------------------------------------------------------------

type WrapProps = Omit<SelectProps, 'options' | 'onChange'>

const option  = { selector: `.${OPTION_CLASS}` };
const options = [
  { value: 'everyone', label: 'everyone' },
  { value: 'alice', label: 'alice' },
  { value: 'bob', label: 'bob' },
  { value: 'carol', label: 'carol' }
];

const WrapSelect: FunctionComponent<WrapProps> = (props) => {
  const { value, ...rest }  = props;
  const [ state, setState ] = useState(value);

  /* eslint-disable react/jsx-props-no-spreading */

  return (
    <Select toggle {...rest} value={state} options={options}
      onChange={setState} />
  );

  /* eslint-enable */
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

describe('the toggle select', () => {
  let events;

  before(() => {
    events = userEvent.setup();
  });

  it('renders an empty value', () => {
    render(<WrapSelect />);

    expect(screen.queryByText('everyone, alice, bob, carol')).to.eq(null);

    expect(isSelected('everyone')).to.eq(false);
    expect(isSelected('alice')).to.eq(false);
    expect(isSelected('bob')).to.eq(false);
    expect(isSelected('carol')).to.eq(false);
    cleanup();
  });

  it('renders the placeholder value', () => {
    render(<WrapSelect placeholder="foo" />);

    expect(screen.queryByText('foo')).to.be.instanceof(HTMLElement);
    expect(screen.queryByText('everyone, alice, bob, carol')).to.eq(null);

    expect(isSelected('everyone')).to.eq(false);
    expect(isSelected('alice')).to.eq(false);
    expect(isSelected('bob')).to.eq(false);
    expect(isSelected('carol')).to.eq(false);
    cleanup();
  });

  it('renders the default value (1)', () => {
    render(<WrapSelect value={options} />);

    expect(screen.queryByText('everyone, alice, bob, carol')).to.be.instanceof(HTMLElement);

    expect(isSelected('everyone')).to.eq(true);
    expect(isSelected('alice')).to.eq(true);
    expect(isSelected('bob')).to.eq(true);
    expect(isSelected('carol')).to.eq(true);
    cleanup();
  });

  it('renders the default value (2)', () => {
    const edit = [
      { value: 'carol', label: 'carol' },
      { value: 'bob', label: 'bob' }
    ];

    render(<WrapSelect value={edit} />);

    expect(screen.queryByText('everyone, alice, bob, carol')).to.eq(null);
    expect(screen.queryByText('bob, carol')).to.be.instanceof(HTMLElement);

    expect(isSelected('everyone')).to.eq(false);
    expect(isSelected('alice')).to.eq(false);
    expect(isSelected('bob')).to.eq(true);
    expect(isSelected('carol')).to.eq(true);
    cleanup();
  });

  it('deselects the whole list', async () => {
    render(<WrapSelect value={options} />);

    await act(async () => {
      await events.click(screen.getByText('everyone, alice, bob, carol'));
      await events.click(screen.getByText('everyone', option));
    });

    expect(isSelected('everyone')).to.eq(false);
    expect(isSelected('alice')).to.eq(false);
    expect(isSelected('bob')).to.eq(false);
    expect(isSelected('carol')).to.eq(false);
    expect(screen.queryByText('everyone, alice, bob, carol')).to.eq(null);
  });

  it('selects the whole list (1)', async () => {
    render(<WrapSelect value={options} />);

    await act(async () => {
      await events.click(screen.getByText('everyone, alice, bob, carol'));
      await events.click(screen.getByText('everyone', option));
      await events.click(screen.getByText('everyone', option));
    });

    expect(isSelected('everyone')).to.eq(true);
    expect(isSelected('alice')).to.eq(true);
    expect(isSelected('bob')).to.eq(true);
    expect(isSelected('carol')).to.eq(true);
    expect(screen.queryByText('everyone, alice, bob, carol')).to.be.instanceof(HTMLElement);
  });

  it('selects the whole list (2)', async () => {
    render(<WrapSelect value={options} />);

    await act(async () => {
      await events.click(screen.getByText('everyone, alice, bob, carol'));
      await events.click(screen.getByText('everyone', option));
      await events.click(screen.getByText('alice', option));
      await events.click(screen.getByText('bob', option));
      await events.click(screen.getByText('carol', option));
    });

    expect(isSelected('everyone')).to.eq(true);
    expect(isSelected('alice')).to.eq(true);
    expect(isSelected('bob')).to.eq(true);
    expect(isSelected('carol')).to.eq(true);
    expect(screen.queryByText('everyone, alice, bob, carol')).to.be.instanceof(HTMLElement);
  });

  it('selects bob', async () => {
    render(<WrapSelect value={options} />);

    await act(async () => {
      await events.click(screen.getByText('everyone, alice, bob, carol'));
      await events.click(screen.getByText('everyone', option));
      await events.click(screen.getByText('bob', option));
    });

    expect(isSelected('everyone')).to.eq(false);
    expect(isSelected('alice')).to.eq(false);
    expect(isSelected('bob')).to.eq(true);
    expect(isSelected('carol')).to.eq(false);
    expect(screen.queryAllByText('bob')).to.have.length(2);
  });

  it('deselects bob', async () => {
    render(<WrapSelect value={options} />);

    await act(async () => {
      await events.click(screen.getByText('everyone, alice, bob, carol'));
      await events.click(screen.getByText('bob', option));
    });

    expect(isSelected('everyone')).to.eq(false);
    expect(isSelected('alice')).to.eq(true);
    expect(isSelected('bob')).to.eq(false);
    expect(isSelected('carol')).to.eq(true);
    expect(screen.queryByText('alice, carol')).to.be.instanceof(HTMLElement);
  });

  it('deselects bob and carol', async () => {
    render(<WrapSelect value={options} />);

    await act(async () => {
      await events.click(screen.getByText('everyone, alice, bob, carol'));
      await events.click(screen.getByText('bob', option));
      await events.click(screen.getByText('carol', option));
    });

    expect(isSelected('everyone')).to.eq(false);
    expect(isSelected('alice')).to.eq(true);
    expect(isSelected('bob')).to.eq(false);
    expect(isSelected('carol')).to.eq(false);
    expect(screen.queryAllByText('alice')).to.have.length(2);
  });

  it('deselects everyone', async () => {
    render(<WrapSelect value={options} />);

    await act(async () => {
      await events.click(screen.getByText('everyone, alice, bob, carol'));
      await events.click(screen.getByText('bob', option));
      await events.click(screen.getByText('carol', option));
      await events.click(screen.getByText('alice', option));
    });

    expect(isSelected('everyone')).to.eq(false);
    expect(isSelected('alice')).to.eq(false);
    expect(isSelected('bob')).to.eq(false);
    expect(isSelected('carol')).to.eq(false);
    expect(screen.queryByText('everyone, alice, bob, carol')).to.eq(null);
  });

  it('deselects bob and selects him again', async () => {
    render(<WrapSelect value={options} />);

    await act(async () => {
      await events.click(screen.getByText('everyone, alice, bob, carol'));
      await events.click(screen.getByText('bob', option));
      await events.click(screen.getByText('bob', option));
    });

    expect(isSelected('everyone')).to.eq(true);
    expect(isSelected('alice')).to.eq(true);
    expect(isSelected('bob')).to.eq(true);
    expect(isSelected('carol')).to.eq(true);
    expect(screen.queryByText('everyone, alice, bob, carol')).to.be.instanceof(HTMLElement);
  });

  it('deselects and selects a couple of times', async () => {
    render(<WrapSelect value={options} />);

    await act(async () => {
      await events.click(screen.getByText('everyone, alice, bob, carol'));
      await events.click(screen.getByText('bob', option));
      await events.click(screen.getByText('carol', option));
      await events.click(screen.getByText('bob', option));
    });

    expect(isSelected('everyone')).to.eq(false);
    expect(isSelected('alice')).to.eq(true);
    expect(isSelected('bob')).to.eq(true);
    expect(isSelected('carol')).to.eq(false);
    expect(screen.queryByText('alice, bob')).to.be.instanceof(HTMLElement);
  });
});
