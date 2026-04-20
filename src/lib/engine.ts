import type { ThemeInputs, ThemeResult } from './types';
import { analyzeColor } from './colorAnalysis';
import { generateCandidates } from './candidateGenerator';
import { scoreAndRank } from './scorer';

export function buildThemeResult(inputs: ThemeInputs): ThemeResult {
  const analysis = analyzeColor(inputs.primary);
  const secondaryAnalysis = inputs.secondary ? analyzeColor(inputs.secondary) : undefined;

  const candidates = generateCandidates(
    analysis,
    inputs.colorMode,
    inputs.styleMode,
    secondaryAnalysis,
    inputs.radius,
    inputs.fontPreset
  );

  const ranked = scoreAndRank(candidates, inputs.styleMode);

  const [best, ...rest] = ranked;
  const alternatives = rest.slice(0, 3);

  return {
    best,
    alternatives,
    analysis,
    secondaryAnalysis,
  };
}

export function regenerateAlternatives(
  inputs: ThemeInputs,
  _lockedId?: string
): ThemeResult {
  return buildThemeResult(inputs);
}
