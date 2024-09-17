import ToDo from './ToDo.jsx'

import {StompSessionProvider} from "react-stomp-hooks";

function App() {

  return (
      <StompSessionProvider
          url={"http://localhost:5555/api/ws"}>
        <ToDo/>
      </StompSessionProvider>
  );
}

export default App
