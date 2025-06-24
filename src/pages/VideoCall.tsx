import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  Monitor,
  MessageCircle,
  Settings,
  Users,
  MoreVertical,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { mockDeals, mockUsers } from '../data/mockData';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const VideoCall: React.FC = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const deal = mockDeals.find(d => d.id === dealId);
  const otherUserId = deal?.buyerId === user?.id ? deal?.sellerId : deal?.buyerId;
  const otherUser = mockUsers.find(u => u.id === otherUserId);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    try {
      // Mock WebRTC setup - in real implementation, you'd initialize WebRTC here
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setIsCallActive(true);
    } catch (error) {
      console.error('Error starting call:', error);
      // In a real app, show error message to user
    }
  };

  const endCall = () => {
    // Stop all media tracks
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    setIsCallActive(false);
    setCallDuration(0);
    navigate(`/deals/${dealId}/chat`);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In real implementation, mute/unmute audio track
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // In real implementation, enable/disable video track
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // In real implementation, start/stop screen sharing
  };

  if (!deal || !otherUser) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Deal not found
          </h3>
          <Button onClick={() => navigate('/deals')}>
            Back to Deals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/deals/${dealId}/chat`)}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="text-white hover:bg-gray-700"
          >
            Back to Chat
          </Button>
          
          <div>
            <h3 className="font-semibold">{deal.title}</h3>
            <p className="text-sm text-gray-300">
              {isCallActive ? `Call with ${otherUser.name} • ${formatDuration(callDuration)}` : 'Video Call'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<MessageCircle className="h-4 w-4" />}
            className="text-white hover:bg-gray-700"
          >
            Chat
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Settings className="h-4 w-4" />}
            className="text-white hover:bg-gray-700"
          >
            Settings
          </Button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {!isCallActive ? (
          /* Pre-call Screen */
          <div className="h-full flex items-center justify-center">
            <Card className="max-w-md w-full mx-4">
              <div className="text-center">
                <div className="mx-auto h-20 w-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-6">
                  {otherUser.avatar ? (
                    <img
                      src={otherUser.avatar}
                      alt={otherUser.name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {otherUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Start Video Call
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Ready to call {otherUser.name}?
                </p>
                
                <div className="space-y-4">
                  <Button
                    onClick={startCall}
                    size="lg"
                    fullWidth
                    leftIcon={<Video className="h-5 w-5" />}
                  >
                    Start Video Call
                  </Button>
                  
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      leftIcon={isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      onClick={toggleMute}
                    >
                      {isMuted ? 'Unmute' : 'Mute'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      leftIcon={isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                      onClick={toggleVideo}
                    >
                      {isVideoOff ? 'Turn On' : 'Turn Off'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          /* Active Call Screen */
          <div className="h-full relative">
            {/* Remote Video */}
            <div className="h-full w-full bg-gray-800 flex items-center justify-center">
              <video
                ref={remoteVideoRef}
                className="h-full w-full object-cover"
                autoPlay
                playsInline
              />
              
              {/* Mock remote user when no video */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  {otherUser.avatar ? (
                    <img
                      src={otherUser.avatar}
                      alt={otherUser.name}
                      className="h-32 w-32 rounded-full object-cover mx-auto mb-4"
                    />
                  ) : (
                    <div className="h-32 w-32 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl font-bold text-white">
                        {otherUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold">{otherUser.name}</h3>
                  <p className="text-gray-300">Connected</p>
                </div>
              </div>
            </div>

            {/* Local Video (Picture-in-Picture) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-white shadow-lg"
            >
              <video
                ref={localVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              
              {isVideoOff && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <VideoOff className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              {/* Local video controls */}
              <div className="absolute bottom-2 right-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleVideo}
                  className="text-white hover:bg-gray-600"
                >
                  {isVideoOff ? <VideoOff className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                </Button>
              </div>
            </motion.div>

            {/* Call Status */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {formatDuration(callDuration)}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {isCallActive && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-6 bg-gray-800"
        >
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant={isMuted ? "danger" : "ghost"}
              size="lg"
              onClick={toggleMute}
              className={`rounded-full w-12 h-12 ${
                isMuted 
                  ? 'bg-error-600 hover:bg-error-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <Button
              variant={isVideoOff ? "danger" : "ghost"}
              size="lg"
              onClick={toggleVideo}
              className={`rounded-full w-12 h-12 ${
                isVideoOff 
                  ? 'bg-error-600 hover:bg-error-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>

            <Button
              variant={isScreenSharing ? "primary" : "ghost"}
              size="lg"
              onClick={toggleScreenShare}
              className={`rounded-full w-12 h-12 ${
                isScreenSharing 
                  ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              <Monitor className="h-5 w-5" />
            </Button>

            <Button
              variant={isSpeakerOn ? "ghost" : "danger"}
              size="lg"
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`rounded-full w-12 h-12 ${
                isSpeakerOn 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-error-600 hover:bg-error-700 text-white'
              }`}
            >
              {isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>

            <Button
              variant="danger"
              size="lg"
              onClick={endCall}
              className="rounded-full w-12 h-12 bg-error-600 hover:bg-error-700 text-white"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VideoCall;