
export interface Credentials {
  [url: string]: {
    username: string;
    password: string;
  };
}

export interface TestData {
  default_email: string;
  default_password: string;
  phone: string;
  [key: string]: string;
}

export interface KnowledgeBase {
  credentials: Credentials;
  test_data: TestData;
}

export interface TestCase {
  id: string;
  title: string;
  description: string;
  steps: string[];
  status: 'pending' | 'running' | 'passed' | 'failed';
}

export interface TestResult {
  testCaseId: string;
  passed: boolean;
  duration: number;
  logs: {
    step: string;
    status: 'passed' | 'failed';
    message?: string;
    screenshot?: string;
    timestamp: string;
  }[];
}

export interface TestRunResult {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  results: TestResult[];
}
