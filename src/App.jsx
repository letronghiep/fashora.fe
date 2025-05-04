import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";
function App() {
  dayjs.extend(updateLocale);
  dayjs.updateLocale("en", {
    weekStart: 1,
  });
  dayjs.extend(customParseFormat);

  return (
    <Routes>
      {routes.map(({ path, component: Component, exact, layout: Layout }) => {
        return (
          <Route
            exact={exact}
            key={path}
            path={path}
            element={
              // <PrivateRoute allowRoutes={[permission]}>
              Layout ? (
                <Layout>
                  <Component />
                </Layout>
              ) : (
                <Component />
              )
              // </PrivateRoute>
            }
          />
        );
      })}
      {/* route.private ? (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PrivateRoute
                element={<route.component />}
                allowRoutes={[route.permission]}
              />
            }
          />
        ) : (
          <Route
            key={route.path}
            path={route.path}
            element={<route.component />}
          />
        );
      })} */}
    </Routes>
  );
}

export default App;
