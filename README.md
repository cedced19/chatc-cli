#ChatC-Web

[![Build Status](https://travis-ci.org/cedced19/ChatC-Web.svg?branch=master)](https://travis-ci.org/cedced19/ChatC-Web)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Dependencies](https://david-dm.org/cedced19/ChatC-Web.png)](https://david-dm.org/cedced19/ChatC-Web)
[![devDependencies](https://david-dm.org/cedced19/ChatC-Web/dev-status.png)](https://david-dm.org/cedced19/ChatC-Web#info=devDependencies)

A chat with Socket.io and Node.js !

It's my first realy application with Node.js !

It's a simple chat.

This chat will be upgrade soon.

![](demo.png)

##Intall and developpement

Yeoman genertor:

```bash
$ npm install -g yo
$ npm install -g generator-chat
$ yo chat
```

To launch in developpement:

```bash
$ npm install
$ node server.js
```

To launch in release:

```bash
$ npm install
$ grunt
$ cd dist/
$ node server.js
```

NOTE: public/ is the dist folder.
