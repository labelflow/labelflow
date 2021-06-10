/* eslint-disable import/first */
// @ts-ignore Needs to be done before ol is imported
global.URL.createObjectURL = jest.fn(() => "mockedUrl");

import { render, waitFor } from "@testing-library/react";
import { Map } from "@labelflow/react-openlayers-fiber";
import { Feature, Map as OlMap } from "ol";
import { fromExtent } from "ol/geom/Polygon";

import {
  useLabellingStore,
  Tools,
} from "../../../../connectors/labelling-state";
import { SelectInteraction } from "../select-interaction";

beforeEach(() => {
  useLabellingStore.setState({
    selectedLabelId: null,
    selectedTool: Tools.SELECTION,
  });
});

it("should select a feature when user clicks on it", async () => {
  useLabellingStore.setState({ selectedTool: Tools.SELECTION });

  const mapRef: { current: OlMap | null } = { current: null };
  render(<SelectInteraction />, {
    wrapper: ({ children }) => (
      <Map
        args={{ interactions: [] }}
        ref={(map) => {
          mapRef.current = map;
        }}
      >
        {children}
      </Map>
    ),
  });

  const selectInteraction = mapRef.current?.getInteractions().getArray()?.[0];
  selectInteraction?.dispatchEvent({
    type: "select",
    // @ts-ignore
    selected: [
      new Feature({
        geometry: fromExtent([100, 200, 200, 300]),
        id: "mocked-label-id",
      }),
    ],
  });

  await waitFor(() => {
    expect(useLabellingStore.getState()).toMatchObject({
      selectedLabelId: "mocked-label-id",
    });
  });
});

it("should unselect selected label if user clicks on nothing", async () => {
  useLabellingStore.setState({ selectedTool: Tools.SELECTION });

  const mapRef: { current: OlMap | null } = { current: null };
  render(<SelectInteraction />, {
    wrapper: ({ children }) => (
      <Map
        args={{ interactions: [] }}
        ref={(map) => {
          mapRef.current = map;
        }}
      >
        {children}
      </Map>
    ),
  });

  const selectInteraction = mapRef.current?.getInteractions().getArray()?.[0];
  selectInteraction?.dispatchEvent({
    type: "select",
    // @ts-ignore
    selected: [],
  });

  await waitFor(() => {
    expect(useLabellingStore.getState()).toMatchObject({
      selectedLabelId: null,
    });
  });
});

it("should not select label if the selection tools is not enabled", async () => {
  useLabellingStore.setState({ selectedTool: Tools.BOUNDING_BOX });

  const mapRef: { current: OlMap | null } = { current: null };
  render(<SelectInteraction />, {
    wrapper: ({ children }) => (
      <Map
        args={{ interactions: [] }}
        ref={(map) => {
          mapRef.current = map;
        }}
      >
        {children}
      </Map>
    ),
  });

  const selectInteraction = mapRef.current?.getInteractions().getArray()?.[0];
  selectInteraction?.dispatchEvent({
    type: "select",
    // @ts-ignore
    selected: [
      new Feature({
        geometry: fromExtent([100, 200, 200, 300]),
        id: "mocked-label-id",
      }),
    ],
  });

  await waitFor(() => {
    expect(useLabellingStore.getState()).toMatchObject({
      selectedLabelId: null,
    });
  });
});
