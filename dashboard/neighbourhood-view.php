<!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8">

  <title>Gemeente Amsterdam | Airbnb Dashboard</title>

  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">

  <!-- Custom CSS -->
  <link rel="stylesheet" href="css/styles.css?v=2.0">

  <!-- Fonts CSS -->
  <link rel="stylesheet" href="fonts/font.css?v=1.0">

  <!-- Material Icons -->
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">

  <!-- Sortable tables -->
  <script src="js/sorttable.js"></script>

  <!-- D3 -->
  <script src="https://d3js.org/d3.v5.min.js" charset="utf-8"></script>

  <!-- Jquery -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

  <!-- Map includes -->
  <link rel="stylesheet" href="leaflet/leaflet.css" />
  <script src="leaflet/leaflet.js"></script>
  <link rel="stylesheet" type="text/css" href="css/maptheme.css">
  <!-- map data -->
  <script src="data/neighbourhoodsLocations.js" type="text/javascript"></script>
  <script type="text/javascript" src="data/listingsFromCsv.js"></script>

  <!-- Set view -->
  <script charset="utf-8"> var view = "neighbourhood-view"; </script>
</head>

<body>

  <div id="wrapper">

    <!-- Sidebar -->
    <div id="sidebar-wrapper">
        <ul class="sidebar-nav">
            <li class="sidebar-brand">
                <img class="logo" src="img/logo.png" alt="Gemeente Amsterdam logo" />
            </li>
            <hr>
            <li>
                <a href="index.html"><i class="material-icons">dashboard</i>Dashboard</a>
            </li>
            <li>
                <a href="neighbourhoods.html" class="current"><i class="material-icons">pin_drop</i>Neighbourhoods</a>
            </li>
            <li>
                <a href="duplicates.html"><i class="material-icons">people</i>Duplicates</a>
            </li>
            <hr>
            <li>
                <a href="" data-toggle="modal" data-target="#helpModal"><i class="material-icons">help</i>More info</a>
            </li>
            <li>
                <a href="login.html"><i class="material-icons">directions_run</i>Log out</a>
            </li>
        </ul>
    </div>

    <!-- Page Content -->
    <div id="page-content-wrapper">
      <div class="container-fluid">
        <a class="back-link" href="./neighbourhoods.html">
          <i class="material-icons">keyboard_arrow_left</i>
          Back to neightbourhood overview
        </a>
        <h1 id="neighbourhood-name"><?php echo $_GET["name"]; ?></h1>
        <div class="row">
          <div class="col-sm-8">

            <div id="mapid" class="databox map-overview">
              <!--- ######################CODE VOOR DE KAART############################################ -->
              <script>
                var listings = JSON.parse(listingsFromCsv);
                var selectedNeighbourhood = getQueryVariable("name");

                function getQueryVariable(variable)
                {
                    var query = window.location.search.substring(1);
                    var vars = query.split("&");
                    for (var i=0;i<vars.length;i++) {
                            var pair = vars[i].split("=");
                            if(pair[0] == variable){return decodeURI(pair[1]);}
                    }
                    return(false);
                }
                
                var bounds = getNeighbourhoodBounds(selectedNeighbourhood);

                function getNeighbourhoodBounds(selectedNeighbourhood){
                  for(key in neighbourhoods.features){
                    if(neighbourhoods.features[key].properties.neighbourhood === selectedNeighbourhood){
                      console.log(neighbourhoods.features[key]);
                      return neighbourhoods.features[key];
                    }
                  }
                  return false;
                }

                var map = L.map('mapid').setView([52.377, 4.880], 13);

                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                  maxZoom: 18,
                  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                  id: 'mapbox.streets'
                }).addTo(map);

                //#########################################################
                // control that shows state info on hover
                var info = L.control();

                info.onAdd = function (map) {
                  this._div = L.DomUtil.create('div', 'info');
                  this.update();
                  return this._div;
                };

                info.update = function (props) {
                  this._div.innerHTML = '<b>Neighbourhood:</b><br/><b>' + selectedNeighbourhood + '</b><br />';
                };

                info.addTo(map);

                function style(feature) {
                  return {
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.2,
                    fillColor: '#80002'
                  };
                }

                var geojson;
                
                function onEachFeature(feature, layer) {
                  layer._leaflet_id = feature.properties.neighbourhood;

                  //fit on the selectedNeighbourhood
                  if(feature.properties.neighbourhood === selectedNeighbourhood){
                    map.fitBounds(layer.getBounds());
                  }

                }
                
                //get the neighbourhood outline
                geojson = L.geoJson(neighbourhoods, {
                  style: style,
                  onEachFeature: onEachFeature
                }).addTo(map);

                //pop ups for listings
                for(key in listings){
                  if(listings[key].neighbourhood === selectedNeighbourhood){
                    var listinginfo = listings[key];
                    L.circle([listinginfo.latitude,listinginfo.longitude], 25).addTo(map).bindPopup("<b>" + key + "</b><br/>" +
                    "host id: " + listinginfo.host_id + "<br/>" +
                    "price: " + listinginfo.price + "<br/>" +
                    "number of reviews: " + listinginfo.number_of_reviews + "<br/>" +
                    "availability 365: " + listinginfo.availability_365 + "<br/>");
                  }
                }

              </script>
              <!--- ######################CODE VOOR DE KAART############################################ -->

            </div>
          </div>
          <div class="col-sm-4">
            <div class="databox map-menu">
              <h2>Overview</h2>

              <p><span id="dupl-no-accounts"></span> accounts</p>
              <p><span id="dupl-no-listings"></span> listings</p>
              <p><span id="dupl-listings-ha"></span> listings per ha</p>
              <p>&euro;<span id="dupl-price"></span> per night on average</p>
              <p><span id="dupl-high-avail"></span>% listings with high availability</p>
              <p><span id="dupl-multi-list"></span>% hosts have multi-listings</p>

              <br/>
              <h2>Top hosts in this area</h2>

              <p>some hosts here</p>

            </div>
          </div>
        </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="helpModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Airbnb dashboard</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Some extra help text here.
        </div>
        <div class="modal-footer action-buttons">
          <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Bootstrap -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>

  <!-- Data -->
  <script type="text/javascript" src="data/duplicates.js"></script>
  <script type="text/javascript" src="data/listings.js"></script>
  <script type="text/javascript" src="data/accounts.js"></script>
  <script type="text/javascript" src="data/neighbourhoods.js"></script>
  <script type="text/javascript" src="data/neighbourhoodsLocations.js"></script>

  <!-- Custom js -->
  <script src="js/scripts.js"></script>
</body>
</html>