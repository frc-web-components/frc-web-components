/**
 * https://github.com/b1tdust/html-logger
 */

const levels = {
  info: {
    color: '#fff',
    name: 'INFO',
    level: 1,
  },
  debug: {
    color: '#fff',
    name: 'DEBUG',
    level: 0,
  },
  fatal: {
    color: '#FF3E3E',
    name: 'ERROR',
    level: 4,
  },
  warning: {
    color: '#FFC53E',
    name: 'WARNING',
    level: 3,
  },
  success: {
    color: '#3EFF45',
    name: 'SUCCESS',
    level: 2,
  },
};

const defaultOptions = {
  name: 'Html Logger',
  enabled: true,
  maxLogCount: 1000,
  loggingFormat: '[MESSAGE]', //"[LEVEL] [MESSAGE]",
  argumentsSeparator: ' ',
  utcTime: false,
  level: 0,
};

// Babel.io Object.assign
var _extend = function _extend(target) {
  var sources = [].slice.call(arguments, 1);

  sources.forEach(function (source) {
    for (var prop in source) {
      target[prop] = source[prop];
    }
  });

  return target;
};

export default class HtmlLogger {
  constructor(options, parent = document.body) {
    this.options = _extend({}, defaultOptions, options || {});
    this.parent = parent;
    this.linesCount = 0;
    this.$ = {};
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    if (
      !document ||
      !document.createElement ||
      !document.body ||
      !document.body.appendChild
    )
      throw new Error('HtmlLogger not initialized');

    this.$.container = document.createElement('div');
    const containerStyle = `width:100%; height: 100%;
					margin:0;
					left:0;
					background: rgba(0, 0, 0, 0.8);
					overflow:auto;
					padding: 5px 7px;
    			box-sizing: border-box;`;
    this.$.container.setAttribute('style', containerStyle);

    this.$.log = document.createElement('div');

    const span = document.createElement('span');
    span.style.color = '#afa';
    span.style.fontWeight = 'bold';
    const title = `===== ${this.options.name} - Logger started at ${
      this.options.utcTime ? new Date().toUTCString() : new Date()
    } =====`;
    span.appendChild(document.createTextNode(title));

    const info = document.createElement('div');
    //info.setAttribute('style', "background:rgba(0, 0, 0, 0.8) ")
    info.appendChild(span);

    info.appendChild(document.createElement('br'));
    info.appendChild(document.createElement('br'));

    this.$.container.appendChild(info);
    this.$.container.appendChild(this.$.log);
    this.parent.appendChild(this.$.container);
    this.initialized = true;
  }

  setLevel(level) {
    this.options.level = level;
  }

  setEnable(enable = true) {
    if (!this.initialized) return;

    this.options.enabled = enable;
    this.$.log.style.color = enable ? '#fff' : '#444';
  }

  /**
   * Removes all lines from the view
   * @memberOf HtmlLogger
   */
  clean() {
    if (!this.initialized) return;

    while (this.$.log.firstChild) {
      this.$.log.removeChild(this.$.log.firstChild);
    }

    this.linesCount = 0;
  }

  /**
   * prints message. default level is [info].
   * @param {String} msg - message to print
   * @param {String} [hexColor=levels.info.color] - hexcolor text
   * @param {String} [level=levels.info.name] - level suffix
   *
   * @memberOf HtmlLogger
   */
  print(msg, hexColor = levels.info.color, level = levels.info.name) {
    if (!this.initialized || !this.options.enabled) return;

    const scrollToBottom =
      this.$.container.scrollTop >
      this.$.container.scrollHeight - this.$.container.clientHeight - 5;

    let message = msg.length ? msg : '[empty]';

    const lines = message.split(/\r\n|\r|\n/);
    for (let i = 0; i < lines.length; i++) {
      let timeElement = document.createElement('div');
      timeElement.setAttribute('style', 'color:#999;float:left;');
      let time = this._getTime();
      timeElement.appendChild(document.createTextNode(`${time}\u00a0`));

      let messageLine = this.options.loggingFormat
        .replace('[LEVEL]', level)
        .replace('[MESSAGE]', lines[i]); // `${time} ${level} ${lines[i]}`)
      let msgContainer = document.createElement('div');
      msgContainer.setAttribute(
        'style',
        `word-wrap:break-word;margin-left:6.0em;color: ${hexColor}`
      );
      msgContainer.appendChild(document.createTextNode(messageLine));

      let newLineDiv = document.createElement('div');
      newLineDiv.setAttribute('style', 'clear:both;');

      var lineContainer = document.createElement('div');
      lineContainer.appendChild(timeElement);
      lineContainer.appendChild(msgContainer);
      lineContainer.appendChild(newLineDiv);

      this.$.log.appendChild(lineContainer);
      this.linesCount++;

      while (this.linesCount > this.options.maxLogCount) {
        this.$.log.childNodes[0].remove();
        this.linesCount--;
      }

      if (scrollToBottom) {
        this.$.container.scrollTop = this.$.container.scrollHeight;
      }
    }
  }

  info() {
    if (this.options.level <= levels.info.level)
      this.print(
        [].map
          .call(arguments, this._determineString)
          .join(this.options.argumentsSeparator)
      );
  }

  debug() {
    if (this.options.level <= levels.debug.level)
      this.print(
        [].map
          .call(arguments, this._determineString)
          .join(this.options.argumentsSeparator),
        levels.debug.color,
        levels.debug.name
      );
  }

  warning() {
    if (this.options.level <= levels.warning.level)
      this.print(
        [].map
          .call(arguments, this._determineString)
          .join(this.options.argumentsSeparator),
        levels.warning.color,
        levels.warning.name
      );
  }

  success() {
    if (this.options.level <= levels.success.level)
      this.print(
        [].map
          .call(arguments, this._determineString)
          .join(this.options.argumentsSeparator),
        levels.success.color,
        levels.success.name
      );
  }

  error() {
    if (this.options.level <= levels.fatal.level)
      this.print(
        [].map
          .call(arguments, this._determineString)
          .join(this.options.argumentsSeparator),
        levels.fatal.color,
        levels.fatal.name
      );
  }

  _getTime() {
    return (
      this.options.utcTime ? new Date().toUTCString() : new Date().toString()
    ).match(/([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]/)[0];
  }

  _determineString(object) {
    if (object === undefined) return 'undefined';
    if (object === null) return 'null';
    if (object instanceof Array) return JSON.stringify(object);
    switch (typeof object) {
      default:
      case 'object':
        return `${
          object.constructor ? object.constructor.name : object.toString()
        } -> ${JSON.stringify(object)}`;
      case 'function':
        return object.name || '[function]';
      case 'number':
      case 'string':
      case 'boolean':
        return object;
    }
  }
}
