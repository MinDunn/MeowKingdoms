/** 
 * MEOW KINGDOMS - CENTRAL TYPES 
 * Version: 4.5 (User & Player Management)
 */

export interface Hero {
  id?: string;
  name: string;
  elementId: string;
  elementName: string;
  roleId: string;
  roleName: string;
  hp: number;
  pAtk: number;
  mAtk: number;
  pDef: number;
  mDef: number;
  speed: number;
  description: string;
  combo: string;
  skills: {
    basic: { name: string; power: number };
    passive: { name: string; description: string };
    active: { name: string; power: number; cd: number };
  };
  color: string;
}

export interface Tribe {
  id?: string;
  name: string;
  icon: string;
  trait: string;
  milestones: string;
  description: string;
  color: string;
  counterId: string;
  rarity: string;
  buffTarget: string;
}

export interface Role {
  id?: string;
  name: string;
  icon: string;
  priorityStat: string;
  description: string;
}

export interface Artifact {
  id?: string;
  name: string;
  icon: string;
  bonusStat: string;
  bonusValue: number;
  effect: string;
  rarity: string;
}

export interface Beast {
  id?: string;
  name: string;
  icon: string;
  buffType: string;
  buffValue: number;
  skill: string;
  rarity: string;
}

export interface Item {
  id?: string;
  name: string;
  icon: string;
  type: 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory';
  statType: string;
  statValue: number;
  rarity: string;
  description: string;
}

export interface StatConfig {
  id?: string;
  name: string;
  code: string;
  icon: string;
  color: string;
  description: string;
}

export interface Material {
  id?: string;
  name: string;
  icon: string;
  type: 'shard' | 'exp' | 'evolution' | 'other';
  rarity: string;
  description: string;
  targetHeroId?: string;
}

export interface Currency {
  id?: string;
  name: string;
  icon: string;
  type: 'basic' | 'premium' | 'summon' | 'special';
  color: string;
  description: string;
}

export interface PlayerInventory {
  currencies: Record<string, number>;
  materials: Record<string, number>;
  heroes: string[];
  items: string[];
}

export interface Player {
  id?: string;
  uid: string;
  displayName: string;
  email: string;
  level: number;
  exp: number;
  avatar: string;
  status: 'active' | 'banned';
  role: 'admin' | 'user';
  createdAt: any;
  inventory: PlayerInventory;
}
