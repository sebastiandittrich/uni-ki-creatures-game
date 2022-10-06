import { Cow, Grass, Wolf, type Board, type Creature } from "@/creatures";
import { closestCreature, directionTo, distanceBetween, isInRadius, isSamePoint, timefn, type CreatureOnPoint, type Point } from "@/lib";

export function makeRound(board: Board) {
  timefn(wolfEatsCows, board);
  timefn(deadCreaturesGetRemoved, board);

  timefn(cowsEatGrass, board);
  deadCreaturesGetRemoved(board);

  const creatures = board.getCreatures();
  timefn("moveCreatures", () => {
    for (const creature of creatures) {
      if (creature.creature instanceof Cow) moveCow(creature, creatures, board);
      if (creature.creature instanceof Wolf) moveWolf(creature, creatures, board);
    }
  });

  //   timefn(cowsMoveTowardsGrassIfHungryOrRandomly, board, 2);
  //   timefn(wolfFollowsCows, board, 5);
}

function moveCow(cow: CreatureOnPoint, creatures: CreatureOnPoint[], board: Board) {
  const closestWolf = closestInSight(
    cow.point,
    creatures.filter(({ creature }) => creature instanceof Wolf),
    2
  );
  if (closestWolf) {
    return moveAway(board, cow, closestWolf.point);
  }
  if (cow.creature.hasMaxHealthPoints()) {
    return moveCreatureRandomly(board, cow);
  }

  const closestGrass = closestInSight(
    cow.point,
    creatures.filter(({ creature }) => creature instanceof Grass),
    2
  );

  if (!closestGrass || isSamePoint(closestGrass.point, cow.point)) {
    return moveCreatureRandomly(board, cow);
  }

  return moveTowards(board, cow, closestGrass.point);
}

function moveWolf(wolf: CreatureOnPoint, creatures: CreatureOnPoint[], board: Board) {
  const closestCow = closestInSight(
    wolf.point,
    creatures.filter(({ creature }) => creature instanceof Cow),
    2
  );
  if (closestCow) {
    return moveTowards(board, wolf, closestCow.point);
  }

  return moveCreatureRandomly(board, wolf);
}

function closestInSight(point: Point, creatures: CreatureOnPoint[], sight: number): CreatureOnPoint | undefined {
  return creatures
    .map((other) => ({
      ...other,
      distance: distanceBetween(point, other.point),
    }))
    .filter(({ distance }) => distance <= sight)
    .sort((a, b) => a.distance - b.distance)
    .map(({ creature, point }) => ({ creature, point }))[0];
}

export function spawnRandomCreatures(board: Board, creature: new (name: string) => Creature, rate: number) {
  for (let x = 0; x < board.width; x++) {
    for (let y = 0; y < board.height; y++) {
      if (Math.random() < rate) {
        board.add({ x, y }, new creature("random creature"));
      }
    }
  }
}

function deadCreaturesGetRemoved(board: Board) {
  for (const { creature } of board.getCreatures()) {
    if (creature.healthPoints <= 0) {
      board.remove(creature);
    }
  }
}

function cowsEatGrass(board: Board) {
  for (const { cell } of board.getCells()) {
    const cows = cell.getCreaturesOfType(Cow);
    const grass = cell.getCreaturesOfType(Grass);
    const pairs = grass.map((grass, index) => [grass, cows[index]] as const).filter(([_, cow]) => cow != undefined);
    for (const [grass, cow] of pairs) {
      grass.healthPoints -= 5;
      cow.healthPoints += 10;
    }
  }
}
function wolfEatsCows(board: Board) {
  for (const { cell } of board.getCells()) {
    const cows = cell.getCreaturesOfType(Cow);
    const wolfs = cell.getCreaturesOfType(Wolf);
    const pairs = wolfs.map((wolf, index) => [wolf, cows[index]] as const).filter(([_, cow]) => cow != undefined);
    for (const [wolf, cow] of pairs) {
      cow.healthPoints = 0;
      wolf.healthPoints = wolf.healthPoints + 50;
    }
  }
}

const randomDestinations = new WeakMap<Creature, Point>();
function moveCreatureRandomly(board: Board, creature: CreatureOnPoint) {
  if (!randomDestinations.has(creature.creature) || isSamePoint(randomDestinations.get(creature.creature)!, creature.point)) {
    randomDestinations.set(creature.creature, { x: Math.floor(Math.random() * board.width), y: Math.floor(Math.random() * board.height) });
  }
  const destination = randomDestinations.get(creature.creature)!;
  return moveTowards(board, creature, destination);
}

function moveTowards(board: Board, creature: CreatureOnPoint, target: Point) {
  const direction = directionTo(creature.point, target);
  board.move(creature.creature, direction);
}

function moveAway(board: Board, creature: CreatureOnPoint, target: Point) {
  const direction = directionTo(creature.point, target);
  board.move(creature.creature, { x: -direction.x, y: -direction.y });
}
