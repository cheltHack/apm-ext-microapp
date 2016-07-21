Microapp Seed
===

**Experimental**

This is a proof-of-concept for a microapp seed, using Node/Express and ES6/Babel/JSPM. It is based on the ES6 seed here: https://github.build.ge.com/seeds/es6-jspm.

## What's a microapp?

The first rule of building big single-page applications is, "don't build big single-page-applications." As some of our projects have grown, it has become clear that we need a way to break them into multiple, smaller single-page applications. For now, we're calling these "microapps".

The idea behind a microapp is that it is designed to load into the content area of the App Hub (prototype at https://github.build.ge.com/hubs/ui-shell). The App Hub will include the microapp's `index.html` directly into the content area on its template, and proxy any further requests directly to the microapp itself.

A microapp should contain all the `<link>` and `<script>` tags needed to run itself. It should expect nothing other than basic styling from the App Hub. Because the App Hub loads no public libraries, the microapp is free to use whatever client-side stack is appropriate without fear of conflicts.

### Important Note:

Within your microapp you must always use **RELATIVE URLS** with **NO LEADING SLASHES**!

When running behind an App Hub, your URLs will have a path prepended to them, to distinguish your microapp from the other microapps running in the same App Hub. 

**Good**
```
<script src="foo/bar">
```

**Bad**
```
<script src="/foo/bar">
```
In the second case, your microapp's path won't be prepended to the URL, resulting in a 404 or worse.

## Dependencies

If you haven't already done so, install JSPM & Bower
```
% sudo npm install -g jspm
% sudo npm install -g bower
% sudo npm install -g gulp
```

Make sure 'github.build.ge.com' is in your no_proxy. In your .zshrc or whatever:
```
$ export no_proxy="github.com"
```

If you haven't already created an endpoint for Github Enterprise, do so:
```
% jspm registry create ge jspm-github
% Are you setting up a GitHub Enterprise registry? [yes]:yes
% Enter the hostname of your GitHub Enterprise server:github.com
```

## Installation

*NOTE* Node version should be > 5.6, You can install stable nodejs from url https://nodejs.org/en/download/stable/

Clone this repo
```
% git clone https://github.com/apmdev/apm-ext-microapp.git
```

Use JSPM and NPM to install all dependencies
```
% cd apm-ext-microapp
% npm install
% jspm install
```
This will create `src/jspm_packages`, `src/bower_components` and `node_modules` folders.

*NOTE* I would very much like to get rid of bower entirely, but until the Px team stops using relative paths (`../some-component/component.html`) we'll need it to load the Px/Polymer dependencies.

Start your server
```
% gulp serve
```

This command compiles all the sass files to css and watches on any change in javascript, sass, html files.

Point your browser to http://localhost:9000. If you want to run the app on a different port, edit the "server" task in `app.js`


## Testing

```
gulp test:unit
```
This runs the javascript unit test for the microapp. Take a look at `karma.conf` to see the configuration there. As usual, you can change the browser, set singleRun to false, etc.

```
gulp test:backend
```

This runs the integration test if any, it uses mocha framework.

```
gulp test:e2e
```

This runs the end-to-end test for the microapp sing protractor. Take a look at protractpr.conf file to change any configuration.


## Creating a Production Version
```
gulp dist
```
Will create a bundled, optimized distribution version of the application along with documentation and a test coverage summary in `dist/`. The manifest.yml file expects your app to be in `dist/` so definitely do this before a `cf push`.

## Documentation

We use ngdoc to compile inline documentation into an online doc system. Typing `gulp docs` will compile all inline comments preceded with `@ngdoc` into a mini-website at `docs/`. It's up to you whether/how to deploy this.

For more information see the documentation at https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation.
