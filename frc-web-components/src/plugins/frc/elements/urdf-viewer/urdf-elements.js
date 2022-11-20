// https://css-tricks.com/converting-color-spaces-in-javascript/
function nameToRGB(name) {
  // Create fake div
  const fakeDiv = document.createElement('div');
  fakeDiv.style.color = name;
  document.body.appendChild(fakeDiv);

  // Get color of div
  const cs = window.getComputedStyle(fakeDiv);
  const pv = cs.getPropertyValue('color');

  // Remove div after obtaining desired color value
  document.body.removeChild(fakeDiv);

  return pv;
}

export function cylinderToUrdf(element) {
  const name = element.getAttribute('name') ?? 'cylinder';
  const radius = element.getAttribute('radius') ?? 0.25;
  const length = element.getAttribute('length') ?? 1;
  const color = element.getAttribute('radius') ?? blue;
  const rgb = nameToRGB(color);
  return `
    <link name="${name}">
      <visual>
        <geometry>
          <cylinder radius="${radius}" length="${length}" />
        </geometry>
        <material>
          <color rgba="0 0 0 1"/>
        </material>
      </visual>
    </link>
  `;
}

export const elementConfigs = {
  'frc-urdf-cylinder': {
    dashboard: {
      topLevel: false,
    },
    properties: {
      name: { type: 'String', defaultValue: 'cylinder', property: false },
      radius: { type: 'Number', defaultValue: 0.25, property: false },
      length: { type: 'Number', defaultValue: 1, property: false },
      color: { type: 'String', defaultValue: 'blue', property: false },
    },
    demos: [
      {
        html: `<frc-urdf-cylinder radius=".25" length="1" color="blue"></frc-urdf-cylinder>`,
      },
    ],
  },
};
