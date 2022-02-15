import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";

// FIXME Default timeout is often exceeded on our CI
const TESTING_LIBRARY_TIMEOUT = 30000;
const JEST_TIMEOUT = TESTING_LIBRARY_TIMEOUT * 2;
jest.setTimeout(JEST_TIMEOUT);
configure({ asyncUtilTimeout: TESTING_LIBRARY_TIMEOUT });

fetchMock.enableMocks();

export {};
