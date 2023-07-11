/**
 * Given a number value, and an optional min and max number,
 * return value such that min <= value <= max.
 * @param options
 * @returns
 */
export default function clamp(options: {
    value: number;
    min?: number;
    max?: number;
}) {
    let value = options.value;

    if (options.min != null) {
        value = Math.max(options.min, value);
    }

    if (options.max != null) {
        value = Math.min(options.max, value);
    }

    return value;
}
