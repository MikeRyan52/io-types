import {Asserter} from './asserter';

export function mapToErrors(value: any, asserters: Asserter[]): any[]{
  return asserters.map(x => {
    try{
      x(value);
    }
    catch(e){
      return e;
    }
  })
  .filter(x => !!x);
}

export function arrayToString(values: any[], converter = t => `${t}`){
  return JSON.stringify(values.map(converter));
}
