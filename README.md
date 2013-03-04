A very simple node bundler, presently only bundles all JS files into one single
file but in future it could bundle CSS, HTML templates etc files too.

This is intended for use during development to speed up feedback, instead of
adding many <script> tags just add one <script src="bundle.js"> and off you go.

Everytime you reload all your newest classes and code changes are immediately
available for you to in the browser. No build step.

Usage ::

```javascript
var BundlerFactory = require('node-bundler');

var bundler = BundlerFactory.createBundler();

bundler.startBundlerServer();
```