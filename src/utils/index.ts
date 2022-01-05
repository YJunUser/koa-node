export function compareTime(t1: string, t2: string) {
  const arr1 = t1.split('/').map((item) => Number(item));
  const arr2 = t2.split('/').map((item) => Number(item));
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] === arr2[i]) {
      continue;
    }
    if (arr1[i] > arr2[i]) {
      return true;
    }

    return false;
  }
  return true;
}
