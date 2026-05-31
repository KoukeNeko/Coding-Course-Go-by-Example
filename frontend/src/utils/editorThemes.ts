import type { editor } from 'monaco-editor';

import lightDefaultJson from './themes/light-default-monaco.json';
import lightColorblindJson from './themes/light-colorblind-monaco.json';
import lightHighContrastJson from './themes/light-high-contrast-monaco.json';
import darkDefaultJson from './themes/dark-default-monaco.json';
import darkColorblindJson from './themes/dark-colorblind-monaco.json';
import darkHighContrastJson from './themes/dark-high-contrast-monaco.json';
import darkDimmedJson from './themes/dark-dimmed-monaco.json';

// Also keep the old ones if you want, but the user requested these specifically.
// We'll export them in an object for easy iteration in App.tsx

export const themes: Record<string, editor.IStandaloneThemeData> = {
  'github-light-default': lightDefaultJson as unknown as editor.IStandaloneThemeData,
  'github-light-colorblind': lightColorblindJson as unknown as editor.IStandaloneThemeData,
  'github-light-high-contrast': lightHighContrastJson as unknown as editor.IStandaloneThemeData,
  'github-dark-default': darkDefaultJson as unknown as editor.IStandaloneThemeData,
  'github-dark-colorblind': darkColorblindJson as unknown as editor.IStandaloneThemeData,
  'github-dark-high-contrast': darkHighContrastJson as unknown as editor.IStandaloneThemeData,
  'github-dark-dimmed': darkDimmedJson as unknown as editor.IStandaloneThemeData,
};
