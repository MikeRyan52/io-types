import {SimpleChange} from 'angular2/core';
import {mapToErrors, arrayToString} from './util';
import {Asserter, identity} from './asserter';


export const optional = function(assertion: Asserter = identity): Asserter{
  return function(val: any){
    if(val !== undefined){
      assertion(val);
    }
  }
}

export const required = function(assertion: Asserter = identity): Asserter{
  return function(val: any){
    if(val === undefined){
      throw new Error(`Value '${val}' is undefined`);
    }
    else{
      assertion(val);
    }
  }
}

export const typeOf = function(type: string): Asserter{
  return function(value: any){
    if(typeof value !== type){
      throw new Error(`Type of '${value}' was not '${type}'`);
    }
  }
}

export const notTypeOf = function(type: string): Asserter{
  return function(value: any){
    if(typeof value === type){
      throw new Error(`Type of '${value}' is '${type}'`);
    }
  }
}

export const isBoolean = typeOf('boolean');
export const isNotBoolean = notTypeOf('boolean');
export const isUndefined = typeOf('undefined');
export const isNotUndefined = notTypeOf('undefined');
export const isNumber = typeOf('number');
export const isNotNumber = notTypeOf('number');
export const isString = typeOf('string');
export const isNotString = notTypeOf('string');
export const isFunction = typeOf('function');
export const isNotFunction = notTypeOf('function');
export const isSymbol = typeOf('symbol');
export const isNotSymbol = notTypeOf('symbol');
export const isObject = typeOf('object');
export const isNotObject = notTypeOf('object');

export const isArray: Asserter = function(value: any){
  if(!Array.isArray(value)){
    throw new Error(`Value '${value}' is not an array`);
  }
}

export const isNotArray: Asserter = function(value: any){
  if(Array.isArray(value)){
    throw new Error(`Value '${value}' is an array`);
  }
}

export const isPresent = required(function(val){
  if(val === null){
    throw new Error('Value is null');
  }
});

export const oneOf = function(...asserters: Asserter[]): Asserter{
  return function(value: any){
    const errors = mapToErrors(value, asserters)

    if(errors.length === asserters.length){
      throw new Error(`Value '${value}' did not satisfy any types:
        ${arrayToString(errors)}
      `);
    }
  };
}


export const allOf = function(...asserters: Asserter[]): Asserter{
  return function(value: any){
    asserters.forEach(assertion => assertion(value));
  };
}

export const oneOfValue = function(...allowedValues: any[]): Asserter{
  return function(value: any){
    if(allowedValues.filter(allowed => allowed === value).length === 0){
      throw new Error(`Value '${value}' was not any of ${arrayToString(allowedValues)}`);
    }
  }
}

export const instanceOf = function(token: any): Asserter{
  return required(function(value: any){
    if(!(value instanceof token)){
      throw new Error(`Value '${value}' is not an instance of token '${token}'`);
    }
  });
}

export const notInstanceOf = function(token: any): Asserter{
  return required(function(value: any){
    if(value instanceof token){
      throw new Error(`Value '${value}' is not an instance of token '${token}'`);
    }
  });
}


export const shape = function(shapeDescription: any): Asserter{
  return required(function(val: any){
    const shapeKeys = Object.keys(shapeDescription);

    Object
      .keys(val)
      .filter(key => !!shapeKeys.find(x => x === key))
      .forEach(key => shapeDescription[key](val[key]));
  });
}

export const arrayOf: Asserter = function(asserter: Asserter){
  return allOf(isArray, value => asserter(value));
}

export const equals = function(targetValue: any){
  return function(value: any){
    if(value !== targetValue){
      throw new Error(`Expected '${targetValue}' to equal '${value}'`);
    }
  }
}


export const arrayLength = function(length: number){
  return allOf(isArray, shape({ length }));
}
