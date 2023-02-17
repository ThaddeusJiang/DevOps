import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { deleteCosmosContainers } from "../client/cosmos";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const databaseId = req.body?.databaseId;
  const containers = req.body?.containers;

  const [error, res] = await deleteCosmosContainers(databaseId, containers);
  if (error) {
    context.log.error(error);
    context.res = {
      // status: 200, /* Defaults to 200 */
      status: 500,
      body: error,
    };
  } else {
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: res,
    };
  }
};

export default httpTrigger;
