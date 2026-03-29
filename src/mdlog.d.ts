declare module "mdlog" {
  const mdlog: (colorScheme: unknown) => (template: TemplateStringsArray | string, ...values: unknown[]) => string;
  export default mdlog;
}

declare module "mdlog/color/solarized-dark.json" {
  const colorScheme: Record<string, unknown>;
  export default colorScheme;
}
