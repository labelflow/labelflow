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
