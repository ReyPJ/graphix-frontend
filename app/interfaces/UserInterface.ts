export interface UserListInterface {
  id: number;
  username: string;
  is_temporary: boolean;
  pdf_progress: number;
  page_limit: number;
  raw_password: string;
  package: string;
}

export interface StageSaveInterface {
  user?: number;
  html: string;
  stage_number: number;
  page_count: number | null;
}

export interface Stage {
  id: number;
  stage_number: number;
  html: string;
  page_count: number;
  created_at: string; // ISO 8601 datetime string
  user: number;
}

export interface StagedSavedGetInterface {
  pdf_progress: number;
  stages: Stage[];
  userName: string;
}
