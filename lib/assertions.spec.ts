import * as check from './assertions';
import {Asserter} from './asserter';

function call(asserter: Asserter, value: any){
  return function(){
    asserter(value);
  };
}

function catchCall(asserter: Asserter, value: any){
  try{
    asserter(value)
  }
  catch(e){

  }
}

describe('Assertions', function(){
  describe('Optional Assertion', function(){
    it('should not throw an error when passed an undefined value', function(){
      call(check.optional(), undefined).should.not.throw(Error);
    });

    it('should wrap a required asserter to filter out undefined values', function(){
      const spy = sinon.spy();
      const asserter = check.optional(spy);

      asserter(undefined);

      spy.should.not.have.been.called;
    });

    it('should pass defined values into the wrapped asserter', function(){
      const spy = sinon.spy();
      const asserter = check.optional(spy);

      asserter(123);

      spy.should.have.been.calledWith(123);
    });
  });

  describe('Required Assertion', function(){
    it('should throw an error when passed an undefined value', function(){
      call(check.required(), undefined).should.throw(/is undefined/);
    });

    it('should wrap an asserter and filter out undefined values', function(){
      const spy = sinon.spy();
      const asserter = check.required(spy);
      catchCall(asserter, undefined);

      spy.should.not.have.been.called;
    });

    it('should pass defined values into the wrapped asserter', function(){
      const spy = sinon.spy();
      const asserter = check.required(spy);
      asserter(123);

      spy.should.have.been.calledWith(123);
    });
  });

  describe('TypeOf Assertion', function(){
    it('should not throw an error if the correct type is passed', function(){
      call(check.typeOf('number'), 123).should.not.throw(Error);
    });

    it('should throw an error if the incorrect type is passed', function(){
      call(check.typeOf('number'), false).should.throw(Error);
    });
  });

  describe('NotTypeOf Assertion', function(){
    it('should not throw an error if the incorrect type is passed', function(){
      call(check.notTypeOf('number'), true).should.not.throw(Error);
    });

    it('should throw an error if the correct type is passed', function(){
      call(check.notTypeOf('function'), function(){}).should.throw(Error);
    });
  });

  describe('OneOf Assertion', function(){
    it('should not throw an error if the provided value satisfies one of the asserters', function(){
      call(check.oneOf(check.isBoolean, check.isNumber), 123).should.not.throw(Error);
    });

    it('should throw an error if the provided value does not satisfy any of the asserters', function(){
      call(check.oneOf(check.isBoolean, check.isNumber), []).should.throw(Error);
    });
  });

  describe('Shape Assertion', function(){
    it('should not throw an error if the shape is correctly described', function(){
      const assertion = check.shape({
        test: check.isNumber,
        hello: check.isFunction
      });

      call(assertion, { test: 123, hello(){ }}).should.not.throw(Error);
    });

    it('should throw an error if the shape is not correctly described', function(){
      const assertion = check.shape({
        test: check.isArray,
        hello: check.isBoolean
      });

      call(assertion, { test: 123, hello: null }).should.throw(Error);
    });
  })
});
