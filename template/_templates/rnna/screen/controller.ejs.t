---
to: app/controllers/<%= h.changeCase.paramCase(name) %>.js
---
import { connect } from 'react-redux';

import { db } from '../services';
import View from '../views/scenes/<%= h.changeCase.paramCase(name) %>';

const data = state => ({
  foo: db.getFoo(state),
});

export default connect(data)(View);