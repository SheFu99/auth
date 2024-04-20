// src/types/trix-editor.d.ts
import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'trix-editor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        toolbar?: string;
        input?: string;
      };
      'trix-toolbar': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
