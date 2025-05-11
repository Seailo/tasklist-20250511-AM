import React, { useState } from 'react';
import TodoWidget from './components/TodoWidget';
import { Settings } from 'lucide-react';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [channelName, setChannelName] = useState('seailo');
  const [moderators, setModerators] = useState<string[]>([]);
  const [moderatorInput, setModeratorInput] = useState('');
  const [customColors, setCustomColors] = useState({
    background: 'rgba(23, 25, 35, 0.8)',
    text: '#ffffff',
    accent: '#9147ff'
  });

  const handleAddModerator = () => {
    if (moderatorInput.trim() && !moderators.includes(moderatorInput.trim())) {
      setModerators([...moderators, moderatorInput.trim()]);
      setModeratorInput('');
    }
  };

  const handleRemoveModerator = (modToRemove: string) => {
    setModerators(moderators.filter(mod => mod !== modToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddModerator();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <button 
          className="absolute top-2 right-2 z-10 bg-gray-800 bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70 transition-all"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={20} />
        </button>
        
        {showSettings ? (
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg animate-fadeIn w-full">
            <h2 className="text-xl font-bold mb-4">Widget Settings</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Channel Name</label>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your Twitch channel name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Moderators</label>
              <div className="flex">
                <input
                  type="text"
                  value={moderatorInput}
                  onChange={(e) => setModeratorInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-l px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Add moderator username"
                />
                <button 
                  onClick={handleAddModerator}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r font-medium transition-colors"
                >
                  Add
                </button>
              </div>
              
              {moderators.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {moderators.map(mod => (
                    <div key={mod} className="bg-gray-700 text-sm px-3 py-1 rounded-full flex items-center">
                      {mod}
                      <button 
                        onClick={() => handleRemoveModerator(mod)}
                        className="ml-2 text-gray-400 hover:text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Colors</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs block mb-1">Background</label>
                  <input
                    type="text"
                    value={customColors.background}
                    onChange={(e) => setCustomColors({...customColors, background: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs block mb-1">Text</label>
                  <input
                    type="text"
                    value={customColors.text}
                    onChange={(e) => setCustomColors({...customColors, text: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs block mb-1">Accent</label>
                  <input
                    type="text"
                    value={customColors.accent}
                    onChange={(e) => setCustomColors({...customColors, accent: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Available Commands:</h3>
              <ul className="text-sm bg-gray-900 p-3 rounded">
                <li className="mb-1"><code>!task add [task]</code> - Add a new task</li>
                <li className="mb-1"><code>!task done [#]</code> - Mark a task as complete</li>
                <li className="mb-1"><code>!task del [#]</code> - Delete a task</li>
                <li className="mb-1"><code>!task clear</code> - Clear all tasks</li>
                <li><code>!task hide</code> - Toggle widget visibility</li>
              </ul>
            </div>

            <p className="text-xs text-gray-400 mb-4">
              This widget connects to your Twitch chat and listens for commands.
              Only the channel owner and added moderators can control the widget.
            </p>
            
            <button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded font-medium transition-colors"
              onClick={() => setShowSettings(false)}
            >
              Save & Close
            </button>
          </div>
        ) : (
          <TodoWidget 
            channelName={channelName}
            moderators={moderators}
            customColors={customColors}
          />
        )}
      </div>
    </div>
  );
}

export default App;