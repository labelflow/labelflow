import { AspectRatio } from "@chakra-ui/react";
import * as React from "react";

const HOME_VIDEO_URL = "/static/img/home-video.webm";

export const HomeVideo = () => (
  <AspectRatio ratio={16 / 9}>
    <video playsInline autoPlay muted loop>
      <source src={HOME_VIDEO_URL} />
    </video>
  </AspectRatio>
);
