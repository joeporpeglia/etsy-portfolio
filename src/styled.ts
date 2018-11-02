import * as styledComponents from 'styled-components';
import { ThemedStyledComponentsModule } from 'styled-components';

import theme from './settings.json';

type Theme = typeof theme;

const styled = {
  default: styledComponents.default,
  css: styledComponents.css,
  createGlobalStyle: styledComponents.createGlobalStyle,
  keyframes: styledComponents.keyframes,
  ThemeProvider: styledComponents.ThemeProvider
} as ThemedStyledComponentsModule<Theme>;

const ThemeProviderHack: any = styled.ThemeProvider;

const { css, createGlobalStyle, keyframes } = styled;

export {
  css,
  createGlobalStyle,
  keyframes,
  ThemeProviderHack as ThemeProvider
};
export default styled.default;
