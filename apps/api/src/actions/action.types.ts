export const WEBSITE_URLS = {
  youtube: 'https://www.youtube.com',
  github: 'https://github.com',
  google: 'https://www.google.com',
} as const;

export type Website = keyof typeof WEBSITE_URLS;

export type ActionRequest =
  | { name: 'open_website'; website: Website }
  | { name: 'get_current_time' }
  | { name: 'open_vscode_project' };

export interface ActionResult {
  response: string;
}
