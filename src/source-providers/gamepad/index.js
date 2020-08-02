import { SourceProvider, addSourceProviderType } from '@webbitjs/store';

export default class GamepadProvider extends SourceProvider {

  static get typeName() {
    return 'Gamepad';
  }

  static get settingsDefaults() {
    return {};
  }

  constructor(providerName, settings) {
    super(providerName, settings);

    const update = () => {
      const gamepads = [...window.navigator.getGamepads()];
      gamepads.forEach((gamepad, index) => {
        
        if (!gamepad) {
          this.removeSource(`${index}/axes`);
          this.removeSource(`${index}/connected`);
          this.removeSource(`${index}/id`);
          this.removeSource(`${index}/index`);
          this.removeSource(`${index}/mapping`);
          this.removeSource(`${index}/timestamp`);
          this.removeSource(`${index}/button/presses`);
          this.removeSource(`${index}/button/touches`);
          this.removeSource(`${index}/button/values`);
          return;
        }

        const { axes, buttons, connected, id, mapping, timestamp } = gamepad;
        
        this.updateSource(`${index}/axes`, axes);
        this.updateSource(`${index}/connected`, connected);
        this.updateSource(`${index}/id`, id);
        this.updateSource(`${index}/index`, index);
        this.updateSource(`${index}/mapping`, mapping);
        this.updateSource(`${index}/timestamp`, timestamp);

        const presses = [];
        const touches = [];
        const values = [];

        buttons.forEach((button, buttonIndex) => {
          const { pressed, touched, value } = button;
          presses.push(pressed);
          touches.push(touched);
          values.push(value);
        });

        this.updateSource(`${index}/button/presses`, presses);
        this.updateSource(`${index}/button/touches`, touches);
        this.updateSource(`${index}/button/values`, values);
      });

      window.requestAnimationFrame(update);
    };

    window.requestAnimationFrame(update);
  }
}

addSourceProviderType(GamepadProvider);
