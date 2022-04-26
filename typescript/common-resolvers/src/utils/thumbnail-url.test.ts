import {
  getThumbnailUrlFromImageUrl,
  getImageUrlFromThumbnailUrl,
} from "./thumbnail-url";

describe(`${getThumbnailUrlFromImageUrl.name} <=> ${getImageUrlFromThumbnailUrl.name}`, () => {
  it("works with a simple case", async () => {
    expect(
      getThumbnailUrlFromImageUrl({
        size: 500,
        extension: "jpeg",
        url: "https://example.com/image.jpg",
      })
    ).toEqual("https://example.com/thumbnails/500/image.jpg.jpeg");
    expect(
      getImageUrlFromThumbnailUrl(
        "https://example.com/thumbnails/500/image.jpg.jpeg"
      )
    ).toEqual({
      size: 500,
      extension: "jpeg",
      url: "https://example.com/image.jpg",
      urlPrefix: "https://example.com/",
      urlSuffix: "image.jpg",
    });
  });

  it("works with corner-case 1", async () => {
    expect(
      getThumbnailUrlFromImageUrl({
        size: 12,
        extension: "png",
        url: "/coucou/176371/loulou/image.jpeg.gif",
      })
    ).toEqual("/coucou/176371/loulou/thumbnails/12/image.jpeg.gif.png");
    expect(
      getImageUrlFromThumbnailUrl(
        "/coucou/176371/loulou/thumbnails/12/image.jpeg.gif.png"
      )
    ).toEqual({
      size: 12,
      extension: "png",
      url: "/coucou/176371/loulou/image.jpeg.gif",
      urlPrefix: "/coucou/176371/loulou/",
      urlSuffix: "image.jpeg.gif",
    });
  });

  it("works with corner-case 2", async () => {
    expect(
      getThumbnailUrlFromImageUrl({
        size: 43,
        extension: "png",
        url: "ffds.jpeg.gif",
      })
    ).toEqual("thumbnails/43/ffds.jpeg.gif.png");
    expect(
      getImageUrlFromThumbnailUrl("thumbnails/43/ffds.jpeg.gif.png")
    ).toEqual({
      size: 43,
      extension: "png",
      url: "ffds.jpeg.gif",
      urlPrefix: undefined,
      urlSuffix: "ffds.jpeg.gif",
    });
  });
});
