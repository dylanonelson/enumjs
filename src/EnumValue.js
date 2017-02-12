import check from 'check-types';

function EnumValue({ name, ordinal, value, enumType }) {
  const enumClassGenerator = new Function ('name', 'ordinal',
    `return function ${name}() {
      Object.defineProperty(this, 'name', {
        get: function() { return function() { return name } },
      });
      Object.defineProperty(this, 'ordinal', {
        get: function() { return function() { return ordinal } },
      });
    }`
  );

  const EnumClass = enumClassGenerator(name, ordinal);
  EnumClass.prototype = value;

  const enumValue = new EnumClass();

  const toString = () => `Enum ${name}`;

  enumValue.getDeclaringClass = () => value.prototype ?
    value.prototype.constructor :
    value.__proto__ ?
    value.__proto__.constructor :
    undefined;

  if (check.instance(value, String)) {
    enumValue.toString = toString;
  }

  else {
    if (value.toString && value.toString !== Object.prototype.toString) {
      enumValue.toString = value.toString.bind(value);
    } else {
      enumValue.toString = toString;
    }
  }

  return enumValue;
}

export default EnumValue;
