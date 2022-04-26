/**
 * Number of images to upload in a batch.
 * For each batch, we perform one "createManyImages" mutation.
 * Increasing this number will lower the number of connections to the database
 * needed to perform the upload.
 *
 * However, every "createManyImages" mutation also performs the processing
 * (thumbnails generations & size validation) of the created all images.
 * If we the batch size, the "createManyImages" mutation will take longer to resolve.
 */
export const BATCH_SIZE = 2;

/**
 * Maximum number of batches to perform in parallel.
 * Increasing this number should reduce potentials bottlenecks,
 * and thus, make the upload faster.
 * For example, if the user uploads faster than the images are processed on
 * the server, then the upload would be delayed until one batch is fully finished.
 *
 * However, increasing this number will also increase the number
 * of connections to the database.
 */
export const CONCURRENCY = 20;
