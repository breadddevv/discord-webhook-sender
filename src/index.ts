import { intro, outro } from "@clack/prompts";
import { MainMenu } from "base/functions/mainMenu";
import chalk from "chalk";
import consola from "consola";
import * as fs from "fs";
import * as path from "path";

export const currentdir = __dirname;

process.on('SIGINT', () => {
  outro('Bye!')
  process.exit(0);
});

(async () => {
  intro("🤖 Discord webhook sender ✨");

  const bindsPath = path.join(currentdir, "../binds.json");

  if (!fs.existsSync(bindsPath)) {
    consola.info(
      chalk.bgYellow(
        chalk.black(
          "No binds found within this folder. Creating a binds file, make sure to use --save, or use the builtin CLI to save future webhook binds!"
        )
      )
    );
    fs.writeFileSync(bindsPath, JSON.stringify({}, null, 2));
  } else {
    const jsonRaw = fs.readFileSync(bindsPath, "utf8");
    const json: Record<string, string> = JSON.parse(jsonRaw);

    if (Object.keys(json).length == 0) {
      consola.info(
        chalk.yellow(`0 binds loaded, consider creating some soon!`)
      )
    } else {
      consola.success(
        chalk.green(`${Object.keys(json).length} ${Object.keys(json).length === 1 ? 'Bind' : 'Binds'} loaded.`)
      );
    }

  }

  while (true) {
    await MainMenu();
  }
})();
