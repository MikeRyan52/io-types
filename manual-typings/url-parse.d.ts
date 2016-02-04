declare module "url-parse"{
  export interface IUrl{
    protocol: string;
    username: string;
    password: string;
    auth: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    query: string;
    hash: string;
    href: string;
  }

  export default function(path: string): IUrl;
}
