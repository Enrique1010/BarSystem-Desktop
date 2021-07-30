import { useEffect } from "react";
import styled from "styled-components";
import "./App.css";
import AppLayout from "./Components/navigation/AppLayout";
// import firebase from "firebase";
// import { useState } from "react/cjs/react.development";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const userId = "rae6Iaulw7cOpBxmd4gp75ztBEF3";
function App() {
  // const [token, setToken] = useState(undefined);
  useEffect(() => {
    document.title = "11:11 Administrativo";
  }, []);

  // useEffect(() => {
  //   if (!!token) {
  //     firebase
  //       .auth()
  //       .signInWithCustomToken(token)
  //       .then(() => {
  //         console.log("LOGGEDIINNN!!!");
  //       });
  //   }
  // }, [token]);

  // const LogInAdminWithGoogle = () => {
  //   firebase
  //     .auth()
  //     .signInWithCustomToken(userId)
  //     .then((token) => {
  //       setToken(token);
  //     });
  // };

  return (
    <AppContainer className="App">
      {/* {LogInAdminWithGoogle} */}
      <AppLayout />
    </AppContainer>
  );
}

export default App;
