export const randomHash = (min: number, max: number, count: number): string => {
  let hash: string = '';

  for (let i = 0; i < count; i++) {
    hash += String(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  return hash;
}