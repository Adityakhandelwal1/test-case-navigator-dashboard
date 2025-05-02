
import React, { useState } from 'react';
import UrlInput from '@/components/UrlInput';
import KnowledgeBaseEditor from '@/components/KnowledgeBaseEditor';
import TestCaseList from '@/components/TestCaseList';
import TestResultsView from '@/components/TestResultsView';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KnowledgeBase, TestCase, TestRunResult } from '@/lib/types';
import { defaultKnowledgeBase, sampleTestCases, sampleTestResults } from '@/lib/mockData';
import { toast } from 'sonner';

const Index = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase>(defaultKnowledgeBase);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [testResults, setTestResults] = useState<TestRunResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('knowledge-base');

  const handleUrlSubmit = (submittedUrl: string) => {
    setUrl(submittedUrl);
    
    // Check if the URL exists in knowledge base, if not add it
    if (submittedUrl && !knowledgeBase.credentials[submittedUrl]) {
      const updatedKnowledgeBase = { ...knowledgeBase };
      updatedKnowledgeBase.credentials[submittedUrl] = {
        username: '',
        password: ''
      };
      setKnowledgeBase(updatedKnowledgeBase);
    }
  };

  const handleKnowledgeBaseUpdate = (updatedKnowledgeBase: KnowledgeBase) => {
    setKnowledgeBase(updatedKnowledgeBase);
  };

  const generateTestCases = () => {
    if (!url) {
      toast.error('Please enter a URL first');
      return;
    }

    // For demo purposes, we'll simulate generating test cases with a delay
    setIsGenerating(true);
    setTestCases([]);
    setTestResults(null);
    
    setTimeout(() => {
      setTestCases(sampleTestCases); 
      setIsGenerating(false);
      setActiveTab('test-cases');
      toast.success('Test cases generated successfully');
    }, 2000);
  };

  const runTestCase = (id: string) => {
    // Update the status of the test case to running
    const updatedTestCases = testCases.map(tc => 
      tc.id === id ? { ...tc, status: 'running' as const } : tc
    );
    setTestCases(updatedTestCases);
    
    // Simulate running the test
    setTimeout(() => {
      // Find the corresponding sample result
      const testResult = sampleTestResults.results.find(r => r.testCaseId === id);
      if (testResult) {
        // Update the test case status based on the result
        const finalTestCases = testCases.map(tc => 
          tc.id === id ? { ...tc, status: testResult.passed ? 'passed' as const : 'failed' as const } : tc
        );
        setTestCases(finalTestCases);
        
        // Set the test results
        const runResult: TestRunResult = {
          totalTests: 1,
          passed: testResult.passed ? 1 : 0,
          failed: testResult.passed ? 0 : 1,
          skipped: 0,
          results: [testResult]
        };
        setTestResults(runResult);
        setActiveTab('results');
      }
    }, 1500);
  };

  const runAllTests = () => {
    // Update all test cases to running
    const runningTestCases = testCases.map(tc => ({ ...tc, status: 'running' as const }));
    setTestCases(runningTestCases);
    
    // Simulate running all tests with a delay
    setTimeout(() => {
      const updatedTestCases = testCases.map((tc, index) => {
        const sampleResult = sampleTestResults.results[index % sampleTestResults.results.length];
        return { 
          ...tc, 
          status: sampleResult.passed ? 'passed' as const : 'failed' as const 
        };
      });
      setTestCases(updatedTestCases);
      setTestResults(sampleTestResults);
      setActiveTab('results');
    }, 2500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Test Case Navigator Dashboard</h1>
        <p className="text-muted-foreground">Generate, manage, and execute test cases based on your knowledge base</p>
      </div>
      
      {/* URL Input Section */}
      <div className="mb-6">
        <UrlInput onUrlSubmit={handleUrlSubmit} />
      </div>
      
      {/* Generate button */}
      <div className="mb-6 flex justify-center">
        <Button 
          size="lg"
          onClick={generateTestCases}
          disabled={!url || isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Test Cases'}
        </Button>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
          <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="knowledge-base">
          <KnowledgeBaseEditor
            initialKnowledgeBase={knowledgeBase}
            onUpdate={handleKnowledgeBaseUpdate}
          />
        </TabsContent>
        
        <TabsContent value="test-cases">
          <TestCaseList
            testCases={testCases}
            onRunTest={runTestCase}
            onRunAll={runAllTests}
            isGenerating={isGenerating}
          />
        </TabsContent>
        
        <TabsContent value="results">
          <TestResultsView results={testResults} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
