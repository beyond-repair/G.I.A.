import { Chat } from './components/Chat';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold text-gray-900">Auto Legion</h1>
          <p className="text-gray-600">Your AI-powered code generation assistant</p>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        <Chat />
      </main>
    </div>
  );
}

export default App;