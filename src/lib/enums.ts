import {
  LanguageProficiency,
  SkillCategory,
  SkillLevel,
} from "@/lib/types";

/** PT-BR labels for the API enums, plus select-option helpers. */

export const skillCategoryLabels: Record<SkillCategory, string> = {
  [SkillCategory.Technology]: "Tecnologia",
  [SkillCategory.Tool]: "Ferramenta",
  [SkillCategory.SoftSkill]: "Soft skill",
};

export const skillLevelLabels: Record<SkillLevel, string> = {
  [SkillLevel.Beginner]: "Iniciante",
  [SkillLevel.Intermediate]: "Intermediário",
  [SkillLevel.Advanced]: "Avançado",
  [SkillLevel.Expert]: "Especialista",
};

export const languageProficiencyLabels: Record<LanguageProficiency, string> = {
  [LanguageProficiency.Basic]: "Básico",
  [LanguageProficiency.Intermediate]: "Intermediário",
  [LanguageProficiency.Advanced]: "Avançado",
  [LanguageProficiency.Fluent]: "Fluente",
  [LanguageProficiency.Native]: "Nativo",
};

/** Builds `{ value, label }[]` from a numeric-enum label map for <Select>. */
function optionsFrom<T extends number>(
  labels: Record<T, string>,
): { value: T; label: string }[] {
  return (Object.keys(labels) as unknown[] as string[])
    .map((k) => Number(k) as T)
    .map((value) => ({ value, label: labels[value] }));
}

export const skillCategoryOptions = optionsFrom(skillCategoryLabels);
export const skillLevelOptions = optionsFrom(skillLevelLabels);
export const languageProficiencyOptions = optionsFrom(
  languageProficiencyLabels,
);
