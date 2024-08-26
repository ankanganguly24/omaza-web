import { motion } from 'framer-motion';
import { Button, Heading, Text, Grid, GridItem } from '@chakra-ui/react';
import React, { useState } from 'react';

import Logo from '@/components/icons/Logo';
import LoginModal from '@/components/auth/LoginModal';

export default function Landing() {
  const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  const handleJoinNowClick = () => {
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };
  // Animation variants for the first section
  const pyramidVariants = {
    hidden: { opacity: 0, x: -100, y: 0 },
    visible: (i: number) => ({
      opacity: 1,
      x: 5,
      y: [-60, -40, 60, -80, 100, 0], // Creating the "A" shape
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
        duration: 1.5,
        delay: i * 0.3, // Stagger effect
        ease: 'easeInOut',
      },
    }),
  };

  // Animation variants for the second section
  // const itemVariants = {
  //   hidden: { opacity: 0, y: 50 },
  //   visible: (i: number) => ({
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       type: 'spring',
  //       stiffness: 100,
  //       damping: 10,
  //       duration: 1.5,
  //       delay: i * 0.3, // Stagger effect
  //       ease: 'easeInOut',
  //     },
  //   }),
  // };

  return (
    <Grid maxW="100vw">
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <GridItem colSpan={2} h={{ base: '150', md: '200' }} w="100">
        <Logo />
      </GridItem>
      <GridItem
        colSpan={{ base: 6, md: 3 }}
        px={{ base: 0.5, md: 36 }}
        display="flex"
        flexDirection={{ base: 'column', lg: 'row' }}
        alignItems="center"
        justifyContent="center"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={pyramidVariants}
          className="text-center"
        >
          <Heading
            as={motion.h1}
            size={{ base: '2xl', md: '4xl' }}
            fontWeight="bold"
            mb={{ base: 2, md: 14 }}
            variants={pyramidVariants}
          >
            Connect with people using{' '}
            <Text as="span" fontFamily="cursive" fontWeight="light">
              callpe
            </Text>
          </Heading>

          <Text
            as={motion.h2}
            fontSize={{ base: 'lg', md: '2xl' }}
            mb={6}
            maxW={{ base: '80%', md: '75%' }}
            variants={pyramidVariants}
          >
            Helping you stay connected with a community of users through an
            easy-to-use interface, offering secure and seamless communication.
          </Text>

          <motion.div variants={pyramidVariants}>
            <Button
              bg="brand.400"
              color="black"
              fontSize="lg"
              rounded="lg"
              py={{ base: 4, md: 8 }}
              px={{ base: 4, md: 8 }}
              onClick={handleJoinNowClick}
            >
              Join now
            </Button>
          </motion.div>
        </motion.div>

        {/* 2nd section */}
      </GridItem>
    </Grid>
  );
}
