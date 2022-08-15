export const randomBytes = (nBytes: number): string => {
  // convert number number of bytes
  nBytes = Math.ceil(+nBytes || 1);

  // create a typed array of that many bytes
  const u = new Uint8Array(nBytes);

  // populate it wit crypto-random values
  window.crypto.getRandomValues(u);

  // convert it to an Array of Strings (e.g. "01", "AF", ..)
  const zpad = (str: string): string => '00'.slice(str.length) + str;

  const a = Array.prototype.map.call(u, (x: number): string =>
    zpad(x.toString(16)),
  );

  // Array of String to String
  const str = a.join('').toUpperCase();

  // return what we made
  return `0x${str}`;
};
