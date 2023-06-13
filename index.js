const http = require("http");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");

http
  .createServer(async (req, res) => {
    const { searchParams, pathname } = new URL(
      req.url,
      `http://${req.headers.host}`
    );
    const params = new URLSearchParams(searchParams);
    const comics = await fs.readFile("comics.txt");
    const autos = await fs.readFile("autos.txt");

    //COMICS

    //GET COMICS
    if (pathname === "/comics" && req.method === "GET") {
      res.write(comics);
      res.end();
    }

    //POST COMICS
    if (pathname === "/comics" && req.method === "POST") {
      const datosJson = JSON.parse(comics);
      const id = uuidv4();
      let nuevoComic;

      req.on("data", (data) => {
        nuevoComic = JSON.parse(data);
      });

      req.on("end", async () => {
        datosJson[id] = nuevoComic;
        await fs.writeFile("comics.txt", JSON.stringify(datosJson, null, 2));
        res.write("Cómic añadido exitosamente");
        res.end();
      });
    }

    //PUT COMICS
    if (pathname === "/comics" && req.method === "PUT") {
      const id = params.get("id");
      const comicsJson = JSON.parse(comics);
      let datosNuevos;

      req.on("data", (datos) => {
        datosNuevos = JSON.parse(datos);
      });

      req.on("end", async () => {
        const comicOriginal = comicsJson[id];
        const comicActualizado = { ...comicOriginal, ...datosNuevos };
        comicsJson[id] = comicActualizado;
        await fs.writeFile("comics.txt", JSON.stringify(comicsJson, null, 2));
        res.write("Los datos han sido modificados exitosamente");
        res.end();
      });
    }

    //DELETE COMICS
    if (req.url.startsWith("/comics") && req.method === "DELETE") {
      const id = params.get("id");
      const comicsJson = JSON.parse(comics);

      delete comicsJson[id];

      await fs.writeFile("comics.txt", JSON.stringify(comicsJson, null, 2));

      res.write(`El comic ID ${id} ha sido eliminado exitosamente`);
      res.end();
    }

    //AUTOS

    //GET AUTOS
    if (pathname === "/autos" && req.method === "GET") {
      res.write(autos);
      res.end();
    }

    //POST AUTOS
    if (pathname === "/autos" && req.method === "POST") {
      const autosJson = JSON.parse(autos);
      let id = uuidv4();
      let nuevoAuto;

      req.on("data", (data) => {
        nuevoAuto = JSON.parse(data);
      });

      req.on("end", async () => {
        autosJson[id] = nuevoAuto;

        await fs.writeFile("autos.txt", JSON.stringify(autosJson, null, 2));
        res.write("Automóvil agregado exitosamente");
        res.end();
      });
    }

    //PUT AUTOS
    if (pathname === "/autos" && req.method === "PUT") {
      const id = params.get("id");
      const autosJson = JSON.parse(autos);
      let datosNuevos;

      req.on("data", (datos) => {
        datosNuevos = JSON.parse(datos);
      });

      req.on("end", async () => {
        const autoOriginal = autosJson[id];
        const autoActualizado = { ...autoOriginal, ...datosNuevos };
        autosJson[id] = autoActualizado;
        await fs.writeFile("autos.txt", JSON.stringify(autosJson, null, 2));
        res.write("Los datos del vehículo han sido modificados exitosamente");
        res.end();
      });
    }

    //DELETE AUTOS
    if (req.url.startsWith("/autos") && req.method === "DELETE") {
      const id = params.get("id");
      const autosJson = JSON.parse(autos);

      delete autosJson[id];

      await fs.writeFile("autos.txt", JSON.stringify(autosJson, null, 2));

      res.write(`El vehíhulo ID ${id} ha sido eliminado exitosamente`);
      res.end();
    }
  })
  .listen(3000, () => console.log("🟢 Servidor iniciado en el puerto 3000"));
