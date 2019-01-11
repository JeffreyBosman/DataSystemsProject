// Load JSON data

// DUPLICATES
$.getJSON( "./data/duplicates.js" )
  .then(function( json ) {

    // sort duplicates based on match_score
    json.sort(function(a, b){
        return b.match_score - a.match_score;
    });

    var f_new = json.filter(function(x) { return x.status == 'new'; });
    var dash_top = 4;

    for (var i = 0; i < f_new.length; i++) {
      if (i < 4) {
      $('<a href="duplicate-view.html"><div class="dpl-row">'
      +'<div class="dpl-icon"><i class="material-icons">filter_none</i></div>'
      +'<div class="dpl-content">'+f_new[i].case_A_id+' & '+f_new[i].case_B_id+'</div>'
      +'<div class="dpl-extra">'+f_new[i].match_score+'%</div>'
      +'</div></a>').appendTo('#dashboard-duplicate-listings .rows');
      }

      $('<tr>'
      +'<td>'+f_new[i].case_A_id+'</td>'
      +'<td>'+f_new[i].case_B_id+'</td>'
      +'<td>'+f_new[i].match_score+'%</td>'
      +'<td class="action-buttons">'
      +'<a href="duplicate-view.html"><button type="button" class="btn btn-primary"><i class="material-icons">search</i>View report</button></a>'
      +'<button type="button" class="btn btn-primary"><i class="material-icons">check</i>Confirm match</button>'
      +'<button type="button" class="btn btn-primary"><i class="material-icons">close</i>Delete match</button>'
      +'<button type="button" class="btn btn-primary"><i class="material-icons">block</i>Mark as unresolvable</button>'
      +'</td>'
      +'</tr>').appendTo('#duplicates tbody');
    }

    var total_new = json.filter(function(x) { return x.status == 'new'; }).length;
    document.getElementById('total-duplicates').innerHTML = total_new;

    var total_duplicates = json.length;
    document.getElementById('stats-total-duplicates').innerHTML = total_duplicates;

    var total_match = json.filter(function(x) { return x.status == 'match'; }).length;
    document.getElementById('stats-total-match').innerHTML = total_match;

    var total_no_match = json.filter(function(x) { return x.status == 'no-match'; }).length;
    document.getElementById('stats-total-no-match').innerHTML = total_no_match;

    var total_unsolvable = json.filter(function(x) { return x.status == 'unsolvable'; }).length;
    document.getElementById('stats-total-unsolvable').innerHTML = total_unsolvable;

    if (dash_top > f_new.length) {
      document.getElementById('total-showing').innerHTML = f_new.length;
    }
});

// NEIGHBOURHOODS
$.getJSON( "./data/neighbourhoods.js", function( json ) {
  for (var i = 0; i < json.length; i++) {

    var item = json[i];

    var name = item.name;
    var accounts = item.accounts;
    var listings = item.listings;
    var listings_per_ha = Math.round( item.listings_per_ha * 10 ) / 10;
    var avg_price_night = Math.round( item.avg_price_night );
    var percentage_high_availability = Math.round( item.percentage_high_availability * 10 ) / 10;
    var percentage_host_with_multiple_listings = Math.round( item.percentage_host_with_multiple_listings * 10 ) / 10;
    var duplicates = Math.round( item.duplicates * 10 ) / 10;
    var risk_rank = Math.round( item.risk_rank );

    $('<tr class="clickable-row" data-href="neighbourhood-view.html">'
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

// Update duplicate status
function updateDuplicateStatus(id, new_status) {

  $.getJSON( "./data/duplicates.js" )
  .then(function( json ) {

    for (var i = 0; i < json.length; i++) {
      if (json[i].duplicate_ID == id) {
        json[i].status = new_status
      }
    }
    console.log(json);
  });
};

// Neighbourhoods link table
jQuery(document).ready(function($) {
    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    });
});

