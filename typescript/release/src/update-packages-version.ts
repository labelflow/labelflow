import { readFile, writeFile, readdir } from "fs/promises";
import { join } from "path";

const semverRegExp =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

const main = async () => {
  let version;
  try {
    version = JSON.parse(
      await (
        await readFile(join(__dirname, "../../../package.json"))
      ).toString()
    ).version;

    if (typeof version !== "string" || !version?.match(semverRegExp)) {
      throw new Error(
        "Couldn't extract a correct version from the root package.json"
      );
    }
  } catch (e) {
    console.error("Cannot read the root package.json file");
  }

  console.log(`Setting packages version to: ${version}`);

  const typescriptPackages = await readdir(join(__dirname, "../../"));

  return Promise.all(
    typescriptPackages.map(async (packageName) => {
      try {
        const packagePath = join(
          __dirname,
          `../../${packageName}/package.json`
        );

        const packageJson = JSON.parse(
          await (
            await readFile(join(__dirname, `../../${packageName}/package.json`))
          ).toString()
        );

        packageJson.version = version;

        await writeFile(
          packagePath,
          `${JSON.stringify(packageJson, null, 2)}\n`
        );
      } catch (error) {
        console.warn(
          `Coudln't read ${join(
            __dirname,
            `../../${packageName}/package.json`
          )}`
        );
      }
    })
  );
};

main();
