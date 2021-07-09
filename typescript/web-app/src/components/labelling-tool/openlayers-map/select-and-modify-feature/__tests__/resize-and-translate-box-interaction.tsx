/* eslint-disable import/first */
// @ts-ignore Needs to be done before ol is imported
global.URL.createObjectURL = jest.fn(() => "mockedUrl");

import { render } from "@testing-library/react";
import { Polygon } from "ol/geom";
import { Feature, MapBrowserEvent, Map as olMap } from "ol";
import { Map, extend } from "@labelflow/react-openlayers-fiber";
// import { Interaction } from "ol/interaction";
// import { TranslateEvent } from "ol/interaction/Translate";
// import VectorSource from "ol/source/Vector";
// import VectorLayer from "ol/layer/Vector";
import PointerInteraction from "ol/interaction/Pointer";
import { ResizeAndTranslateBox } from "../resize-and-translate-box-interaction";

// Extend react-openlayers-catalogue to include resize and translate interaction
extend({
  ResizeAndTranslateBox: { object: ResizeAndTranslateBox, kind: "Interaction" },
});

describe("Resize and translate box interaction", function () {
  let target: HTMLDivElement;
  let mapRef: { current: olMap };
  let source;
  let features: Feature<Polygon>[];
  let resizeAndTranslate: ResizeAndTranslateBox;

  const width = 360;
  const height = 180;

  beforeEach(function (done) {
    // target = document.createElement("div");
    // const { style } = target;
    // style.position = "absolute";
    // style.left = "-1000px";
    // style.top = "-1000px";
    // style.width = `${width}px`;
    // style.height = `${height}px`;
    // document.body.appendChild(target);
    // source = new VectorSource();
    // features = [
    //   new Feature<Polygon>({
    //     geometry: new Polygon([
    //       [
    //         [10, 10],
    //         [10, 30],
    //         [20, 30],
    //         [20, 10],
    //         [10, 10],
    //       ],
    //     ]),
    //   }),
    // ];
    // source.addFeatures(features);
    // const layer = new VectorLayer({ source });
    // map = new Map({
    //   target,
    //   layers: [layer],
    //   view: new View({
    //     projection: "EPSG:4326",
    //     center: [0, 0],
    //     resolution: 1,
    //   }),
    // });
    // map.once("postrender", function () {
    //   done();
    // });
  });

  // afterEach(function () {
  //   mapRef?.current.dispose();
  //   document.body.removeChild(target);
  // });

  /**
   * Simulates a browser event on the map viewport.  The client x/y location
   * will be adjusted as if the map were centered at 0,0.
   * @param {string} type Event type.
   * @param {number} x Horizontal offset from map center.
   * @param {number} y Vertical offset from map center.
   * @param {boolean} [opt_shiftKey] Shift key is pressed.
   */
  function simulateEvent(
    type: string,
    x: number,
    y: number,
    opt_shiftKey: boolean = false
  ) {
    const viewport = mapRef?.current.getViewport();
    // calculated in case body has top < 0 (test runner with small window)
    const position = viewport.getBoundingClientRect();
    const shiftKey = opt_shiftKey !== undefined ? opt_shiftKey : false;
    const event = new MapBrowserEvent(type, mapRef.current, {
      type,
      target: viewport.firstChild,
      pointerId: 0,
      clientX: position.left + x + width / 2,
      clientY: position.top + y + height / 2,
      shiftKey,
      preventDefault() {},
    });
    console.log("Hello", mapRef.current);
    mapRef.current.handleMapBrowserEvent(event);
  }

  describe("constructor", function () {
    it("creates a new interaction", function () {
      resizeAndTranslate = new ResizeAndTranslateBox({
        selectedFeature: features[0],
      });

      expect(resizeAndTranslate instanceof ResizeAndTranslateBox).toEqual(true);
      expect(resizeAndTranslate instanceof PointerInteraction).toEqual(true);
    });
  });

  describe("moving features, with features option", function () {
    beforeEach(function () {
      // @ts-ignore
      render(<resizeAndTranslateBox />, {
        wrapper: ({ children }) => (
          <Map
            args={{
              interactions: [],
              features: [
                new Feature<Polygon>({
                  geometry: new Polygon([
                    [
                      [10, 10],
                      [10, 30],
                      [20, 30],
                      [20, 10],
                      [10, 10],
                    ],
                  ]),
                }),
              ],
            }}
            ref={(map) => {
              if (map != null) {
                mapRef = { current: map };
              }
            }}
          >
            {children}
          </Map>
        ),
      });
    });

    it.only("moves a selected feature", function () {
      simulateEvent("pointermove", 10, 20);
      simulateEvent("pointerdown", 15, 15);
      simulateEvent("pointerdrag", 40, 40);
      simulateEvent("pointerup", 40, 40);
      const geometry = features[0].getGeometry();
      expect(geometry instanceof Polygon).toBe(true);
      expect(geometry.getCoordinates()).toEqual([50, 40]);
    });

    //     it("does not move an unselected feature", function () {
    //       const events = trackEvents(features[0], translate);

    //       simulateEvent("pointermove", 20, 30);
    //       simulateEvent("pointerdown", 20, 30);
    //       simulateEvent("pointerdrag", 50, -40);
    //       simulateEvent("pointerup", 50, -40);
    //       const geometry = features[1].getGeometry();
    //       expect(geometry).to.be.a(Point);
    //       expect(geometry.getCoordinates()).to.eql([20, -30]);

    //       expect(events).to.be.empty();
    //     });
  });

  //   describe("moving features, without features option", function () {
  //     let translate;

  //     beforeEach(function () {
  //       translate = new Translate();
  //       map.addInteraction(translate);
  //     });

  //     it("moves only targeted feature", function () {
  //       const events = trackEvents(features[0], translate);

  //       simulateEvent("pointermove", 10, 20);
  //       simulateEvent("pointerdown", 10, 20);
  //       simulateEvent("pointerdrag", 50, -40);
  //       simulateEvent("pointerup", 50, -40);
  //       expect(features[0].getGeometry().getCoordinates()).to.eql([50, 40]);
  //       expect(features[1].getGeometry().getCoordinates()).to.eql([20, -30]);

  //       validateEvents(events, [features[0]]);
  //     });
  //   });

  //   describe("moving features, with filter option", function () {
  //     let translate;

  //     beforeEach(function () {
  //       translate = new Translate({
  //         filter(feature, layer) {
  //           return feature == features[0];
  //         },
  //       });
  //       map.addInteraction(translate);
  //     });

  //     it("moves a filter-passing feature", function () {
  //       const events = trackEvents(features[0], translate);

  //       simulateEvent("pointermove", 10, 20);
  //       simulateEvent("pointerdown", 10, 20);
  //       simulateEvent("pointerdrag", 50, -40);
  //       simulateEvent("pointerup", 50, -40);
  //       const geometry = features[0].getGeometry();
  //       expect(geometry).to.be.a(Point);
  //       expect(geometry.getCoordinates()).to.eql([50, 40]);

  //       validateEvents(events, [features[0]]);
  //     });

  //     it("does not move a filter-discarded feature", function () {
  //       const events = trackEvents(features[0], translate);

  //       simulateEvent("pointermove", 20, 30);
  //       simulateEvent("pointerdown", 20, 30);
  //       simulateEvent("pointerdrag", 50, -40);
  //       simulateEvent("pointerup", 50, -40);
  //       const geometry = features[1].getGeometry();
  //       expect(geometry).to.be.a(Point);
  //       expect(geometry.getCoordinates()).to.eql([20, -30]);

  //       expect(events).to.be.empty();
  //     });
  //   });

  //   describe("moving features, with condition option", function () {
  //     let translate;

  //     beforeEach(function () {
  //       translate = new Translate({ condition: shiftKeyOnly });
  //       map.addInteraction(translate);
  //     });

  //     it("moves targeted feature when condition is met", function () {
  //       const events = trackEvents(features[0], translate);

  //       simulateEvent("pointermove", 10, 20);
  //       simulateEvent("pointerdown", 10, 20, true);
  //       simulateEvent("pointerdrag", 50, -40);
  //       simulateEvent("pointerup", 50, -40);
  //       expect(features[0].getGeometry().getCoordinates()).to.eql([50, 40]);

  //       validateEvents(events, [features[0]]);
  //     });

  //     it("does not move feature when condition is not met", function () {
  //       const events = trackEvents(features[0], translate);

  //       simulateEvent("pointermove", 20, 30);
  //       simulateEvent("pointerdown", 20, 30);
  //       simulateEvent("pointerdrag", 50, -40);
  //       simulateEvent("pointerup", 50, -40);
  //       expect(features[1].getGeometry().getCoordinates()).to.eql([20, -30]);

  //       expect(events).to.be.empty();
  //     });
  //   });

  //   describe("changes css cursor", function () {
  //     let element;
  //     let translate;

  //     beforeEach(function () {
  //       translate = new Translate();
  //       map.addInteraction(translate);
  //       element = map.getViewport();
  //     });

  //     it("changes css cursor", function () {
  //       expect(element.classList.contains("ol-grabbing")).to.be(false);
  //       expect(element.classList.contains("ol-grab")).to.be(false);

  //       simulateEvent("pointermove", 10, 20);
  //       expect(element.classList.contains("ol-grabbing")).to.be(false);
  //       expect(element.classList.contains("ol-grab")).to.be(true);

  //       simulateEvent("pointerdown", 10, 20);
  //       expect(element.classList.contains("ol-grabbing")).to.be(true);
  //       expect(element.classList.contains("ol-grab")).to.be(false);

  //       simulateEvent("pointerup", 10, 20);
  //       expect(element.classList.contains("ol-grabbing")).to.be(false);
  //       expect(element.classList.contains("ol-grab")).to.be(true);

  //       simulateEvent("pointermove", 0, 0);
  //       expect(element.classList.contains("ol-grabbing")).to.be(false);
  //       expect(element.classList.contains("ol-grab")).to.be(false);
  //     });

  //     it("resets css cursor when interaction is deactivated while pointer is on feature", function () {
  //       simulateEvent("pointermove", 10, 20);
  //       expect(element.classList.contains("ol-grabbing")).to.be(false);
  //       expect(element.classList.contains("ol-grab")).to.be(true);

  //       translate.setActive(false);

  //       simulateEvent("pointermove", 0, 0);
  //       expect(element.classList.contains("ol-grabbing")).to.be(false);
  //       expect(element.classList.contains("ol-grab")).to.be(false);
  //     });

  //     it("resets css cursor interaction is removed while pointer is on feature", function () {
  //       simulateEvent("pointermove", 10, 20);
  //       expect(element.classList.contains("ol-grabbing")).to.be(false);
  //       expect(element.classList.contains("ol-grab")).to.be(true);

  //       map.removeInteraction(translate);

  //       simulateEvent("pointermove", 0, 0);
  //       expect(element.classList.contains("ol-grabbing")).to.be(false);
  //       expect(element.classList.contains("ol-grab")).to.be(false);
  //     });

  //     it("resets css cursor to existing cursor interaction is removed while pointer is on feature", function () {
  //       element.style.cursor = "pointer";

  //       simulateEvent("pointermove", 10, 20);
  //       expect(element.classList.contains("ol-grabbing")).to.be(false);
  //       expect(element.classList.contains("ol-grab")).to.be(true);

  //       map.removeInteraction(translate);

  //       simulateEvent("pointermove", 0, 0);
  //       expect(element.classList.contains("ol-grabbing")).to.be(false);
  //       expect(element.classList.contains("ol-grab")).to.be(false);
  //     });
  //   });
});
