declare module "path-to-regexp" {
  interface IOptions{
    sensitive?: boolean;
    strict?: boolean;
    end?: boolean;
  }

  interface IToken{
    name: string | number;
    prefix: string;
    delimiter: string;
    optional: boolean;
    repeat: boolean;
    pattern: string;
  }

  function pathToRegexp(path: string, keys?: string[], options?: IOptions): RegExp;

  function parse(path: string): Array<string | IToken>;

  function compile(path: string): (params: any) => string;

  function tokensToRegExp(tokens: Array<string | IToken>): RegExp;

  function tokensToFunction(tokens: Array<string | IToken>): (params: any) => string;

  export default pathToRegexp;
  export { parse, compile, tokensToFunction, tokensToRegExp, IToken, IOptions };
}
