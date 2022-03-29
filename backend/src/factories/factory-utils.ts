const getRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export function generateList(factory: any, min = 1, max = 5): any[] {
  const arr = new Array(getRandomNumber(min, max)).fill(0);
  return arr.map(() => factory);
}
