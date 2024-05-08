export type RouteData = {
  metadata?: { width?: number; height?: number };
  content: string | Buffer | JSX.Element;
};

export type Route = {
  pathname: string;
  render(): RouteData | Promise<RouteData>;
};
