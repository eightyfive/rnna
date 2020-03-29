import { connect } from 'react-redux';

import { db } from '../services';
import View from '../views/scenes/hello';

const data = state => db.getUser(state);

export default connect(data)(View);
