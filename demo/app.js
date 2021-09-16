import React, { Fragment, useCallback, useState } from 'react';
import SmartSelect from '../dist/react-smart-select.esm';
import styled from 'styled-components';
import ReactDOM from 'react-dom';

// ---------------------------------------------------------------------

const countPeople = (value) => {
  const full  = value.some((item) => item.value === 'everyone');
  const count = value.length;

  if (count === 0) {
    return 'nobody';
  }

  if (full === false) {
    return count === 1 ? '1 person' : `${count} people`;
  }

  return 'everyone';
};

const fancyLabel = (value) => {
  if (value === null) {
    return 'nothing selected';
  }

  const html = { __html: value.emoji };

  /* eslint-disable react/no-danger */

  return (
    <span>
      <span dangerouslySetInnerHTML={html} />
      <em>{value.label}</em>
    </span>
  );
};

const fancyOption = (option, selected) => {
  if (selected) {
    return (
      <strong>&bull; {option.label}</strong>
    );
  }

  return (
    <em>&bull; {option.label}</em>
  );
};

const people = [
  { label: 'alice', value: 'alice', emoji: '&#9818;' },
  { label: 'bob', value: 'bob', emoji: '&#9819;' },
  { label: 'carol', value: 'carol', emoji: '&#9820;' },
  { label: 'dave', value: 'dave', emoji: '&#9821;' }
];

const everyone = [
  { label: 'everyone', value: 'everyone' },
  ...people
];

const Styled = styled(SmartSelect)`
  font-family: 'Times New Roman', Time, serif;
  background-color: #33336a;
  border-radius: 12px;
  color: #efe8de;

  .rss-dropdown {
    border: 2px solid darkgray;
    background-color: #95aeb0;

    .rss-option {
      padding: 4px;

      &:hover {
        background-color: #dac281;
        color: #efe8de;
      }
    }
  }

  .rss-label {
    justify-content: center;

    em {
      margin-left: 0.5em;
    }

    &:after {
      content: none;
    }
  }
`;

const Grouped = styled(SmartSelect)`
h4 {
  display: inline-block;
  margin-bottom: 0;
}

label {
  padding: 6px;
}
`;

// ---------------------------------------------------------------------

function Single() {
  const [ value, onChange ] = useState();

  return (
    <SmartSelect value={value} options={people}
      onChange={onChange} />
  );
}

function Multi() {
  const [ value, onChange ] = useState();

  return (
    <SmartSelect multi value={value} options={people}
      onChange={onChange} />
  );
}

function Toggle() {
  const [ value, onChange ] = useState(everyone);

  return (
    <SmartSelect toggle value={value} options={everyone}
      formatLabel={countPeople}
      onChange={onChange} />
  );
}

function FancyOne() {
  const [ value, onChange ] = useState();

  const dropdownStyle = {
    border:          '2px solid darkgray',
    backgroundColor: '#95aeb0'
  };

  const style = {
    backgroundColor: '#33336a',
    color:           '#efe8de',
    borderRadius:    '12px'
  };

  const optionStyle = {
    padding: '4px'
  };

  // see index.html for more styles applied

  return (
    <SmartSelect className="fancy-select" value={value} options={people}
      dropdownStyle={dropdownStyle} optionStyle={optionStyle}
      formatOption={fancyOption} formatLabel={fancyLabel}
      style={style} onChange={onChange} />
  );
}

function FancyTwo() {
  const [ value, onChange ] = useState();

  return (
    <Styled className="styled-select" value={value} options={people}
      formatOption={fancyOption} formatLabel={fancyLabel}
      onChange={onChange} />
  );
}

function Group() {
  const [ value, setValue ] = useState();

  const menu = [
    { label: 'Starters', value: 'starters_header', group: 'starters', header: true },
    { label: 'Duck & orange salad', value: 'duck', group: 'starters' },
    { label: 'Crab cakes', value: 'crab', group: 'starters' },
    { label: 'Chilled pea soup', value: 'soup', group: 'starters' },
    { label: 'Main courses', value: 'main_header', group: 'main', header: true },
    { label: 'Beef bourguignon', value: 'beef', group: 'main' },
    { label: 'Lasagna', value: 'lasagna', group: 'main' },
    { label: 'Herb-roasted Beef Tenderloin', value: 'tenderloin', group: 'main' },
    { label: 'Desserts', value: 'desserts_header', group: 'desserts', header: true },
    { label: 'Cheesecake', value: 'cheesecake', group: 'desserts' },
    { label: 'Creme brulee', value: 'cremebrulee', group: 'desserts' }
  ];

  const onChange = useCallback((values, selected, options) => {
    const group  = options.filter((o) => o.group === selected.group);
    const header = group[0];

    if (selected.header === true) {
      const others   = values.filter((v) => v.group !== selected.group);
      const included = values.some((v) => v.value === selected.value);

      if (included) {
        setValue(others.concat(group));
      } else {
        setValue(others);
      }

      return;
    }

    const current  = values.filter((v) => v.group === selected.group);
    const included = values.some((v) => v.value === header.value);
    const length   = group.length - 1;

    if (current.length < length || included === true) {
      const filtered = values.filter((v) => v.value !== header.value);

      setValue(filtered);
      return;
    }

    setValue(values.concat(header));
  }, []);

  const fmtLabel = useCallback((selected) => {
    const entries = selected.filter((v) => v.header !== true);
    const groups  = selected.map((v) => v.group);
    const set     = new Set(groups);

    const _entries = entries.length === 1 ? 'entry' : 'entries';
    const _groups  = set.size === 1 ? 'group' : 'groups';

    return `${entries.length} ${_entries}, ${set.size} ${_groups}`;
  }, []);

  const fmtOption = useCallback((option) => {
    if (option.header === true) {
      return (
        <h4>{option.label}:</h4>
      );
    }
    return option.label;
  }, []);

  return (
    <Grouped multi value={value} options={menu}
      formatOption={fmtOption} formatLabel={fmtLabel}
      onChange={onChange} />
  );
}

// ---------------------------------------------------------------------

function Demo() {
  return (
    <Fragment>
      <div className="box">
        <h2>Single select</h2>
        <Single />
        <p>
          A classic, single-select dropdown.
        </p>
      </div>

      <div className="box">
        <h2>Multi select</h2>
        <Multi />
        <p>
          A classic, multi-select dropdown, with a checkbox
          to show the selected options.
        </p>
      </div>

      <div className="box">
        <h2>Toggle select</h2>
        <Toggle />
        <p>
          A more complex multi-select dropdown, where the first
          option is a &quot;select / deselect all&quot; switch.
        </p>
      </div>

      <div className="box">
        <h2>Fancy select</h2>
        <FancyOne />
        <p>
          This select just shows some of the style configurability
          achievable with react-smart-select.
        </p>
      </div>

      <div className="box">
        <h2>Styled select</h2>
        <FancyTwo />
        <p>
          Like the previous, but with style applied through
          styled-components instead of classic css or the
          style props.
        </p>
      </div>

      <div className="box">
        <h2>Group select</h2>
        <Group />
        <p>
          A complex select, where options are divided in groups,
          each one with a header that can select and deselect
          the whole group.
        </p>
      </div>
    </Fragment>
  );
}

// ---------------------------------------------------------------------

const node = document.getElementById('app');
const demo = (<Demo />);

ReactDOM.render(demo, node);
