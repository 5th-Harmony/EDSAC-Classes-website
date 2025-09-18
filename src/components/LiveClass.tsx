import React, { useRef, useEffect, useState } from 'react';
import { useWebRTC } from '../hooks/useWebRTC';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface LiveClassProps {
  roomId: string;
  token: string;
}

export const LiveClass: React.FC<LiveClassProps> = ({ roomId, token }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isVideoStarted, setIsVideoStarted] = useState(false);

  const {
    isConnected,
    peers,
    localStream,
    remoteStreams,
    joinRoom,
    startVideo,
    stopVideo,
    sendChatMessage
  } = useWebRTC({
    roomId,
    token,
    onPeerJoined: (peer) => {
      console.log('Peer joined:', peer.userName);
    },
    onPeerLeft: (peer) => {
      console.log('Peer left:', peer.userName);
    },
    onChatMessage: (message) => {
      setChatMessages(prev => [...prev, message]);
    }
  });

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (isConnected) {
      joinRoom();
    }
  }, [isConnected]);

  const handleStartVideo = async () => {
    await startVideo();
    setIsVideoStarted(true);
  };

  const handleStopVideo = () => {
    stopVideo();
    setIsVideoStarted(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendChatMessage(newMessage);
      setChatMessages(prev => [...prev, {
        userName: 'You',
        message: newMessage,
        timestamp: new Date().toISOString()
      }]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Video Area */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4 h-full">
          {/* Local Video */}
          <Card>
            <CardHeader>
              <CardTitle>Your Video</CardTitle>
            </CardHeader>
            <CardContent>
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-64 bg-gray-900 rounded"
              />
              <div className="mt-4 space-x-2">
                {!isVideoStarted ? (
                  <Button onClick={handleStartVideo}>Start Video</Button>
                ) : (
                  <Button onClick={handleStopVideo} variant="destructive">
                    Stop Video
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Remote Videos */}
          <Card>
            <CardHeader>
              <CardTitle>Participants ({peers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {Array.from(remoteStreams.entries()).map(([streamId, stream]) => (
                  <RemoteVideo key={streamId} stream={stream} />
                ))}
                {peers.map(peer => (
                  <div key={peer.id} className="p-2 bg-gray-100 rounded">
                    <span className="font-medium">{peer.userName}</span>
                    <span className="ml-2 text-sm text-gray-600">({peer.role})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-80 border-l p-4">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {chatMessages.map((msg, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded">
                  <div className="font-medium text-sm">{msg.userName}</div>
                  <div className="text-sm">{msg.message}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Remote Video Component
const RemoteVideo: React.FC<{ stream: MediaStream }> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="w-full h-32 bg-gray-900 rounded"
    />
  );
};
