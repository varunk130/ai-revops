import { descriptor as leadScore } from "./lead-score";
import { descriptor as forecastSkill } from "./forecast";

export interface SkillDescriptor {
  name: string;
  description: string;
}

export const SKILLS: SkillDescriptor[] = [leadScore, forecastSkill];
