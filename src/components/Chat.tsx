import React, { useState } from 'react';
import { Button } from './ui/button';
import { CodeEditor } from './CodeEditor';
import ReactMarkdown from 'react-markdown';
import { chat } from '../api/chat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeContent, setCodeContent] = useState('// Your generated code will appear here');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chat([...messages, userMessage]);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.content
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      if (response.code) {
        setCodeContent(response.code);
      }
    } catch (error: any) {
      console.error('Error:', error);
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (error.message === 'OPENAI_API_KEY_MISSING') {
        errorMessage = 'Please add your OpenAI API key to the .env file (VITE_OPENAI_API_KEY=your_key)';
      } else if (error.message === 'INVALID_API_KEY') {
        errorMessage = 'Invalid OpenAI API key. Please check your API key and try again.';
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex gap-4">
        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto mb-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-100 ml-auto max-w-[80%]'
                    : 'bg-gray-100 mr-auto max-w-[80%]'
                }`}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <p className="mb-2">Welcome to Auto Legion!</p>
                <p className="text-sm">Before starting, make sure to:</p>
                <ol className="text-sm list-decimal list-inside mt-2">
                  <li>Add your OpenAI API key to the .env file</li>
                  <li>Set VITE_OPENAI_API_KEY=your_actual_api_key</li>
                  <li>Restart the development server</li>
                </ol>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 border rounded-lg"
              placeholder="Ask Auto Legion to write some code..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Thinking...' : 'Send'}
            </Button>
          </form>
        </div>

        {/* Code Editor Section */}
        <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden">
          <CodeEditor
            value={codeContent}
            onChange={(value) => setCodeContent(value || '')}
            language="typescript"
          />
        </div>
      </div>
    </div>
  );
}</content>