import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/pipeable';
import * as t from 'io-ts';
import { failure } from 'io-ts/PathReporter';

// https://www.azavea.com/blog/2020/10/29/run-time-type-checking-in-typescript-with-io-ts/

const decode = <A, O = A, I = unknown>(codec: t.Type<A, O, I>, input: I) =>
  pipe(input, codec.decode, E.getOrElseW((errors) => { throw new Error(failure(errors).join("\n")) }));

const id = 1234567890;
const idString = 'abcdefgh';

const IdBrand = t.brand(
  t.number,
  (n): n is t.Branded<number, { readonly Id: unique symbol; }> => typeof n === 'number',
  'Id'
);

console.log(IdBrand.decode(id));
console.log(IdBrand.decode(idString));

const brandedId = decode(IdBrand, id);
console.log(brandedId);

const errorBrandedId = decode(IdBrand, idString);
