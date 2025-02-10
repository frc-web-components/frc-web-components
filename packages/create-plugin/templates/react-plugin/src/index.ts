import { addComponents, addThemeRules } from '@frc-web-components/app';
import { myElement } from './MyElement.tsx';

addComponents({
  myReactElement: myElement,
});

addThemeRules('dark', {
  '--my-react-element-background': 'cadetblue',
  '--my-react-element-color': 'black',
});

addThemeRules('light', {
  '--my-react-element-background': 'cornflowerblue',
  '--my-react-element-color': 'white',
});
