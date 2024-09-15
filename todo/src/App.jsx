import ToDoList from './ToDoList'

import {StompSessionProvider, useStompClient} from "react-stomp-hooks";

function App() {

  return (
      <StompSessionProvider
          url={"http://192.168.0.106:5555/api/ws"}>
        <ToDoList/>
      </StompSessionProvider>

  );
}

export default App
