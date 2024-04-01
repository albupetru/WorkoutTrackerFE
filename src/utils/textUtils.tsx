const stringIsNullUndefOrEmpty = (str: string | null | undefined) =>
  str === null || str === undefined || str.trim().length === 0;

export { stringIsNullUndefOrEmpty };
