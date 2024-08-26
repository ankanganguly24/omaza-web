import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Image,
  Text,
  Badge,
  Button,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { FaWhatsapp, FaHeart } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

import { apiGet } from '@/utils/api';
import Language from '@/components/icons/Language';

// Define a type that represents the structure of the data
type StreamerDetails = {
  profilePic?: string;
  name?: string;
  age?: number;
  city?: string;
  online?: boolean;
  busy?: boolean;
  aboutMe?: string;
  languages?: string[];
  interests?: string[];
  followerCount?: number;
};

const fetchStreamerDetails = async (id: string): Promise<StreamerDetails> => {
  const response = await apiGet<StreamerDetails>(
    `/user/streamer/details?streamerId=${id}`
  );
  return response;
};

const StreamerDetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const streamerId = Array.isArray(id) ? id[0] : id;

  const { data, error, isLoading } = useQuery<StreamerDetails, Error>({
    queryKey: ['streamer', streamerId],
    queryFn: () => fetchStreamerDetails(streamerId as string),
    enabled: !!streamerId,
  });

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return <Text color="red.500">Error: {error.message}</Text>;
  }

  if (!data) {
    return <Text>No details found for this streamer.</Text>;
  }

  const getStatus = (streamer: StreamerDetails) => {
    if (streamer.busy) return 'Busy';
    if (streamer.online) return 'Online';
    return 'Offline';
  };

  const statusColorScheme =
    getStatus(data) === 'Busy'
      ? 'yellow'
      : getStatus(data) === 'Online'
      ? 'green'
      : 'red';

  return (
    <Box
      p={5}
      maxW="lg"
      mx="auto"
      mt={10}
      bg={useColorModeValue('white', 'gray.800')}
      borderRadius="lg"
      shadow="lg"
      border="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <VStack spacing={5} align="start">
        <Flex alignItems="center" w="full">
          <Image
            src={data.profilePic}
            alt={data.name || 'Streamer'}
            boxSize="120px"
            borderRadius="full"
            shadow="lg"
            mr={4}
          />
          <VStack align="start" spacing={1}>
            <HStack>
              <Text fontSize="2xl" fontWeight="bold">
                {data.name}
              </Text>
              <Badge
                colorScheme={statusColorScheme}
                borderRadius="full"
                px={2}
                fontSize="sm"
              >
                {getStatus(data)}
              </Badge>
            </HStack>
            <HStack spacing={2}>
              <Language width={20} height={20} color="gray" />
              <Text fontSize="sm" color="gray.500">
                {data.languages?.join(', ')}
              </Text>
            </HStack>
            <HStack spacing={2}>
              <MdLocationOn color="gray" />
              <Text fontSize="sm" color="gray.500">
                {data.city}
              </Text>
            </HStack>
            <Text fontSize="sm" color="gray.500">
              {data.followerCount} Followers | Age: {data.age}
            </Text>
          </VStack>
        </Flex>

        <Flex w="full" justifyContent="space-between">
          <Button size="lg" leftIcon={<FaHeart />} flex="1" mr={2}>
            Follow
          </Button>
          <IconButton
            icon={<FaWhatsapp />}
            colorScheme="whatsapp"
            aria-label="Whatsapp"
            variant="solid"
            isRound
            size="lg"
          />
        </Flex>

        <Box
          mt={5}
          p={4}
          bg={useColorModeValue('gray.100', 'gray.700')}
          borderRadius="md"
          w="full"
          border="1px"
          borderColor={useColorModeValue('gray.300', 'gray.600')}
        >
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            About Me:
          </Text>
          <Text fontSize="md" color="gray.800">
            {data.aboutMe || 'This user has not provided any information.'}
          </Text>
        </Box>

        {data.interests && data.interests.length > 0 && (
          <Box mt={5} w="full">
            <Text fontSize="lg" fontWeight="bold">
              Talks About:
            </Text>
            <HStack mt={2} spacing={2} wrap="wrap">
              {data.interests.map((interest) => (
                <Badge
                  key={interest}
                  colorScheme="blue"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                >
                  {interest}
                </Badge>
              ))}
            </HStack>
          </Box>
        )}

        <HStack mt={8} spacing={4} justifyContent="space-between" w="full">
          <Button colorScheme="teal" variant="outline">
            Say Hi
          </Button>
          <Button>Call</Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default StreamerDetailsPage;
