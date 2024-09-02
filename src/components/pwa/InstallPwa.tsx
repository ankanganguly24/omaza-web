import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  Icon,
  useDisclosure,
} from '@chakra-ui/react';
import { MdInstallMobile } from 'react-icons/md';

// Define the BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Define props interface if needed (empty for now, but useful for future extensions)
interface InstallPWAProps {}

const InstallPWA: React.FC<InstallPWAProps> = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const checkPlatform = (): void => {
      const isIOSDevice =
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as any).MSStream;
      setIsIOS(isIOSDevice);
    };

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent): void => {
      e.preventDefault();
      setDeferredPrompt(e);
      onOpen();
    };

    if (typeof window !== 'undefined') {
      checkPlatform();

      if (isIOS) {
        const timer = setTimeout(() => {
          onOpen();
        }, 3000);

        return () => clearTimeout(timer);
      } else {
        window.addEventListener(
          'beforeinstallprompt',
          handleBeforeInstallPrompt as EventListener
        );
        return () => {
          window.removeEventListener(
            'beforeinstallprompt',
            handleBeforeInstallPrompt as EventListener
          );
        };
      }
    }
  }, [isIOS, onOpen]);

  const handleInstallClick = async (): Promise<void> => {
    if (isIOS) {
      alert(
        'To install the app, tap the share button in Safari and then "Add to Home Screen".'
      );
    } else if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
      } catch (error) {
        console.error('Error in install process:', error);
      } finally {
        setDeferredPrompt(null);
      }
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Install To Be Honest</ModalHeader>
        <ModalBody>
          <VStack spacing={4} align="center">
            <Icon as={MdInstallMobile} w={12} h={12} color="orange.400" />
            <Text textAlign="center">
              Install the "To Be Honest" app for a better experience on your
              mobile device.
            </Text>
            {isIOS && (
              <Text fontSize="sm" color="gray.500">
                To install, tap the share button in Safari and then "Add to Home
                Screen".
              </Text>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={3}>
            <Button colorScheme="orange" onClick={handleInstallClick}>
              {isIOS ? 'Got it' : 'Install'}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Later
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InstallPWA;
