import { id } from "../../id";
import type { Point } from "./lib";

export abstract class Creature {
  public id: number = id();
  protected _healthPoints: number = (this.constructor as typeof Creature).initialHealthPoints;

  constructor(public name: string) {}

  public get maxHealthPoints(): number {
    return (this.constructor as typeof Creature).initialHealthPoints * 2;
  }

  public set healthPoints(healthPoints: number) {
    this._healthPoints = Math.min(this.maxHealthPoints, Math.max(0, healthPoints));
  }

  public get healthPoints(): number {
    return this._healthPoints;
  }

  public equals(other: Creature) {
    return this.id == other.id;
  }

  public static get initialHealthPoints(): number {
    throw new Error("Not implemented");
  }

  public hasMaxHealthPoints(): boolean {
    return this.healthPoints >= this.maxHealthPoints;
  }
}

export abstract class Animal extends Creature {}

export class Grass extends Creature {
  public static initialHealthPoints = 50;
}
export class Water extends Creature {
  public static initialHealthPoints = 0;
}
export class Cow extends Animal {
  public static initialHealthPoints = 200;
}
export class Wolf extends Animal {
  public static initialHealthPoints = 100;
}

export class Cell {
  public creatures: Creature[] = [];

  isFreeFor(creature: Creature) {
    if (this.hasType(Water)) return false;
    return true;
  }

  add(creature: Creature) {
    this.creatures.push(creature);
  }

  remove(creature: Creature) {
    this.creatures.splice(this.creatures.indexOf(creature), 1);
  }

  has(creature: Creature) {
    return this.creatures.find((c) => c.equals(creature)) != undefined;
  }
  hasType(type: typeof Creature) {
    return this.creatures.find((c) => c instanceof type) != undefined;
  }
  countType(type: typeof Creature) {
    return this.creatures.filter((c) => c instanceof type).length;
  }
  getCreaturesOfType(type: typeof Creature) {
    return this.creatures.filter((c) => c instanceof type);
  }
}

export class AutoMap<K, V> {
  public map: Map<K, V> = new Map();

  constructor(public resolver: (k: K) => V) {}

  ensure(k: K) {
    if (!this.map.has(k)) this.map.set(k, this.resolver(k));
  }

  get(k: K) {
    const key = k;
    this.ensure(k);
    return this.map.get(k)!;
  }
  set(k: K, v: V) {
    return this.map.set(k, v);
  }
}

class CircularAutoMap<T> extends AutoMap<number, T> {
  constructor(resolver: (k: number) => T, public boundary: number) {
    super(resolver);
  }

  normalize(k: number) {
    while (k < 0) k += this.boundary;
    return k % this.boundary;
  }

  set(k: number, v: T) {
    return super.set(this.normalize(k), v);
  }

  get(k: number) {
    return super.get(this.normalize(k));
  }

  ensure(k: number): void {
    return super.ensure(this.normalize(k));
  }
}

export class Board {
  public map: AutoMap<number, AutoMap<number, Cell>>;

  constructor(public width: number, public height: number) {
    this.map = new CircularAutoMap(() => new CircularAutoMap(() => new Cell(), height), width);
  }

  getPointOfCreature(creature: Creature) {
    return this.getCellByCreature(creature)?.point;
  }

  getCell(x: number, y: number) {
    return this.map.get(x).get(y);
  }

  getCells() {
    return Array.from(this.map.map.entries()).flatMap(([x, row]) =>
      Array.from(row.map.entries()).map(([y, cell]) => ({
        point: { x, y },
        cell,
      }))
    );
  }

  getCreatures() {
    return this.getCells().flatMap(({ cell, point }) =>
      cell.creatures.map((creature) => ({
        point,
        creature,
      }))
    );
  }

  getCellByCreature(creature: Creature) {
    return this.getCells().find(({ cell }) => cell.has(creature));
  }

  add({ x, y }: { x: number; y: number }, creature: Creature) {
    const cell = this.getCell(x, y);
    if (cell.isFreeFor(creature)) {
      cell.add(creature);
      return true;
    }
    return false;
  }
  remove(creature: Creature) {
    this.getCellByCreature(creature)?.cell.remove(creature);
  }

  moveTo(creature: Creature, point: Point) {
    const lastCell = this.getCellByCreature(creature);
    if (!lastCell) throw new Error("Creature not found on board");

    const newCell = this.getCell(point.x, point.y);

    if (newCell.isFreeFor(creature)) {
      lastCell.cell.remove(creature);
      newCell.add(creature);
      return true;
    }
    return false;
  }
  move(creature: Creature, delta: Point) {
    const lastPoint = this.getPointOfCreature(creature);
    if (!lastPoint) throw new Error("Creature not found on board");
    return this.moveTo(creature, {
      x: lastPoint.x + delta.x,
      y: lastPoint.y + delta.y,
    });
  }
}
