const DOMP = (function () {


	function IndexPoolArray( _array = [], _openIndices = [] ) {

		this._array       = _array;
		this._openIndices = _openIndices;

	};

	IndexPoolArray.prototype = Object.assign( {

		add: function( item ) {

			let index;

			if( this._openIndices.length > 0 ) {

				index = this._openIndices.pop();

				this._array[ index ] = item;

			}

			else {

				index = this._array.length;

				this._array[ index ] = item;

			}

			return index;

		},

		remove: function( index ) {

			if( index === this._array.length - 1 ) {

				this._array.pop();

			}

			else {

				this._openIndices.push( index );

			}

		},

		get: function( index ) {

			return this._array[ index ];

		}

	} );

	function DOMPonent ( param = {} ) {

		this.template = param.template !== undefined ? param.template : undefined;
		this.id = param.id !== undefined ? param.id : undefined;
		this.container = param.container !== undefined ? param.container : undefined;
		this.fragment = param.fragment !== undefined ? param.fragment : undefined;

	};

	DOMPonent.prototype = Object.assign( DOMPonent.prototype, {

		constructor: DOMPonent

	} );

	function DOMP () {

	};

	DOMP.prototype = Object.assign( DOMP.prototype, {


		/*
		**	Private methods and variables.
		*/

		_components: ( function() {

			return new IndexPoolArray();

		} )(),

		_templates: {},

		_fragments: [],

		_toComponent: function ( query ) {

			if( query instanceof DOMPonent ) {

				return query;

			}

			let id;

			if( typeof query === 'string' ) {

				id = parseInt( query.splice( 5, query.length ) );
				
				return this._components.get( id );

			}

			else if ( typeof query === 'number' ) {

				id = query;
				
				return this._components.get( id );

			}

			else if ( query instanceof Element ) {

				id = parseInt( query.id.splice( 10, query.id.length ) );
				
				return this._components.get( id );

			}

			else throw new TypeError( 'Could not recognize component. Try using the DOMPonent object, an integer id inside the DOMPonent, a string containing the id with "DOMPonent-" as a prefix, or the container element refrenced inside the DOMPonent object.' );

		},

		_requestFragment: function() {

			if( this._fragments.length === 0 ) return document.createDocumentFragment();

			else return this._fragments.pop();

		},

		_releaseFragment: function( fragment ) {

			this._fragments.push( fragment );

		},


		/*
		**	Public methods.
		*/

		createTemplate: function ( name, template ) {

			this._templates[ name ] = template;

			return this;

		},

		removeTemplate: function( name ) {

			if( this._templates[ name ] !== undefined ) {

				this._templates[ name ] = undefined;

			}

		},

		buildComponent: function ( name, data, _container ) {

			let container, component;

			if( _container === undefined ) {

				const fragment = this._requestFragment();

				component = new DOMPonent( {

				  	id: 		undefined,
				  	data:       data,
				  	container: 	undefined,
				  	fragment: 	fragment

				}, this );

				container = document.createElement( 'DIV' );

				component.id = this._components.add( component );
				component.container = container;

				container.id = component.id;
				container.classList.add( 'domp-container' );

				fragment.appendChild( container );

			}

			this._templates[ name ]( 

				data,
				_container !== undefined ? _container : container,
				this.buildComponent

			);


			if( _container === undefined ) {

				return component;

			} else {

				return component.container;

			}

		},

		removeComponent: function ( component ) {

			component = this._toComponent( component );

			this.retrieve( component );

			const children = component.fragment.childNodes;

			while ( component.fragment.firstChild ) {

				component.fragment.removeChild( component.fragment.firstChild );

			}

			this._releaseFragment( component.fragment );

			this._components.remove( component.id );

			component.template = undefined;
			component.container = undefined;
			component.fragment = undefined;
			component.id = undefined;

			component = undefined;

			return this;

		},

		injectComponent: function ( parent, component ) {

			component = this._toComponent( component );

			parent.appendChild( component.fragment );

		},

		retrieveComponent: function ( component ) {

			component = this._toComponent( component );

			if( component.fragment === undefined ) {

				component.fragment = this._requestFragment();

			}

			component.fragment.appendChild( component.container );

			return this;

		},

		get components() {

			return this._components;

		},

		set components( ...components ) {

			for( var i = 0; i < components.length; i ++ ) {

				this._buildComponent( 

					components[ i ].name
				)

			}

		}


	} );

	return DOMP;

} );
