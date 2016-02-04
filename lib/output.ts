import {Asserter} from './asserter';
import {assertionsEnabled} from 'angular2/src/facade/lang'

export function CheckArgs(...asserters: Asserter[]): MethodDecorator{
  return function(proto, key: string, descriptor: PropertyDescriptor){
    if(assertionsEnabled()){
      const fn: Function = descriptor.value;

      descriptor.value = function(...args){
        asserters.forEach((asserter, index) => {
          try{
            asserter(args[index]);
          }
          catch(e){
            throw new Error(
              `Arguments check failed for '${proto.constructor.name}.${key}':
               ↳ ${e}
               ↳ At position ${index} of args ${JSON.stringify(args)}`
            );
          }
        });

        return fn.apply(this, args);
      };
    }
  };
}
