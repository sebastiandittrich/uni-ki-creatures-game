import { Cow, Creature, Grass, Water, Wolf } from "./creatures";
import GrassIcon from "./assets/grass.png";
import CowIcon from "./assets/cow.png";
import WolfIcon from "./assets/dog.png";

export function GrassVue(props: { creature: Grass }) {
  return (
    // <div class="grid grid-cols-1 items-stretch justify-stretch">
    <img src={GrassIcon} />
    //   {props.creature.healthPoints}
    // </div>
  );
}
export function WolfVue() {
  return <img src={WolfIcon} />;
}
export function CowVue(props: { creature: Cow }) {
  return (
    // <div class="grid grid-cols-1 items-stretch justify-stretch">
    <img src={CowIcon} />
    //   {props.creature.healthPoints}
    // </div>
  );
}
export function WaterVue() {
  return <div class="bg-blue-500"></div>;
}
export function UnknownVue() {
  return <div class="rounded-full bg-red-500"></div>;
}

export function CreatureVue(props: { creature: Creature }) {
  if (props.creature instanceof Grass) {
    return <GrassVue creature={props.creature} />;
  }
  if (props.creature instanceof Cow) {
    return <CowVue creature={props.creature} />;
  }
  if (props.creature instanceof Wolf) {
    return <WolfVue />;
  }
  if (props.creature instanceof Water) {
    return <WaterVue />;
  }
  return <UnknownVue />;
}
