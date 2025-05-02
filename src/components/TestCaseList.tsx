
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestCase } from '@/lib/types';
import TestCaseCard from './TestCaseCard';
import { toast } from 'sonner';

interface TestCaseListProps {
  testCases: TestCase[];
  onRunTest: (id: string) => void;
  onRunAll: () => void;
  isGenerating?: boolean;
}

const TestCaseList: React.FC<TestCaseListProps> = ({ 
  testCases, 
  onRunTest, 
  onRunAll,
  isGenerating = false
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Test Cases</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (expandedIds.length === testCases.length) {
                  setExpandedIds([]);
                } else {
                  setExpandedIds(testCases.map(tc => tc.id));
                }
              }}
            >
              {expandedIds.length === testCases.length ? 'Collapse All' : 'Expand All'}
            </Button>
            <Button 
              onClick={onRunAll}
              size="sm"
              disabled={testCases.length === 0 || isGenerating}
            >
              Run All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {testCases.length === 0 ? (
          isGenerating ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Generating test cases...</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No test cases available.</p>
              <p className="text-muted-foreground text-sm mt-1">
                Enter a URL and update the knowledge base, then generate test cases.
              </p>
            </div>
          )
        ) : (
          <div>
            {testCases.map((testCase) => (
              <TestCaseCard
                key={testCase.id}
                testCase={testCase}
                onRun={onRunTest}
                expanded={expandedIds.includes(testCase.id)}
                toggleExpand={toggleExpand}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestCaseList;
