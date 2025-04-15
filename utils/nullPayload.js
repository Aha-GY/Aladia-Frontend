export function nullPayloads(obj) {
  if (Array.isArray(obj)) {
    // Handle arrays
    return obj
      .map(nullPayloads) // Recursively clean array elements
      .filter((value) => value != null); // Remove null or undefined values
  }
  if (typeof obj !== 'object' || obj === null) {
    return obj; // Return non-object values as is
  }

  // Iterate through entries, cleaning nested objects
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, value]) => value != null) // Filter out null or undefined
      .map(([key, value]) => [key, nullPayloads(value)]), // Recursively clean nested objects
  );
}
