import { chakra } from "@chakra-ui/react";
import Error from "../graphics/error";
import ConnectionOff from "../graphics/connection-off";
import CreditCard from "../graphics/credit-card";
import Image from "../graphics/image";
import ImageNotFound from "../graphics/image-not-found";
import Search from "../graphics/search";
import Coffee from "../graphics/coffee";

export const EmptyStateError = chakra(Error, {
  baseStyle: {
    width: 250,
    height: 250,
    padding: 6,
    opacity: 1,
    boxSizing: "border-box",
  },
});

export const EmptyStateNoConnection = chakra(ConnectionOff, {
  baseStyle: {
    width: 250,
    height: 250,
    padding: 6,
    opacity: 1,
    boxSizing: "border-box",
  },
});

export const EmptyStateNoCreditCard = chakra(CreditCard, {
  baseStyle: {
    width: 250,
    height: 250,
    padding: 6,
    opacity: 1,
    boxSizing: "border-box",
  },
});

export const EmptyStateNoImages = chakra(Image, {
  baseStyle: {
    width: 250,
    height: 250,
    padding: 6,
    opacity: 0.7,
    boxSizing: "border-box",
  },
});

export const EmptyStateImageNotFound = chakra(ImageNotFound, {
  baseStyle: {
    width: 250,
    height: 250,
    padding: 6,
    boxSizing: "border-box",
  },
});

export const EmptyStateNoSearchResult = chakra(Search, {
  baseStyle: {
    width: 250,
    height: 250,
    padding: 6,
    opacity: 0.7,
    boxSizing: "border-box",
  },
});

export const EmptyStateNoTasks = chakra(Coffee, {
  baseStyle: {
    width: 250,
    height: 250,
    padding: 6,
    opacity: 1,
    boxSizing: "border-box",
  },
});
