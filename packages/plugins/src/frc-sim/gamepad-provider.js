import { SourceProvider } from '@webbitjs/store';

export default class GamepadProvider extends SourceProvider {
  constructor() {
    super({}, 1000 / 60);
    const update = () => {
      const gamepads = [...window.navigator.getGamepads()];
      gamepads.forEach((gamepad, index) => {
        if (!gamepad) {
          this.removeSource(`/${index}/axes`);
          this.removeSource(`/${index}/connected`);
          this.removeSource(`/${index}/id`);
          this.removeSource(`/${index}/index`);
          this.removeSource(`/${index}/mapping`);
          this.removeSource(`/${index}/timestamp`);
          this.removeSource(`/${index}/buttonPresses`);
          this.removeSource(`/${index}/buttonTouches`);
          this.removeSource(`/${index}/buttonValues`);
          return;
        }

        const { axes, buttons, connected, id, mapping, timestamp } = gamepad;

        this.updateSource(`/${index}/axes`, axes);
        this.updateSource(`/${index}/connected`, connected);
        this.updateSource(`/${index}/id`, id);
        this.updateSource(`/${index}/index`, index);
        this.updateSource(`/${index}/mapping`, mapping);
        this.updateSource(`/${index}/timestamp`, timestamp);

        const presses = [];
        const touches = [];
        const values = [];

        buttons.forEach((button, buttonIndex) => {
          const { pressed, touched, value } = button;
          presses.push(pressed);
          touches.push(touched);
          values.push(value);
        });

        this.updateSource(`/${index}/buttonPresses`, presses);
        this.updateSource(`/${index}/buttonTouches`, touches);
        this.updateSource(`/${index}/buttonValues`, values);
      });

      window.requestAnimationFrame(update);
    };

    window.requestAnimationFrame(update);
  }
}
