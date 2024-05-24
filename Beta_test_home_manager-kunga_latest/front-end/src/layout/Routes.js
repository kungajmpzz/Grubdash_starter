import React from "react";

import { Route} from "react-router-dom";
import NotFound from "./NotFound";
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <switch>
      <Route>
        <NotFound />
      </Route>
    </switch>
  );
}

export default Routes;
