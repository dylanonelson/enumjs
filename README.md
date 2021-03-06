# enumfactory
> Java-like enums in JavaScript

![Build status](https://travis-ci.org/dylanonelson/enumfactory.svg?branch=master)

## Example

```javascript
// ES5

var enumfactory = require('enumfactory');
var createEnum = enumfactory.createEnum;
var defineConstant = enumfactory.defineConstant;

var Letters = createEnum(
  defineConstant('ALPHA'),
  defineConstant('BETA')
)();

Letters.ALPHA // => String {getDeclaringClass: f, toString: f}

Letters.ALPHA.name() // => "ALPHA"

Letters.ALPHA.ordinal() // => 0

Letters.ALPHA.toString() // => "Enum ALPHA"

Letters.GAMMA // => Uncaught Error: Value GAMMA is not present in enum.

var Color = function(options) {
  if (options) {
    this._rgb = options.rgb;
    this._hex = options.hex;
    this._name = options.name;
  }

  Object.defineProperty(this, 'name', {
    get: function () {
      return this._name;
    },
  });
}

var Colors = createEnum(
  defineConstant('WHITE', { hex: '#FFF', name: 'white' }),
  defineConstant('BLACK', { hex: '#000', name: 'black' })
)(Color);

Colors.values() // => [Color, Color]

Colors.WHITE.hex // => "#FFF"
Colors.WHITE.name // => function () { return name }
Object.getPrototypeOf(Colors.WHITE).name // => "white"

Colors.RED // => Uncaught Error: Value RED is not present in enum. (See note below on `Proxy` and `process.env.NODE_ENV`)

var Rainbow = createEnum(
  defineConstant('RED'),
  defineConstant('ORANGE'),
  defineConstant('YELLOW'),
  defineConstant('RED')
)(Color); // => Uncaught Error: Cannot define a constant for RED twice in the same enum
```

```js
// ESNext, with decorators!
import { createEnum, defineConstant } from 'enumfactory';

@createEnum(
  defineConstant('WHITE', { hex: '#FFF', name: 'white' }),
  defineConstant('BLACK', { hex: '#000', name: 'black' }),
)
class Colors {
  constructor() {
    if (options) {
      this._rgb = options.rgb;
      this._hex = options.hex;
      this._name = options.name;
    }
  }

  get name() {
    return this._name;
  }
}

Colors.values() // => [Color, Color]

// etc...
```

## Installation

`npm i --save-dev enumfactory`

## Methods

```javascript
var enumfactory = require('enumfactory');
```

### enumfactory.createEnum
Create a new Enum object. Takes as its arguments a list of defined constants created with enumfactory.defineConstant. Returns a function that takes as an optional argument a class or constructor function and returns an `EnumType` object. If you do not provide a function with which to instantiate an enum, it defaults to `String`.

### enumfactory.defineConstant
Define an enum constant to be consumed by `createEnum`. Takes as its first argument the name of the enum to be defined. Any additional arguments will be passed to the constructor function when the return value of enumfactory.createEnum is invoked.

### EnumType
An EnumType is what you get when you invoke the return value of enumfactory.createEnum.

#### EnumType#values()
Returns an array of EnumValues. See below.

#### EnumType#valueOf(string: name)
Returns the EnumValue whose name matches the name parameter.

#### EnumType#toString()
Returns
```javascript
`Enum type ${constructor.name}`
```

### EnumValue
An EnumValue is what you get when you retrieve a constant from an EnumType.

#### EnumValue#getDeclaringClass()
Returns the constructor function used to create the constant.

#### EnumValue#name()
Returns its name.

#### EnumValue#ordinal()
Returns the index of its definition in the call to `createEnum`.

#### EnumValue#toString()
Returns
```javascript
`Enum ${name}`
```

#### A note on errors
In development (`process.env.NODE_ENV !== 'production'`) and when the environment supports `Proxy`s, an EnumType will throw errors when you try to get or set a property that is not defined. If either of the former conditions are not met, EnumTypes behave like normal JavaScript objects.

#### A note on equality
Every EnumValue is an object, even those which are defined as strings. So each constant will evaluate as strictly equal *only to itself*.

#### A note on the prototype chain
Each EnumValue has as its prototype an instance of the class (`String`, in the default case) passed to `createEnum`. If, therefore, your class defines a property that overlaps with those defined on EnumValues -- e.g., `name` -- you can still unearth the underlying value by calling `Object.getPrototypeOf` on the EnumValue.

Note in the example above that `Colors.WHITE.name` is a function, but `Object.getPrototypeOf(Colors.WHITE).name` returns the property defined on an instance of `Color`.

This also means that if your class methods rely on distinguishing properties of `this` that are enumerable, you may run into issues.
