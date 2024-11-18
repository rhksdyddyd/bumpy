/* eslint-disable max-classes-per-file */

const uniqueKey = Symbol('class identifier');
let uniqueKeyValue = 0;

export interface IIdentifiable {
    getUniqueKey: () => number;
}

export type UniqueKey = ReturnType<IIdentifiable['getUniqueKey']>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function identify(any: any): UniqueKey {
    return (any as IIdentifiable).getUniqueKey();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ctor<T = any> = new (...args: any[]) => T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ACtor<T = any> = abstract new (...args: any[]) => T;

function Identifiable<ABase extends ACtor>(base: ABase): ACtor<InstanceType<typeof base>> & IIdentifiable;
function Identifiable<TBase extends Ctor>(base: TBase): Ctor<InstanceType<typeof base>> & IIdentifiable;
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
function Identifiable(base: any): any {
    abstract class IdentifiableBase extends base {
        private static [uniqueKey]: number;

        public static getUniqueKey(): number {
            if (Object.prototype.hasOwnProperty.call(this, uniqueKey)) {
                return this[uniqueKey]!;
            }
            this[uniqueKey] = uniqueKeyValue;
            uniqueKeyValue += 1;

            return this[uniqueKey];
        }
    }

    return IdentifiableBase;
}

export default Identifiable;
