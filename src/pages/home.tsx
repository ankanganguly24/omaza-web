import React from 'react';
import {
  Box,
  Image,
  Text,
  Badge,
  Button,
  HStack,
  Flex,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';

import {
  Streamer,
  useFetchStreamers,
} from '@/hooks/streamers/useFetchStreamers';
import { useInfiniteScroll } from '@/hooks/util/useInfiniteScroll';
import Language from '@/components/icons/Language'; // Importing the Language icon

const Home: React.FC = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useFetchStreamers();

  const observerRef = useInfiniteScroll(
    fetchNextPage,
    hasNextPage!,
    isFetchingNextPage
  );

  // Determine the status based on priority
  const getStatus = (streamer: Streamer) => {
    if (streamer.busy) return 'Busy';
    if (streamer.online) return 'Online';
    return 'Offline';
  };

  // Handle loading state
  if (status === 'pending')
    return (
      <Box textAlign="center" mt={10}>
        <Text>Loading...</Text>
      </Box>
    );

  // Handle error state
  if (status === 'error')
    return (
      <Box textAlign="center" mt={10}>
        <Text>Error: {(error as Error).message}</Text>
      </Box>
    );

  // Render the list of streamers with infinite scroll
  return (
    <Box p={5} bg="gray.100" minH="100vh" px={{ base: 5, lg: 10 }}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.map((streamer) => (
              <Box
                key={streamer.id}
                p={6}
                shadow="lg"
                borderWidth="1px"
                borderRadius="md"
                bg="white"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                transition="transform 0.2s"
                _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}
              >
                <Flex alignItems="center">
                  <Image
                    src={streamer.profilePic}
                    alt={streamer.name}
                    boxSize="80px"
                    borderRadius="full"
                    mr={4}
                  />
                  <Box>
                    <Text fontSize="lg" fontWeight="bold">
                      {streamer.name}, {streamer.age}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {streamer.city}
                    </Text>
                    <Badge
                      colorScheme={
                        getStatus(streamer) === 'Busy'
                          ? 'yellow'
                          : getStatus(streamer) === 'Online'
                          ? 'green'
                          : 'red'
                      }
                      mt={2}
                    >
                      {getStatus(streamer)}
                    </Badge>
                  </Box>
                </Flex>
                <Text mt={4} fontSize="md" color="gray.800" lineHeight="1.6">
                  {streamer.aboutMe}
                </Text>
                {streamer.languages && streamer.languages.length > 0 && (
                  <HStack spacing={2} mt={4} wrap="wrap" alignItems="center">
                    <Icon as={Language} w={5} h={5} color="blue.500" />
                    <Text fontSize="sm" color="gray.600">
                      {streamer.languages.join(', ')}
                    </Text>
                  </HStack>
                )}
                {streamer.interests && streamer.interests.length > 0 && (
                  <Text fontSize="sm" color="gray.600" mt={4}>
                    Talks About: {streamer.interests.join(', ')}
                  </Text>
                )}
                <HStack mt={6} justifyContent="space-between">
                  <Button colorScheme="orange" size="sm">
                    Talk Now
                  </Button>
                  <Button variant="outline" size="sm" colorScheme="gray">
                    View Profile
                  </Button>
                </HStack>
              </Box>
            ))}
          </React.Fragment>
        ))}
      </SimpleGrid>
      <div ref={observerRef}>
        {isFetchingNextPage && (
          <Text mt={6} textAlign="center">
            Loading more...
          </Text>
        )}
      </div>
    </Box>
  );
};

export default Home;
