

var Livemap = React.createClass({
  componentDidMount: function(){
    var map = this.map = L.map(ReactDOM.findDOMNode(this),{
      minZoom: 2,
      maxZoom:20,
      layers: [
        L.tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'})
      ],
      attributionControl: false,
    })


    map.on('click', this.onMapClick);
    //map.fitWorld();
    map.fitBounds([
    [41.762, -75.277],
    [41.824, -75.175]
    ]);


    var marker = L.marker([60.45, 22.27]).addTo(map);
    marker.bindPopup("<b>TERVE!</b><br>Olen Turku.").openPopup();

    map.panTo([60.45, 22.27]);


  },
  componentWillUnmount: function(){
    this.map.off('click', this.onMapClick);
    this.map = null;
  },
  onMapClick: function(){

  },
  render: function(){
    return(
      <div className= 'map'></div>
    );
  }
});


ReactDOM.render(
  <Livemap/>,
  document.getElementById('map')
);
