// ----------------------------------------------------------------------------------------------------------------------
// DONUT CHART ----------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

var donutChart;
(function() {
  var w = 120,
   h = 120,
   r = 58,
   innerRadius = 52,
   transitionsDuration = 1000,
   transitionsDelay = 250,
   percentageTextSize = '22px';

  // This is the scale to avoid using gradiant for the angles.


  // Here we use the helper function of d3 to draw arcs easier
  var arc = d3.svg.arc()
    .outerRadius(r + 0.8)
    .innerRadius(innerRadius);

  // Another helper function of d3 to bind the data to the arcs
  var pie = d3.layout.pie()
    .value(function(d) {
      return d.value;
    });

  donutChart = {
    /**
     * A d3 function that draws a donut chart.
     */
    draw: function(container, data) {

      var svg = d3.select(container)
        .append('svg');

      var rScale = initScale(data);
      createBigCircle(svg);
      var vis = createChartContainer(svg, data);
      drawChartArcs(vis, data);
      createSmallCircle(vis);
      drawPercentageText(vis, data);

    }
  };

  // Here we give dimensions to the svg and create a g container
  function initScale(data) {
    return d3.scale.linear().domain([0, 100]).range([0, 2 * Math.PI]);
  }

  // Here we create the big circle (the outer one)
  function createBigCircle(svg) {
    svg.append('circle')
      .attr('cx', r)
      .attr('cy', r)
      .attr('r', r)
      .attr('class', 'pie-graph-big-circle');
  }

  // Here we give dimensions to the svg and create a g container
  function createChartContainer(svg, data) {
    return svg
      .data([data])
      .attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('transform', 'translate(' + r + ',' + r + ')');
  }

  // We draw the arc in here, give it an smooth transition and the correct color depending on the data.
  function drawChartArcs(visualization, data) {
    var arcs = visualization.selectAll('g')
      .data(pie)
      .enter()
      .append('g');

    arcs.append('path')
    /*.attr('transform', function(d){return 'rotate('+rotationAngle(d.value)+')' })*/
    .attr('fill', function(d, i) {
      return data[i].color;
    })
      .each(function(d) {
        d.endAngle = 0;
      })
      .attr('d', arc)
      .transition()
      .duration(transitionsDuration)
      .delay(transitionsDelay)
      .ease('elastic')
      .call(arcTween, this);
  }

  // This help us achieve the arcs transitions.
  function arcTween(transition, newAngle) {

    transition.attrTween("d", function(d) {

      var interpolate = d3.interpolate(0, 360 * (d.value / 100) * Math.PI / 180);

      return function(t) {

        d.endAngle = interpolate(t);

        return arc(d);
      };
    });
  }

  // This is the small circle, the one with the text in the middle.
  function createSmallCircle(visualization) {
    visualization.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', innerRadius)
      .attr('class', 'pie-graph-small-circle');
  }

  // This is the percentage text, it appears with the same transition as the path/arcs
  function drawPercentageText(visualization, data) {
    visualization.append('text')
      .data(data)
      .attr("fill", "black")
      .attr('text-anchor', 'middle')
      .attr('y', '18px')
      .text(function(d) {
        return d.valueText + d.after;
      })
      .transition()
      .attr('font-size', percentageTextSize)
      .attr('font-weight', 500)
      .duration(transitionsDuration)
      .delay(transitionsDelay)
      .ease('elastic');

    visualization.append('text')
      .data(data)
      .attr("fill", "#AEB3BD")
      .attr('text-anchor', 'middle')
      .attr('y', '-8px')
      .text(function(d) {
        return d.text;
      })
      .transition()
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('style', 'text-transform: uppercase;')
      .duration(transitionsDuration)
      .delay(transitionsDelay)
      .ease('elastic');
  }
})();

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
    var collection_new = duplicates.filter(function(x) { return x.status == 'Undifined'; });

    // Generate donut chart
    var total_duplicates = duplicates.length;
    var total_new = duplicates.filter(function(x) { return x.status == 'Undifined'; }).length;
    var total_match = duplicates.filter(function(x) { return x.status == 'correct'; }).length;
    var total_no_match = duplicates.filter(function(x) { return x.status == 'incorrect'; }).length;
    var total_unsolvable = duplicates.filter(function(x) { return x.status == 'unsolvable'; }).length;

    // Seed data to populate the donut pie chart
    var duplicatesAggr = [{
      "label": "correct",
      "value": total_match.toString(),
      "color": "#2ecc71"
    }, {
      "label": "incorrect",
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
    var arcText = d3.scale.ordinal()
      .range([0, width]);

    // Determine size of arcs
    var arc = d3.svg.arc()
      .innerRadius(radius - 30)
      .outerRadius(radius - 10);

    // Create the donut pie chart layout
    var pie = d3.layout.pie()
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
      .attr("dy", "0.1em")
      .style("text-anchor", "middle")
      .attr("class", "inner-circle")
      .attr("fill", "#354f")
      .text(function(d) { return total_duplicates.toString(); });

    svg.append("text")
      .attr("dy", "1.9em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("text-transform", "uppercase")
      .attr("class", "inner-circle")
      .attr("fill", "#AEB3BD")
      .text(function(d) { return 'duplicates'; });

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
  var dash_top = 4;

  // Load top duplicates on dashboard
  for (var i = 0; i < collection_new.length; i++) {
      if (i < dash_top) {
      $('<a href="duplicate-view.html?ID='+collection_new[i].duplicate_ID+'"><div class="dpl-row">'
      +'<div class="dpl-icon"><i class="material-icons">filter_none</i></div>'
      +'<div class="dpl-content">'+collection_new[i].case_A_id+' & '+collection_new[i].case_B_id+'</div>'
      +'<div class="dpl-extra">'+ (collection_new[i].match_score*100).toPrecision(3) +'%</div>'
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
    +'<td>'+(collection_new[i].match_score*100).toPrecision(3)+'%</td>'
    +'<td class="listing-id">'+collection_new[i].case_A_id+'</td>'
    +'<td class="listing-id">'+collection_new[i].case_B_id+'</td>'
    +'<td class="action-buttons">'
    +'<a href="duplicate-view.html?ID='+collection_new[i].duplicate_ID+'"><button type="button" class="btn btn-secondary"><i class="material-icons">search</i>View report</button></a>'
    +'</td>'
    +'</tr>').appendTo('#duplicates tbody');
  }

// INSERT DATA FOR SINGLE DUPLICATE VIEW --------------------------------------------------------------------------------
} else if (view == "duplicate-view") {

  for (var i = 0; i < duplicates.length; i++) {
    if (duplicates[i].duplicate_ID == duplicateId) {
      var id1 = duplicates[i].case_A_id;
      var id2 = duplicates[i].case_B_id;
      document.getElementById('duplicate-id-1').innerHTML = id1;
      document.getElementById('duplicate-id-2').innerHTML = id2;

      $('#airbnb-embed-frame-1').attr('data-id',id1);
      $('#airbnb-embed-frame-1-link-1').attr('data-id','https://www.airbnb.com/rooms/8573716'+id1);
      $('#airbnb-embed-frame-1-link-2').attr('data-id','https://www.airbnb.com/rooms/8573716'+id1);

      $('#airbnb-embed-frame-2').attr('data-id',id2);
      $('#airbnb-embed-frame-2-link-1').attr('data-id','https://www.airbnb.com/rooms/8573716'+id2);
      $('#airbnb-embed-frame-2-link-2').attr('data-id','https://www.airbnb.com/rooms/8573716'+id2);

      if (duplicates[i].status == 'Undifined') {
        $('#status').html('<span>to do</span>');
      } else {
        $('#status').html('<span>'+duplicates[i].status+'</span>');
      }

      donutChart.draw('#donut-chart-score', [{value: (duplicates[i].match_score*100).toPrecision(3), valueText: (duplicates[i].match_score*100).toPrecision(3), text: 'total score', color: '#333', middleText: 'TARGET', after:'%'}] );
      donutChart.draw('#donut-chart-name', [{value: (duplicates[i].feature_name*100).toPrecision(3), valueText: (duplicates[i].feature_name*100).toPrecision(3), text: 'name', color: '#aaa', middleText: 'TARGET', after:'%'}] );
      donutChart.draw('#donut-chart-description', [{value: (duplicates[i].feature_description*10*10).toPrecision(3), valueText: (duplicates[i].feature_description*10*10).toPrecision(3), text: 'description', color: '#aaa', middleText: 'TARGET', after:'%'}] );
      donutChart.draw('#donut-chart-price', [{value: (duplicates[i].feature_name*100).toPrecision(3), valueText: (duplicates[i].feature_name*100).toPrecision(3), text: 'price', color: '#aaa', middleText: 'TARGET', after:'%'}] );
      donutChart.draw('#donut-chart-attributes', [{value: (duplicates[i].feature_listing_attributes*100).toPrecision(3), valueText: (duplicates[i].feature_listing_attributes*100).toPrecision(3), text: 'amenities', color: '#aaa', middleText: 'TARGET', after:'%'}] );
      donutChart.draw('#donut-chart-location', [{value: (duplicates[i].feature_location*100).toPrecision(3), valueText: (duplicates[i].feature_location*100).toPrecision(3), text: 'location', color: '#aaa', middleText: 'TARGET', after:'%'}] )

      var compDays = listings[id1]['est_bookings_2018']+listings[id2]['est_bookings_2018'];
      if (compDays <= 30) {
        donutChart.draw('#donut-chart-days', [{value: (compDays/365*100), valueText: compDays, text: 'nights/year', color: '#39CA74', middleText: 'TARGET', after:''}] )
      } else {
        donutChart.draw('#donut-chart-days', [{value: (compDays/365*100), valueText: compDays, text: 'nights/year', color: '#FF0000', middleText: 'TARGET', after:''}] )
      }
    }
  }

// INSERT DATA FOR NEIGHBOURHOODS OVERVIEW ------------------------------------------------------------------------------
} else if (view == "neighbourhoods") {

  for (var i = 0; i < neighbourhoodsInfo.length; i++) {
    var nbh = neighbourhoodsInfo[i];
    var listings_per_ha = Math.round( nbh.listings_per_ha * 10 ) / 10;
    var avg_price_night = Math.round( nbh.avg_price_night );
    var percentage_high_availability = Math.round( nbh.percentage_high_availability * 10 ) / 10;
    var percentage_host_with_multiple_listings = Math.round( nbh.percentage_host_with_multiple_listings * 10 ) / 10;
    var duplicates = Math.round( nbh.duplicates * 10 ) / 10;
    var risk_rank = Math.round( nbh.risk_rank );

    var selectedNeighbourhood = nbh.name

    var rank = parseInt(nbh.risk_rank)
    if (rank <= 5) {
      var riskColor = '#e74c3c';
    } else if ((rank > 5) & (rank <= 15)) {
      var riskColor = '#f1c40f';
    } else {
      var riskColor = '#2ecc71';
    }

    if (rank < 10) {
      var rank = '0'+rank;
    }

    $('<tr class="clickable-row" data-href="neighbourhood-view.html?name='+selectedNeighbourhood+'">'
      +'<td class="risk-label"><span id="sort">'+ rank +'</span><i class="material-icons" style="color:'+ riskColor +';"> fiber_manual_record </i></td>'
      +'<td><span style="font-weight: 500;">'+nbh.name+'</span></td>'
      +'<td>'+nbh.accounts+'</td>'
      +'<td>'+nbh.listings+'</td>'
      +'<td class="euro">'+avg_price_night+'</td>'
      +'<td class="perc">'+percentage_high_availability+'</td>'
      +'<td class="perc">'+percentage_host_with_multiple_listings+'</td>'
      +'<td>'+duplicates+'</td>'
      +'</tr>').appendTo('#neighbourhoods tbody');


  }

// INSERT DATA FOR SINGLE NEIGHBOURHOOD VIEW ----------------------------------------------------------------------------
} else if (view == "neighbourhood-view") {
  console.log(neighbourhoodsInfo)
  for (var i = 0; i < neighbourhoodsInfo.length; i++) {
    var nbh = neighbourhoodsInfo[i];
    var percentage_host_with_multiple_listings = Math.round( nbh.percentage_host_with_multiple_listings * 10 ) / 10;
    var duplicates = Math.round( nbh.duplicates * 10 ) / 10;
    var risk_rank = Math.round( nbh.risk_rank );

    if (nbh.name == selectedNeighbourhood) {
      document.getElementById('neighbourhood-name').innerHTML = selectedNeighbourhood;
      document.getElementById('dupl-no-accounts').innerHTML = nbh.accounts;
      document.getElementById('dupl-no-listings').innerHTML = nbh.listings;
      document.getElementById('dupl-price').innerHTML = Math.round( nbh.avg_price_night );
      document.getElementById('dupl-high-avail').innerHTML = Math.round( nbh.percentage_high_availability * 10 ) / 10;
      document.getElementById('dupl-multi-list').innerHTML = Math.round( nbh.percentage_host_with_multiple_listings * 10 ) / 10;
      document.getElementById('dupl-duplicates').innerHTML = Math.round( nbh.duplicates );
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


