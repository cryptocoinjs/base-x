/// <reference types="node" />
declare function base(ALPHABET: string): {
    encode: (source: Buffer) => string;
    decodeUnsafe: (source: string) => Buffer | undefined;
    decode: (string: string) => Buffer;
};
export = base;
