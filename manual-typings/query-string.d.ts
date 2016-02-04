declare module "query-string" {
  export function parse(params: string): { [name: string]: any };

  export function stringify(params: { [name: string]: any }): string;
}
