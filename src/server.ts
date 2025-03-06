import express from "express";
import { routes } from "./routes";
import { errorHandling } from "./middlewares/error-handling";
import { specs, swaggerUi } from "./swagger";

const PORT = 3333;
const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(routes);
app.use(errorHandling);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Documentação Swagger disponível em: http://localhost:${PORT}/api-docs`);
});