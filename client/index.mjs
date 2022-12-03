#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import ConfigStore from "configstore";
import axios from "axios";
import { formatArticle, formatProfile, sleep } from "./util.mjs";

const config = new ConfigStore("artshare");
const yg = yargs(hideBin(process.argv));

yg.command(
  "push [link] [title] [group]",
  "pushes a link to your shared public list",
  (yrg) => {
    yrg
      .option("group", {
        describe:
          "Post to a group list or private list instead of a public one (type private to push to your private list)",
        default: "public",
        demandOption: false,
      })
      .option("interactive", {
        alias: "i",
        describe: "Shows a prompt to input fields to push one by one",
        default: false,
      });
  },
  async (argv) => {
    let group, link, title;
    if (argv.i) {
      title = await inquirer.prompt({
        name: "Title",
        type: "input",
        message: "Enter Title:",
      });
      title = title.Title;
      link = await inquirer.prompt({
        name: "Link",
        type: "input",
        message: "Link to the Article:",
      });
      link = link.Link;
      group = await inquirer.prompt({
        name: "Group",
        default: "public",
        type: "input",
        message: "Group Name [private to add in private list]:",
      });
      group = group.Group;
    } else {
      group = argv.group;
      link = argv.link;
      title = argv.title;
    }
    const spin = createSpinner(
      `Pushing ${link} with title ${title} to ${group}\n`
    ).start();
    // await sleep();
    const token = config.get("auth.token");
    if (!token) {
      spin.error("You are not logged in, kindly login to push articles");
      process.exit(1);
    }

    try {
      const req = await axios.post(
        "http://localhost:5000/article/",
        {
          group,
          link,
          title,
        },
        {
          headers: {
            "x-access-token": `Bearer ${token}`,
          },
        }
      );
      await sleep();

      if (req.status === 201) {
        spin.success(`${req?.data?.msg}`);
        console.log(chalk.greenBright(`Article ID: ${req?.data?.id}`));
      }
    } catch (e) {
      console.error(e);
      console.log(chalk.redBright(e));
      spin.error("Error has occurred while adding the article to list :(");
      process.exit(1);
    }
  }
);

yg.command(
  "get [id] [group] [interactive]",
  "gets the details of the article with the specified id or label",
  (yrg) => {
    yrg
      .positional("group", {
        describe:
          "Pulls the article from the given group list instead of a public one (type private to push to your private list)",
        default: "public",
        demandOption: false,
      })
      .option("interactive", {
        alias: "i",
        describe: "Shows a prompt to input fields to push one by one",
        default: false,
      });
  },
  async (argv) => {
    let id, group;
    if (argv.interactive) {
      id = await inquirer.prompt({
        name: "Id",
        message: "Enter Article Id or Title",
        type: "input",
      });
      id = id.Id;
      group = await inquirer.prompt({
        name: "Group",
        default: "public",
        type: "input",
        message: "Group Name [private to add in private list]:",
      });
      group = group.Group;
    } else {
      id = argv.id;
      group = argv.group;
    }

    const url = `/article/${id}`;

    const spin = createSpinner(`Fetching Article...\n`).start();
    // await sleep();
    const token = config.get("auth.token");
    if (!token) {
      spin.error("You are not logged in, kindly login to push articles");
      process.exit(1);
    }
    try {
      const req = await axios.get("http://localhost:5000" + url, {
        headers: {
          "x-access-token": `Bearer ${token}`,
        },
      });
      await sleep();

      if (req.status === 200) {
        spin.success(`Fetch Complete`);
        formatArticle(req?.data);
      }
    } catch (e) {}
  }
);

yg.command(
  "login",
  "Login to the Application",
  () => {},
  async (argv) => {
    const username = await inquirer.prompt({
      type: "input",
      name: "Username",
      message: "Enter Username to ArtShare",
    });
    const password = await inquirer.prompt({
      type: "password",
      name: "Password",
      message: "Enter Password",
      mask: "*",
    });
    try {
      const req = await axios.post("http://localhost:5000/auth/login", {
        username: username.Username,
        password: password.Password,
      });

      if (req.status === 200) {
        config.set("auth.token", req?.data?.token);
        console.log(chalk.greenBright(req?.data?.msg));
      }
    } catch (e) {
      // Write to error log
      console.log(chalk.redBright(e?.response?.data?.msg));
    }
  }
);

yg.command(
  "register",
  "Register to the Application",
  () => {},
  async (argv) => {
    const name = await inquirer.prompt({
      type: "input",
      name: "Name",
      message: "Enter Your Name",
    });
    const username = await inquirer.prompt({
      type: "input",
      name: "Username",
      message: "Enter Username to ArtShare",
    });
    const password = await inquirer.prompt({
      type: "password",
      name: "Password",
      message: "Enter Password",
      mask: "*",
    });

    try {
      const req = await axios.post("http://localhost:5000/auth/register", {
        username: username.Username,
        password: password.Password,
        name: name.Name,
      });
      if (req.status === 200) {
        console.log(
          chalk.greenBright(
            `Registration Successful\nUse ${chalk.blueBright(
              "artshare login"
            )} to login`
          )
        );
      }
    } catch (e) {}
  }
);

yg.command(
  "profile",
  "Get Profile of the logged in user",
  () => {},
  async (argv) => {
    const token = config.get("auth.token");
    if (!token) {
      console.log(
        chalk.redBright(
          `You are not logged in\nUse ${chalk.blueBright(
            "artshare login"
          )} command to login`
        )
      );
    } else {
      const req = await axios.get("http://localhost:5000/auth/", {
        headers: {
          "x-access-token": `Bearer ${token}`,
        },
      });
      formatProfile(req.data);
    }
  }
);

yg.command(
  "logout",
  "Logs you out from the application",
  () => {},
  async (argv) => {
    config.delete("auth.token");
    console.log(chalk.blueBright("Logout Successful!"));
  }
);

yg.parse();
