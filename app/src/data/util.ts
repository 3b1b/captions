import { readFileSync, writeFileSync } from "fs";

export function average(array: number[]) {
  return array.reduce((total, value) => total + value, 0) / array.length;
}

export function readFile<T>(filename: string) {
  try {
    return JSON.parse(readFileSync(filename, { encoding: "utf8" })) as T;
  } catch (error) {
    return;
  }
}

export function writeFile(filename: string, data: unknown) {
  writeFileSync(filename, JSON.stringify(data, null, 2));
}
