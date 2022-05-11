import { render, screen, cleanup, act } from '@testing-library/react';
import { LABEL_CLASS, OPTION_CLASS } from '../src/constants';
import React, { FunctionComponent, useState } from 'react';
import userEvent from '@testing-library/user-event';
import Select from '../src/smart-select';
import { expect } from 'chai';

import type {
  SelectProps, FormatLabel, RSSOption, RSSOptions
} from '../src/typings';

// ---------------------------------------------------------------------

type WrapProps = Omit<SelectProps, 'options' | 'onChange'>

const option = { selector: `.${OPTION_CLASS}` };
const button = { selector: `.${LABEL_CLASS}` };

const options: RSSOptions = [
  { value: 'A', label: 'A', extra: 1 },
  { value: 'B', label: 'B', extra: 2 }
];

const first = options[0];

const WrapSelect: FunctionComponent<WrapProps> = (props) => {
  const { value, ...rest }  = props;
  const [ state, setState ] = useState(value);

  /* eslint-disable react/jsx-props-no-spreading */

  return (
    <Select {...rest} value={state} options={options}
      onChange={setState} />
  );

  /* eslint-enable */
};

// ---------------------------------------------------------------------

describe('the single select', () => {
  let events;

  before(() => {
    events = userEvent.setup();
  });

  it('renders an empty value', () => {
    render(<WrapSelect />);

    expect(screen.queryByText('A', button)).to.eq(null);
    expect(screen.queryByText('B', button)).to.eq(null);
    cleanup();
  });

  it('renders the placeholder value', () => {
    render(<WrapSelect placeholder="foo" />);

    expect(screen.queryByText('foo', button)).to.be.instanceof(HTMLElement);
    expect(screen.queryByText('A', button)).to.eq(null);
    expect(screen.queryByText('B', button)).to.eq(null);
    cleanup();
  });

  it('renders an empty value with formatLabel', () => {
    const formatLabel: FormatLabel = (value) => {
      const single = value as RSSOption;

      return value ? single.label : ' ';
    };

    render(<WrapSelect placeholder="foo" formatLabel={formatLabel} />);

    expect(screen.queryByText('foo', button)).to.eq(null);
    expect(screen.queryByText('A', button)).to.eq(null);
    expect(screen.queryByText('B', button)).to.eq(null);
    cleanup();
  });

  it('renders the default value (1)', () => {
    render(<WrapSelect value={first} />);

    expect(screen.queryByText('A', button)).to.be.instanceof(HTMLElement);
    expect(screen.queryByText('B', button)).to.eq(null);
    cleanup();
  });

  it('renders the default value (2)', () => {
    const edit = { value: 'B', label: 'B' };

    render(<WrapSelect value={edit} />);

    expect(screen.queryByText('A', button)).to.eq(null);
    expect(screen.queryByText('B', button)).to.be.instanceof(HTMLElement);
    cleanup();
  });

  it('selects B', async () => {
    render(<WrapSelect value={first} />);

    await act(async () => {
      await events.click(screen.getByText('A', button));
    });
    await act(async () => {
      await events.click(screen.getByText('B', option));
    });

    expect(screen.queryByText('A', button)).to.eq(null);
    expect(screen.queryByText('B', button)).to.be.instanceof(HTMLElement);
  });

  it('selects A (1)', async () => {
    render(<WrapSelect value={first} />);

    await act(async () => {
      await events.click(screen.getByText('A', button));
    });
    await act(async () => {
      await events.click(screen.getByText('B', option));
    });
    await act(async () => {
      await events.click(screen.getByText('B', button));
    });
    await act(async () => {
      await events.click(screen.getByText('A', option));
    });

    expect(screen.queryByText('A', button)).to.be.instanceof(HTMLElement);
    expect(screen.queryByText('B', button)).to.eq(null);
  });

  it('selects A (2)', async () => {
    render(<WrapSelect value={first} />);

    await act(async () => {
      await events.click(screen.getByText('A', button));
    });
    await act(async () => {
      await events.click(screen.getByText('A', option));
    });

    expect(screen.queryByText('A', button)).to.be.instanceof(HTMLElement);
    expect(screen.queryByText('B', button)).to.eq(null);
  });
});
