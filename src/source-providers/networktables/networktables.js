const wpilib_NT = window.require('wpilib-nt-client');

const client = new wpilib_NT.Client();

let keys = {}; 
let connectionListeners = []; 
let connected = false; 
let globalListeners = []; 
let keyListeners = {}; 
let robotAddress = '127.0.0.1';


// The client will try to reconnect after 1 second
client.setReconnectDelay(1000);


client.addListener((key, val, valType, mesgType, id, flags) => {
    if (val === 'true' || val === 'false') {
      val = val === 'true';
    }

    const msg = { key, val, valType, id, flags };

    if (mesgType === 'add') {
        onAdd(msg);
    } else if (mesgType === 'delete') {
        onDelete(msg);
    } else if (mesgType === 'update') {
        onUpdate(msg);
    } else if (mesgType === 'flagChange') {
        onFlagChange(msg);
    }
});

function onAdd({ key, val, valType, id, flags }) {
    keys[key] = { val, valType, id, flags, new: true };
    globalListeners.map(e => e(key, val, true));
    if (globalListeners.length > 0)
        keys[key].new = false;
    if (key in keyListeners) {
        keyListeners[key].map(e => e(key, val, true));
        keys[key].new = false;
    }
}

function onDelete({ key }) {
    delete keys[key];
}

function onUpdate({ key, flags, val }) {
    let temp = keys[key];
    temp.flags = flags;
    temp.val = val;
    globalListeners.map(e => e(key, temp.val, temp.new));
    if (globalListeners.length > 0)
        keys[key].new = false;
    if (key in keyListeners) {
        keyListeners[key].map(e => e(key, temp.val, temp.new));
        temp.new = false;
    }
}

function onFlagChange({ key, flags }) {
    keys[key].flags = flags;
}

export default {

    connect(address, port) {
        robotAddress = address;
        const callback = (con, err) => {
            connected = con;
            connectionListeners.map(e => e(con));
        };
        if (port) {
            client.start(callback, address, port);
        } else {
            client.start(callback, address);
        }
    },

    /**
     * Sets a function to be called when the robot connects/disconnects to the pynetworktables2js server via NetworkTables. It will also be called when the websocket connects/disconnects.
     *
     * When a listener function is called with a ‘true’ parameter, the NetworkTables.getRobotAddress() function will return a non-null value.
     * @param {(connected: boolean) => any} f a function that will be called with a single boolean parameter that indicates whether the robot is connected
     * @param {boolean} [immediateNotify] If true, the function will be immediately called with the current robot connection state
     */
    addRobotConnectionListener(f, immediateNotify) {
        if(typeof f != 'function') return new Error('Invalid argument')

        connectionListeners.push(f);
        if (immediateNotify)
            f(connected);
    },
    /**
     * Set a function that will be called whenever any NetworkTables value is changed
     * @param {(key: string, value: any, isNew: boolean) => any} f When any key changes, this function will be called with the following parameters; key: key name for entry, value: value of entry, isNew: If true, the entry has just been created
     * @param {boolean} [immediateNotify] If true, the function will be immediately called with the current value of all keys
     */
    addGlobalListener(f, immediateNotify) {
        if(typeof f != 'function') return new Error('Invalid argument')

        globalListeners.push(f);
        if (immediateNotify) {
            for (let key in keys) {
                f(key, keys[key].val, keys[key].new);
                keys[key].new = false;
            }
        }
    },
    /**
     * Set a function that will be called whenever a value for a particular key is changed in NetworkTables
     * @param {string} key A networktables key to listen for
     * @param {(key: string, value: any, isNew: boolean) => any} f When the key changes, this function will be called with the following parameters; key: key name for entry, value: value of entry, isNew: If true, the entry has just been created
     * @param {boolean} [immediateNotify] If true, the function will be immediately called with the current value of the specified key
     */
    addKeyListener(key, f, immediateNotify) {
        if(typeof key != 'string' || typeof f != 'function') return new Error('Valid Arguments are (string, function)')

        if (typeof keyListeners[key] != 'undefined') {
            keyListeners[key].push(f);
        }
        else {
            keyListeners[key] = [f];
        }
        if (immediateNotify && key in keys) {
            let temp = keys[key];
            f(key, temp.val, temp.new);
        }
    },
    /**
     * Use this to test whether a value is present in the table or not
     * @param {string} key A networktables key
     * @returns true if a key is present in NetworkTables, false otherwise
     */
    containsKey(key) {
        if(typeof f != 'string') return false
        return key in keys;
    },
    /**
     * Get all keys in the NetworkTables
     * @returns all the keys in the NetworkTables
     */
    getKeys() {
        return Object.keys(keys);
    },
    /**
     * Returns the value that the key maps to. If the websocket is not open, this will always return the default value specified.
     * @param {string} key A networktables key
     * @param {any} [defaultValue] If the key isn’t present in the table, return this instead
     * @returns value of key if present, undefined or defaultValue otherwise
     */
    getValue(key, defaultValue) {
        if(typeof key != 'string') return new Error('Invalid Argument')

        if (typeof keys[key] != 'undefined') {
            return keys[key].val;
        }
        else {
            return defaultValue;
        }
    },
    /**
     * @returns null if the robot is not connected, or a string otherwise
     */
    getRobotAddress() {
        return connected ? robotAddress : null;
    },
    /**
     * @returns true if the robot is connected
     */
    isRobotConnected() {
        return connected;
    },
    /**
     * Sets the value in NetworkTables. If the websocket is not connected, the value will be discarded.
     * @param {string} key A networktables key
     * @param value The value to set (see warnings)
     * @returns True if the websocket is open, False otherwise
     */
    putValue(key, value) {
        if(typeof key != 'string') return new Error('Invalid Argument')

        if (typeof keys[key] != 'undefined') {
            keys[key].val = value;
            client.Update(keys[key].id, value);
        }
        else {
            const flags = 0;
            client.Assign(value, key, (flags & 1) === 1);
        }
        return connected;
    },
    /**
     * Escapes NetworkTables keys so that they’re valid HTML identifiers.
     * @param key A networktables key
     * @returns Escaped value
     */
    keyToId: encodeURIComponent,
    /**
     * Escapes special characters and returns a valid jQuery selector. Useful as NetworkTables does not really put any limits on what keys can be used.
     * @param {string} key A networktables key
     * @returns Escaped value
     */
    keySelector(key) {
        return encodeURIComponent(key).replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
    }
}