import { useEffect } from "react";
import styled from "styled-components";
import "./App.css";
import AppLayout from "./Components/navigation/AppLayout";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;

function App() {
  useEffect(() => {
    document.title = "11:11 Administrativo";
  }, []);

  return (
    <AppContainer className="App">
      <AppLayout />
    </AppContainer>
  );
}

export default App;
