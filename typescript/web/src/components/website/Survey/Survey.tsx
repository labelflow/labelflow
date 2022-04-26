import {
  Box,
  Center,
  useColorModeValue,
  Text,
  Heading,
} from "@chakra-ui/react";
import * as React from "react";
import { useRouter } from "next/router";

export const Survey = () => {
  const router = useRouter();

  const { email } = router.query;

  React.useEffect(() => {
    setTimeout(() => {
      document.getElementById("get-prio-access")?.click();
    }, 30);
  }, []);

  return (
    <Box as="section" bg={useColorModeValue("gray.50", "gray.800")} py="48">
      <Box
        maxW={{ base: "xl", md: "7xl" }}
        mx="auto"
        px={{ base: "6", md: "8" }}
        // dangerouslySetInnerHTML={
        //   email != null
        //     ? {
        //         __html: `<div class="typeform-widget" data-url="https://form.typeform.com/to/V7sQxTzy?typeform-medium=embed-snippet#email=${email}" style="width: 100%; height: 500px;"></div> <script> (function() { var qs,js,q,s,d=document, gi=d.getElementById, ce=d.createElement, gt=d.getElementsByTagName, id="typef_orm", b="https://embed.typeform.com/"; if(!gi.call(d,id)) { js=ce.call(d,"script"); js.id=id; js.src=b+"embed.js"; q=gt.call(d,"script")[0]; q.parentNode.insertBefore(js,q) } })() </script>`,
        //       }
        //     : undefined
        // }
      >
        {/* {email != null ? null : ( */}
        {/* <> */}
        <Heading align="center" fontWeight="extrabold" maxW="lg" mx="auto">
          Thank you!
        </Heading>
        <Text align="center" textAlign="center" maxW="lg" mx="auto" mt="12">
          <strong>To get priority in the queue</strong>, you can answer a couple
          additional questions that will help us focus our product to your need!
        </Text>
        <Text align="center" textAlign="center" maxW="lg" mx="auto" mt="12">
          In any case, we will come back to you as soon as we have a spot for
          you, at your email address {email}
        </Text>

        <Center mt="12">
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `<a id="get-prio-access" class="typeform-share button" href="https://form.typeform.com/to/V7sQxTzy?typeform-medium=embed-snippet#email=${email}" data-mode="popup" style="display:inline-block;text-decoration:none;background-color:#56D7D4;color:white;cursor:pointer;font-family:Helvetica,Arial,sans-serif;font-size:20px;line-height:50px;text-align:center;margin:0;height:50px;padding:0px 33px;border-radius:6px;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:bold;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;" data-size="100" target="_blank">Get priority access </a> <script> (function() { var qs,js,q,s,d=document, gi=d.getElementById, ce=d.createElement, gt=d.getElementsByTagName, id="typef_orm_share", b="https://embed.typeform.com/"; if(!gi.call(d,id)){ js=ce.call(d,"script"); js.id=id; js.src=b+"embed.js"; q=gt.call(d,"script")[0]; q.parentNode.insertBefore(js,q) } })() </script>`,
            }}
          />
        </Center>
        {/* </> */}
        {/* )} */}
      </Box>
    </Box>
  );
};
