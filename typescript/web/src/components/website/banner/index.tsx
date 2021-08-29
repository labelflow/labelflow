import { Box, Button, Heading, Text, useTheme } from '@chakra-ui/react'
import * as React from 'react'

export const Banner = () => {
  const theme = useTheme()

  const color1 = theme?.colors?.brand?.["50"]
  const color2 = theme?.colors?.brand?.["500"]

  return (

    <Box as="section" background={'90deg, rgba(49,206,202,1) 0%, rgba(234,250,250,1) 100%'} 
      /*backgroundImage="url(/static/img/electricalpole-shot.png)"
      aria-label="Webinar banner"
      this was in the box under this one. 
        <Box background={`linear-gradient(90deg, #FFFFFF.4D 0%, ${color2} 100%)`} >
      */
    >
      <Box bgGradient="linear(to-r, rgba(123,223,221,1) , rgba(234,250,250,1))"  >
      <Box
        maxW="2xl"
        mx="auto"
        px={{ base: '6', lg: '8' }}
        py={{ base: '16', sm: '20' }}
        textAlign="center"
      >
        <Heading as="h2" size="3xl" fontWeight="extrabold" letterSpacing="tight">
         Webinar - Get an AI ready in a day!
        </Heading>
        <Text mt="4" fontSize="lg">
          From image labeling to training and testing a model,
          discover how to reach a usable model on a real use case: equipment detection on
          electrical distribution system.
          <br />
          <br />

          <b> Sept 28th - 4.30pm CET Time - Duration: 45min</b>
        </Text>
        <Button mt="8" as="a" href="https://app.livestorm.co/labelflow/get-an-ai-ready-in-1-day" target="blank" size="lg" colorScheme="brand" fontWeight="bold">
          Register now
        </Button>
      </Box>
    </Box>
    </Box>
  )
}



