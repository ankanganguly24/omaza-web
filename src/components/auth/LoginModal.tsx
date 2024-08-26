import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Input,
  FormControl,
  FormLabel,
  Text,
  VStack,
  Divider,
  useBreakpointValue,
} from '@chakra-ui/react';

import { apiPost } from '@/utils/api';
// import FcGoogle from '@/components/icons/Logo'; // For Google Icon

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSendOtp = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await apiPost(
        '/login/send-otp',
        { mobile: mobileNumber },
        false
      );
      setSuccessMessage('OTP sent successfully!');
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const modalSize = useBreakpointValue({ base: 'full', md: 'md' });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={modalSize}>
      <ModalOverlay />
      <ModalContent p={4}>
        <ModalHeader textAlign="center">Login Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {/* <HStack spacing={2} width="100%" justifyContent="center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log('Switch to Email login')}
                isActive={true}
              >
                Email
              </Button>
              <Button
                variant="solid"
                size="sm"
                colorScheme="teal"
                onClick={() => console.log('Switch to Phone login')}
              >
                Phone Number
              </Button>
            </HStack> */}
            <FormControl id="mobileNumber" isRequired>
              <FormLabel>Mobile Number</FormLabel>
              <Input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter your mobile number"
              />
            </FormControl>
            {error && (
              <Text color="red.500" mt={2}>
                {error}
              </Text>
            )}
            {successMessage && (
              <Text color="green.500" mt={2}>
                {successMessage}
              </Text>
            )}
            <Button
              width="100%"
              colorScheme="teal"
              onClick={handleSendOtp}
              isLoading={isLoading}
            >
              Request OTP
            </Button>
            <Divider />
            <Button
              //   leftIcon={<Icon as={FcGoogle} />}
              width="100%"
              variant="outline"
              colorScheme="teal"
              onClick={() => console.log('Google login')}
            >
              Sign in with Google
            </Button>
            {/* <Text fontSize="sm">
              Not registered yet?{' '}
              <Text as="span" color="orange.400">
                Create an Account
              </Text>
            </Text> */}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
