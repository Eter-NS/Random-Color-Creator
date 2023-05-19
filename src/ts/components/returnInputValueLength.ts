export function returnInputValueLength(inputs: NodeListOf<HTMLInputElement>) {
  let smallestLength = 0;
  for (let i = 0; i < inputs.length; i++) {
    const element = inputs[i];
    if (smallestLength < element.value.length)
      smallestLength = element.value.length;
  }
  return smallestLength;
}

export function returnStringLength(array: string[]) {
  let smallestLength = 0;
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (smallestLength < element.length) smallestLength = element.length;
  }
  return smallestLength;
}
