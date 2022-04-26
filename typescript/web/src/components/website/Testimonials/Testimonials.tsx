import { Box, SimpleGrid, useColorModeValue, Heading } from "@chakra-ui/react";
import * as React from "react";
import { Testimonial } from "./Testimonial";

export const Testimonials = () => {
  return (
    <Box as="section" bg={useColorModeValue("gray.50", "gray.800")} py="48">
      <Box
        maxW={{ base: "xl", md: "7xl" }}
        mx="auto"
        px={{ base: "6", md: "8" }}
      >
        <Heading align="center" fontWeight="extrabold" maxW="lg" mx="auto">
          Stay in control, plug your own backend
        </Heading>
        <SimpleGrid
          mt="24"
          columns={{ base: 1, lg: 2 }}
          spacing={{ base: "16", lg: "32" }}
        >
          <Testimonial
            name="Mark Zoidberg"
            job="Founder @ Fakebooth"
            image="https://images.unsplash.com/photo-1571175351749-e8d06f275d85?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTk0fHxsYWR5JTIwc21pbGluZ3xlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
          >
            I was able to validate my SaaS idea in a couple hours of
            development, and the codebase was super easy to get into
          </Testimonial>
          <Testimonial
            name="Jeff Bozo"
            job="Engineering Manager @ Armazone"
            image="https://images.unsplash.com/photo-1603987248955-9c142c5ae89b?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjJ8fGhhbmRzb21lJTIwbWFuJTIwc21pbGluZ3xlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
          >
            With no experience in Software development, I didn&apos;t think I
            could start a SaaS business. But I did!
          </Testimonial>
          <Testimonial
            name="Etron Must"
            job="Lead Engineer @ Pesta motors"
            image="https://images.unsplash.com/photo-1618085220188-b4f210d22703?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80"
          >
            I was able to monetize my domain knowledge by creating a SaaS which
            automates most of my consulting work
          </Testimonial>
          <Testimonial
            name="Bill Kates"
            job="CEO @ Necrosoft"
            image="https://images.unsplash.com/photo-1616497925804-78987151de78?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80"
          >
            It&apos;s like Visual Basic and Excel, but 30 years later and
            cloud-native!
          </Testimonial>
        </SimpleGrid>
      </Box>
    </Box>
  );
};
