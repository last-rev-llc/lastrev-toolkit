/* eslint-disable @typescript-eslint/unbound-method */
import _ from 'lodash';

export default _.flow(_.camelCase, _.upperFirst);
