
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
import { Database, Play, FileText, Bug, ChevronRight } from 'lucide-react';

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">AI QA Engineer Dashboard</h1>
          <p className="text-muted-foreground">Automate your testing workflow with AI-powered web crawling and test generation</p>
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm p-6 mb-8">
          <div className="flex flex-col space-y-6">
            {/* URL Input Section */}
            <UrlInput onUrlSubmit={handleUrlSubmit} />
            
            {/* Generate button */}
            <div className="flex justify-center">
              <Button 
                size="lg"
                onClick={generateTestCases}
                disabled={!url || isGenerating}
                className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 transition-all duration-300 font-medium"
              >
                {isGenerating ? (
                  <>
                    <Bug className="mr-2 h-5 w-5 animate-spin" />
                    Crawling Website...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-5 w-5" />
                    Generate Test Cases
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Workflow Steps */}
        <div className="flex justify-between items-center mb-6 px-4 py-2 bg-muted/50 rounded-lg">
          <div className="flex items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${activeTab === 'knowledge-base' ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground'}`}>
              <Database size={16} />
            </div>
            <span className="ml-2 text-sm font-medium">Knowledge Base</span>
          </div>
          <ChevronRight className="text-muted-foreground" size={16} />
          <div className="flex items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${activeTab === 'test-cases' ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground'}`}>
              <FileText size={16} />
            </div>
            <span className="ml-2 text-sm font-medium">Test Cases</span>
          </div>
          <ChevronRight className="text-muted-foreground" size={16} />
          <div className="flex items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${activeTab === 'results' ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground'}`}>
              <Play size={16} />
            </div>
            <span className="ml-2 text-sm font-medium">Results</span>
          </div>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 mb-6 w-full">
            <TabsTrigger value="knowledge-base" className="flex items-center gap-2">
              <Database size={16} />
              Knowledge Base
            </TabsTrigger>
            <TabsTrigger value="test-cases" className="flex items-center gap-2">
              <FileText size={16} />
              Test Cases
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Play size={16} />
              Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="knowledge-base" className="animate-fade-in">
            <KnowledgeBaseEditor
              initialKnowledgeBase={knowledgeBase}
              onUpdate={handleKnowledgeBaseUpdate}
            />
          </TabsContent>
          
          <TabsContent value="test-cases" className="animate-fade-in">
            <TestCaseList
              testCases={testCases}
              onRunTest={runTestCase}
              onRunAll={runAllTests}
              isGenerating={isGenerating}
            />
          </TabsContent>
          
          <TabsContent value="results" className="animate-fade-in">
            <TestResultsView results={testResults} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
