import runApp from "./app";
import cvrQueries from "./modules/cvr/queries";

const app = runApp(cvrQueries);

app.listen(8000, () => {
  console.warn("Active port: 8000");
});
