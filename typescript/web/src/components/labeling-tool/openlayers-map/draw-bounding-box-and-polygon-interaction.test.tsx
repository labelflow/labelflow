// @ts-ignore Needs to be done before ol is imported
global.URL.createObjectURL = jest.fn(() => "mockedUrl");

import { Map } from "@labelflow/react-openlayers-fiber";
import { render, waitFor, screen, act } from "@testing-library/react";
import { Feature, Map as OlMap } from "ol";
import { Vector as OlSourceVector } from "ol/source";
import { Geometry } from "ol/geom";
import Polygon, { fromExtent } from "ol/geom/Polygon";
import { DrawEvent, DrawEventType } from "ol/interaction/Draw";
import { MockedProvider as MockedApolloProvider } from "@apollo/client/testing";
import { BASIC_IMAGE_DATA } from "../../../utils/fixtures";
import { mockNextRouter } from "../../../utils/tests/router-mocks";

mockNextRouter({ query: { imageId: BASIC_IMAGE_DATA.id } });

import { useUndoStore } from "../../../connectors/undo-store";
import { useLabelingStore, Tools } from "../../../connectors/labeling-state";
import { ApolloMockResponses, getApolloMockLink } from "../../../utils/tests";
import { DrawInteraction } from "./draw-interaction";
import {
  APOLLO_MOCKS,
  CREATE_LABEL_ACTION_MOCK,
  DELETE_LABEL_ACTION_MOCK,
  ERROR_CREATE_LABEL_ACTION_MOCK,
} from "./draw-bounding-box-and-polygon-interaction.fixtures";

// Disabled/mocked due to part of the code throwing an error if the cache doesn't contain the image
jest.mock(
  "../../../connectors/undo-store/effects/cache-updates/create-label-mutation-update"
);

beforeEach(() => {
  useLabelingStore.setState({ selectedTool: Tools.BOX });
  jest.clearAllMocks();
});

const renderDrawInteraction = (mocks?: ApolloMockResponses) => {
  const mapRef: { current: OlMap | null } = { current: null };
  const iogSpinnerRef: { current: HTMLDivElement | null } = { current: null };
  const sourceVectorLabelsRef: { current: OlSourceVector<Geometry> | null } = {
    current: null,
  };
  const mockLink = getApolloMockLink(mocks ?? APOLLO_MOCKS);
  render(
    <DrawInteraction
      iogSpinnerRef={iogSpinnerRef}
      sourceVectorLabelsRef={sourceVectorLabelsRef}
    />,
    {
      wrapper: ({ children }) => (
        <Map
          args={{ interactions: [] }}
          ref={(map) => {
            mapRef.current = map;
          }}
        >
          <MockedApolloProvider link={mockLink}>
            {children}
          </MockedApolloProvider>
        </Map>
      ),
    }
  );
  return { mapRef, iogSpinnerRef, sourceVectorLabelsRef, mockLink };
};

const basicBoxDrawExpectedMutationVars = expect.objectContaining({
  data: expect.objectContaining({
    imageId: BASIC_IMAGE_DATA.id,
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [100, 200],
          [100, 300],
          [200, 300],
          [200, 200],
          [100, 200],
        ],
      ],
    },
  }),
});

const renderDrawInteractionWithBasicBox = async (
  mocks?: ApolloMockResponses
) => {
  const { mapRef, mockLink } = renderDrawInteraction(mocks);
  const drawInteraction = mapRef.current?.getInteractions().getArray()?.[0];
  drawInteraction?.dispatchEvent(
    new DrawEvent(
      "drawend" as DrawEventType,
      new Feature(fromExtent([100, 200, 200, 300]))
    )
  );
  await act(() => mockLink.waitForAllResponses());
  return mockLink;
};

describe(DrawInteraction, () => {
  it("creates a label when the user has finished to draw a bounding box on the labeling interface", async () => {
    await renderDrawInteractionWithBasicBox();
    expect(CREATE_LABEL_ACTION_MOCK.result).toHaveBeenCalledWith(
      basicBoxDrawExpectedMutationVars
    );
  });

  it("is possible to undo the creation of the label", async () => {
    await renderDrawInteractionWithBasicBox();
    await useUndoStore.getState().undo();
    expect(CREATE_LABEL_ACTION_MOCK.result).toHaveBeenCalled();
    const { id } = (CREATE_LABEL_ACTION_MOCK.result as jest.Mock).mock
      .calls[0][0].data;
    expect(DELETE_LABEL_ACTION_MOCK.result).toHaveBeenCalledWith(
      expect.objectContaining({ id })
    );
  });

  it("selects the newly created label", async () => {
    await renderDrawInteractionWithBasicBox();
    const { id } = (CREATE_LABEL_ACTION_MOCK.result as jest.Mock).mock
      .calls[0][0].data;
    await waitFor(() =>
      expect(useLabelingStore.getState()).toMatchObject({
        selectedLabelId: id,
      })
    );
  });

  it("unsets the selected label when the effect is undone", async () => {
    await renderDrawInteractionWithBasicBox();
    await useUndoStore.getState().undo();
    await waitFor(() =>
      expect(useLabelingStore.getState()).toMatchObject({
        selectedLabelId: null,
      })
    );
  });

  it("is possible to redo an undone action", async () => {
    await renderDrawInteractionWithBasicBox();
    await useUndoStore.getState().undo();
    await useUndoStore.getState().redo();
    expect(CREATE_LABEL_ACTION_MOCK.result).toHaveBeenNthCalledWith(
      3,
      basicBoxDrawExpectedMutationVars
    );
  });

  it("sets back the selected label when the effect is redone after an undone", async () => {
    await renderDrawInteractionWithBasicBox();
    await useUndoStore.getState().undo();
    await useUndoStore.getState().redo();
    const { id } = (CREATE_LABEL_ACTION_MOCK.result as jest.Mock).mock
      .calls[0][0].data;
    await waitFor(() =>
      expect(useLabelingStore.getState()).toMatchObject({
        selectedLabelId: id,
      })
    );
  });

  it("handles cases where the label creation throws an error", async () => {
    await renderDrawInteractionWithBasicBox([ERROR_CREATE_LABEL_ACTION_MOCK]);
    await waitFor(() =>
      expect(screen.getByText("Error creating bounding box")).toBeDefined()
    );
  });

  it("creates a label when the user has finished to draw a polygon on the labeling interface", async () => {
    const { mapRef, mockLink } = renderDrawInteraction();
    useLabelingStore.setState({ selectedTool: Tools.POLYGON });
    const drawInteraction = mapRef.current?.getInteractions().getArray()?.[0];
    drawInteraction?.dispatchEvent(
      new DrawEvent(
        "drawend" as DrawEventType,
        new Feature({
          geometry: new Polygon([
            [
              [100, 200],
              [200, 300],
              [250, 350],
              [200, 200],
              [100, 200],
            ],
          ]),
        })
      )
    );
    await act(() => mockLink.waitForAllResponses());
    expect(CREATE_LABEL_ACTION_MOCK.result).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          imageId: BASIC_IMAGE_DATA.id,
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [100, 200],
                [200, 300],
                [250, 350],
                [200, 200],
                [100, 200],
              ],
            ],
          },
        }),
      })
    );
  });
});
