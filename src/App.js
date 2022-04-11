import Button from "./components/CallApi";
function App() {
  const callApi = async () => {
    await fetch("/trade")
      .then((response) => response.text())
      .then((data) => console.log(data));
  };

  return (
    <div>
      <Button onClick={callApi}></Button>
    </div>
  );
}

export default App;
