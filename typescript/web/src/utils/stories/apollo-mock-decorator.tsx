import { Story } from "@storybook/react";
import { WildcardMockLink } from "wildcard-mock-link";
import {
  ApolloMockResponses,
  getApolloMockWrapper,
} from "../tests/apollo-mock";

export const getApolloMockDecorator =
  (data?: WildcardMockLink | ApolloMockResponses) =>
  (StoryComponent: Story) => {
    const Wrapper = getApolloMockWrapper(data);
    return (
      <Wrapper>
        <StoryComponent />
      </Wrapper>
    );
  };

export const apolloMockDecorator = getApolloMockDecorator();
