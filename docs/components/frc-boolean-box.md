# frc-boolean-box

A box that's shown as one color if true and another color if false.

## Properties

| Property     | Attribute     | Type      | Default | Description                                      |
|--------------|---------------|-----------|---------|--------------------------------------------------|
| `falseColor` | `false-color` | `String`  | "red"   | The color that is displayed if value is false.   |
| `label`      | `label`       | `String`  | ""      | A text label that is shown in the center of the boolean box. |
| `trueColor`  | `true-color`  | `String`  | "green" | The color that is displayed if value is true.    |
| `value`      | `value`       | `Boolean` | false   | If true then the boolean box's color will be the true color. If false the color will be the false color. |

## CSS Shadow Parts

| Part  | Description     |
|-------|-----------------|
| `box` | The box element |
