export interface Project {
  id: string;
  name: string;
  files: {
    html: string;
    css: string;
    js: string;
  };
  createdAt: number;
  deployedAt?: number;
  status: 'draft' | 'deployed';
  domain?: string;
}
