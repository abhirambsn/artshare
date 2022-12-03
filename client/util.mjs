import chalk from "chalk";

export const formatProfile = (data) => {
  console.log(chalk.blueBright("Your ArtShare Profile"));
  console.log(
    chalk.greenBright(
      `\nAccount Created on ${new Date(data?.createdAt).toLocaleString(
        "en-IN",
        {
          dateStyle: "short",
        }
      )}\n`
    )
  );
  console.log(chalk.blueBright("User Details"));
  console.log(chalk.greenBright(`Name:\t\t${data?.name}`));
  console.log(chalk.greenBright(`Username:\t${data?.username}`));
  console.log(chalk.greenBright(`Password:\t********`));

  console.log(chalk.redBright("\n\nStatistics"));
  console.log(
    chalk.yellowBright(
      `Articles in Private List: ${data?.privateList.length} articles`
    )
  );
  console.log(chalk.yellowBright(`Total Articles Read:\t${0}`));
};

export const formatArticle = (data) => {
    console.log(chalk.cyanBright("Article Details\n"))
    console.log(chalk.cyanBright(`Article ID:\t${data._id}`))
    console.log(chalk.cyanBright(`Title:\t${data.title}`))
    console.log(chalk.cyanBright(`Link:\t${data.link}`))
    console.log(chalk.cyanBright(`Author:\t${data.author.name}`))
}

export const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
