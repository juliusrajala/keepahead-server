var MainComponent = React.createClass({
  render: function(){
    return(
      <div className="mainContainer">
      <h1> Julius <span className="surname">Rajala</span> </h1>
        <p>Lorem ipsum salum sipsum. Kipsun kapsun kopsun.
        Lorem ipsum salum sipsum. Kipsun kapsun kopsun.
        Lorem ipsum salum sipsum. Kipsun kapsun kopsun.
        Lorem ipsum salum sipsum. Kipsun kapsun kopsun.
        Lorem ipsum salum sipsum. Kipsun kapsun kopsun.</p>
      </div>
      
    );
  }
});

ReactDOM.render(
  <MainComponent/>,
  document.getElementById('componentSet')
);
