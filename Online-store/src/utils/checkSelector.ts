export const checkSelector = (source: Element | Document, selector: string): Element => {
  const element = source.querySelector(selector);
  if (!element) {
    throw new Error(`No element with selector ${selector}`);
  }
  return element;
};
