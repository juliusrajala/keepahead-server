
var googleMapComponent = React.createClass({
  render: function(){
    return(
      <GoogleMap containerProps={{
          ...this.props,
          style: {
            height: "100%",
          },
        }}
        /*
         * 3. config <GoogleMap> instance by properties
         */
        defaultZoom={8}
        defaultCenter={{lat: -34.397, lng: 150.644}} />
    );
  }
});

ReactDOM.render(
  <googleMapComponent/>,
  document.getElementById('componentSet')
);
