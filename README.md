# DOMP
A library for creating templates and handling DOM elements.

## Installation
### Client-side
The `DOMP.js` can be found inside the `build/` folder, add it as `<script src="path/to/DOMP.js" type="text/javascript"></scipt>` in the body of your html file. Then create a new hash managing unit from the DOMP `constructor` with:

```javascript
const DOMManager = new DOMP();
```
## Setup

### A basic setup and usage
```javascript

const DOMManager = new DOMP();


// (0.) Creating templates.
DOMManager.createTemplate( 'link-template', function( data, container ) {

   const linkElem = document.createElement( 'A' );
   linkElem.href = data.href;
   linkElem.innerText = data.title;
   
   container.appendChild( link );
  
} );

DOMManager.createTemplate( 'paragraph-template', function( data, container, build ) {

   const link = build( 'link-template', data ),
         paragraph = document.createElement( 'P' );
         
   paragraph.innerText = data.description;
   
   paragraph.appendChild( link );
   container.appendChild( paragraph );
  
} );
```
```javascript
// (1.) Building the component.

const myComponent = DOMManager.buildComponent( 'paragraph-template', { 
  
  //Data:
  title: 'Github',
  href: 'https://github.com/',
  description: 'Among the greatest sites on the internet!'
  
} );

```
```javascript
// (2.) Injecting myComponent into a HTML element on the document.

const docElem = document.getElementById( 'some-id' );
DOMManager.injectComponent( docElem /* Where to inject */, myComponent /* The component to inject */ );

```
```javascript
// (3.) Retrieving myComponent from the document.
DOMManager.retrieveComponent( myComponent );
// and now it's ready for reuse.

```
```javascript
// (4.) Removing the myComponent completely.
DOMManager.removeComponent( myComponent );

```

