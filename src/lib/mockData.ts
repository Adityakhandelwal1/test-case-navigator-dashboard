
import { KnowledgeBase, TestCase, TestRunResult } from './types';

export const defaultKnowledgeBase: KnowledgeBase = {
  credentials: {
    'coaching.staging.mindtickle.com': {
      username: 'isha.verma@mindtickle.com',
      password: 'mind1234'
    }
  },
  test_data: {
    default_email: 'isha.verma@mindtickle.com',
    default_password: 'mind1234',
    phone: '1234567890'
  }
};

export const sampleTestCases: TestCase[] = [
  {
    id: '1',
    title: 'Login Authentication',
    description: 'Verify user can login with valid credentials',
    steps: [
      'Navigate to the login page',
      'Enter username from knowledge base',
      'Enter password from knowledge base',
      'Click on login button',
      'Verify successful login by checking for dashboard element'
    ],
    status: 'pending'
  },
  {
    id: '2',
    title: 'User Profile Access',
    description: 'Verify user can access their profile page',
    steps: [
      'Login with valid credentials',
      'Navigate to user profile section',
      'Verify profile information is displayed correctly'
    ],
    status: 'pending'
  },
  {
    id: '3',
    title: 'Password Reset Flow',
    description: 'Verify password reset functionality works',
    steps: [
      'Navigate to login page',
      'Click on forgot password link',
      'Enter email address from test data',
      'Submit reset password request',
      'Verify confirmation message is displayed'
    ],
    status: 'pending'
  }
];

export const sampleTestResults: TestRunResult = {
  totalTests: 3,
  passed: 2,
  failed: 1,
  skipped: 0,
  results: [
    {
      testCaseId: '1',
      passed: true,
      duration: 2.54,
      logs: [
        {
          step: 'Navigate to the login page',
          status: 'passed',
          message: 'Successfully navigated to login page',
          timestamp: '2023-06-15T10:30:45.123Z'
        },
        {
          step: 'Enter username from knowledge base',
          status: 'passed',
          message: 'Username entered successfully',
          timestamp: '2023-06-15T10:30:46.456Z'
        },
        {
          step: 'Enter password from knowledge base',
          status: 'passed',
          message: 'Password entered successfully',
          timestamp: '2023-06-15T10:30:47.789Z'
        },
        {
          step: 'Click on login button',
          status: 'passed',
          message: 'Login button clicked',
          timestamp: '2023-06-15T10:30:48.123Z'
        },
        {
          step: 'Verify successful login by checking for dashboard element',
          status: 'passed',
          message: 'Dashboard element found, login successful',
          timestamp: '2023-06-15T10:30:50.456Z'
        }
      ]
    },
    {
      testCaseId: '2',
      passed: true,
      duration: 1.87,
      logs: [
        {
          step: 'Login with valid credentials',
          status: 'passed',
          message: 'Login successful',
          timestamp: '2023-06-15T10:31:00.123Z'
        },
        {
          step: 'Navigate to user profile section',
          status: 'passed',
          message: 'Successfully navigated to profile page',
          timestamp: '2023-06-15T10:31:02.456Z'
        },
        {
          step: 'Verify profile information is displayed correctly',
          status: 'passed',
          message: 'Profile information verified',
          timestamp: '2023-06-15T10:31:03.789Z'
        }
      ]
    },
    {
      testCaseId: '3',
      passed: false,
      duration: 1.25,
      logs: [
        {
          step: 'Navigate to login page',
          status: 'passed',
          message: 'Successfully navigated to login page',
          timestamp: '2023-06-15T10:31:10.123Z'
        },
        {
          step: 'Click on forgot password link',
          status: 'passed',
          message: 'Forgot password link clicked',
          timestamp: '2023-06-15T10:31:11.456Z'
        },
        {
          step: 'Enter email address from test data',
          status: 'passed',
          message: 'Email entered successfully',
          timestamp: '2023-06-15T10:31:12.789Z'
        },
        {
          step: 'Submit reset password request',
          status: 'passed',
          message: 'Reset password request submitted',
          timestamp: '2023-06-15T10:31:13.123Z'
        },
        {
          step: 'Verify confirmation message is displayed',
          status: 'failed',
          message: 'Confirmation message not found or incorrect',
          timestamp: '2023-06-15T10:31:14.456Z'
        }
      ]
    }
  ]
};
