import plugin from 'tailwindcss/plugin';

import { Color } from '../types/tailwindcssPlugin';
import { mergeToConfig } from './tailwindCssPlugin/config';
import { colorList, fontSizeList } from './tailwindCssPlugin/constants';

export default plugin(function ({ addUtilities, theme, addComponents }) {
  const getColor = (color: Color) =>
    theme(
      `colors.${color.themeName}`,
      theme(`colors.${color.tailwindDefault}`, color.hexDefault)
    );

  const colorUtilities = colorList.reduce(
    (acc, color) => ({
      ...acc,
      [`.has-${color.name}-color`]: {
        color: getColor(color),
      },
    }),
    {}
  );

  const fontSizeUtilities = fontSizeList.reduce(
    (acc, fontSize) => ({
      ...acc,
      [`.has-${fontSize.name}-font-size`]: {
        fontSize: `${theme(
          `fontSize.${fontSize.tailwind}`,
          `${fontSize.default}`
        )} !important`,
      },
    }),
    {}
  );

  const backgroundPadding = `${theme(
    'padding.backgroundX',
    theme('padding.5', '1.25em')
  )} ${theme('padding.backgroundY', theme('padding.9', '2.35em'))}`;

  const backgroundUtilities = colorList.reduce(
    (acc, color) => ({
      ...acc,
      [`.has-${color.name}-background-color`]: {
        backgroundColor: getColor(color),
      },
    }),
    {
      '.has-background': {
        padding: backgroundPadding,
      },
    }
  );

  const textAlignUtilities = {
    '.has-text-align-center': {
      textAlign: 'center',
    },
    '.has-text-align-right': {
      textAlign: 'right',
    },
    '.has-text-align-left': {
      textAlign: 'left',
    },
  };

  const dropCapUtilities = {
    '.has-drop-cap': {
      '&:first-letter': {
        float: 'left',
        fontSize: '3.25em',
        lineHeight: '0.68',
        fontWeight: 'bolder',
        margin: '1rem 1rem 0 0',
        textTransform: 'uppercase',
        fontStyle: 'normal',
      },
    },
  };

  const quoteUtilities = {
    '.is-style-plain': {
      cite: {
        fontStyle: 'normal',
        fontSize: '0.8rem',
      },
      quotes: 'none',
      border: 'none',
      fontStyle: 'normal',
    },
    '.is-style-large': {
      cite: {
        fontStyle: 'italic',
        fontSize: '1.2rem',
      },
      margin: '0',
      fontSize: '2.5rem',
      quotes: 'none',
      border: 'none',
      fontStyle: 'normal',
    },

    '.wp-block-quote': {
      'p:empty': {
        quotes: 'none',
      },
      '&.has-text-align-center': {
        border: 'none',
      },
      '&.has-text-align-right': {
        borderLeft: 'none',
        paddingRight: '1.06em',
        borderRightWidth: '0.25rem',
        borderRightColor: '#e5e7eb',
      },
      cite: {
        fontStyle: 'normal',
        fontSize: '0.8rem',
      },
    },
  };

  const pullQuoteUtilities = {
    '.wp-block-pullquote': {
      '&.alignleft': {
        float: 'left',
        maxWidth: '30rem',
        minWidth: '20rem',
      },
      '&.alignright': {
        float: 'right',
        maxWidth: '30rem',
        minWidth: '20rem',
      },
      '&.alignwide': {
        maxWidth: '850px',
      },
      '&.alignfull': {
        maxWidth: 'none',
      },
      blockquote: {
        p: {
          fontSize: theme('fontSize.4xl', '2.5rem'),
        },
        cite: {
          textTransform: 'uppercase',
          fontSize: '.8em',
          fontStyle: 'normal',
        },
        border: 'none',
        color: 'inherit',
        quotes: 'none',
      },
      margin: 'auto',
      maxWidth: '650px',
      borderColor: 'currentColor',
      borderWidth: '3px 0',
      marginBottom: '0',
      marginTop: '0',
      padding: '2em 0',
      textAlign: 'center',
    },
  };

  const borderColorUtilities = colorList.reduce(
    (acc, color) => ({
      ...acc,
      [`.has-${color.name}-border-color`]: {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        borderColor: `${getColor(color)} !important`,
      },
    }),
    {}
  );

  const tableComponent = {
    '.wp-block-table': {
      td: {
        padding: '0.5em',
      },
      table: {
        thead: {
          tr: {
            borderColor: 'inherit',
            th: {
              padding: '0.5em',
              color: 'inherit',
            },
          },
          borderColor: 'inherit',
        },
        tbody: {
          borderColor: 'inherit',
          tr: {
            borderColor: 'inherit',
          },
        },
        '&.has-fixed-layout': {
          width: '100%',
          tableLayout: 'fixed',
        },
      },
      figcaption: {
        fontSize: '.5em',
        textAlign: 'center',
      },
      '&.is-style-stripes': {
        margin: '0',
        table: {
          tbody: {
            'tr:nth-child(odd)': {
              backgroundColor: theme('colors.stripes', '#f2f2f2'),
            },
          },
        },
      },
    },
  };

  addUtilities([
    backgroundUtilities,
    borderColorUtilities,
    colorUtilities,
    dropCapUtilities,
    fontSizeUtilities,
    pullQuoteUtilities,
    quoteUtilities,
    textAlignUtilities,
  ]);

  addComponents(tableComponent);
}, mergeToConfig);
