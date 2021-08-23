import { writeFile, readFile } from "fs/promises";
import { join } from "path";

const padToTwo = (number: number) => String(number).padStart(2, "0");

const main = async () => {
  const now = new Date();
  now.setFullYear(now.getFullYear() + 2);

  let formattedDate;
  if ((now.getMonth() === 2, now.getDate() === 29)) {
    // We take into account that the 29th of february doesn't exist in 2 years
    formattedDate = `${now.getFullYear()}-03-01`;
  } else {
    formattedDate = `${now.getFullYear()}-${padToTwo(
      now.getMonth()
    )}-${padToTwo(now.getDate())}`;
  }

  const previousLicense = await (
    await readFile(join(__dirname, "../../../LICENSE"))
  ).toString();

  const newLicense = previousLicense.replace(
    /Change Date:(.*?)\n/,
    `Change Date:          ${formattedDate}\n`
  );

  await writeFile(join(__dirname, "../../../LICENSE"), newLicense);
};

main();
