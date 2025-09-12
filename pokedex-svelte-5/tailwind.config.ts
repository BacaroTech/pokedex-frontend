import type { Config } from 'tailwindcss';

import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        'poke-primary': {
          '50': '#fff1f1',
          '100': '#ffdfdf',
          '200': '#ffc5c5',
          '300': '#ff9d9d',
          '400': '#ff6464',
          '500': '#ff1c1c',
          '600': '#ed1515',
          '700': '#c80d0d',
          '800': '#a50f0f',
          '900': '#881414',
          '950': '#4b0404',
        },
      }
    },
  },

  plugins: [typography, forms, containerQueries]
} satisfies Config;
