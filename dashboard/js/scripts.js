// ----------------------------------------------------------------------------------------------------------------------
// DATA LOADING ---------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

// LOAD DUPLICATE DATA --------------------------------------------------------------------------------------------------
if (typeof duplicates !== 'undefined') {

    // Order duplicates based on match score (if not already)
    duplicates.sort(function(a, b){
        return b.match_score - a.match_score;
    });

    // Select only "new" duplicates
    var collection_new = duplicates.filter(function(x) { return x.status == 'new'; });

    // Generate donut chart
    var total_duplicates = duplicates.length;
    var total_new = duplicates.filter(function(x) { return x.status == 'new'; }).length;
    var total_match = duplicates.filter(function(x) { return x.status == 'match'; }).length;
    var total_no_match = duplicates.filter(function(x) { return x.status == 'no-match'; }).length;
    var total_unsolvable = duplicates.filter(function(x) { return x.status == 'unsolvable'; }).length;

    // Seed data to populate the donut pie chart
    var duplicatesAggr = [{
      "label": "correct match",
      "value": total_match.toString(),
      "color": "#2ecc71"
    }, {
      "label": "wrong match",
      "value": total_no_match.toString(),
      "color": "#ff6b6b"
    }, {
      "label": "unsolvable",
      "value": total_unsolvable.toString(),
      "color": "#feca57"
    }, {
      "label": "unresolved",
      "value": total_new.toString(),
      "color": "#e3e3e3"
    }];

    // Define size & radius of donut pie chart
    var width = 190,
        height = 190,
        radius = Math.min(width, height) / 2;

    // Define arc ranges
    var arcText = d3.scaleOrdinal()
      .range([0, width]);

    // Determine size of arcs
    var arc = d3.arc()
      .innerRadius(radius - 50)
      .outerRadius(radius - 0);

    // Create the donut pie chart layout
    var pie = d3.pie()
      .value(function (d) { return d["value"]; })
      .sort(null);

    // Append SVG attributes and append g to the SVG
    var svg = d3.select("#donut-chart")
      .attr("width", width)
      .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + radius + "," + radius + ")");

    // Define inner circle
    svg.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 100)
      .attr("fill", "#fff") ;

    // Calculate SVG paths and fill in the colours
    var g = svg.selectAll(".arc")
      .data(pie(duplicatesAggr))
      .enter().append("g")
      .attr("class", "arc")

      // Make each arc clickable

        // Append the path to each g
        g.append("path")
        .attr("d", arc)
        .attr("fill", function(d, i) {
            return duplicatesAggr[i].color;
        });

        // Append text labels to each arc
        g.append("text")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("fill", "#fff")
            .text("")

    // Append text to the inner circle
    svg.append("text")
      .attr("dy", "-0.3em")
      .style("text-anchor", "middle")
      .attr("class", "inner-circle")
      .attr("fill", "#36454f")
      .text(function(d) { return total_duplicates.toString(); });

    svg.append("text")
      .attr("dy", "0.8em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .attr("class", "inner-circle")
      .attr("fill", "#36454f")
      .text(function(d) { return 'duplicates'; });

    svg.append("text")
      .attr("dy", "2em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .attr("class", "inner-circle")
      .attr("fill", "#36454f")
      .text(function(d) { return 'found'; });

    d3.select("#no-match").text(total_no_match.toString());
    d3.select("#match").text(total_match.toString());
    d3.select("#unsolvable").text(total_unsolvable.toString());
    d3.select("#unresolved").text(total_new.toString());
    d3.select("#total-duplicates").text(total_duplicates.toString());
}

// LOAD NEIGHBOURHOOD DATA ----------------------------------------------------------------------------------------------
if (typeof neighbourhoods !== 'undefined') {
}

// ----------------------------------------------------------------------------------------------------------------------
// DATA INSERTING -------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

// INSERT DATA FOR DASHBOARD VIEW ---------------------------------------------------------------------------------------
if (view == "dashboard") {

  // Amount of duplicates to show on dashboard
  var dash_top = 5;

  // Load top duplicates on dashboard
  for (var i = 0; i < collection_new.length; i++) {
      if (i < dash_top) {
      $('<a href="duplicate-view.html"><div class="dpl-row">'
      +'<div class="dpl-icon"><i class="material-icons">filter_none</i></div>'
      +'<div class="dpl-content">'+collection_new[i].case_A_id+' & '+collection_new[i].case_B_id+'</div>'
      +'<div class="dpl-extra">'+collection_new[i].match_score+'%</div>'
      +'</div></a>').appendTo('#dashboard-duplicate-listings .rows');
    }
  }

  // Check if there were enough duplicates to show, otherwise adjust dash_top
  if (dash_top > collection_new.length) {
    document.getElementById('total-showing').innerHTML = collection_new.length;
  } else {
    document.getElementById('total-showing').innerHTML = dash_top;
  }

// INSERT DATA FOR DUPLICATES OVERVIEW -----------------------------------------------------------------------------------
} else if (view == "duplicates") {
  // Load rows for duplicates table
  for (var i = 0; i < collection_new.length; i++) {
    $('<tr>'
    +'<td>'+collection_new[i].match_score+'%</td>'
    +'<td class="listing-id"><i class="material-icons">home</i> '+collection_new[i].case_A_id+'</td>'
    +'<td class="listing-id"><i class="material-icons">home</i> '+collection_new[i].case_B_id+'</td>'
    +'<td class="action-buttons">'
    +'<a href="duplicate-view.html"><button type="button" class="btn btn-secondary"><i class="material-icons">search</i>View report</button></a>'
    +'</td>'
    +'</tr>').appendTo('#duplicates tbody');
  }

// INSERT DATA FOR SINGLE DUPLICATE VIEW --------------------------------------------------------------------------------
} else if (view == "duplicate-view") {
  // ...

// INSERT DATA FOR NEIGHBOURHOODS OVERVIEW ------------------------------------------------------------------------------
} else if (view == "neighbourhoods") {

  for (var i = 0; i < neighbourhoods.length; i++) {
    var nbh = neighbourhoods[i];
    var listings_per_ha = Math.round( nbh.listings_per_ha * 10 ) / 10;
    var avg_price_night = Math.round( nbh.avg_price_night );
    var percentage_high_availability = Math.round( nbh.percentage_high_availability * 10 ) / 10;
    var percentage_host_with_multiple_listings = Math.round( nbh.percentage_host_with_multiple_listings * 10 ) / 10;
    var duplicates = Math.round( nbh.duplicates * 10 ) / 10;
    var risk_rank = Math.round( nbh.risk_rank );

    $('<tr class="clickable-row" data-href="neighbourhood-view.php?name='+nbh.name+'">'
      +'<td class="risk-label"><span id="sort"></span><i class="material-icons"> fiber_manual_record </i></td>'
      +'<td>'+nbh.name+'</td>'
      +'<td>'+nbh.accounts+'</td>'
      +'<td>'+nbh.listings+'</td>'
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

// INSERT DATA FOR SINGLE NEIGHBOURHOOD VIEW ----------------------------------------------------------------------------
} else if (view == "neighbourhood-view") {
  for (var i = 0; i < neighbourhoods.length; i++) {
    var nbh = neighbourhoods[i];
    var listings_per_ha = Math.round( nbh.listings_per_ha * 10 ) / 10;
    var avg_price_night = Math.round( nbh.avg_price_night );
    var percentage_high_availability = Math.round( nbh.percentage_high_availability * 10 ) / 10;
    var percentage_host_with_multiple_listings = Math.round( nbh.percentage_host_with_multiple_listings * 10 ) / 10;
    var duplicates = Math.round( nbh.duplicates * 10 ) / 10;
    var risk_rank = Math.round( nbh.risk_rank );

    if (document.getElementById('neighbourhood-name')) {
      var currentNeighbourhood = document.getElementById('neighbourhood-name').innerHTML;
      console.log(currentNeighbourhood);

      if (nbh.name == currentNeighbourhood) {
        document.getElementById('dupl-no-accounts').innerHTML = nbh.accounts;
        document.getElementById('dupl-no-listings').innerHTML = nbh.listings;
        document.getElementById('dupl-listings-ha').innerHTML = listings_per_ha;
        document.getElementById('dupl-price').innerHTML = avg_price_night;
        document.getElementById('dupl-high-avail').innerHTML = percentage_high_availability;
        document.getElementById('dupl-multi-list').innerHTML = percentage_host_with_multiple_listings;
      }
    }
  }
}

// ----------------------------------------------------------------------------------------------------------------------
// OTHER JS -------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

// Link  functionality for neighbourhoods table -------------------------------------------------------------------------
jQuery(document).ready(function($) {
    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    });
});

