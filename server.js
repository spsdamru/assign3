const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const loadRoutes = () => {
  const dataDir = path.join(__dirname, 'data');
  const routes = ['circuits', 'constructors', 'drivers', 'qualifying', 'races', 'results'];
  const apiRoutes = {};

  routes.forEach(routeName => {
    try {
      const filePath = path.join(dataDir, `${routeName}.json`);
      
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      app.get(`/${routeName}`, (req, res) => {
        res.json(jsonData);
      });
      
      if (routeName === 'drivers') {
        jsonData.forEach(driver => {
          const driverReference = driver.driverRef;
          app.get(`/drivers/${driverReference}`, (req, res) => {
            res.json(driver);
          });
        });
      }
      
      if (routeName === 'constructors') {
        jsonData.forEach(constructor => {
          const constructorReference = constructor.constructorRef;
          app.get(`/constructors/${constructorReference}`, (req, res) => {
            res.json(constructor);
          });
        });
      }
      
      if (routeName === 'circuits') {
        jsonData.forEach(circuit => {
          const circuitID = circuit.circuitId;
          app.get(`/circuits/${circuitID}`, (req, res) => {
            res.json(circuit);
          });
        });
      }
      
      apiRoutes[routeName] = `/${routeName}`;
    } catch (error) {
      console.error(`Error loading ${routeName}.json:`, error);
    }
  });

  return apiRoutes;
};

app.get('/', (req, res) => {
  res.send('F1 API is running. Available routes: /circuits, /constructors, /drivers, /qualifying, /races, /results');
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  const routes = loadRoutes();
  Object.entries(routes).forEach(([name, path]) => {
    console.log(`- ${name}: ${path}`);
  });
});
