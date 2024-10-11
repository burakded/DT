import { Model, PaidModels } from "../context/BrainConfigProvider/types";

export const defineMaxTokens = (model: Model | PaidModels): number => {
  //At the moment is evaluating only models from OpenAI
  switch (model) {
    case "gpt-4o":
      return 2000;
    default:
      return 1000;
  }
};
