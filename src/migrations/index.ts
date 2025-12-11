import * as migration_20251210_172403 from './20251210_172403';

export const migrations = [
  {
    up: migration_20251210_172403.up,
    down: migration_20251210_172403.down,
    name: '20251210_172403'
  },
];
