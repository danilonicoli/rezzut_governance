export interface GovernanceCycle {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'closed';
}

export interface OKR {
  id: number;
  cycle_id: number;
  title: string;
  owner: string;
  progress: number;
  status: 'on_track' | 'at_risk' | 'behind';
}

export interface KPI {
  id: number;
  title: string;
  target: number;
  actual: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface Risk {
  id: number;
  title: string;
  impact: number;
  probability: number;
  status: 'monitored' | 'mitigated' | 'critical';
  owner: string;
}

export interface Policy {
  id: number;
  title: string;
  version: string;
  status: 'published' | 'draft' | 'archived';
  last_updated: string;
}
