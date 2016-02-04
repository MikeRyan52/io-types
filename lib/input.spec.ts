import 'reflect-metadata';
import {SimpleChange, enableProdMode} from 'angular2/core';
import {CheckInput} from './input';
import * as check from './assertions';

class Test{
  @CheckInput(check.isBoolean) value: any;

  ngOnInit(){ }
  ngOnChanges(change: { [name: string]: SimpleChange }){ }
}

function call(instance: Test, fnName: string, arg?: any){
  return function(){
    instance[fnName](arg);
  };
}

function change(prop: string, value: any): { [name: string]: SimpleChange }{
  return { [prop]: { isFirstChange: () => true, previousValue: undefined, currentValue: value }};
}

describe('CheckInput Decorator', function(){
  let instance: Test;

  beforeEach(() => instance = new Test());

  it('should not throw an error if the input is initialized correctly', function(){
    instance.value = true;
    call(instance, 'ngOnInit').should.not.throw();
  });

  it('should throw an error if the input type is not initialized correctly', function(){
    instance.value = 123;

    call(instance, 'ngOnInit').should.throw(Error);
  });

  it('should call the original OnInit hook', function(){
    const spy = sinon.spy();

    class HookTest{
      @CheckInput(check.isBoolean) value = true;

      ngOnInit = spy;
    }

    const instance = new HookTest();
    instance.ngOnInit();

    spy.should.have.been.called;
  });

  // This test has global side effects that break other tests :(
  xit('should not install assertions if Angular is in production mode', function(){
    enableProdMode();

    class HookTest{
      @CheckInput(check.isBoolean) value = 123;

      ngOnInit(){ }
      ngOnChanges(){ }
    }

    const instance = new HookTest();

    call(instance, 'ngOnInit').should.not.throw();
  });
});
