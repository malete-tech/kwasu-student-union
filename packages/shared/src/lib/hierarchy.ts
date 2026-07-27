import { Executive } from "../types";

/**
 * Assigns an official protocol hierarchy rank to an executive based on role name and council.
 * Lower numerical rank indicates higher official protocol precedence (1 = highest).
 */
export function getExecutiveHierarchyRank(role: string, councilType?: Executive['councilType']): number {
  const normalizedRole = role.toLowerCase().trim();

  // Central Executive Council Ranks
  if (!councilType || councilType === 'Central') {
    if (normalizedRole.includes('president') && !normalizedRole.includes('vice')) return 1;
    if (normalizedRole.includes('vice president') || normalizedRole.includes('vice-president') || normalizedRole.includes('vp')) return 2;
    if (normalizedRole.includes('general secretary') || normalizedRole.includes('secretary general') || normalizedRole.includes('sec. gen') || normalizedRole.includes('sec gen')) return 3;
    if (normalizedRole.includes('assistant secretary') || normalizedRole.includes('asst. secretary') || normalizedRole.includes('assistant sec')) return 4;
    if (normalizedRole.includes('financial secretary') || normalizedRole.includes('fin. sec')) return 5;
    if (normalizedRole.includes('treasurer')) return 6;
    if (normalizedRole.includes('public relations') || normalizedRole.includes('pro') || normalizedRole.includes('information')) return 7;
    if (normalizedRole.includes('welfare')) return 8;
    if (normalizedRole.includes('social')) return 9;
    if (normalizedRole.includes('sport')) return 10;
    if (normalizedRole.includes('director')) return 11;
    if (normalizedRole.includes('whip') || normalizedRole.includes('security')) return 12;
  }

  // Senate Council Ranks
  if (!councilType || councilType === 'Senate') {
    if (normalizedRole.includes('senate president') || normalizedRole.includes('speaker')) return 1;
    if (normalizedRole.includes('deputy senate president') || normalizedRole.includes('deputy speaker')) return 2;
    if (normalizedRole.includes('clerk') && !normalizedRole.includes('assistant') && !normalizedRole.includes('asst')) return 3;
    if (normalizedRole.includes('assistant clerk') || normalizedRole.includes('asst. clerk')) return 4;
    if (normalizedRole.includes('whip')) return 5;
    if (normalizedRole.includes('leader') || normalizedRole.includes('chairman') || normalizedRole.includes('head')) return 6;
    if (normalizedRole.includes('senator')) return 7;
  }

  // Judiciary Council Ranks
  if (!councilType || councilType === 'Judiciary') {
    if (normalizedRole.includes('chief justice') || normalizedRole.includes('grand kadi') || normalizedRole.includes('president of court') || normalizedRole.includes('president of the court')) return 1;
    if (normalizedRole.includes('deputy chief justice') || normalizedRole.includes('deputy grand kadi')) return 2;
    if (normalizedRole.includes('registrar') || normalizedRole.includes('judicial secretary')) return 3;
    if (normalizedRole.includes('magistrate') || normalizedRole.includes('justice') || normalizedRole.includes('judge')) return 4;
  }

  // Fallback rank for unmapped custom roles
  return 99;
}

/**
 * Automatically sorts an array of executives according to official union protocol hierarchy.
 */
export function sortExecutivesByHierarchy<T extends { role: string; councilType?: Executive['councilType']; displayOrder?: number; name?: string }>(
  executives: T[]
): T[] {
  return [...executives].sort((a, b) => {
    const rankA = getExecutiveHierarchyRank(a.role, a.councilType);
    const rankB = getExecutiveHierarchyRank(b.role, b.councilType);

    if (rankA !== rankB) {
      return rankA - rankB;
    }

    // Secondary fallback: manual displayOrder if different
    if (a.displayOrder !== undefined && b.displayOrder !== undefined && a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }

    // Tertiary fallback: alphabetical by name
    return (a.name || '').localeCompare(b.name || '');
  });
}
