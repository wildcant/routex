import md5 from 'md5';

export const generateHashFor = (str: string) => md5(str);
