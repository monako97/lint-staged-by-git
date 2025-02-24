#!/usr/bin/env node
':'; // # comment; exec /usr/bin/env node --experimental-modules --experimental-json-modules "$0" "$@"

import { eslint, stylelint } from '../lib';

Promise.all([eslint(), stylelint()]);
