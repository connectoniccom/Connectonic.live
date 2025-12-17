'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Music, Video, Search, ArrowLeft, Loader2 } from 'lucide-react';

interface Message {
  id?: string;
  text: string;
  senderId: string;
  receiverId?: string;
  senderName?: string;
  timestamp: any;
}

interface OnlineUser {
  uid: string;
  name: string;
  photoURL?: string;
  lastSeen: any;
  isOnline: boolean;
}

const ChatPage = () => {
  const { user } = useAuth();
  const db = getFirestore(app);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [allUsers, setAllUsers] = useState<OnlineUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [userProfiles, setUserProfiles] = useState<{[key: string]: string}>({});
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);
  const [showSiteUsers, setShowSiteUsers] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    } else {
      setLoading(false);
    }
  }, [user, router]);

  // Update user online status
  useEffect(() => {
    if (user) {
      const userStatusRef = doc(db, 'userStatus', user.uid);
      const updateOnlineStatus = async () => {
        await setDoc(userStatusRef, {
          name: user.displayName || user.email || 'Anonymous',
          photoURL: user.photoURL || null,
          lastSeen: serverTimestamp(),
          isOnline: true
        }, { merge: true });
      };

      updateOnlineStatus();

      // Set offline when user leaves
      const handleBeforeUnload = () => {
        setDoc(userStatusRef, {
          isOnline: false,
          lastSeen: serverTimestamp()
        }, { merge: true });
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        setDoc(userStatusRef, {
          isOnline: false,
          lastSeen: serverTimestamp()
        }, { merge: true });
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [user, db]);

  // Listen for messages
  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const msgs: Message[] = [];
      for (const docSnap of querySnapshot.docs) {
        const msgData = docSnap.data() as Message;
        // Get user name for each message
        if (!userProfiles[msgData.senderId]) {
          try {
            const userDoc = await getDoc(doc(db, 'userStatus', msgData.senderId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              userProfiles[msgData.senderId] = userData.name || 'Anonymous';
              setUserProfiles({...userProfiles});
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        }
        msgs.push({ id: docSnap.id, ...msgData, senderName: userProfiles[msgData.senderId] || 'Anonymous' });
      }
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [db, userProfiles]);

  // Listen for all users (both online and offline)
  useEffect(() => {
    const q = query(collection(db, 'userStatus'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users: OnlineUser[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as OnlineUser;
        users.push({ ...userData, uid: doc.id });
      });
      setAllUsers(users);
      setOnlineUsers(users.filter(u => u.isOnline));
    });

    return () => unsubscribe();
  }, [db]);

  // Listen for typing status
  useEffect(() => {
    if (!selectedUser || !user) return;

    const q = query(collection(db, 'typingStatus'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const typing: string[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isTyping && data.to === user.uid && data.from === selectedUser.uid) {
          typing.push(data.from);
        }
      });
      setTypingUsers(typing);
    });

    return () => unsubscribe();
  }, [db, selectedUser, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !user || !selectedUser) return;

    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      senderId: user.uid,
      receiverId: selectedUser.uid,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  const handleTyping = async (isTyping: boolean) => {
    if (user && selectedUser) {
      const typingStatusRef = doc(db, 'typingStatus', `${user.uid}_${selectedUser.uid}`);
      await setDoc(typingStatusRef, {
        isTyping,
        from: user.uid,
        to: selectedUser.uid,
      });
    }
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log(file);
    }
  };

  const handleRecord = () => {
    if (isRecording) {
      mediaRecorder?.stop();
      setIsRecording(false);
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        recorder.start();
        setIsRecording(true);

        recorder.ondataavailable = (e) => {
          setAudioChunks((prev) => [...prev, e.data]);
        };
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* User List Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {showSearch ? '🔍 Search Users' : `💬 Online Users (${onlineUsers.length})`}
            </h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSiteUsers(!showSiteUsers)}
                className={`p-2 rounded-full transition-all duration-200 ${showSiteUsers ? 'bg-white bg-opacity-20 shadow-md' : 'hover:bg-white hover:bg-opacity-10'}`}
                title="Site Users"
              >
                👥
              </button>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`p-2 rounded-full transition-all duration-200 ${showSearch ? 'bg-white bg-opacity-20 shadow-md' : 'hover:bg-white hover:bg-opacity-10'}`}
                title="Search Users"
              >
                🔎
              </button>
            </div>
          </div>

          {showSearch && (
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-white placeholder-white placeholder-opacity-70 bg-white bg-opacity-20 backdrop-blur-sm"
            />
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Site Users Section */}
          {showSiteUsers && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3">All Site Users</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {allUsers
                  .filter(u => u.uid !== user?.uid)
                  .map((siteUser) => (
                  <div key={siteUser.uid} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="relative mr-3">
                      {siteUser.photoURL ? (
                        <img
                          src={siteUser.photoURL}
                          alt={siteUser.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {siteUser.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {siteUser.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{siteUser.name}</p>
                      <p className="text-xs text-gray-500">
                        {siteUser.isOnline ? '🟢 Online' : '⚫ Offline'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedUser(siteUser);
                        setShowSiteUsers(false); // Close the users panel after selection
                      }}
                      className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Start Chat
                    </button>
                  </div>
                ))}
                {allUsers.filter(u => u.uid !== user?.uid).length === 0 && (
                  <p className="text-center text-gray-500 py-4">No other users found</p>
                )}
              </div>
            </div>
          )}

          {/* Users List */}
          <div className="space-y-1 p-2">
            {(showSearch ? allUsers : onlineUsers)
              .filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                user.uid !== user?.uid // Exclude current user from search
              )
              .map((user) => (
              <div
                key={user.uid}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${selectedUser?.uid === user.uid ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600'}`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center">
                  <div className="relative mr-4">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.name}
                        className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-lg font-bold text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-3 border-white dark:border-gray-800 animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold text-base ${selectedUser?.uid === user.uid ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {user.name}
                    </p>
                    <p className={`text-sm ${selectedUser?.uid === user.uid ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {showSearch ? (user.isOnline ? '🟢 Online' : '⚫ Offline') : '🟢 Online'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(showSearch ? allUsers : onlineUsers).length === 0 && (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">
                {showSearch ? 'No users found' : 'No users online'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Chat Header */}
        <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          {selectedUser ? (
            <div className="flex items-center">
              <div className="relative mr-4">
                {selectedUser.photoURL ? (
                  <img
                    src={selectedUser.photoURL}
                    alt={selectedUser.name}
                    className="w-14 h-14 rounded-full border-3 border-white dark:border-gray-800 shadow-lg"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-white">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {selectedUser.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white dark:border-gray-800 animate-pulse"></div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedUser.name}</h2>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  {selectedUser.isOnline ? '🟢 Online' : '⚫ Offline'}
                  {typingUsers.includes(selectedUser.uid) && <span className="text-blue-500 italic ml-2 animate-pulse">is typing...</span>}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">💬 Select a user to start chatting</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Choose someone from the sidebar to begin a conversation</p>
            </div>
          )}
        </div>

        {/* Message List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {selectedUser ? (
            messages
              .filter(msg =>
                (msg.senderId === user?.uid && msg.receiverId === selectedUser.uid) ||
                (msg.senderId === selectedUser.uid && msg.receiverId === user?.uid)
              )
              .map((msg) => {
                const isSent = msg.senderId === user?.uid;
                return (
                  <div key={msg.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
                    {/* Profile Image (only for received messages) */}
                    {!isSent && (
                      <div className="flex items-start mr-3">
                        {userProfiles[msg.senderId] ? (
                          <img
                            src={userProfiles[msg.senderId]}
                            alt={msg.senderName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-600 dark:text-gray-300 text-sm font-semibold">
                              {(msg.senderName || 'A').charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`rounded-xl px-5 py-3 max-w-2xl shadow-md ${isSent ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                      {/* Sender Name (only for received messages) */}
                      {!isSent && (
                        <p className="text-xs font-medium mb-1 opacity-75">
                          {msg.senderName || 'Anonymous'}
                        </p>
                      )}
                      <p className="text-sm break-words">{msg.text}</p>
                      <p className="text-xs mt-1 text-right opacity-50">
                        {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString() : 'Just now'}
                      </p>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-blue-500 dark:text-gray-300">💬</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Start a conversation
                </h3>
                <p className="text-gray-500 dark:text-gray-400">Select a user from the sidebar to begin chatting</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="pb-2" />
        </div>

        {/* Message Input */}
        <div className="sticky bottom-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          {user && selectedUser ? (
            <div className="flex items-center space-x-3">
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
              <button className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={handleAttachment}>
                <i className="fas fa-paperclip text-gray-500 dark:text-gray-400"></i>
              </button>
              <input
                type="text"
                placeholder={`Message ${selectedUser.name}...`}
                className="flex-1 px-5 py-3 border-0 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  if (e.target.value.length > 0 && !isTyping) {
                    setIsTyping(true);
                    handleTyping(true);
                  } else if (e.target.value.length === 0 && isTyping) {
                    setIsTyping(false);
                    handleTyping(false);
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                    setIsTyping(false);
                    handleTyping(false);
                  }
                }}
              />
              <button className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={handleRecord}>
                <i className={`fas fa-microphone ${isRecording ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}></i>
              </button>
              <button
                onClick={() => {
                  handleSendMessage();
                  setIsTyping(false);
                  handleTyping(false);
                }}
                disabled={!newMessage.trim()}
                className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400">
                {user ? '👆 Select a user from the sidebar to start chatting' : '🔐 Please log in to send messages.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;