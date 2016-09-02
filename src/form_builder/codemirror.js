import React, { Component } from 'react';
import { render } from 'react-dom';
import Codemirror from 'react-codemirror';
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/fold/foldcode.js";

function isArguments (object) {
  return Object.prototype.toString.call(object) === "[object Arguments]";
}

export function deepEquals(a, b, ca = [], cb = []) {
  // Partially extracted from node-deeper and adapted to exclude comparison
  // checks for functions.
  // https://github.com/othiym23/node-deeper
  if (a === b) {
    return true;
  } else if (typeof a === "function" || typeof b === "function") {
    // Assume all functions are equivalent
    // see https://github.com/mozilla-services/react-jsonschema-form/issues/255
    return true;
  } else if (typeof a !== "object" || typeof b !== "object") {
    return false;
  } else if (a === null || b === null) {
    return false;
  } else if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  } else if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source &&
    a.global === b.global &&
    a.multiline === b.multiline &&
    a.lastIndex === b.lastIndex &&
    a.ignoreCase === b.ignoreCase;
  } else if (isArguments(a) || isArguments(b)) {
    if (!(isArguments(a) && isArguments(b))) {
      return false;
    }
    let slice = Array.prototype.slice;
    return deepEquals(slice.call(a), slice.call(b), ca, cb);
  } else {
    if (a.constructor !== b.constructor) {
      return false;
    }

    let ka = Object.keys(a);
    let kb = Object.keys(b);
    // don't bother with stack acrobatics if there's nothing there
    if (ka.length === 0 && kb.length === 0) {
      return true;
    }
    if (ka.length !== kb.length) {
      return false;
    }

    let cal = ca.length;
    while (cal--) {
      if (ca[cal] === a) {
        return cb[cal] === b;
      }
    }
    ca.push(a);
    cb.push(b);

    ka.sort();
    kb.sort();
    for (var j = ka.length - 1; j >= 0; j--) {
      if (ka[j] !== kb[j]) {
        return false;
      }
    }

    let key;
    for (let k = ka.length - 1; k >= 0; k--) {
      key = ka[k];
      if (!deepEquals(a[key], b[key], ca, cb)) {
        return false;
      }
    }

    ca.pop();
    cb.pop();

    return true;
  }
}

function deepEquals(a, b, ca = [], cb = []) {
  // Partially extracted from node-deeper and adapted to exclude comparison
  // checks for functions.
  // https://github.com/othiym23/node-deeper
  if (a === b) {
    return true;
  } else if (typeof a === "function" || typeof b === "function") {
    // Assume all functions are equivalent
    // see https://github.com/mozilla-services/react-jsonschema-form/issues/255
    return true;
  } else if (typeof a !== "object" || typeof b !== "object") {
    return false;
  } else if (a === null || b === null) {
    return false;
  } else if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  } else if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source &&
    a.global === b.global &&
    a.multiline === b.multiline &&
    a.lastIndex === b.lastIndex &&
    a.ignoreCase === b.ignoreCase;
  } else if (isArguments(a) || isArguments(b)) {
    if (!(isArguments(a) && isArguments(b))) {
      return false;
    }
    let slice = Array.prototype.slice;
    return deepEquals(slice.call(a), slice.call(b), ca, cb);
  } else {
    if (a.constructor !== b.constructor) {
      return false;
    }

    let ka = Object.keys(a);
    let kb = Object.keys(b);
    // don't bother with stack acrobatics if there's nothing there
    if (ka.length === 0 && kb.length === 0) {
      return true;
    }
    if (ka.length !== kb.length) {
      return false;
    }

    let cal = ca.length;
    while (cal--) {
      if (ca[cal] === a) {
        return cb[cal] === b;
      }
    }
    ca.push(a);
    cb.push(b);

    ka.sort();
    kb.sort();
    for (var j = ka.length - 1; j >= 0; j--) {
      if (ka[j] !== kb[j]) {
        return false;
      }
    }

    let key;
    for (let k = ka.length - 1; k >= 0; k--) {
      key = ka[k];
      if (!deepEquals(a[key], b[key], ca, cb)) {
        return false;
      }
    }

    ca.pop();
    cb.pop();

    return true;
  }
}

function shouldRender(comp, nextProps, nextState) {
  const {props, state} = comp;
  return !deepEquals(props, nextProps) || !deepEquals(state, nextState);
}


Codemirror.prototype.componentWillReceiveProps = function (nextProps) {
  if (this.codeMirror &&
      nextProps.value !== undefined &&
      this.codeMirror.getValue() != nextProps.value) {
    this.codeMirror.setValue(nextProps.value);
  }
  if (typeof nextProps.options === "object") {
    for (var optionName in nextProps.options) {
      if (nextProps.options.hasOwnProperty(optionName)) {
        this.codeMirror.setOption(optionName, nextProps.options[optionName]);
      }
    }
  }
};


class JsonEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {valid: true, code: props.value};
  }

  componentWillReceiveProps(props) {
    this.setState({valid: true, code: props.value});
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onCodeChange(code)  {
    this.setState({valid: true, code});
    setImmediate(() => {
      try {
        this.props.onChange(this.state.code);
      } catch(err) {
        console.error(err);
        this.setState({valid: false, code});
      }
    });
  };

  render() {
    const {title, theme='default'} = this.props;
    const icon = this.state.valid ? 'ok' : 'remove';
    const cls = this.state.valid ? 'valid' : 'invalid';
    const cmOptions = {
      theme: 'default',
      height: 'auto',
      viewportMargin: Infinity,
      mode: {
        name: 'javascript',
        statementIndent: 2,
      },
      lineNumbers: true,
      lineWrapping: true,
      indentWithTabs: false,
      tabSize: 2,
    };
    return (
      <div className='panel panel-default'>
        <Codemirror
          value={this.state.code}
          onChange={this.onCodeChange.bind(this)}
          options={Object.assign({}, cmOptions, {theme})} />
      </div>
    );
  }
}

export default JsonEditor;
