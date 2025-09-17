import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import * as messageService from '../services/messageService.js';
import { useAuth } from './AuthContext.jsx';

// Initial state for chat
const initialState = {
  currentUser: null,
  selectedUser: null,
  messages: [],
  users: [],
  chatPartners: [],
  isLoading: false,
  isLoadingMessages: false,
  isLoadingUsers: false,
  isSendingMessage: false,
  error: null,
  messageError: null,
};

// Chat action types
export const CHAT_ACTIONS = {
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  SET_SELECTED_USER: 'SET_SELECTED_USER',
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_USERS: 'SET_USERS',
  SET_CHAT_PARTNERS: 'SET_CHAT_PARTNERS',
  SET_LOADING: 'SET_LOADING',
  SET_LOADING_MESSAGES: 'SET_LOADING_MESSAGES',
  SET_LOADING_USERS: 'SET_LOADING_USERS',
  SET_SENDING_MESSAGE: 'SET_SENDING_MESSAGE',
  SET_ERROR: 'SET_ERROR',
  SET_MESSAGE_ERROR: 'SET_MESSAGE_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_MESSAGE_ERROR: 'CLEAR_MESSAGE_ERROR',
  RESET_CHAT: 'RESET_CHAT',
};

// Chat reducer
const chatReducer = (state, action) => {
  switch (action.type) {
    case CHAT_ACTIONS.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };

    case CHAT_ACTIONS.SET_SELECTED_USER:
      return {
        ...state,
        selectedUser: action.payload,
        messages: [], // Clear messages when selecting new user
        messageError: null,
      };

    case CHAT_ACTIONS.SET_MESSAGES:
      return {
        ...state,
        messages: action.payload,
        isLoadingMessages: false,
        messageError: null,
      };

    case CHAT_ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        isSendingMessage: false,
        messageError: null,
      };

    case CHAT_ACTIONS.SET_USERS:
      return {
        ...state,
        users: action.payload,
        isLoadingUsers: false,
        error: null,
      };

    case CHAT_ACTIONS.SET_CHAT_PARTNERS:
      return {
        ...state,
        chatPartners: action.payload,
        isLoadingUsers: false,
        error: null,
      };

    case CHAT_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case CHAT_ACTIONS.SET_LOADING_MESSAGES:
      return {
        ...state,
        isLoadingMessages: action.payload,
      };

    case CHAT_ACTIONS.SET_LOADING_USERS:
      return {
        ...state,
        isLoadingUsers: action.payload,
      };

    case CHAT_ACTIONS.SET_SENDING_MESSAGE:
      return {
        ...state,
        isSendingMessage: action.payload,
      };

    case CHAT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isLoadingUsers: false,
      };

    case CHAT_ACTIONS.SET_MESSAGE_ERROR:
      return {
        ...state,
        messageError: action.payload,
        isLoadingMessages: false,
        isSendingMessage: false,
      };

    case CHAT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case CHAT_ACTIONS.CLEAR_MESSAGE_ERROR:
      return {
        ...state,
        messageError: null,
      };

    case CHAT_ACTIONS.RESET_CHAT:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

// Create ChatContext
const ChatContext = createContext();

// ChatProvider component
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user: authUser, isAuthenticated } = useAuth();

  // Set current user from auth context
  useEffect(() => {
    if (isAuthenticated && authUser) {
      dispatch({
        type: CHAT_ACTIONS.SET_CURRENT_USER,
        payload: authUser,
      });
    } else {
      dispatch({ type: CHAT_ACTIONS.RESET_CHAT });
    }
  }, [authUser, isAuthenticated]);

  // Chat actions
  const setSelectedUser = useCallback((user) => {
    dispatch({
      type: CHAT_ACTIONS.SET_SELECTED_USER,
      payload: user,
    });
  }, []);

  const addMessage = useCallback((message) => {
    dispatch({
      type: CHAT_ACTIONS.ADD_MESSAGE,
      payload: message,
    });
  }, []);

  const setMessages = useCallback((messages) => {
    dispatch({
      type: CHAT_ACTIONS.SET_MESSAGES,
      payload: messages,
    });
  }, []);

  const setUsers = useCallback((users) => {
    dispatch({
      type: CHAT_ACTIONS.SET_USERS,
      payload: users,
    });
  }, []);

  // Load all contacts
  const loadContacts = useCallback(async (forceRefresh = false) => {
    if (!isAuthenticated) return;

    // Skip loading if we already have users and not forcing refresh
    if (!forceRefresh && state.users.length > 0 && !state.isLoadingUsers) {
      return;
    }

    try {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING_USERS, payload: true });
      const contacts = await messageService.getContacts();
      dispatch({
        type: CHAT_ACTIONS.SET_USERS,
        payload: contacts,
      });
    } catch (error) {
      console.error('Error loading contacts:', error);
      dispatch({
        type: CHAT_ACTIONS.SET_ERROR,
        payload: error.message || 'Failed to load contacts',
      });
    }
  }, [isAuthenticated, state.users.length, state.isLoadingUsers]);

  // Load chat partners
  const loadChatPartners = useCallback(async (forceRefresh = false) => {
    if (!isAuthenticated) return;

    // Skip loading if we already have chat partners and not forcing refresh
    if (!forceRefresh && state.chatPartners.length > 0 && !state.isLoadingUsers) {
      return;
    }

    try {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING_USERS, payload: true });
      const chatPartners = await messageService.getChatPartners();
      dispatch({
        type: CHAT_ACTIONS.SET_CHAT_PARTNERS,
        payload: chatPartners,
      });
    } catch (error) {
      console.error('Error loading chat partners:', error);
      dispatch({
        type: CHAT_ACTIONS.SET_ERROR,
        payload: error.message || 'Failed to load chat partners',
      });
    }
  }, [isAuthenticated, state.chatPartners.length, state.isLoadingUsers]);

  // Load messages with selected user
  const loadMessages = useCallback(async (userId) => {
    if (!userId || !isAuthenticated) return;

    try {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING_MESSAGES, payload: true });
      const messages = await messageService.getMessages(userId);
      dispatch({
        type: CHAT_ACTIONS.SET_MESSAGES,
        payload: messages,
      });
    } catch (error) {
      console.error('Error loading messages:', error);
      dispatch({
        type: CHAT_ACTIONS.SET_MESSAGE_ERROR,
        payload: error.message || 'Failed to load messages',
      });
    }
  }, [isAuthenticated]);

  // Send message with retry functionality
  const sendMessage = useCallback(async (userId, messageData, retryCount = 0) => {
    if (!userId || !isAuthenticated) return;

    const maxRetries = 3;
    const retryDelay = 1000 * Math.pow(2, retryCount); // Exponential backoff

    try {
      dispatch({ type: CHAT_ACTIONS.SET_SENDING_MESSAGE, payload: true });
      const sentMessage = await messageService.sendMessage(userId, messageData);
      
      // Add the sent message to the current messages
      dispatch({
        type: CHAT_ACTIONS.ADD_MESSAGE,
        payload: sentMessage,
      });
      
      return sentMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Retry logic for network errors
      if (retryCount < maxRetries && (
        error.message?.includes('network') || 
        error.message?.includes('timeout') ||
        error.status >= 500
      )) {
        console.log(`Retrying message send (attempt ${retryCount + 1}/${maxRetries + 1})`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        return sendMessage(userId, messageData, retryCount + 1);
      }
      
      dispatch({
        type: CHAT_ACTIONS.SET_MESSAGE_ERROR,
        payload: error.message || 'Failed to send message',
      });
      dispatch({ type: CHAT_ACTIONS.SET_SENDING_MESSAGE, payload: false });
      throw error;
    }
  }, [isAuthenticated]);

  // Real-time message polling mechanism with smart updates
  const startMessagePolling = useCallback((userId, interval = 3000) => {
    if (!userId || !isAuthenticated) return null;

    let lastMessageCount = state.messages.length;
    let lastMessageId = state.messages.length > 0 ? state.messages[state.messages.length - 1]._id : null;

    const pollMessages = async () => {
      try {
        const messages = await messageService.getMessages(userId);
        
        // Check if we have new messages
        const hasNewMessages = messages.length > lastMessageCount || 
          (messages.length > 0 && messages[messages.length - 1]._id !== lastMessageId);
        
        if (hasNewMessages) {
          dispatch({
            type: CHAT_ACTIONS.SET_MESSAGES,
            payload: messages,
          });
          
          // Update tracking variables
          lastMessageCount = messages.length;
          lastMessageId = messages.length > 0 ? messages[messages.length - 1]._id : null;
        }
      } catch (error) {
        console.error('Error polling messages:', error);
        // Don't dispatch error for polling failures to avoid spam
        // But we could implement exponential backoff here if needed
      }
    };

    // Initial poll
    pollMessages();
    
    const intervalId = setInterval(pollMessages, interval);
    return intervalId;
  }, [isAuthenticated, state.messages]);

  // Stop message polling
  const stopMessagePolling = useCallback((intervalId) => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }, []);

  // Retry failed message
  const retryMessage = useCallback(async (userId, messageData) => {
    if (!userId || !isAuthenticated) return;
    
    // Clear previous error
    dispatch({ type: CHAT_ACTIONS.CLEAR_MESSAGE_ERROR });
    
    // Retry sending the message
    return sendMessage(userId, messageData);
  }, [isAuthenticated, sendMessage]);

  // Refresh user data
  const refreshUsers = useCallback(async (activeTab = 'all') => {
    if (!isAuthenticated) return;

    try {
      if (activeTab === 'all') {
        await loadContacts(true);
      } else {
        await loadChatPartners(true);
      }
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  }, [isAuthenticated, loadContacts, loadChatPartners]);

  // Update user online status (can be called periodically)
  const updateUserStatus = useCallback((userId, isOnline, lastSeen = null) => {
    const updateUserInList = (userList) => 
      userList.map(user => 
        user._id === userId 
          ? { ...user, isOnline, lastSeen: lastSeen || user.lastSeen }
          : user
      );

    dispatch({
      type: CHAT_ACTIONS.SET_USERS,
      payload: updateUserInList(state.users),
    });

    dispatch({
      type: CHAT_ACTIONS.SET_CHAT_PARTNERS,
      payload: updateUserInList(state.chatPartners),
    });

    // Update selected user if it matches
    if (state.selectedUser?._id === userId) {
      dispatch({
        type: CHAT_ACTIONS.SET_SELECTED_USER,
        payload: { 
          ...state.selectedUser, 
          isOnline, 
          lastSeen: lastSeen || state.selectedUser.lastSeen 
        },
      });
    }
  }, [state.users, state.chatPartners, state.selectedUser]);

  // Clear errors
  const clearError = useCallback(() => {
    dispatch({ type: CHAT_ACTIONS.CLEAR_ERROR });
  }, []);

  const clearMessageError = useCallback(() => {
    dispatch({ type: CHAT_ACTIONS.CLEAR_MESSAGE_ERROR });
  }, []);

  // Auto-load messages when selected user changes
  useEffect(() => {
    if (state.selectedUser?._id) {
      loadMessages(state.selectedUser._id);
    }
  }, [state.selectedUser?._id, loadMessages]);

  // Context value
  const value = {
    ...state,
    dispatch,
    setSelectedUser,
    addMessage,
    setMessages,
    setUsers,
    loadContacts,
    loadChatPartners,
    loadMessages,
    sendMessage,
    retryMessage,
    refreshUsers,
    updateUserStatus,
    startMessagePolling,
    stopMessagePolling,
    clearError,
    clearMessageError,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use ChatContext
export const useChat = () => {
  const context = useContext(ChatContext);
  
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
};

export default ChatContext;