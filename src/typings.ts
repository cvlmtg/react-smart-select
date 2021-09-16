import type { ReactNode, CSSProperties, SyntheticEvent } from 'react';

// ---------------------------------------------------------------------

export type RSSOption = {
  label: string | ReactNode;
  value: string;
  [key: string]: any;
};

export type RSSOptions = Array<RSSOption>;

export type RSSValue = RSSOptions | RSSOption | null;

export type EvtHandler = (evt?: SyntheticEvent) => void;

export type FormatLabel = (value: RSSValue, options: RSSOptions) => ReactNode | string;

export type FormatOption = (option: RSSOption, selected: boolean) => ReactNode | string;

export type ChangeHandler = (
  value: RSSValue,
  selected?: RSSOption,
  options?: RSSOptions
) => void;

export type SelectProps = {
  onChange: ChangeHandler;
  options: RSSOptions;
  value?: RSSValue;
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
