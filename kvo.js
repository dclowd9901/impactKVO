ig.module('plugins.kvo')
.requires('impact.impact')
.defines( function(){

KVO = ig.Class.extend({
  observers: {},
  formEl: null,

  init: function( form ){
    if( form ){
      this.formEl = $(form);

      this._eventInputs();
      this._setInitialVals();
    }
  },

  get: function( propName ){
    return this[propName];
  },

  set: function( propName, value, silent ){
    var former = this[propName],
        i;

    $(this.formEl).find('[name=' + propName + ']').first().val( value );
    this[propName] = value;

    if( !silent && this.observers[propName] ){
      for( i = 0; i < this.observers[propName].length; i++ ){
        this.observers[propName][i]( value, former );
      }
    }
  },

  update: function( propName, obj, silent ){
    var combined = _.defaults( obj, this[propName] );

    this.set( propName, combined, silent );
  },

  observe: function( propName, fn, scope ){
    fn = scope ? fn.bind( scope ) : fn;

    if( this.observers[propName] ){
      this.observers[propName].push( fn );
    } else {
      this.observers[propName] = [ fn ];
    }
  },

  _eventInputs: function(){
    var self = this;

    $(this.formEl).change( function(e){
      var name = e.target.name,
          val  = e.target.value;

      self.set( name, val );
    });

    $(this.formEl).on('keyup', function(e){
      var name = e.target.name,
          val  = e.target.value;

      self.set( name, val );
    });
  },

  _setInitialVals: function(){
    var inputs = $('[name]'),
        self = this;

    _.forEach( inputs, function( input ){
      self[input.name] = input.value;
    });
  }
});

});