import { useEffect, useRef } from 'react';

interface TwitchCommandsProps {
  channelName: string;
  moderators: string[];
  onAddTodo: (text: string, user: string) => void;
  onDeleteTodo: (indexOrText: string, user: string) => void;
  onToggleTodo: (indexOrText: string, user: string) => void;
  onClearTodos: (text: string, user: string) => void;
  onToggleWidget: (text: string, user: string) => void;
}

interface TwitchChatMessage {
  username: string;
  message: string;
  isMod: boolean;
  isBroadcaster: boolean;
}

export const useTwitchCommands = ({
  channelName,
  moderators,
  onAddTodo,
  onDeleteTodo,
  onToggleTodo,
  onClearTodos,
  onToggleWidget
}: TwitchCommandsProps) => {
  const webSocketRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    // Set up the connection to Twitch chat
    const connectToTwitchChat = () => {
      try {
        if (window.WebSocket) {
          webSocketRef.current = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
          const ws = webSocketRef.current;
          
          ws.onopen = () => {
            // Anonymous connection to Twitch chat
            ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
            ws.send(`NICK justinfan${Math.floor(Math.random() * 100000)}`);
            ws.send(`JOIN #${channelName.toLowerCase()}`);
            console.log(`Connected to Twitch chat for channel: ${channelName}`);
          };
          
          ws.onmessage = (event) => {
            const message = event.data;
            if (message.includes('PING')) {
              ws.send('PONG :tmi.twitch.tv');
              return;
            }
            
            // Handle actual chat messages
            if (message.includes('PRIVMSG')) {
              const parsedMessage = parseTwitchMessage(message);
              if (parsedMessage) {
                handleCommand(parsedMessage);
              }
            }
          };
          
          ws.onclose = () => {
            console.log('Disconnected from Twitch chat. Reconnecting in 5 seconds...');
            setTimeout(connectToTwitchChat, 5000);
          };
          
          ws.onerror = (error) => {
            console.error('WebSocket error:', error);
          };
        } else {
          console.error('WebSocket is not supported by this browser');
          
          // Fallback to StreamElements API (hypothetical implementation)
          // This part would require StreamElements specific implementation
          window.addEventListener('onEventReceived', (obj: any) => {
            const data = obj.detail.event.data;
            if (data.text && data.text.startsWith('!todo')) {
              const parsedMessage = {
                username: data.nick,
                message: data.text,
                isMod: data.tags.mod === '1',
                isBroadcaster: data.nick.toLowerCase() === channelName.toLowerCase()
              };
              handleCommand(parsedMessage);
            }
          });
        }
      } catch (error) {
        console.error('Error connecting to Twitch chat:', error);
      }
    };
    
    const parseTwitchMessage = (rawMessage: string): TwitchChatMessage | null => {
      try {
        // Extract username and message from the IRC message
        const userMatch = rawMessage.match(/@(.+?(?=\s:)).*PRIVMSG #\w+ :(.*)/);
        if (!userMatch) return null;
        
        const tagsString = userMatch[1];
        const message = userMatch[2];
        
        // Extract username from tags
        const displayNameMatch = tagsString.match(/display-name=([^;]+)/);
        const username = displayNameMatch ? displayNameMatch[1] : 'Anonymous';
        
        // Check if user is mod or broadcaster
        const modMatch = tagsString.match(/mod=([^;]+)/);
        const isMod = modMatch ? modMatch[1] === '1' : false;
        
        // Check if broadcaster (channel owner)
        const isBroadcaster = username.toLowerCase() === channelName.toLowerCase();
        
        return {
          username,
          message,
          isMod,
          isBroadcaster
        };
      } catch (error) {
        console.error('Error parsing Twitch message:', error);
        return null;
      }
    };
    
    const handleCommand = (chatMessage: TwitchChatMessage) => {
      const { username, message, isMod, isBroadcaster } = chatMessage;
      
      // Check if message is a command
      if (!message.startsWith('!todo')) return;
      
      // Check if user is authorized (broadcaster or mod)
      const isAuthorized = isBroadcaster || isMod || moderators.includes(username.toLowerCase());
      if (!isAuthorized) return;
      
      const parts = message.split(' ');
      if (parts.length < 2) return;
      
      const subCommand = parts[1].toLowerCase();
      const remainingText = parts.slice(2).join(' ');
      
      switch (subCommand) {
        case 'add':
          if (remainingText) {
            onAddTodo(remainingText, username);
          }
          break;
          
        case 'delete':
        case 'del':
        case 'remove':
        case 'rm':
          if (remainingText) {
            onDeleteTodo(remainingText, username);
          }
          break;
          
        case 'done':
        case 'complete':
        case 'check':
        case 'toggle':
          if (remainingText) {
            onToggleTodo(remainingText, username);
          }
          break;
          
        case 'clear':
        case 'reset':
          onClearTodos(remainingText, username);
          break;
          
        case 'hide':
        case 'show':
        case 'toggle-widget':
          onToggleWidget(remainingText, username);
          break;
          
        default:
          break;
      }
    };
    
    connectToTwitchChat();
    
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, [channelName, moderators, onAddTodo, onDeleteTodo, onToggleTodo, onClearTodos, onToggleWidget]);
};