import App from '../import/form_builder/index.jsx';
import React from 'react';
import { render } from 'react-dom';
import preset from './preset.js'

import "../node_modules/react-ui-tree/dist/react-ui-tree.css";

Meteor.startup(() => {
    console.log(preset);
    render(<App preset={preset}/>, document.getElementById('app'));
});
