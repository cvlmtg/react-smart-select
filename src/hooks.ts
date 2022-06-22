import { IGNORE_CLASS } from './constants';
import { EvtHandler } from './typings';
import {
  useEffect, useCallback, useState, useMemo,
  RefObject, SyntheticEvent
} from 'react';

// ---------------------------------------------------------------------

export function useClickOutside(ref: RefObject<HTMLElement>, onClick?: EvtHandler): void {
  useEffect(() => {
    if (typeof onClick !== 'function') {
      return undefined;
    }

    const handler = (evt: MouseEvent) => {
      let source = evt.target as HTMLElement;
      let check;
      let found;

      if (ref.current === null) {
        return;
      }

      while (source && source.parentNode) {
        check  = source.classList.contains(IGNORE_CLASS);
        found  = source === ref.current || check === true;
        source = source.parentNode as HTMLElement;

        if (found === true) {
          return;
        }
      }

      evt.stopPropagation();
      evt.preventDefault();
      onClick(evt);
    };

    document.addEventListener('mousedown', handler, true);

    return () => {
      document.removeEventListener('mousedown', handler, true);
    };
  }, [ ref, onClick ]);
}

export function useToggle(initialValue = false): [ boolean, EvtHandler ] {
  const [ value, setValue ] = useState(initialValue);

  const onToggle = useCallback((evt?: Event | SyntheticEvent) => {
    if (evt) {
      evt.preventDefault();
    }
    setValue(!value);
  }, [ value ]);

  return [ value, onToggle ];
}

export function useRandomId(): string {
  return useMemo(() => Math.random().toString(36).substring(2, 6) || '-', []);
}
