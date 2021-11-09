import type { RSSOption, RSSOptions, FormatLabel } from './typings';

// ---------------------------------------------------------------------

type UpdateFn = (
  values: RSSOptions,
  selected: RSSOption,
  index: string,
  options: RSSOptions
) => RSSOptions;

// ---------------------------------------------------------------------

export const toggle: UpdateFn = (values, selected, index, options) => {
  const uncheck = values.some((item) => item.value === selected.value);
  const value   = selected.value;

  if (index === '0') {
    return uncheck ? [] : options;
  }

  if (options.length === values.length) {
    return options.slice(1).filter((item) => item.value !== value);
  }

  if (uncheck) {
    return values.filter((item) => item.value !== value);
  }

  if (options.length !== values.length + 2) {
    return values.concat(selected);
  }

  return options;
};

export const multi: UpdateFn = (values, selected) => {
  const uncheck = values.some((item) => item.value === selected.value);
  const value   = selected.value;
  let updated;

  if (uncheck) {
    updated = values.filter((item) => item.value !== value);
  } else {
    updated = values.concat(selected);
  }

  return updated;
};

export const formatLabel: FormatLabel = (value, options) => {
  if (Array.isArray(value)) {
    // we want to preserve options order

    return options
      .filter((o) => value.some((v) => v.value === o.value))
      .map((o) => o.label)
      .join(', ');
  }

  return value ? value.label : ' ';
};
