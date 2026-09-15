import readline from "node:readline/promises";

import { createVectorIndex } from "./prepare.js";
import { askQuestion } from "./chat.js";
import { stdin, stdout } from "node:process";

const main = async () => {
  try {
    // create vector index
    const vectorStore = await createVectorIndex();

    const rl = readline.createInterface({
      input: stdin,
      output: stdout,
    });

    while (true) {
      const question = await rl.question("You: ");

      if (question.toLowerCase() === "exit") {
        console.log("Exit successful");
        return;
      }

      const answer = await askQuestion(vectorStore, question);

      console.log("Assistant: ", answer);
    }
  } catch (error) {
    console.log("Error in the main function: ", error.message);
  }
};

main();
