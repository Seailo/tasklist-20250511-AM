import React, { useState, useEffect } from 'react';
import { X, Trash2, CheckCircle, Circle, Plus } from 'lucide-react';
import { useTwitchCommands } from '../hooks/useTwitchCommands';
import { useLocalStorage } from '../hooks/useLocalStorage';
import '../styles/TodoWidget.css';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface TodoWidgetProps {
  channelName: string;
  moderators: string[];
  customColors?: {
    background?: string;
    text?: string;
    accent?: string;
  };
}

const TodoWidget: React.FC<TodoWidgetProps> = ({ 
  channelName, 
  moderators,
  customColors = {
    background: 'rgba(23, 25, 35, 0.8)',
    text: '#ffffff',
    accent: '#9147ff'
  }
}) => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('twitch-todos', []);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [widgetVisible, setWidgetVisible] = useState(true);

  useTwitchCommands({
    channelName,
    moderators,
    onAddTodo: (text, user) => {
      if (isAuthorized(user)) {
        addTodo(text);
        showNotification(`Added: "${text}"`, 'success');
      }
    },
    onDeleteTodo: (indexOrText, user) => {
      if (isAuthorized(user)) {
        const index = parseInt(indexOrText);
        if (!isNaN(index) && index > 0 && index <= todos.length) {
          const todoText = todos[index - 1].text;
          deleteTodo(index - 1);
          showNotification(`Deleted #${index}: "${todoText}"`, 'success');
        } else {
          const todoIndex = todos.findIndex(todo => 
            todo.text.toLowerCase().includes(indexOrText.toLowerCase())
          );
          
          if (todoIndex !== -1) {
            deleteTodo(todoIndex);
            showNotification(`Deleted: "${todos[todoIndex].text}"`, 'success');
          } else {
            showNotification(`Task #${index} not found`, 'error');
          }
        }
      }
    },
    onToggleTodo: (indexOrText, user) => {
      if (isAuthorized(user)) {
        const index = parseInt(indexOrText);
        if (!isNaN(index) && index > 0 && index <= todos.length) {
          toggleTodo(index - 1);
          const status = !todos[index - 1].completed ? 'completed' : 'reopened';
          showNotification(`Task #${index} ${status}`, 'success');
        } else {
          const todoIndex = todos.findIndex(todo => 
            todo.text.toLowerCase().includes(indexOrText.toLowerCase())
          );
          
          if (todoIndex !== -1) {
            toggleTodo(todoIndex);
            const status = !todos[todoIndex].completed ? 'completed' : 'reopened';
            showNotification(`Task "${todos[todoIndex].text}" ${status}`, 'success');
          } else {
            showNotification(`Task #${index} not found`, 'error');
          }
        }
      }
    },
    onClearTodos: (_, user) => {
      if (isAuthorized(user)) {
        setTodos([]);
        showNotification('All tasks cleared', 'success');
      }
    },
    onToggleWidget: (_, user) => {
      if (isAuthorized(user)) {
        setWidgetVisible(prev => !prev);
        showNotification(widgetVisible ? 'Widget hidden' : 'Widget visible', 'success');
      }
    }
  });

  const isAuthorized = (username: string): boolean => {
    return username.toLowerCase() === channelName.toLowerCase() || 
           moderators.map(mod => mod.toLowerCase()).includes(username.toLowerCase());
  };

  const addTodo = (text: string) => {
    setTodos(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: Date.now(),
      }
    ]);
  };

  const deleteTodo = (index: number) => {
    setTodos(prev => prev.filter((_, i) => i !== index));
  };

  const toggleTodo = (index: number) => {
    setTodos(prev => 
      prev.map((todo, i) => 
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (!widgetVisible) return null;

  return (
    <div 
      className="todo-widget"
      style={{
        backgroundColor: customColors.background,
        color: customColors.text
      }}
    >
      <div className="todo-widget-header">
        <h2>Stream Tasks</h2>
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
      </div>
      
      <ul className="todo-list">
        {todos.length === 0 ? (
          <li className="empty-state">
            No tasks yet. Add with !task add [task]
          </li>
        ) : (
          todos.map((todo, index) => (
            <li 
              key={todo.id} 
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
              style={{
                animationDelay: `${index * 0.05}s`
              }}
            >
              <span className="todo-number">{index + 1}.</span>
              <span className="todo-status">
                {todo.completed ? 
                  <CheckCircle size={18} color={customColors.accent} /> : 
                  <Circle size={18} />
                }
              </span>
              <span className="todo-text">{todo.text}</span>
            </li>
          ))
        )}
      </ul>
      
      <div className="todo-commands">
        <p>Commands: !task add [task] | !task done [#] | !task del [#] | !task clear</p>
      </div>
    </div>
  );
};

export default TodoWidget;