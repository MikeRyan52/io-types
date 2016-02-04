import {Asserter} from './asserter';
import {SimpleChange} from 'angular2/core';
import {assertionsEnabled} from 'angular2/src/facade/lang'


const INPUT_ASSERTION_CACHE = new WeakMap<any, { [key: string]: Asserter }>();

function isInstalled(proto: any){
  return INPUT_ASSERTION_CACHE.has(proto);
}

function installInputAsserter(proto: any){
  INPUT_ASSERTION_CACHE.set(proto, {});

  const ngOnChanges: Function = proto.ngOnChanges;
  proto.ngOnChanges = function(changes: { [prop: string]: SimpleChange }){
    const key = Object.keys(changes)[0];
    const asserters = INPUT_ASSERTION_CACHE.get(proto);

    if(asserters[key]){
      try{
        asserters[key](changes[key].currentValue);
      }
      catch(e){
        throw new Error(
          `Invalud value for '${proto.constructor.name}.${key}':
           ↳ ${e}`
        );
      }
    }

    if(ngOnChanges){
      ngOnChanges.call(this, changes);
    }
  };

  const ngOnInit: Function = proto.ngOnInit;
  proto.ngOnInit = function(){
    const asserters = INPUT_ASSERTION_CACHE.get(proto);
    const keys = Object.keys(asserters);

    for(let key of keys){
      asserters[key](this[key]);
    }

    keys.forEach(key => {
      try{
        asserters[key](this[key]);
      }
      catch(e){
        throw new Error(
          `Invalud value for '${proto.constructor.name}.${key}':
           ↳ ${e}`
        );
      }
    })

    if(ngOnInit){
      ngOnInit.call(this);
    }
  };
}

function pushInputAsserter(proto: any, key: string, asserter: Asserter){
  if(assertionsEnabled()){
    if( !isInstalled(proto) ){
      installInputAsserter(proto);
    }

    INPUT_ASSERTION_CACHE.get(proto)[key] = asserter;
  }
}

export function CheckInput(asserter: Asserter): PropertyDecorator{
  return function(proto, key: string){
    pushInputAsserter(proto, key, asserter);
  }
}
