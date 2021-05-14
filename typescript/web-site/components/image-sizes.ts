// From https://gist.github.com/TheThirdRace/0f439acef8d9cb6bf5d7e69c54704086

/**
 * ! Important in optimizing images
 *
 *  Keep the values in sync between:
 * - `deviceSizes` in `next.config.js`
 * - `deviceSizes` in `image.ts`
 *
 * ! Recommended
 * NextJs optimize images according to your viewport. This is wonderful for mobile, but for desktop with a 4k screen, NextJs would
 * download the 3840px version of your image.
 *
 * To workaround this unfortunate situation, I highly recommend you pass `size` to images with the highest width value being the
 * max width an image can have on your site.
 *
 * For example, content on my site is centered and cannot be more than 960px wide, thus I make sure that 960 is in `deviceSizes` and
 * I use `Sizes.main` to limit the image to only 960px. This considerably reduce the size in KB of my images and they're much
 * better optimized on screens larger than 960px.
 *
 * This file is a way to generate the strings to pass to Image's `size` property and put the results in an Enum for easier consumption
 */
// const deviceSizes = [
//   320, 480, 640, 750, 828, 960, 1080, 1200, 1440, 1920, 2048, 2560, 3840,
// ];
// const deviceSizesMax = Math.max(...deviceSizes);

/**
 * ? `generateSizes` will create the strings necessary for `Sizes` enum
 *
 * ? Simply uncomment the `console.log` and adjust values
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const generateSizes = (upperLimit: number = deviceSizesMax): string => {
//   const sizes = [...deviceSizes.filter((v) => v < upperLimit), upperLimit];
//   return sizes
//     .map((v, i) => {
//       return i < sizes.length - 1 ? ` (max-width: ${v}px) ${v}px` : ` ${v}px`;
//     })
//     .join();
// };
// console.log(generateSizes(960)) // I use a variable, but since it's easier to understand with a real number...
// console.log(generateSizes());

export enum Sizes {
  main = "(max-width: 320px) 320px, (max-width: 480px) 480px, (max-width: 640px) 640px, (max-width: 750px) 750px, (max-width: 828px) 828px, 960px",
  full = "(max-width: 320px) 320px, (max-width: 480px) 480px, (max-width: 640px) 640px, (max-width: 750px) 750px, (max-width: 828px) 828px, (max-width: 960px) 960px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, (max-width: 1440px) 1440px, (max-width: 1920px) 1920px, (max-width: 2048px) 2048px, (max-width: 2560px) 2560px, 3840px",
}
