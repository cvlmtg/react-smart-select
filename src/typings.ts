import type { ReactNode, CSSProperties, SyntheticEvent } from 'react';

// ---------------------------------------------------------------------

export type RSSLabel = string | ReactNode;

export type RSSOption = {
  label: RSSLabel;
  value: any;
  [key: string]: any;
};

export type RSSOptions = Array<RSSOption>;

export type RSSValue = RSSOptions | RSSOption | null;

export type EvtHandler = (evt?: Event | SyntheticEvent) => void;

export type FormatLabel = (value: RSSValue, options: RSSOptions) => RSSLabel;

export type FormatOption = (option: RSSOption, selected: boolean) => RSSLabel;

export type ChangeHandler = (
  value: RSSValue,
  selected?: RSSOption,
  options?: RSSOptions
) => void;

export type SelectProps = {
  onChange: ChangeHandler;
  options: RSSOptions;
  value?: RSSValue;
  placeholder?: RSSLabel;
  className?: string;
  style?: CSSProperties;
  labelStyle?: CSSProperties;
  dropdownStyle?: CSSProperties;
  optionStyle?: CSSProperties;
  formatLabel?: FormatLabel;
  formatOption?: FormatOption;
  disabled?: boolean;
  multi?: boolean;
  toggle?: boolean;
};

export interface StyleProps {
  readonly open: boolean;
}
