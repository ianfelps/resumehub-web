"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import {
  languageProficiencyOptions,
  skillCategoryOptions,
  skillLevelOptions,
} from "@/lib/enums";
import type {
  CourseResponse,
  EducationResponse,
  ExperienceResponse,
  InventoryKind,
  InventoryShapes,
  LanguageResponse,
  ProjectResponse,
  SkillResponse,
} from "@/lib/types";

/**
 * One controlled form per inventory kind. Each exposes the same contract:
 * a `formId` (so the modal footer can host the submit button) and an
 * `onSubmit` that receives the typed request body.
 */

type Req<K extends InventoryKind> = InventoryShapes[K]["request"];
type Res<K extends InventoryKind> = InventoryShapes[K]["response"];

interface FormProps<K extends InventoryKind> {
  formId: string;
  defaultValues?: Res<K>;
  onSubmit: (body: Req<K>) => void;
}

const emptyToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v;
const optionalText = z.preprocess(emptyToNull, z.string().nullable().optional());
const optionalUrl = z.preprocess(
  emptyToNull,
  z.string().url("URL inválida").nullable().optional(),
);
const optionalDate = z.preprocess(emptyToNull, z.string().nullable().optional());

// ---- Experience ----

const experienceSchema = z.object({
  company: z.string().trim().min(1, "Obrigatório"),
  role: z.string().trim().min(1, "Obrigatório"),
  location: optionalText,
  startDate: z.string().min(1, "Obrigatório"),
  endDate: optionalDate,
  description: optionalText,
});

function ExperienceForm({
  formId,
  defaultValues,
  onSubmit,
}: FormProps<"experiences">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: defaultValues?.company ?? "",
      role: defaultValues?.role ?? "",
      location: defaultValues?.location ?? "",
      startDate: defaultValues?.startDate ?? "",
      endDate: defaultValues?.endDate ?? "",
      description: defaultValues?.description ?? "",
    },
  });

  return (
    <form
      id={formId}
      onSubmit={handleSubmit((v) => onSubmit(v as Req<"experiences">))}
      className="flex flex-col gap-4"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Empresa" error={errors.company?.message}>
          <Input invalid={!!errors.company} {...register("company")} />
        </Field>
        <Field label="Cargo" error={errors.role?.message}>
          <Input invalid={!!errors.role} {...register("role")} />
        </Field>
      </div>
      <Field label="Local" error={errors.location?.message as string}>
        <Input {...register("location")} placeholder="Cidade · Remoto" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Início" error={errors.startDate?.message}>
          <Input type="date" invalid={!!errors.startDate} {...register("startDate")} />
        </Field>
        <Field label="Fim (em branco = atual)" error={errors.endDate?.message as string}>
          <Input type="date" {...register("endDate")} />
        </Field>
      </div>
      <Field
        label="Descrição · suporta Markdown"
        error={errors.description?.message as string}
      >
        <Textarea {...register("description")} />
      </Field>
    </form>
  );
}

// ---- Project ----

const projectSchema = z.object({
  name: z.string().trim().min(1, "Obrigatório"),
  description: optionalText,
  url: optionalUrl,
  repoUrl: optionalUrl,
  highlights: optionalText,
});

function ProjectForm({ formId, defaultValues, onSubmit }: FormProps<"projects">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      url: defaultValues?.url ?? "",
      repoUrl: defaultValues?.repoUrl ?? "",
      highlights: defaultValues?.highlights ?? "",
    },
  });

  return (
    <form
      id={formId}
      onSubmit={handleSubmit((v) => onSubmit(v as Req<"projects">))}
      className="flex flex-col gap-4"
      noValidate
    >
      <Field label="Nome" error={errors.name?.message}>
        <Input invalid={!!errors.name} {...register("name")} />
      </Field>
      <Field
        label="Descrição · suporta Markdown"
        error={errors.description?.message as string}
      >
        <Textarea {...register("description")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="URL" error={errors.url?.message as string}>
          <Input {...register("url")} placeholder="https://" />
        </Field>
        <Field label="Repositório" error={errors.repoUrl?.message as string}>
          <Input {...register("repoUrl")} placeholder="https://github.com/" />
        </Field>
      </div>
      <Field
        label="Destaques · suporta Markdown (listas, negrito…)"
        error={errors.highlights?.message as string}
      >
        <Textarea {...register("highlights")} />
      </Field>
    </form>
  );
}

// ---- Skill ----

const skillSchema = z.object({
  name: z.string().trim().min(1, "Obrigatório"),
  category: z.coerce.number().int(),
  level: z.coerce.number().int(),
});

function SkillForm({ formId, defaultValues, onSubmit }: FormProps<"skills">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      category: defaultValues?.category ?? skillCategoryOptions[0].value,
      level: defaultValues?.level ?? skillLevelOptions[0].value,
    },
  });

  return (
    <form
      id={formId}
      onSubmit={handleSubmit((v) => onSubmit(v as unknown as Req<"skills">))}
      className="flex flex-col gap-4"
      noValidate
    >
      <Field label="Nome" error={errors.name?.message}>
        <Input invalid={!!errors.name} {...register("name")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Categoria">
          <Select {...register("category")}>
            {skillCategoryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Nível">
          <Select {...register("level")}>
            {skillLevelOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
    </form>
  );
}

// ---- Language ----

const languageSchema = z.object({
  name: z.string().trim().min(1, "Obrigatório"),
  proficiency: z.coerce.number().int(),
});

function LanguageForm({
  formId,
  defaultValues,
  onSubmit,
}: FormProps<"languages">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof languageSchema>>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      proficiency:
        defaultValues?.proficiency ?? languageProficiencyOptions[0].value,
    },
  });

  return (
    <form
      id={formId}
      onSubmit={handleSubmit((v) => onSubmit(v as unknown as Req<"languages">))}
      className="flex flex-col gap-4"
      noValidate
    >
      <Field label="Idioma" error={errors.name?.message}>
        <Input invalid={!!errors.name} {...register("name")} />
      </Field>
      <Field label="Proficiência">
        <Select {...register("proficiency")}>
          {languageProficiencyOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </Field>
    </form>
  );
}

// ---- Education ----

const educationSchema = z.object({
  institution: z.string().trim().min(1, "Obrigatório"),
  degree: z.string().trim().min(1, "Obrigatório"),
  field: optionalText,
  startDate: z.string().min(1, "Obrigatório"),
  endDate: optionalDate,
});

function EducationForm({
  formId,
  defaultValues,
  onSubmit,
}: FormProps<"education">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: defaultValues?.institution ?? "",
      degree: defaultValues?.degree ?? "",
      field: defaultValues?.field ?? "",
      startDate: defaultValues?.startDate ?? "",
      endDate: defaultValues?.endDate ?? "",
    },
  });

  return (
    <form
      id={formId}
      onSubmit={handleSubmit((v) => onSubmit(v as Req<"education">))}
      className="flex flex-col gap-4"
      noValidate
    >
      <Field label="Instituição" error={errors.institution?.message}>
        <Input invalid={!!errors.institution} {...register("institution")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Grau / Curso" error={errors.degree?.message}>
          <Input invalid={!!errors.degree} {...register("degree")} />
        </Field>
        <Field label="Área" error={errors.field?.message as string}>
          <Input {...register("field")} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Início" error={errors.startDate?.message}>
          <Input type="date" invalid={!!errors.startDate} {...register("startDate")} />
        </Field>
        <Field label="Fim" error={errors.endDate?.message as string}>
          <Input type="date" {...register("endDate")} />
        </Field>
      </div>
    </form>
  );
}

// ---- Course ----

const courseSchema = z.object({
  name: z.string().trim().min(1, "Obrigatório"),
  provider: optionalText,
  completionDate: optionalDate,
  certificateUrl: optionalUrl,
});

function CourseForm({ formId, defaultValues, onSubmit }: FormProps<"courses">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      provider: defaultValues?.provider ?? "",
      completionDate: defaultValues?.completionDate ?? "",
      certificateUrl: defaultValues?.certificateUrl ?? "",
    },
  });

  return (
    <form
      id={formId}
      onSubmit={handleSubmit((v) => onSubmit(v as Req<"courses">))}
      className="flex flex-col gap-4"
      noValidate
    >
      <Field label="Nome" error={errors.name?.message}>
        <Input invalid={!!errors.name} {...register("name")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Instituição" error={errors.provider?.message as string}>
          <Input {...register("provider")} />
        </Field>
        <Field label="Conclusão" error={errors.completionDate?.message as string}>
          <Input type="date" {...register("completionDate")} />
        </Field>
      </div>
      <Field label="Certificado (URL)" error={errors.certificateUrl?.message as string}>
        <Input {...register("certificateUrl")} placeholder="https://" />
      </Field>
    </form>
  );
}

// ---- Registry ----

interface KindMeta {
  singular: string;
  plural: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Form: (props: FormProps<any>) => React.ReactNode;
}

export const inventoryMeta: Record<InventoryKind, KindMeta> = {
  experiences: { singular: "experiência", plural: "Experiências", Form: ExperienceForm },
  projects: { singular: "projeto", plural: "Projetos", Form: ProjectForm },
  skills: { singular: "habilidade", plural: "Habilidades", Form: SkillForm },
  languages: { singular: "idioma", plural: "Idiomas", Form: LanguageForm },
  education: { singular: "formação", plural: "Formação", Form: EducationForm },
  courses: { singular: "curso", plural: "Cursos", Form: CourseForm },
};

export type {
  CourseResponse,
  EducationResponse,
  ExperienceResponse,
  LanguageResponse,
  ProjectResponse,
  SkillResponse,
};
