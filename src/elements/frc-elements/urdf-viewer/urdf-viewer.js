import './urdf-viewer-element';
import { html, css, LitElement } from 'lit';
import loadMesh from './load-mesh';
import { cylinderToUrdf } from './urdf-elements';

export const elementName = 'frc-urdf-viewer';

export const elementConfig = {
  dashboard: {
    displayName: 'URDF Viewer',
    topLevel: false,
  },
  description: 'Component used to display and manipulate URDF models',
  properties: {
    text: { type: String, primary: true },
    urdf: { type: String },
    // urdfContent: { type: String, attribute: 'urdf-content' },
    up: { type: String, defaultValue: 'Z+' },
    displayShadow: { type: Boolean, attribute: 'display-shadow' },
    ambientColor: {
      type: String,
      defaultValue: 'black',
      attribute: 'ambient-color',
    },
    minDistance: {
      type: Number,
      defaultValue: 0.25,
      attribute: 'min-distance',
    },
    maxDistance: { type: Number, defaultValue: 5, attribute: 'max-distance' },
    robotX: { type: Number, attribute: 'robot-x' },
    robotY: { type: Number, attribute: 'robot-y' },
    robotZ: { type: Number, attribute: 'robot-z' },
    cameraX: { type: Number, attribute: 'camera-x' },
    cameraY: { type: Number, attribute: 'camera-y' },
    cameraZ: { type: Number, defaultValue: -10, attribute: 'camera-z' },
    autoRotate: { type: Boolean, attribute: 'auto-rotate' },
    autoRotateSpeed: {
      type: Number,
      defaultValue: 2,
      attribute: 'auto-rotate-speed',
    },
  },
  slots: [{ name: '', allowedChildren: ['frc-urdf-cylinder'] }],
  demos: [
    {
      // html: `
      //   <frc-urdf-viewer
      //     urdf="https://rawcdn.githack.com/frc-web-components/frc-web-components/b0fbd5c90d50035012ce04d8dcde041fea7ed79b/models/urdf/pi-bot.urdf"
      //     max-distance=".75"
      //     controllable
      //     camera-x="0.58"
      //     camera-y="0.3"
      //     camera-z="0.48"
      //   ></frc-urdf-viewer>
      // `
      html: `
      <frc-urdf-viewer>
        <frc-urdf-cylinder radius=".25" length="1" color="blue"></frc-urdf-cylinder>
      </frc-urdf-viewer>
    `,
    },
  ],
};

const urdf = `
<robot name="myRobot">
     
<material name="blue">
  <color rgba="0 0 1 1" />
</material>

<link name="link1">
  <visual>
    <origin xyz="0 0 0" rpy="0 0 0" />
    <geometry>
      <box size="1 1 1" />
    </geometry>
    <material>
      <color rgba="0 1 0 1" />
    </material>
  </visual>
</link>

<link name="link2">
  <visual>
    
    <origin xyz="0 0 1" rpy="1.57 0 0" />
    <geometry>
      <cylinder radius=".5" length="2" />
    </geometry>
    <material name="brick" />
  </visual>
</link>
<link name="link3">
  <visual>
    <origin xyz="0 0 -1.5" />
    <geometry>
      <sphere radius="1" />
    </geometry>
    <material name="blue" />
  </visual>
</link>
</robot>

`;

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 1 / DEG2RAD;

class UrdfViewer extends LitElement {
  #urdfContent;
  #mutationObservers;

  static styles = css`
    :host {
      display: inline-block;
      width: 300px;
      height: 300px;
      background: white;
    }

    urdf-viewer {
      display: block;
      width: 100%;
      height: 100%;
    }

    canvas {
      display: block;
      width: 100%;
      height: 100%;
      outline: none;
    }
  `;

  static properties = elementConfig.properties;

  constructor() {
    super();
    this.#urdfContent = '<robot name="myRobot"></robot>';
    this.#mutationObservers = [];
  }

  setJointAnglesFromSource() {
    // const viewer = this.shadowRoot.querySelector('[part=viewer]');
    // const source = this.getSource();
    // if (viewer.robot && source && typeof source === 'object') {
    //   Object.getOwnPropertyNames(source).forEach(name => {
    //     viewer.setAngle(name, source[name] * DEG2RAD);
    //   });
    // }
  }

  onCameraChange(ev) {
    const { x, y, z } = ev.detail;
    this.cameraX = x;
    this.cameraY = y;
    this.cameraZ = z;
  }

  onUrdfError(ev) {
    const { detail } = ev;
    // this.showErrorNotification('Unable to preview URDF');
    console.log('error:', detail);
  }

  #addMutationObserver(child) {
    console.log('child:', child);
    const observer = new MutationObserver(() => {
      this.#toUrdf();
      console.log('attributes changed:', child);
    });
    observer.observe(child, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }

  #toUrdf() {
    this.#mutationObservers.forEach((observer) => observer.disconnect());
    this.#mutationObservers = [];
    const childUrdfs = [...this.children].map((child) => {
      switch (child.tagName.toLowerCase()) {
        case 'frc-urdf-cylinder':
          this.#addMutationObserver(child);
          return cylinderToUrdf(child);
        default:
          return '';
      }
    });
    this.#urdfContent = `<robot name="myRobot">${childUrdfs.join('')}</robot>`;
    this.requestUpdate();
  }

  firstUpdated() {
    this.#toUrdf();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          this.#toUrdf();
        }
      });
    });
    observer.observe(this, {
      childList: true,
      subtree: true,
    });
  }

  render() {
    return html`
      <urdf-viewer
        part="viewer"
        urdf-content="${this.#urdfContent}"
        @urdf-error="${this.onUrdfError}"
        up="${this.up}"
        ?display-shadow="${this.displayShadow}"
        ambient-color="${this.ambientColor}"
        .loadMeshFunc="${loadMesh}"
        min-distance="${this.minDistance}"
        max-distance="${this.maxDistance}"
        robot-x="${this.robotX}"
        robot-y="${this.robotY}"
        robot-z="${this.robotZ}"
        camera-x="${this.cameraX}"
        camera-y="${this.cameraY}"
        camera-z="${this.cameraZ}"
        ?auto-rotate="${this.autoRotate}"
        auto-rotate-speed="${this.autoRotateSpeed}"
        @camera-change="${this.onCameraChange}"
      ></urdf-viewer>
    `;
  }
}

customElements.define(elementName, UrdfViewer);
