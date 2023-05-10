import '../../components/boolean-box';
export const elementName = 'frc-boolean-box';

export const elementConfig = {
  dashboard: {
    displayName: 'Boolean Box',
  },
  properties: {
    value: { type: Boolean, primary: true },
    trueColor: {
      type: String,
      input: { type: 'ColorPicker' },
      defaultValue: '#00ff00',
      attribute: 'true-color',
    },
    falseColor: {
      type: String,
      input: { type: 'ColorPicker' },
      defaultValue: '#ff0000',
      attribute: 'false-color',
    },
    label: { type: String },
  },
};
