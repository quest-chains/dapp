export function removeFromArray(arr: string[], item: string): string[] {
  let newArr = new Array<string>();
  for (let i = 0; i < arr.length; i = i + 1) {
    if (arr[i] != item) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}

export function createSearchString(
  name: string | null,
  description: string | null,
): string | null {
  if (name == null && description == null) return null;

  if (description == null) {
    return (name as String).toLowerCase();
  }

  if (name == null) {
    return (description as String).toLowerCase();
  }

  return (name as String)
    .toLowerCase()
    .concat(' ')
    .concat((description as String).toLowerCase());
}
