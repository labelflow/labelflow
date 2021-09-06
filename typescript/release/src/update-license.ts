import { writeFile, readFile } from "fs/promises";
import { join } from "path";
import { add, format } from "date-fns";

const main = async () => {
  const newDate = format(
    add(new Date(), {
      years: 2,
    }),
    "yyyy-MM-dd"
  );

  const previousLicense = await (
    await readFile(join(__dirname, "../../../LICENSE"))
  ).toString();

  const newLicense = previousLicense.replace(
    /Change Date:(.*?)\n/,
    `Change Date:          ${newDate}\n`
  );

  await writeFile(join(__dirname, "../../../LICENSE"), newLicense);
};

main();
