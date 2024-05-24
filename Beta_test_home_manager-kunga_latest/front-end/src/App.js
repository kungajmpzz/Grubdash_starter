import React from "react";
import { Route} from "react-router-dom";
import Layout from "./layout/Layout";

/**
 * Defines the root application component.
 * @returns {JSX.Element}
 */
function App() {
  return (
    <switch>
      <Route path="/">
        <Layout />
      </Route>
    </switch>
  );
}

export default App;
