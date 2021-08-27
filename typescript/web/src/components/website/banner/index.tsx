import { Box, Button, Heading, Text } from '@chakra-ui/react'
import * as React from 'react'

export const Banner = () => (
  <Box as="section">
    <Box
      maxW="2xl"
      mx="auto"
      px={{ base: '6', lg: '8' }}
      py={{ base: '16', sm: '20' }}
      textAlign="center"
    >
      <Heading as="h2" size="3xl" fontWeight="extrabold" letterSpacing="tight">
        Ready to Grow?
      </Heading>
      <Text mt="4" fontSize="lg">
        Ac euismod vel sit maecenas id pellentesque eu sed consectetur. Malesuada adipiscing
        sagittis vel nulla nec.
      </Text>
      <Button mt="8" as="a" href="#" size="lg" colorScheme="brand" fontWeight="bold">
        Start Free Trial
      </Button>
    </Box>
  </Box>
)