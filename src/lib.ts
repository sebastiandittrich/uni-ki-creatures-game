import type { Creature } from "./creatures";

export type Point = { x: number; y: number };
export type CreatureOnPoint = { creature: Creature; point: Point };

export function distanceBetween(a: Point, b: Point) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function isSamePoint(a: Point, b: Point) {
  return a.x === b.x && a.y === b.y;
}

export function timefn<Args extends unknown[], Return>(name: string, fn: (...args: Args) => Return, ...args: Args): Return;
export function timefn<Args extends unknown[], Return>(fn: (...args: Args) => Return, ...args: Args): Return;
export function timefn(...args: unknown[]) {
  const [name, fn, ...rest] = typeof args[0] === "string" ? args : [(args[0] as Function).name, ...args];
  if (typeof fn !== "function") throw new Error("timefn: fn is not a function");
  const start = performance.now();
  const result = fn(...rest);
  const end = performance.now();
  console.log(`${name}: ${end - start}ms`);
  return result;
}

export function closestCreature(creature: CreatureOnPoint, creatures: CreatureOnPoint[]) {
  return creatures
    .filter((other) => !isSamePoint(other.point, creature.point))
    .reduce(
      (closest, other) => {
        const distance = distanceBetween(creature.point, other.point);
        if (distance < closest.distance) {
          return { distance, creature: other };
        }
        return closest;
      },
      {
        distance: Infinity,
        creature: null as CreatureOnPoint | null,
      }
    );
}

export function directionTo(a: Point, b: Point) {
  const x = b.x - a.x;
  const y = b.y - a.y;
  const length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return { x: Math.round(x / length), y: Math.round(y / length) };
}

export function isInRadius(a: Point, b: Point, radius: number) {
  return distanceBetween(a, b) <= radius;
}
