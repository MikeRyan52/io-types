export interface Asserter{
  (value: any): void
};

export const identity: Asserter = function(){ }
