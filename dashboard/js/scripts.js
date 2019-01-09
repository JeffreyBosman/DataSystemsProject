// Load JSON data
// DUPLICATES
$.getJSON( "./data/duplicates.js" )
  .then(function( json ) {
  for (var i = 0; i < json.duplicates.length; i++) {


    var item = json.duplicates[i];

    var type = item.type;
    var icon = "people";
    var case_A = item.case_A;
    var case_B = item.case_B;
    var match_score = item.match_score;
    var status = item.status;
    var timestamp = item.timestamp;


    if (type == "listings") {
      icon = "home";

      $('<div class="dpl-row">'
      +'<div class="dpl-icon"><i class="material-icons">'+icon+'</i></div>'
      +'<div class="dpl-content">'+case_A+' & '+case_B+'</div>'
      +'<div class="dpl-extra">'+match_score+'%</div>'
      +'</div>').appendTo('#dashboard-duplicate-listings .rows');

    } else {
      icon = "people";

      $('<div class="dpl-row">'
      +'<div class="dpl-icon"><i class="material-icons">'+icon+'</i></div>'
      +'<div class="dpl-content">'+case_A+' & '+case_B+'</div>'
      +'<div class="dpl-extra">'+match_score+'%</div>'
      +'</div>').appendTo('#dashboard-duplicate-accounts .rows');
    }

    $('<tr>'
      +'<td class="duplicate-label"><span id="sort">'+type+'</span><i class="material-icons">'+icon+'</i></td>'
      +'<td>'+case_A+'</td>'
      +'<td>'+case_B+'</td>'
      +'<td>'+match_score+'</td>'
      +'<td class="action-buttons">'
      +'<button type="button" class="btn btn-primary"><i class="material-icons">search</i>View report</button>'
      +'<button type="button" class="btn btn-primary"><i class="material-icons">check</i>Confirm match</button>'
      +'<button type="button" class="btn btn-primary"><i class="material-icons">close</i>Delete match</button>'
      +'<button type="button" class="btn btn-primary"><i class="material-icons">block</i>Mark as unresolvable</button>'
      +'</td>'
      +'</tr>').appendTo('#duplicates tbody');
  }
});

// NEIGHBOURHOODS
$.getJSON( "./data/neighbourhoods.js", function( json ) {
  for (var i = 0; i < json.neighbourhoods.length; i++) {

    var item = json.neighbourhoods[i];

    var name = item.name;
    var accounts = item.accounts;
    var listings = item.listings;
    var listings_per_ha = item.listings_per_ha;
    var avg_price_night = item.avg_price_night;
    var percentage_high_availability = item.percentage_high_availability;
    var percentage_host_with_multiple_listings = item.percentage_host_with_multiple_listings;
    var duplicates = item.duplicates;
    var risk_rank = item.risk_rank;

    $('<tr>'
      +'<td class="risk-label"><span id="sort"></span><i class="material-icons"> fiber_manual_record </i></td>'
      +'<td>'+name+'</td>'
      +'<td>'+accounts+'</td>'
      +'<td>'+listings+'</td>'
      +'<td>'+listings_per_ha+'</td>'
      +'<td class="euro">'+avg_price_night+'</td>'
      +'<td class="perc">'+percentage_high_availability+'</td>'
      +'<td class="perc">'+percentage_host_with_multiple_listings+'</td>'
      +'<td>'+duplicates+'</td>'
      +'<td>'+risk_rank+'</td>'
      +'</tr>').appendTo('#neighbourhoods tbody');
  }

  // Random colors for labels table
  var colors = {0:'#e74c3c', 1:'#f1c40f', 2:'#2ecc71'};
  var elems = document.getElementsByClassName('risk-label');

  for (i=0; i<elems.length; i++) {
    var random_key = Math.floor(Math.random() * Object.keys(colors).length)
    var random_color = colors[random_key];
    elems[i].style.color = random_color;
    elems[i].firstElementChild.innerHTML = random_key;
  }
});



