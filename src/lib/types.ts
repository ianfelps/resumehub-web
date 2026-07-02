/**
 * TypeScript mirror of the ResumeHub API DTOs.
 * Source of truth: `resumehub-api/src/ResumeHub.Application/Dtos/*` and
 * `ResumeHub.Domain/Enums/SkillEnums.cs`. Keep field names in sync with the API.
 */

// ---- Enums (numeric, matching the C# enum values) ----

export enum SkillCategory {
  Technology = 0,
  Tool = 1,
  SoftSkill = 2,
}

export enum SkillLevel {
  Beginner = 0,
  Intermediate = 1,
  Advanced = 2,
  Expert = 3,
}

export enum LanguageProficiency {
  Basic = 0,
  Intermediate = 1,
  Advanced = 2,
  Fluent = 3,
  Native = 4,
}

// ---- Auth ----

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string; // ISO datetime
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ---- Account ----

export interface AccountResponse {
  email: string;
  fullName?: string | null;
  headline?: string | null;
  location?: string | null;
  phoneNumber?: string | null;
  showEmailOnResume: boolean;
  linkedInUrl?: string | null;
  gitHubUrl?: string | null;
  websiteUrl?: string | null;
}

export interface UpdateAccountRequest {
  fullName?: string | null;
  headline?: string | null;
  location?: string | null;
  phoneNumber?: string | null;
  showEmailOnResume: boolean;
  linkedInUrl?: string | null;
  gitHubUrl?: string | null;
  websiteUrl?: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ---- Inventory: Experience ----

export interface ExperienceRequest {
  company: string;
  role: string;
  location?: string | null;
  startDate: string; // ISO date (yyyy-MM-dd)
  endDate?: string | null;
  description?: string | null;
}
export interface ExperienceResponse extends ExperienceRequest {
  id: string;
}

// ---- Inventory: Project ----

export interface ProjectRequest {
  name: string;
  description?: string | null;
  url?: string | null;
  repoUrl?: string | null;
  date?: string | null; // ISO date (yyyy-MM-dd)
}
export interface ProjectResponse extends ProjectRequest {
  id: string;
}

// ---- Inventory: Skill ----

export interface SkillRequest {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
}
export interface SkillResponse extends SkillRequest {
  id: string;
}

// ---- Inventory: Language ----

export interface LanguageRequest {
  name: string;
  proficiency: LanguageProficiency;
}
export interface LanguageResponse extends LanguageRequest {
  id: string;
}

// ---- Inventory: Education ----

export interface EducationRequest {
  institution: string;
  degree: string;
  field?: string | null;
  startDate: string;
  endDate?: string | null;
}
export interface EducationResponse extends EducationRequest {
  id: string;
}

// ---- Inventory: Course ----

export interface CourseRequest {
  name: string;
  provider?: string | null;
  completionDate?: string | null;
  certificateUrl?: string | null;
}
export interface CourseResponse extends CourseRequest {
  id: string;
}

// ---- Profiles ----

export type PortfolioTheme = "dark" | "light";

export interface ProfileRequest {
  name: string;
  slug?: string | null;
  headline?: string | null;
  summary?: string | null;
  isPublic: boolean;
  theme?: PortfolioTheme | null;
  accentColor?: string | null;
}

export interface ProfileResponse {
  id: string;
  name: string;
  slug: string;
  headline?: string | null;
  summary?: string | null;
  isPublic: boolean;
  theme: PortfolioTheme;
  accentColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileItemSelection {
  id: string;
  displayOrder: number;
}

export interface ProfileItemsRequest {
  experiences?: ProfileItemSelection[];
  projects?: ProfileItemSelection[];
  skills?: ProfileItemSelection[];
  languages?: ProfileItemSelection[];
  education?: ProfileItemSelection[];
  courses?: ProfileItemSelection[];
}

/** A profile's currently selected items per type (read-back from the API). */
export interface ProfileItemsResponse {
  experiences: ProfileItemSelection[];
  projects: ProfileItemSelection[];
  skills: ProfileItemSelection[];
  languages: ProfileItemSelection[];
  education: ProfileItemSelection[];
  courses: ProfileItemSelection[];
}

// ---- Public assembled resume ----

export interface PublicOwner {
  fullName?: string | null;
  headline?: string | null;
  location?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  linkedInUrl?: string | null;
  gitHubUrl?: string | null;
  websiteUrl?: string | null;
}

export interface PublicResumeResponse {
  name: string;
  summary?: string | null;
  theme: PortfolioTheme;
  accentColor: string;
  owner: PublicOwner;
  experiences: ExperienceResponse[];
  projects: ProjectResponse[];
  skills: SkillResponse[];
  languages: LanguageResponse[];
  education: EducationResponse[];
  courses: CourseResponse[];
}

/** The six inventory resource kinds, used to parameterize generic CRUD. */
export type InventoryKind =
  | "experiences"
  | "projects"
  | "skills"
  | "languages"
  | "education"
  | "courses";

/** Maps an InventoryKind to its response/request shapes. */
export interface InventoryShapes {
  experiences: { response: ExperienceResponse; request: ExperienceRequest };
  projects: { response: ProjectResponse; request: ProjectRequest };
  skills: { response: SkillResponse; request: SkillRequest };
  languages: { response: LanguageResponse; request: LanguageRequest };
  education: { response: EducationResponse; request: EducationRequest };
  courses: { response: CourseResponse; request: CourseRequest };
}
