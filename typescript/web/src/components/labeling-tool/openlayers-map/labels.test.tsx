/* eslint-disable import/order */
// @ts-ignore Needs to be done before ol is imported
global.URL.createObjectURL = jest.fn(() => "mockedUrl");

import { Map } from "@labelflow/react-openlayers-fiber";
import { render, waitFor } from "@testing-library/react";
import { Map as OlMap } from "ol";
import { Geometry } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import { mockNextRouter } from "../../../utils/tests/router-mocks";

mockNextRouter();

import { MockedProvider as MockedApolloProvider } from "@apollo/client/testing";
import VectorSource from "ol/source/Vector";
import { useRouter } from "next/router";
import { useLabelingStore } from "../../../connectors/labeling-state";
import { DEEP_DATASET_WITH_LABELS_DATA } from "../../../utils/fixtures";
import { getApolloMockLink } from "../../../utils/tests";
import { Labels } from "./labels";
import { APOLLO_MOCKS } from "./labels.fixtures";

const renderLabels = (imageId: string): { current: OlMap | null } => {
  const mapRef: { current: OlMap | null } = { current: null };
  (useRouter as jest.Mock).mockImplementation(() => ({
    query: { imageId, datasetId: DEEP_DATASET_WITH_LABELS_DATA.id },
  }));
  render(<Labels />, {
    wrapper: ({ children }) => (
      <Map
        ref={(map) => {
          mapRef.current = map;
        }}
      >
        <MockedApolloProvider link={getApolloMockLink(APOLLO_MOCKS)}>
          {children}
        </MockedApolloProvider>
      </Map>
    ),
  });
  return mapRef;
};

describe(Labels, () => {
  it("displays a single label", async () => {
    const mapRef = renderLabels(DEEP_DATASET_WITH_LABELS_DATA.images[0].id);
    await waitFor(() =>
      expect(
        (
          mapRef.current?.getLayers().getArray()[0] as VectorLayer<
            VectorSource<Geometry>
          >
        )
          .getSource()
          .getFeatures()
      ).toHaveLength(1)
    );
  });

  it("displays created labels", async () => {
    const mapRef = renderLabels(DEEP_DATASET_WITH_LABELS_DATA.images[1].id);
    await waitFor(() => {
      expect(
        (
          mapRef.current?.getLayers().getArray()[0] as VectorLayer<
            VectorSource<Geometry>
          >
        )
          .getSource()
          .getFeatures()
      ).toHaveLength(2);
    });
  });

  it("changes style of selected label", async () => {
    const mapRef = renderLabels(DEEP_DATASET_WITH_LABELS_DATA.images[0].id);
    useLabelingStore.setState({
      selectedLabelId: DEEP_DATASET_WITH_LABELS_DATA.images[0].labels[0].id,
    });
    await waitFor(() => {
      const [feature] = (
        mapRef.current?.getLayers().getArray()[0] as VectorLayer<
          VectorSource<Geometry>
        >
      )
        .getSource()
        .getFeatures();
      /* When the label is selected it contains two styles, one for the label, another for the vertices style */
      expect(feature.getStyle()).toHaveLength(2);
    });
  });
});
