import { IGNORE_CLASS } from './constants';
import { EvtHandler } from './typings';
import {
  useEffect, useCallback, useState, useMemo,
  useRef, RefObject
} from 'react';

// ---------------------------------------------------------------------

export function useClickOutside(onClick?: EvtHandler): RefObject<any> {
  const ref = useRef(null);

  const handler = useCallback((evt) => {
    let source = evt.target;
    let check;
    let found;

    if (ref.current === null) {
      return;
    }

    while (source.parentNode) {
      check  = source.classList.contains(IGNORE_CLASS) === true;
      found  = source === ref.current || check;
      source = source.parentNode;

      if (found === true) {
        return;
      }
    }

    evt.stopPropagation();
    evt.preventDefault();

    if (typeof onClick === 'function') {
      onClick(evt);
    }
  }, [ onClick ]);

  useEffect(() => {
    if (typeof onClick !== 'function') {
      return undefined;
    }

    document.addEventListener('mousedown', handler, true);

    return () => {
      document.removeEventListener('mousedown', handler, true);
    };
  }, [ handler, onClick ]);

  return ref;
}

export function useToggle(initialValue = false): [ boolean, EvtHandler ] {
  const [ value, setValue ] = useState(initialValue);

  const onToggle = useCallback((evt) => {
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
