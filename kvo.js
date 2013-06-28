ig.module('plugins.kvo.kvo')
.requires('impact.impact')
.defines( function(){

KVO = ig.Class.extend({
  observers: {},
  formEl: null,

  init: function( form, passedObservers ){
    if( form ){
      this.formEl = $(form);

      this._eventInputs();
      this._setInitialVals();
    }

    if( passedObservers ){
      this.observers = passedObservers;
    }
  },

  get: function( propName ){
    return this[propName];
  },

  set: function( propName, value, data, silent ){
    var former = this[propName],
        i;

    $(this.formEl).find('[name=' + propName + ']').first().val( value );
    this[propName] = value;

    if( !silent && this.observers[propName] ){
      for( i = 0; i < this.observers[propName].length; i++ ){
        this.observers[propName][i]( value, former, data );
      }
    }
  },

  update: function( propName, obj, data, silent ){
    var combined = $.extend( this[propName], obj );

    this.set( propName, combined, data, silent );
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
    var $inputs = $('[name]'),
        self = this,
        i;

    $inputs.each( function( input ){
      self[input.name] = input.value;
    });
  }
});

});