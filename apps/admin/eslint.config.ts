import { baseConfig } from '@appabbang/eslint/base';
import { tanstackConfig } from '@tanstack/eslint-config';

export default {
  ...baseConfig,
  extends: [...(baseConfig.extends ?? []), ...tanstackConfig.extends],
};
