# io-types for Angular 2 Components
### Run Time Type Checking for Inputs/Outputs

_Please note that io-types is currently proof-of-concept._

Like React's propTypes, io-types let you describe expected input and output
for your Angular 2 components. Assertions are run in development mode letting
you easily catch bad bindings.

To use, install the dependency using npm:

`npm install io-types`

Then write assertions for your component's inputs:

```ts
import {Compnent, Input} from 'angular2/core';
import {CheckInput, check} from 'io-types';

@Component({
  selector: 'my-component',
  template: `...`
})
class MyComponent{
  @Input() @CheckInput(check.isBoolean) active;
}
```

Now passing non-boolean values to `active` results in an error. For example:

```html
<my-component [active]="123"></my-component>
```

Would throw:
```
Invalid value for 'MyComponent.active':
↳ Expected '123' to be of type 'boolean'
```

Similarly, you can use the same assertions to check function arguments. This helps
you make assertions about event handler callbacks:

```ts
import {Component} from 'angular2/core';
import {CheckArgs, check} from 'io-types';

@Component({
  selector: 'my-component',
  template: `
    <input (change)="handleChange($event.value)">
  `
})
class MyComponent{
  @CheckArgs(check.isString) handleChange(value: string){ }
}
```

### To Do
Right now io-types is basically a proof-of-concept. Future iterations may include
an API similar to React's propTypes in addition to using Reflection for simple assertions.
