import 'reflect-metadata';
import {enableProdMode} from 'angular2/core';
import {CheckArgs} from './output';
import * as check from './assertions';

describe('Function Argument Checking', function(){
  it('should check arguments before calling the original function', function(){
    const spy = sinon.spy();
    let called = false;
    class Test{
      @CheckArgs(spy)
      method(){
        called = true;
      }
    }

    const instance = new Test();

    instance.method();

    spy.should.have.been.called;
    called.should.be.true;
  });

  it('should throw an error if the incorrect arguments are passed', function(){
    class Test{
      @CheckArgs(check.isBoolean, check.isNumber)
      method(...args: any[]){ }
    }

    const instance = new Test();

    (() => instance.method(123, false)).should.throw(Error);
  });
});
