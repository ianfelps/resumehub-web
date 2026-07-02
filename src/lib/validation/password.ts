import { z } from "zod";

/** A single password requirement, evaluated live for the visual checklist. */
export type PasswordRule = {
  id: string;
  label: string;
  test: (value: string) => boolean;
};

/**
 * Password policy — kept in sync with the API's `StrongPassword` validator
 * (ResumeHub.Application.Validators.ValidationExtensions).
 */
export const passwordRules: PasswordRule[] = [
  {
    id: "length",
    label: "Pelo menos 8 caracteres",
    test: (v) => v.length >= 8,
  },
  {
    id: "alphanumeric",
    label: "Letras e números",
    test: (v) => /[A-Za-z]/.test(v) && /[0-9]/.test(v),
  },
  {
    id: "special",
    label: "Um caractere especial",
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
];

/** Zod schema enforcing the same policy; blocks submit until every rule passes. */
export const passwordSchema = z
  .string()
  .min(8, "Pelo menos 8 caracteres")
  .max(128, "No máximo 128 caracteres")
  .regex(/[A-Za-z]/, "Inclua ao menos uma letra")
  .regex(/[0-9]/, "Inclua ao menos um número")
  .regex(/[^A-Za-z0-9]/, "Inclua ao menos um caractere especial");
