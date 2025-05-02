
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestRunResult, TestResult } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface TestResultsViewProps {
  results: TestRunResult | null;
}

const TestResultsView: React.FC<TestResultsViewProps> = ({ results }) => {
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No test results available yet.</p>
            <p className="text-muted-foreground text-sm mt-1">
              Run tests to see results here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Select the first test result by default if none is selected
  const currentTestId = selectedTestId || (results.results.length > 0 ? results.results[0].testCaseId : null);
  const selectedResult = results.results.find(r => r.testCaseId === currentTestId);
  
  const passPercentage = results.totalTests > 0 
    ? Math.round((results.passed / results.totalTests) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Test Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="font-semibold">{results.totalTests}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-700">Passed</div>
            <div className="font-semibold text-green-700">{results.passed}</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-sm text-red-700">Failed</div>
            <div className="font-semibold text-red-700">{results.failed}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Skipped</div>
            <div className="font-semibold">{results.skipped}</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm">Pass Rate</span>
            <span className="text-sm font-medium">{passPercentage}%</span>
          </div>
          <Progress value={passPercentage} className="h-2" />
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            <TabsTrigger value="logs" className="flex-1">Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-4 bg-muted p-2 text-sm font-medium">
                <div className="col-span-2">Test Case</div>
                <div>Status</div>
                <div>Duration</div>
              </div>
              {results.results.map((result) => (
                <div 
                  key={result.testCaseId}
                  className={cn(
                    "grid grid-cols-4 p-2 text-sm border-t hover:bg-slate-50 cursor-pointer",
                    result.testCaseId === currentTestId ? "bg-slate-50" : ""
                  )}
                  onClick={() => setSelectedTestId(result.testCaseId)}
                >
                  <div className="col-span-2">Test {result.testCaseId}</div>
                  <div>
                    <Badge 
                      className={cn(
                        "font-normal",
                        result.passed 
                          ? "bg-green-100 text-green-800 hover:bg-green-100" 
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      )}
                      variant="outline"
                    >
                      <span className="flex items-center gap-1">
                        {result.passed 
                          ? <Check className="h-3 w-3 text-green-600" /> 
                          : <X className="h-3 w-3 text-red-600" />
                        }
                        {result.passed ? 'Passed' : 'Failed'}
                      </span>
                    </Badge>
                  </div>
                  <div>{result.duration.toFixed(2)}s</div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="logs">
            {selectedResult ? (
              <div className="space-y-3">
                {selectedResult.logs.map((log, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "p-3 rounded-md border",
                      log.status === 'passed' ? "bg-green-50 border-green-100" : 
                      log.status === 'failed' ? "bg-red-50 border-red-100" : "bg-slate-50"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {log.status === 'passed' ? (
                        <Check className="h-4 w-4 text-green-600 mt-0.5" />
                      ) : log.status === 'failed' ? (
                        <X className="h-4 w-4 text-red-600 mt-0.5" />
                      ) : (
                        <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-sm">{log.step}</div>
                        {log.message && (
                          <div className="text-sm text-muted-foreground mt-1">{log.message}</div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Select a test to view logs.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TestResultsView;
