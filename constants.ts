
import { BodyArea } from './types';

export const BODY_AREAS: BodyArea[] = [
  'Head',
  'Neck',
  'Shoulder',
  'Arm',
  'Torso',
  'Chest',
  'Thighs',
  'Legs',
  'Feet'
];

export const SEVERITY_COLORS = {
  low: '#10b981',    // emerald-500
  medium: '#f59e0b', // amber-500
  high: '#ef4444',   // red-500
};

export const STORAGE_KEY = 'hive_tracker_entries';
export const CUSTOM_TRIGGERS_KEY = 'hive_tracker_custom_triggers';

export const DEFAULT_COMMON_TRIGGERS = [
  'Stress', 'Heat', 'Cold', 'Dairy', 'Seafood', 'Alcohol', 
  'Detergent', 'Sweat', 'Pressure', 'Medication'
];
