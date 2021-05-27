function buildMetadata(sample) {
    console.log(sample)
d3.json("samples.json").then((data) => {
    var metadata= data.metadata;
    var resultsarray= metadata.filter(sampleobject =>
        sampleobject.id == sample);
    console.log(resultsarray)
    var result= resultsarray[0]
    var panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(result).forEach(([key, value]) => {
        panel.append("p").text(key + ':' + value);
    });

});

}

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      var samples= data.samples;
      var resultsarray= samples.filter(sampleobject => 
          sampleobject.id == sample);
      var result= resultsarray[0]
    
      var ids = result.otu_ids;
      var labels = result.otu_labels;
      var values = result.sample_values;

      var LayoutBubble = {
        margin: { t: 0 },
        xaxis: { title: "OTU ID" },
        hovermode: "closest",
        };
    
        var DataBubble = [ 
        {
          x: ids,
          y: values,
          text: labels,
          mode: "markers",
          marker: {
            color: ids,
            size: values,
            }
        }
      ];
    
      Plotly.newPlot("bubble", DataBubble, LayoutBubble); 


      var bar_data =[
        {
          y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
          x:values.slice(0,10).reverse(),
          text:labels.slice(0,10).reverse(),
          type:"bar",
          orientation:"h"
    
        }
      ];
    
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 }
      };
    
      Plotly.newPlot("bar", bar_data, barLayout);
    });
    }
     
    
    function init() {
    // drop down
    var dropdownMenu = d3.select("#selDataset");
    
    // sample names to populate drop down
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        dropdownMenu
          .append("option")
          .text(sample)
          .property("value", sample);
      });
    
      // use first sample to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
    }
    
    function optionChanged(newSample) {
    // fetch new data each time new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
    }

      
    
init();