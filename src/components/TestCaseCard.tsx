
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TestCase } from '@/lib/types';
import { Play, Check, X, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestCaseCardProps {
  testCase: TestCase;
  onRun: (id: string) => void;
  expanded?: boolean;
  toggleExpand?: (id: string) => void;
}

const TestCaseCard: React.FC<TestCaseCardProps> = ({ 
  testCase, 
  onRun, 
  expanded = false,
  toggleExpand 
}) => {
  // Status badge styling
  const getBadgeVariant = (status: TestCase['status']) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'failed':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'running':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  // Status icon
  const getStatusIcon = (status: TestCase['status']) => {
    switch (status) {
      case 'passed':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Loader className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-medium">{testCase.title}</CardTitle>
            <Badge 
              className={cn("font-normal", getBadgeVariant(testCase.status))}
              variant="outline"
            >
              <span className="flex items-center gap-1">
                {getStatusIcon(testCase.status)}
                {testCase.status.charAt(0).toUpperCase() + testCase.status.slice(1)}
              </span>
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toggleExpand && toggleExpand(testCase.id)}
            >
              {expanded ? 'Collapse' : 'Expand'}
            </Button>
            <Button 
              variant="default"
              size="sm"
              onClick={() => onRun(testCase.id)}
              disabled={testCase.status === 'running'}
              className="flex items-center gap-1"
            >
              <Play className="h-3 w-3" />
              Run
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-0 pb-4">
        <p className="text-sm text-gray-500 mb-2">{testCase.description}</p>
        
        {expanded && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Steps:</h4>
            <ol className="list-decimal pl-5 space-y-1">
              {testCase.steps.map((step, index) => (
                <li key={index} className="text-sm">{step}</li>
              ))}
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestCaseCard;
