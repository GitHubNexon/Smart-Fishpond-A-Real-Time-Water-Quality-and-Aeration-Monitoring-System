// utils/form-data.helper.ts

/**
 * Deep comparison to check if two values are equal
 */
function deepEqual(val1: any, val2: any): boolean {
  // Strict equality check
  if (val1 === val2) return true;

  // Handle null and undefined
  if (val1 == null || val2 == null) return val1 === val2;

  // Handle Date objects
  if (val1 instanceof Date && val2 instanceof Date) {
    return val1.getTime() === val2.getTime();
  }

  // Handle arrays
  if (Array.isArray(val1) && Array.isArray(val2)) {
    if (val1.length !== val2.length) return false;
    return val1.every((item, index) => deepEqual(item, val2[index]));
  }

  // Handle objects
  if (typeof val1 === 'object' && typeof val2 === 'object') {
    const keys1 = Object.keys(val1);
    const keys2 = Object.keys(val2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every((key) => deepEqual(val1[key], val2[key]));
  }

  return false;
}

/**
 * Normalize empty values (null, undefined, empty string) for comparison
 */
function normalizeValue(value: any): any {
  if (value === '' || value === null || value === undefined) {
    return null;
  }
  return value;
}

/**
 * Get changed fields between initial and updated objects, supporting nested structures
 */
export function getChangedFields<T extends object, U extends object = T>(
  initial: T,
  updated: U,
  options: {
    skipEmpty?: boolean;
    normalizeEmpty?: boolean; // Treat null, undefined, and '' as equivalent
  } = {},
): Partial<U> {
  const changes: any = {};

  for (const key in updated) {
    if (!updated.hasOwnProperty(key)) continue;

    const initialValue = (initial as any)[key];
    const updatedValue = updated[key];

    // Skip if values are identical
    if (deepEqual(initialValue, updatedValue)) {
      continue;
    }

    // Handle nested objects (but not Date or Array)
    if (
      typeof updatedValue === 'object' &&
      updatedValue !== null &&
      !Array.isArray(updatedValue) &&
      !(updatedValue instanceof Date) &&
      typeof initialValue === 'object' &&
      initialValue !== null &&
      !Array.isArray(initialValue) &&
      !(initialValue instanceof Date)
    ) {
      const nestedChanges = getChangedFields(
        initialValue,
        updatedValue,
        options,
      );

      // Only include nested object if it has changes
      if (Object.keys(nestedChanges).length > 0) {
        changes[key] = nestedChanges;
      }
      continue;
    }

    // Normalize empty values if option is enabled
    if (options.normalizeEmpty) {
      const normalizedInitial = normalizeValue(initialValue);
      const normalizedUpdated = normalizeValue(updatedValue);

      if (normalizedInitial === normalizedUpdated) {
        continue;
      }
    }

    // Skip empty values if option is set
    if (options.skipEmpty) {
      if (
        updatedValue === '' ||
        updatedValue === null ||
        updatedValue === undefined
      ) {
        continue;
      }
    }

    // Value has changed
    changes[key] = updatedValue;
  }

  return changes as Partial<U>;
}

/**
 * Check if there are any changes between two objects
 */
export function hasChanges<T extends object, U extends object = T>(
  initial: T,
  updated: U,
  options?: { skipEmpty?: boolean; normalizeEmpty?: boolean },
): boolean {
  const changes = getChangedFields(initial, updated, options);
  return Object.keys(changes).length > 0;
}

/**
 * Merge changed fields back into the original object (deep merge)
 */
export function mergeChanges<T extends object>(
  original: T,
  changes: Partial<T>,
): T {
  const result: any = { ...original };

  for (const key in changes) {
    if (!changes.hasOwnProperty(key)) continue;

    const changeValue = changes[key];
    const originalValue = result[key];

    // Deep merge nested objects
    if (
      typeof changeValue === 'object' &&
      changeValue !== null &&
      !Array.isArray(changeValue) &&
      !(changeValue instanceof Date) &&
      typeof originalValue === 'object' &&
      originalValue !== null &&
      !Array.isArray(originalValue) &&
      !(originalValue instanceof Date)
    ) {
      result[key] = mergeChanges(originalValue, changeValue);
    } else {
      result[key] = changeValue;
    }
  }

  return result as T;
}
