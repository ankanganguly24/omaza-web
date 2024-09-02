import React, { useState, useRef } from 'react';
import { Box, Button, Text, Spinner, HStack, Flex } from '@chakra-ui/react';

import { apiGet, apiPost } from '@/utils/api';

const VideoCallPage: React.FC = () => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRoomJoined, setIsRoomJoined] = useState<boolean>(false);
  const [stopPolling, setStopPolling] = useState<boolean>(false);

  const opponentId = 2123; // Replace with the actual opponent ID
  const pollingInterval = 1000; // Poll every second

  const initiateCall = async (type: 'video' | 'audio') => {
    setLoading(true);
    setError(null);
    setDetails(null);
    setIsRoomJoined(false);
    setVideoId(null);
    setStopPolling(false);

    try {
      const endpoint = `/video/call/${
        type === 'video' ? 'create' : 'audio-create'
      }?opponentId=${opponentId}`;
      const response = await apiPost<{ agoraChannelName: string; id: string }>(
        endpoint,
        null,
        true
      );

      if (!response || !response.id) {
        throw new Error('Failed to initiate the call. Please try again.');
      }

      const { id } = response;
      setVideoId(id);
      await fetchCallDetailsWithPolling(id);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCallDetailsWithPolling = async (videoId: string) => {
    const poll = async () => {
      if (stopPolling) return;

      try {
        const endpoint = `/video/call/details?videoId=${videoId}`;
        const data = await apiGet<any>(endpoint, true);
        setDetails(data);

        if (data.streamerJoined) {
          await setupZegoUIKit(
            data.agoraChannelName,
            data.userId.toString(),
            data.userDetails?.name || `user_${data.userId}`,
            data.agoraUserToken,
            data.agoraStreamerToken
          );
          setStopPolling(true);
        } else if (data.status === 'ended') {
          setStopPolling(true);
        } else {
          setTimeout(poll, pollingInterval);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(
            err.message ||
              'An unexpected error occurred while fetching call details.'
          );
          setStopPolling(true);
        }
      }
    };

    poll(); // Start polling
  };

  const setupZegoUIKit = async (
    roomId: string,
    userId: string,
    userName: string,
    userToken: string,
    streamerToken: string
  ) => {
    try {
      if (isRoomJoined) {
        console.log('Room already joined, skipping joinRoom call.');
        return;
      }

      console.log('Importing Zego UIKit...');
      const { ZegoUIKitPrebuilt } = await import(
        '@zegocloud/zego-uikit-prebuilt'
      );

      const appID = parseInt(process.env.NEXT_PUBLIC_APP_ID || '0', 10);

      if (isNaN(appID) || appID === 0) {
        console.error('App ID is not a valid number');
        return;
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        appID,
        userToken,
        roomId,
        userId
      );

      console.log('Creating Zego UIKit instance with token...');
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      if (!zp) {
        throw new Error('Failed to create Zego UIKit instance.');
      }

      console.log('Joining room with Zego UIKit...');

      if (containerRef.current) {
        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showPreJoinView: false,
          branding: {
            logoURL: '/icon.png',
          },
        });

        setIsRoomJoined(true); // Set the flag after joining the room
        console.log('Successfully joined the room.');
      } else {
        throw new Error('Container reference is null. Unable to join room.');
      }
    } catch (error: any) {
      setError(error.message);
      console.error('Error setting up Zego UIKit:', error.message);
    }
  };

  return (
    <Flex p={5} bg="gray.100" minH="50vh" direction="column">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Video/Audio Call
      </Text>
      <HStack spacing={4} mb={4}>
        <Button colorScheme="blue" onClick={() => initiateCall('video')}>
          Initiate Video Call
        </Button>
        <Button colorScheme="teal" onClick={() => initiateCall('audio')}>
          Initiate Audio Call
        </Button>
      </HStack>

      {loading && (
        <Box textAlign="center" mt={10}>
          <Spinner size="xl" />
          <Text mt={4}>Loading...</Text>
        </Box>
      )}

      {error && (
        <Box textAlign="center" mt={10}>
          <Text color="red.500">Error: {error}</Text>
        </Box>
      )}

      <Box
        ref={containerRef}
        bg="white"
        p={4}
        borderRadius="md"
        shadow="md"
        flex="1"
        maxW="100%"
        maxH="50vh"
        overflow="hidden"
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {!loading && !error && !details && (
          <Text fontSize="lg">Ready to join the room...</Text>
        )}

        {isRoomJoined && (
          <Box
            as="video"
            width="100%"
            height="100%"
            objectFit="contain"
            ref={containerRef}
          />
        )}
      </Box>

      {details && (
        <Box
          bg="white"
          p={4}
          borderRadius="md"
          shadow="md"
          mt={4}
          maxH="20vh"
          overflowY="auto"
        >
          <Text fontSize="lg">Call ID: {details.id}</Text>
          <Text fontSize="lg">
            Participant: {details.userDetails?.name || 'Unknown'}
          </Text>
          <Text fontSize="lg">Status: {details.status}</Text>
          <Text fontSize="lg">
            Start Time:{' '}
            {details.startTime
              ? new Date(details.startTime).toLocaleString()
              : 'Not started'}
          </Text>
        </Box>
      )}
    </Flex>
  );
};

export default VideoCallPage;
