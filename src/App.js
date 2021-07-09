import styled from 'styled-components';
import './App.css';
import AppLayout from './Components/navigation/AppLayout';

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;

function App() {
  
  return (
    <AppContainer className="App">
      <AppLayout />
    </AppContainer>
  );
}

export default App;
