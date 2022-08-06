import GamepadProvider from "./gamepad-provider";

export default function(dashboard) {
  dashboard.addSourceProvider('Gamepad', new GamepadProvider());
}