# ImpactKVO

A lightweight KVO class for Impact.js

## Install

From your `lib` directory:
    
    mkdir plugins
    cd plugins
    git clone https://github.com/dclowd9901/impactKVO.git kvo

## Use

Key-value observation allows you to bind event handlers to specific value changes in a class. It's a bit cleaner than normal Javascript eventing, and promotes cleaner, more modular code.

    function doSomething( value, formerValue ){
      console.log( value, formerValue );
    }

    var model = new KVO();
    model.set('name', 'Bob'); // Sets model.name to "Bob"

    model.observe('name', doSomething, this) // doSomething will be called when 'name' changes, and doSomething will operate with the scope of 'this'
    model.set('name', 'Robert');

    // doSomething is fired, output is:
    // 'Robert', 'Bob'

## UI Watching

I made this to aide with some UI lifting I was doing, so there's optional functionality that can tie DOM changes to class value changes as well.

Let's say I was making a new debug panel:

    ig.module(
      'plugins.new-panel'
    )
    .requires(
      'dom.ready',
      'impact.game',
      'impact.debug.menu',
      'plugins.kvo.kvo'
    )
    .defines(function(){
      NewDebugPanel = ig.DebugPanel.extend({
        init: function( name, label ){
          this.parent( name, label );

          panelModel = new KVO( $('.newPanel')[0] );
        }
      });

      ig.debug.addPanel({
        type: NewDebugPanel,
        name: 'newPanel', // classname on dom element
        label: 'Bezier Scripter'
      });
    });

And let's say that panel had this markup:

    <select name="newOption"><option value="1">1</option><option selected="selected" value="2">2</option></select>

After `init`, your `panelModel` instance will now contain a new property:

    panelModel.get('newOption') // returns '2', as that was the default value set in the dom

It creates properties for *any element* that is an ancestor of the instantiated DOM element that contains a name attribute. The property names will be the same as the name attribute value (in this case, `newOption`).

If I:
  
    panelModel.set('newOption', '1');
    // The DOM element will now be set to '1'

Likewise, if I select '1' on the DOM element by clicking and selecting:

    panelModel.get('newOption'); // returns '1'

And, of course, making changes to that value in either case will trigger whatever observers happen to be assigned to it.

## API

`.get( *propertyName* )`

Returns value of that property in the class.

`.set( *propertyName*, *value*, *[silent]* )`

Sets the value of the property name in the class (and updates the associated DOM element as well, if there is one). It will subsequently fire attached observers in the order which they were attached. You can also opt to silence the change, thus not causing the observers to fire. 

`.observe( *propertyName*, *function*, *scope* )`

Adds an observer to a property change. It is recommended that you pass the scope as well, especially if you're making references to other properties/methods of your listening class. Generally speaking, scope should be set to `this` wherever you use this method.

`.update( *propertyName*, *object*, *[silent]* )`

Like `set`, only for structured objects. It allows you to overwrite properties, while leaving existing ones intact.

If I have a property on a class with the value:

    example: {
      'foo': 2
    }

and I `set`:
    
    instantiatedClass.set('example', { 'bar': 'car' });
 
    instantiatedClass.get('example')
    // returns {'bar':'car'}

Alternatively, if I `update`:

    instantiatedClass.update('example', { 'bar': 'car' });
 
    instantiatedClass.get('example')
    // returns {'foo' : 2, 'bar' : 'car'}

Any properties you set in `update` overwrite the existing properties for that object:

    instantiatedClass.update('example', { 'foo': 'car' });
 
    instantiatedClass.get('example')
    // returns {'foo' : 'car'}

## Legal

The MIT License (MIT)

Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.