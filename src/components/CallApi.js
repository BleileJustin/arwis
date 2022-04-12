const CallApi = (props) => {

  const callApi = async () => {
    await fetch("/trade").then((response) => response.text()).then((data) => console.log(data));
  };

  return (<button className="callApiButt" onClick={callApi}>
    Call Api
  </button>);
};

export default CallApi;
