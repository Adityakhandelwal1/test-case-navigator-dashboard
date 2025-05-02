
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { KnowledgeBase } from '@/lib/types';
import { toast } from 'sonner';

interface KnowledgeBaseEditorProps {
  initialKnowledgeBase: KnowledgeBase;
  onUpdate: (knowledgeBase: KnowledgeBase) => void;
}

const KnowledgeBaseEditor: React.FC<KnowledgeBaseEditorProps> = ({ 
  initialKnowledgeBase, 
  onUpdate 
}) => {
  const [yamlContent, setYamlContent] = useState('');
  const [isValid, setIsValid] = useState(true);

  // Convert the knowledge base object to YAML-like string format
  const objectToYamlString = (obj: any, indent = 0): string => {
    const indentation = ' '.repeat(indent);
    return Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return `${indentation}${key}:\n${objectToYamlString(value, indent + 2)}`;
      }
      return `${indentation}${key}: ${value}`;
    }).join('\n');
  };

  // Attempt to parse the YAML-like string back to an object
  const tryParseYaml = (text: string): { success: boolean; data?: KnowledgeBase } => {
    try {
      const result: KnowledgeBase = {
        credentials: {},
        test_data: { default_email: '', default_password: '', phone: '' }
      };

      let currentSection: keyof KnowledgeBase | null = null;
      let currentUrl: string | null = null;
      
      const lines = text.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#')) continue;

        // Check if this is a main section (credentials or test_data)
        if (trimmedLine.endsWith(':') && !line.startsWith('  ')) {
          const sectionName = trimmedLine.slice(0, -1) as keyof KnowledgeBase;
          if (sectionName === 'credentials' || sectionName === 'test_data') {
            currentSection = sectionName;
            currentUrl = null;
          }
          continue;
        }

        // If we're in the credentials section and find a URL
        if (currentSection === 'credentials' && trimmedLine.endsWith(':') && line.startsWith('  ')) {
          currentUrl = trimmedLine.slice(0, -1).trim();
          result.credentials[currentUrl] = { username: '', password: '' };
          continue;
        }

        // Process key-value pairs
        if (line.includes(':')) {
          const [key, ...valueParts] = line.split(':');
          const trimmedKey = key.trim();
          const value = valueParts.join(':').trim();

          if (currentSection === 'credentials' && currentUrl) {
            if (trimmedKey === 'username' || trimmedKey === 'password') {
              result.credentials[currentUrl][trimmedKey] = value;
            }
          } else if (currentSection === 'test_data') {
            result.test_data[trimmedKey] = value;
          }
        }
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Failed to parse YAML:', error);
      return { success: false };
    }
  };

  // Initialize YAML content
  useEffect(() => {
    const yaml = [
      'credentials:',
      ...Object.entries(initialKnowledgeBase.credentials).flatMap(([url, creds]) => [
        `  ${url}:`,
        `    username: ${creds.username}`,
        `    password: ${creds.password}`
      ]),
      'test_data:',
      ...Object.entries(initialKnowledgeBase.test_data).map(([key, value]) => 
        `  ${key}: ${value}`
      )
    ].join('\n');

    setYamlContent(yaml);
  }, [initialKnowledgeBase]);

  const handleChange = (content: string) => {
    setYamlContent(content);
    const parseResult = tryParseYaml(content);
    setIsValid(parseResult.success);
  };

  const handleSave = () => {
    const parseResult = tryParseYaml(yamlContent);
    if (parseResult.success && parseResult.data) {
      onUpdate(parseResult.data);
      toast.success('Knowledge base updated successfully');
    } else {
      toast.error('Invalid format. Please check your input.');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span>Knowledge Base</span>
          <Button 
            onClick={handleSave} 
            disabled={!isValid}
            size="sm"
          >
            Save
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={yamlContent}
          onChange={(e) => handleChange(e.target.value)}
          className="min-h-[300px] font-mono code-font text-sm"
          placeholder="Enter your knowledge base data..."
        />
        {!isValid && (
          <p className="text-destructive text-sm mt-2">
            Invalid format. Please check your input.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseEditor;
