
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UrlInputProps {
  onUrlSubmit: (url: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ onUrlSubmit }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    // Basic URL validation
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      onUrlSubmit(url);
      toast.success('URL successfully added');
    } catch (error) {
      toast.error('Please enter a valid URL');
    }
  };

  return (
    <div className="w-full mb-6">
      <h2 className="text-lg font-medium mb-2">Target URL</h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter website URL (e.g., https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Add URL</Button>
      </form>
    </div>
  );
};

export default UrlInput;
