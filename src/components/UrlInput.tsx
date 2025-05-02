
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Search, Link } from 'lucide-react';

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
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary">
        <Link size={20} /> Target URL
      </h2>
      <div className="bg-card rounded-lg p-4 border shadow-sm">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="text"
              placeholder="Enter website URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" className="bg-primary hover:bg-primary/90 transition-colors">
            Analyze Website
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          The AI QA Engineer will crawl this website using your knowledge base credentials
        </p>
      </div>
    </div>
  );
};

export default UrlInput;
