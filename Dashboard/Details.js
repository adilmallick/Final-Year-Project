var device;
var charts = [];
var bgColor = [], pm25 = [],pm10 = [];
var ct = 0,cnt = 0;
var current_co2, current_voc, current_pm10, current_pm25;
// var fixTime = 0;
var tConverter;
var tl = 0, no_skip = 0;
var index = 0;
var lastTime = 100, tickC = 0;


urlparam();
function urlparam(){
    let gr = document.getElementById("greeting");
    const d = new Date();
    var curHr = d.getHours();

    if (curHr < 12) {
      gr.innerText = 'Good Morning!';      
    } 
    else if (curHr < 18) {
      gr.innerText = 'Good Afternoon!';
    } 
    else {
      gr.innerText = 'Good Evening!';
    }
   
    let param = new URLSearchParams(window.location.search);
    device = param.get("id").toString();
    // devName = param.get("device").toString();
    // document.getElementById("dev-name").innerHTML = devName.toUpperCase();
    api(device);

    document.getElementById("date").innerHTML = d.toDateString(); 
    var modeChecking = cMode();
    first = 1;
}



var opts_co = {
  angle: -0.2, // The span of the gauge arc
  lineWidth: 0.07, // The line thickness
  radiusScale: 1, // Relative radius
  pointer: {
    length: 0.55, // // Relative to gauge radius
    strokeWidth: 0.026, // The thickness
    color: '#B8BDAF' // Fill color
  },
  limitMax: false,     // If false, max value increases automatically if value > maxValue
  limitMin: false,     // If true, the min value of the gauge will be fixed
  colorStart: '#F03E3E',   // Colors
  colorStop: '#F03E3E',    // just experiment with them
   // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true,     // High resolution support
  staticZones: [
    {strokeStyle: "rgb(9, 187, 9)", min: 0, max: 400}, // Red from 100 to 130
    {strokeStyle: "rgb(238, 182, 0)", min: 401, max: 1000}, // Yellow
    {strokeStyle: "rgb(219, 24, 24)", min: 1001, max : 20000}, // Green  
 ],
 strokeColor: '#F03E3E',
  
};
var canCo = document.getElementById('can-co'); // your canvas element
var gaugeCo = new Gauge(canCo).setOptions(opts_co); // create sexy gauge!
gaugeCo.maxValue = 20000; // set max gauge value
gaugeCo.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeCo.animationSpeed = 32; // set animation speed (32 is default value)
gaugeCo.setTextField(document.getElementById("current-co"));
// document.getElementById("textfield").style.color = color.co2(res.CO2);
// set actual value
gaugeCo.set(0);



var opts_vps = {
  angle: -0.2, // The span of the gauge arc
  lineWidth: 0.07, // The line thickness
  radiusScale: 1, // Relative radius
  pointer: {
    length: 0.55, // // Relative to gauge radius
    strokeWidth: 0.026, // The thickness
    color: '#B8BDAF' // Fill color
  },
  limitMax: false,     // If false, max value increases automatically if value > maxValue
  limitMin: false,     // If true, the min value of the gauge will be fixed
  colorStart: '#F03E3E',   // Colors
  colorStop: '#F03E3E',    // just experiment with them
   // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true,     // High resolution support
  staticZones: [
    {strokeStyle: "rgb(9, 187, 9)", min: 0, max: 30}, // Red from 100 to 130
    {strokeStyle: "rgb(238, 182, 0)", min: 30, max: 70}, // Yellow
    {strokeStyle: "rgb(219, 24, 24)", min: 70, max : 100}, // Green  
 ],
 strokeColor: '#F03E3E',
  
};
var canVPS = document.getElementById('can-vps'); // your canvas element
var gaugeVPS = new Gauge(canVPS).setOptions(opts_vps); // create sexy gauge!
gaugeVPS.maxValue = 100; // set max gauge value
gaugeVPS.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeVPS.animationSpeed = 32; // set animation speed (32 is default value)
gaugeVPS.setTextField(document.getElementById("current-vps"));
gaugeVPS.set(0);





var opts_pm25 = {
  angle: -0.2, // The span of the gauge arc
  lineWidth: 0.07, // The line thickness
  radiusScale: 1, // Relative radius
  pointer: {
    length: 0.55, // // Relative to gauge radius
    strokeWidth: 0.026, // The thickness
    color: '#B8BDAF' // Fill color
  },
  limitMax: false,     // If false, max value increases automatically if value > maxValue
  limitMin: false,     // If true, the min value of the gauge will be fixed
  colorStart: '#F03E3E',   // Colors
  colorStop: '#F03E3E',    // just experiment with them
   // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true,     // High resolution support
  staticZones: [
    {strokeStyle: "rgb(9, 187, 9)", min: 0, max: 50}, // Red from 100 to 130
    {strokeStyle: "rgb(238, 182, 0)", min: 51, max: 100}, // Yellow
    {strokeStyle: "rgb(219, 24, 24)", min: 101, max : 800}, // Green
    
  
 ],
 strokeColor: '#F03E3E',
  
};
var canPm25 = document.getElementById('can-pm25'); // your canvas element
var gaugePm25 = new Gauge(canPm25).setOptions(opts_pm25); // create sexy gauge!
gaugePm25.maxValue = 800; // set max gauge value
gaugePm25.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugePm25.animationSpeed = 32; // set animation speed (32 is default value)
gaugePm25.setTextField(document.getElementById("current-pm25"));
gaugePm25.set(0);


var opts_pm10 = {
  angle: -0.2, // The span of the gauge arc
  lineWidth: 0.07, // The line thickness
  radiusScale: 1, // Relative radius
  pointer: {
    length: 0.55, // // Relative to gauge radius
    strokeWidth: 0.026, // The thickness
    color: '#B8BDAF' // Fill color
  },
  limitMax: false,     // If false, max value increases automatically if value > maxValue
  limitMin: false,     // If true, the min value of the gauge will be fixed
  colorStart: '#F03E3E',   // Colors
  colorStop: '#F03E3E',    // just experiment with them
   // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true,     // High resolution support
  staticZones: [
    {strokeStyle: "rgb(9, 187, 9)", min: 0, max: 27}, // Red from 100 to 130
    {strokeStyle: "rgb(238, 182, 0)", min: 27, max: 30}, // Yellow
    {strokeStyle: "rgb(219, 24, 24)", min: 30, max : 400}, // Green  
 ],
 strokeColor: '#F03E3E',
  
};
var canPm10 = document.getElementById('can-pm10'); // your canvas element
var gaugePm10 = new Gauge(canPm10).setOptions(opts_pm10); // create sexy gauge!
gaugePm10.maxValue = 400; // set max gauge value
gaugePm10.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugePm10.animationSpeed = 32; // set animation speed (32 is default value)
gaugePm10.setTextField(document.getElementById("current-pm10"));
gaugePm10.set(0);


var opts_no = {
  angle: -0.2, // The span of the gauge arc
  lineWidth: 0.07, // The line thickness
  radiusScale: 1, // Relative radius
  pointer: {
    length: 0.55, // // Relative to gauge radius
    strokeWidth: 0.026, // The thickness
    color: '#B8BDAF' // Fill color
  },
  limitMax: false,     // If false, max value increases automatically if value > maxValue
  limitMin: false,     // If true, the min value of the gauge will be fixed
  colorStart: '#F03E3E',   // Colors
  colorStop: '#F03E3E',    // just experiment with them
   // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true,     // High resolution support
  staticZones: [
    {strokeStyle: "rgb(9, 187, 9)", min: 0, max: 34}, // Red from 100 to 130
    {strokeStyle: "rgb(238, 182, 0)", min: 34, max: 51}, // Yellow
    {strokeStyle: "rgb(219, 24, 24)", min: 51, max : 100}, // Green  
 ],
 strokeColor: '#F03E3E',
  
};
var canNo = document.getElementById('can-no'); // your canvas element
var gaugeNo = new Gauge(canNo).setOptions(opts_no); // create sexy gauge!
gaugeNo.maxValue = 100; // set max gauge value
gaugeNo.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeNo.animationSpeed = 32; // set animation speed (32 is default value)
gaugeNo.setTextField(document.getElementById("current-no"));
gaugeNo.set(0);


var opts_no2 = {
  angle: -0.2, // The span of the gauge arc
  lineWidth: 0.07, // The line thickness
  radiusScale: 1, // Relative radius
  pointer: {
    length: 0.55, // // Relative to gauge radius
    strokeWidth: 0.026, // The thickness
    color: '#B8BDAF' // Fill color
  },
  limitMax: false,     // If false, max value increases automatically if value > maxValue
  limitMin: false,     // If true, the min value of the gauge will be fixed
  colorStart: '#F03E3E',   // Colors
  colorStop: '#F03E3E',    // just experiment with them
   // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true,     // High resolution support
  staticZones: [
    {strokeStyle: "rgb(9, 187, 9)", min: 0, max: 30}, // Red from 100 to 130
    {strokeStyle: "rgb(238, 182, 0)", min: 30, max: 70}, // Yellow
    {strokeStyle: "rgb(219, 24, 24)", min: 70, max : 100}, // Green  
 ],
 strokeColor: '#F03E3E',
  
};
var canNo2 = document.getElementById('can-no2'); // your canvas element
var gaugeNo2 = new Gauge(canNo2).setOptions(opts_no2); // create sexy gauge!
gaugeNo2.maxValue = 100; // set max gauge value
gaugeNo2.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeNo2.animationSpeed = 32; // set animation speed (32 is default value)
gaugeNo2.setTextField(document.getElementById("current-no2"));
gaugeNo2.set(0);


var opts_o3 = {
  angle: -0.2, // The span of the gauge arc
  lineWidth: 0.07, // The line thickness
  radiusScale: 1, // Relative radius
  pointer: {
    length: 0.55, // // Relative to gauge radius
    strokeWidth: 0.026, // The thickness
    color: '#B8BDAF' // Fill color
  },
  limitMax: false,     // If false, max value increases automatically if value > maxValue
  limitMin: false,     // If true, the min value of the gauge will be fixed
  colorStart: '#F03E3E',   // Colors
  colorStop: '#F03E3E',    // just experiment with them
   // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true,     // High resolution support
  staticZones: [
    {strokeStyle: "rgb(9, 187, 9)", min: 0, max: 1}, // Red from 100 to 130
    {strokeStyle: "rgb(238, 182, 0)", min: 1, max: 10}, // Yellow
    {strokeStyle: "rgb(219, 24, 24)", min: 10, max : 100}, // Green
    
  
 ],
 strokeColor: '#F03E3E',
  
};
var canO3 = document.getElementById('can-o3'); // your canvas element
var gaugeO3 = new Gauge(canO3).setOptions(opts_o3); // create sexy gauge!
gaugeO3.maxValue = 100; // set max gauge value
gaugeO3.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeO3.animationSpeed = 32; // set animation speed (32 is default value)
gaugeO3.setTextField(document.getElementById("current-o3"));
// document.getElementById("textfield").style.color = color.co2(res.CO2);
// set actual value
gaugeO3.set(0);


var opts_so2 = {
  angle: -0.2, // The span of the gauge arc
  lineWidth: 0.07, // The line thickness
  radiusScale: 1, // Relative radius
  pointer: {
    length: 0.55, // // Relative to gauge radius
    strokeWidth: 0.026, // The thickness
    color: '#B8BDAF' // Fill color
  },
  limitMax: false,     // If false, max value increases automatically if value > maxValue
  limitMin: false,     // If true, the min value of the gauge will be fixed
  colorStart: '#F03E3E',   // Colors
  colorStop: '#F03E3E',    // just experiment with them
   // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true,     // High resolution support
  staticZones: [
    {strokeStyle: "rgb(9, 187, 9)", min: 0, max: 100}, // Red from 100 to 130
    {strokeStyle: "rgb(238, 182, 0)", min: 100, max: 400}, // Yellow
    {strokeStyle: "rgb(219, 24, 24)", min: 400, max : 1000}, // Green
    
  
 ],
 strokeColor: '#F03E3E',
  
};
var canSo2 = document.getElementById('can-so2'); // your canvas element
var gaugeSo2 = new Gauge(canSo2).setOptions(opts_so2); // create sexy gauge!
gaugeSo2.maxValue = 1000; // set max gauge value
gaugeSo2.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeSo2.animationSpeed = 32; // set animation speed (32 is default value)
gaugeSo2.setTextField(document.getElementById("current-so2"));
gaugeSo2.set(0);


var opts_nh3 = {
  angle: -0.2, // The span of the gauge arc
  lineWidth: 0.07, // The line thickness
  radiusScale: 1, // Relative radius
  pointer: {
    length: 0.55, // // Relative to gauge radius
    strokeWidth: 0.026, // The thickness
    color: '#B8BDAF' // Fill color
  },
  limitMax: false,     // If false, max value increases automatically if value > maxValue
  limitMin: false,     // If true, the min value of the gauge will be fixed
  colorStart: '#F03E3E',   // Colors
  colorStop: '#F03E3E',    // just experiment with them
   // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true,     // High resolution support
  staticZones: [
    {strokeStyle: "rgb(9, 187, 9)", min: 0, max: 2500}, // Red from 100 to 130
    {strokeStyle: "rgb(238, 182, 0)", min: 2500, max: 4500}, // Yellow
    {strokeStyle: "rgb(219, 24, 24)", min: 4500, max : 6000}, // Green
    
  
 ],
 strokeColor: '#F03E3E',
  
};
var canNh3 = document.getElementById('can-nh3'); // your canvas element
var gaugeNh3 = new Gauge(canNh3).setOptions(opts_nh3); // create sexy gauge!
gaugeNh3.maxValue = 6000; // set max gauge value
gaugeNh3.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeNh3.animationSpeed = 32; // set animation speed (32 is default value)
gaugeNh3.setTextField(document.getElementById("current-nh3"));
gaugeNh3.set(0);





var color = {
  co : function(val){
    if(val <= 400){
      return 'rgb(9 187 9)';
    }
    else if(val <= 1000){
      return 'rgb(238 182 0)';
    }
    else{
      return 'rgb(219 24 24)';
    }
  },

  no: function(val){
    if(val < 34){
      return 'rgb(9 187 9)';
    }
    else if(val <= 51){
      return 'rgb(238 182 0)';
    }
    else{
      return 'rgb(219 24 24)';
    }
  },

  no2 : function(val){
    if(val < 31){
      return 'rgb(9 187 9)';
    }
    else if(val <= 70){
      return 'rgb(238 182 0)';
    }
    else{
      return 'rgb(219 24 24)';
    }
  },

  o3 : function(val){
    if(val <= 1){
      return 'rgb(9 187 9)';
    }
    else if(val <= 10){
      return 'rgb(238 182 0)';
    }
    else{
      return 'rgb(219 24 24)';
    }
  },

  pm25 : function(val){
    if(val <= 50){
      return 'rgb(9 187 9)';
    }
    else if(val <= 100){
      return 'rgb(238 182 0)';
    }
    else{
      return 'rgb(219 24 24)';
    }
  },

  pm10 : function(val){
    if(val <= 27){
      return 'rgb(9 187 9)';
    }
    else if(val <= 30){
      return 'rgb(238 182 0)';
    }
    else{
      return 'rgb(219 24 24)';
    }
  },

  nh3 : function(val){
    if(val <= 2500){
      return 'rgb(9 187 9)';
    }
    else if(val <= 4500){
      return 'rgb(238 182 0)';
    }
    else{
      return 'rgb(219 24 24)';
    }
  },

  so2 : function(val){
    if(val <= 100){
      return 'rgb(9 187 9)';
    }
    else if(val <= 400){
      return 'rgb(238 182 0)';
    }
    else{
      return 'rgb(219 24 24)';
    }
  },
    thermal_comfort : function name(val) {
      if(val == 'good'){
        return 'rgb(9 187 9)';
      }
      else if(val == 'moderate'){
        return 'rgb(238 182 0)'
      }
      else{
        return 'rgb(219 24 24)'
      }
    },
    vps : function(val){
      if(val < 31){
        return 'rgb(9 187 9)';
      }
      else if(val < 70){
        return 'rgb(238 182 0)'
      }
      else{
        return 'rgb(219 24 24)'
      }
    }
  }

  function api(devId){
    let latLon = devId.split("-");
    url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latLon[0]}&lon=${latLon[1]}&appid=891aa4b7bdb8858ead0d62c72f71ddb9`
    console.log(url)
  fetch(url)
    .then(res => res.text())
    .then(response => {
      let para = JSON.parse(response)
      let res = para.list[0].components
      // console.log(res.list[0].components)

      hturl = `https://api.openweathermap.org/data/2.5/weather?lat=${latLon[0]}&lon=${latLon[1]}&appid=891aa4b7bdb8858ead0d62c72f71ddb9`
      fetch(hturl)
      .then(res2 => res2.text())
      .then(response2 => {
    
          
          let res2 = JSON.parse(response2)
          temp = res2.main.temp;
          humi = res2.main.humidity;
        // document.getElementById("humi-value").style.color = color.humi(Math.round(humi));
        // document.getElementById("temp-value").style.color = color.temp(Math.round(temp - 273));

        document.getElementById("humi-value").innerText = Math.round(humi);
        document.getElementById("temp-value").innerText = Math.round(temp - 273);
    
      })
      .catch(function(error) {
          console.log(error)
      });

        recText(res.pm2_5);
        gaugeCo.set(res.co);
        gaugePm25.set(res.pm2_5);
        gaugePm10.set(res.pm10);
        gaugeNo.set(res.no);
        gaugeNo2.set(res.no2);
        console.log(res.no2)
        gaugeO3.set(res.o3);
        gaugeVPS.set(vps(res.co, res.nh3));
        gaugeSo2.set(res.so2);
        gaugeNh3.set(res.nh3);

        document.getElementById("location").innerHTML = "Hey " + latLon[2] + "!&#128079";
        // document.getElementById("humi-value").innerHTML = Math.round(res.no);
        // document.getElementById("temp-value").innerHTML = tConverter;

        // document.getElementById("humi-value").style.color = color.humi(Math.round(res.RH));
        // document.getElementById("temp-value").style.color = color.temp(Math.round(res.Temp) - 5);
        // document.getElementById("indi-quality").style.backgroundColor = color.pm25(res.PM25);
        setTimeout(()=>{
          document.getElementById("indi-co").style.backgroundColor = color.co(res.co);
          document.getElementById("indi-no").style.backgroundColor = color.no(res.no);
          document.getElementById("indi-no2").style.backgroundColor = color.no2(res.no2);
          document.getElementById("indi-so2").style.backgroundColor = color.so2(res.so2);
          console.log(res.so2) 
          document.getElementById("indi-o3").style.backgroundColor = color.o3(res.o3);
          document.getElementById("indi-pm10").style.backgroundColor = color.pm10(res.pm10);
          document.getElementById("indi-pm25").style.backgroundColor = color.pm25(res.pm2_5);
          console.log(res.pm2_5)
          document.getElementById("indi-nh3").style.backgroundColor = color.nh3(res.nh3);
          document.getElementById("indi-vps").style.backgroundColor = color.vps(vps(res.co, res.co));
        },500)

       

        

        var tc = thermalComfort(res.Temp - 5, res.RH);
        thermalComfortIndicator(tc);
        sbsStatus(res);

        // recomendation(res,d);    
    })
    .catch(function(error) {
        console.log(error)
        if(first != 0){
          alert( " Device ID Not Found.");
        }

        });
}

function setCurrentValue(res){

}

function sbsStatus(res){
      if(res.Temp - 5 >= 30 || (res.RH < 30 || res.RH > 72) || res.CO2 >= 2000 || res.VOC >= 2000 || res.PM25 >= 500 || res.O3 >= 500){
            document.getElementById("sbs").innerText = 'Occupants may start to feel Sick Building Syndrome.';
            document.getElementById("sbs").style.color = 'rgb(219 24 24)';
            document.getElementById("sbs").style.fontSize = "25px";
            document.getElementById("indi-sbs").style.backgroundColor = 'rgb(219 24 24)';
      }
      else{
        document.getElementById("sbs").innerText = 'Under Control, ideal indoor environment for Occupants.';
        document.getElementById("sbs").style.color = 'rgb(238 182 0)';
        document.getElementById("sbs").style.fontSize = "25px";
        document.getElementById("indi-sbs").style.backgroundColor = 'rgb(238 182 0)';
      }

}

function thermalComfortIndicator(tc){
  tcColor = color.thermal_comfort(tc);
  document.getElementById("indi-thermal-comfort").style.backgroundColor = tcColor;
  document.getElementById("thermal-comfort").style.color = tcColor;

  if(tc == 'good'){
      document.getElementById("thermal-comfort").innerText = "Adequate Condition";
      document.getElementById("thermal-comfort").style.fontSize = "25px";
  }
  else if(tc == 'moderate'){
    document.getElementById("thermal-comfort").innerText = "Lower than Adequate Condition";
    document.getElementById("thermal-comfort").style.fontSize = "25px";
  }
  else if(tc == 'high'){
    document.getElementById("thermal-comfort").innerText = "Higher than Adequate Condition";
    document.getElementById("thermal-comfort").style.fontSize = "25px";
  }
  else{
    document.getElementById("indi-thermal-comfort").style.backgroundColor = 'transparent';
    document.getElementById("thermal-comfort").style.color = 'black';
    document.getElementById("thermal-comfort").innerText = "Inadequate Condition";
  }
}





function recText(res){
  let recomendText;
  let q = document.getElementById("quality");
  let hrt = document.getElementById("heart");
  let senior = document.getElementById("senior");
  let pregnent = document.getElementById("pregnent");
  let kids = document.getElementById("kids");
  let sport = document.getElementById("sport");
  let gp = document.getElementById("gpublic");
  let as = document.getElementById("asthmatic");
  let indi_qlt = document.getElementById("indi-quality");
 
  let g = 'rgb(9 187 9)';
  let y = 'rgb(238 182 0)';
  let r = 'rgb(219 24 24)';

  if(res <= 50){
      recomendText = "Air quality is satisfactory, and air pollution poses little or no risk.<br><b>Sports, exercise, picnic.</b>";
      
      q.innerHTML = "GOOD".toUpperCase();
      q.style.color = g;
      indi_qlt.style.backgroundColor = g;
      hrt.style.color = g;
      senior.style.color = g;
      pregnent.style.color = g;
      kids.style.color = g;
      sport.style.color = g;
      gp.style.color = g;
      as.style.color = g;
  }
  else if(res <= 100){
      document.getElementById("recomendation").style.fontSize = "15px";
      recomendText = "Air quality is acceptable. However there may be a risk for some people, particularly those who are unusually sensitive to air polution. <br><b>Sports & exercises are allowed.</b>";
      q.innerHTML = "GOOD";
      q.style.color = g;
      indi_qlt.style.backgroundColor = g;
      hrt.style.color = g;
      senior.style.color = g;
      pregnent.style.color = g;
      kids.style.color = g;
      sport.style.color = g;
      gp.style.color = g;
      as.style.color = y;
  }
  else if(res <= 200){
    document.getElementById("recomendation").style.fontSize = "15px";
    q.innerHTML = "MODERATE";
    q.style.color = y;
    indi_qlt.style.backgroundColor = y;
    hrt.style.color = y;
    senior.style.color = y;
    pregnent.style.color = y;
    kids.style.color = y;
    sport.style.color = y;
    gp.style.color = y;
    as.style.color = y;
      recomendText = "Member of sensitive group my experience health effect. The general public is less likely to be affected. <br><b>Sports & exercises are allowed for limited hours.</b>";
  }
  else if(res <= 300){
    q.innerHTML = "MODERATE";
    q.style.color = y;
    indi_qlt.style.backgroundColor = y;
    sport.style.color = y;
    hrt.style.color = r;
    senior.style.color = r;
    pregnent.style.color = r;
    kids.style.color = r;
    gp.style.color = r;
    as.style.color = r;
      recomendText = "Some members of the general public may experience health effects; members of sensitive groups may expeience more serious health effects.<br> <b>Sports & exercises are allowed for max 1 hour toddlers, adults need special care.</b>";
      document.getElementById("recomendation").style.fontSize = "small";
    }
   else if(res <= 400){
    q.innerHTML = "POOR";
    q.style.color = r;
    indi_qlt.style.backgroundColor = r;
    hrt.style.color = r;
    senior.style.color = r;
    pregnent.style.color = r;
    kids.style.color = r;
    sport.style.color = r;
    gp.style.color = r;
    as.style.color = r;
    recomendText = "Health alert : The risk of health effects is increased for everyone.<br><b>No sport or exercises are allowed. Toddlers, adults need special care.</b>";
    document.getElementById("recomendation").style.fontSize = "15px";
  }
  else{
    q.innerHTML = "POOR";
    q.style.color = r;
    indi_qlt.style.backgroundColor = r;
    hrt.style.color = r;
    senior.style.color = r;
    pregnent.style.color = r;
    kids.style.color = r;
    sport.style.color = r;
    gp.style.color = r;
    as.style.color = r;
    recomendText = "Health warning of emergency conditions : everyone is more likely to be affected.<br><b>Toddlers, adults need special care.</b>";
    document.getElementById("recomendation").style.fontSize = "15px";
  }

  document.getElementById("recomendation").innerHTML = recomendText;
}

function cMode(){
  if(localStorage.getItem("darkmode") == 'true'){
    document.getElementsByTagName('body')[0].style.backgroundColor = "black";
    document.getElementsByTagName('body')[0].style.color = "white";
    document.getElementById("scircle").style.backgroundColor = "white";
    document.getElementById("nav").style.backgroundColor = "black";
    document.getElementById("dark").style.opacity = "1";
    document.getElementById("light").style.opacity = ".5";
    document.querySelector("html").style.backgroundColor = "black";
    document.getElementById("fullscreen").style.backgroundColor = "rgb(53 51 51)";
    document.getElementById("my-logo").src = "Logo Climate_NowR.jpg";
    let x = document.getElementsByClassName("items");
    document.getElementById("location").style.color = "white";
    for(var i = 0; i < x.length; i++){
      x[i].style.backgroundColor = "rgb(32, 31, 31)";
      x[i].style.color = "white";
    }
    document.getElementById("check").checked = true;

  }
  else{
    document.getElementsByTagName('body')[0].style.backgroundColor = "rgb(223, 223, 211)";
    document.getElementsByTagName('body')[0].style.color = "black";
    document.getElementById("scircle").style.backgroundColor = "black";
    document.getElementById("nav").style.backgroundColor = "white";
    document.getElementById("dark").style.opacity = ".5";
    document.getElementById("light").style.opacity = "1";
    document.querySelector("html").style.backgroundColor = "rgb(223, 223, 211)";
    document.getElementById("fullscreen").style.backgroundColor = "rgb(204 204 204)";
    let x = document.getElementsByClassName("items");
    document.getElementById("location").style.color = "black";
    document.getElementById("my-logo").src = "Logo Climate_Now.jpg";
    for(var i = 0; i < x.length; i++){
      x[i].style.backgroundColor = "white";
      x[i].style.color = "black";
    }

  }
}


document.addEventListener('DOMContentLoaded', function () {
  // var checkbox = document.querySelector('input[type="checkbox"]');
  var checkbox = document.getElementById("check");

  checkbox.addEventListener('change', function () {
    let val = checkbox.checked;
    if (val) {

      document.getElementsByTagName('body')[0].style.backgroundColor = "black";
      document.getElementsByTagName('body')[0].style.color = "white";
      document.getElementById("scircle").style.backgroundColor = "white";
      document.getElementById("nav").style.backgroundColor = "black";
      document.getElementById("dark").style.opacity = "1";
      document.getElementById("light").style.opacity = ".5";
      document.querySelector("html").style.backgroundColor = "black";
      document.getElementById("fullscreen").style.backgroundColor = "rgb(53 51 51)";
      document.getElementById("my-logo").src = "Logo Climate_NowR.jpg";
      let x = document.getElementsByClassName("items");
      document.getElementById("location").style.color = "white";
      for(var i = 0; i < x.length; i++){
        x[i].style.backgroundColor = "rgb(32, 31, 31)";
        x[i].style.color = "white";
      }
    localStorage.setItem("darkmode", true);
    } 
    else {
      document.getElementsByTagName('body')[0].style.backgroundColor = "rgb(223, 223, 211)";
      document.getElementById("scircle").style.backgroundColor = "black";
      document.getElementsByTagName('body')[0].style.color = "black";
      document.getElementById("nav").style.backgroundColor = "white";
      document.querySelector("html").style.backgroundColor = "rgb(223, 223, 211)";
      
      document.getElementById("dark").style.opacity = ".5";
      document.getElementById("light").style.opacity = "1";
      document.getElementById("fullscreen").style.backgroundColor = "rgb(204 204 204)";
      let x = document.getElementsByClassName("items");
      document.getElementById("my-logo").src = "Logo Climate_Now.jpg";
      document.getElementById("location").style.color = "black";
      for(var i = 0; i < x.length; i++){
        x[i].style.backgroundColor = "white";
        x[i].style.color = "black";
    }
    localStorage.setItem("darkmode", false);
    }
  });
});



// document.getElementById("pm25-line").style.opacity = .5;
// document.getElementById("pm10-line").style.opacity = .5;
// document.getElementById("Far").style.opacity = .5;


function goBack() {
  window.history.back();
}

var fCount = 0;
function fullscreen(){
  var element = document.querySelector("#container");

// make the element go to full-screen mode
  if(fCount == 0){
        element.requestFullscreen()
        .then(function() {

        })
        .catch(function(error) {
          // element could not enter fullscreen mode
        });
        fCount++;
      }
    else{
      
      document.exitFullscreen(); 

      // document.getElementById("fullscreen").innerText = "Full Screen";
      fCount = 0;

    }

}

window.onresize = function (event) {
  var maxHeight = window.screen.height,
      maxWidth = window.screen.width,
      curHeight = window.innerHeight,
      curWidth = window.innerWidth;

  if (maxWidth == curWidth && maxHeight == curHeight) {
      fCount++;
      document.getElementById("fullscreen").classList.remove( "fa-expand-alt");
      document.getElementById("fullscreen").classList.add( "fa-compress-alt");
  }
  else{
    document.getElementById("fullscreen").classList.remove("fa-compress-alt" );
    document.getElementById("fullscreen").classList.add("fa-expand-alt" );
  }
}

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
  document.getElementById("fullscreen").style.display = "none";
}






setInterval(function(){
  urlparam();
  console.log("called");
},120000)




function thermalComfort(temp, humi){
    let season = seasons();

    if(humi > 60 && season == 'summer'){
        if(temp < 22.2){
          return 'Inadequate'
        }
        else{
          return 'moderate';
        }
    }
    else if(humi > 60 && season == 'winter'){
        if(temp < 20){
          return 'Inadequate'
        }
        else{
          return 'moderate';
        }
    }
    else if(humi >= 30 && humi <= 60){
        if(season == 'winter'){
            if(temp >= 20 && temp <= 23.3){
                return 'good';
            }
            else if(temp < 20){
                return 'moderate';
            }
            else{
                return 'high';
            }
        }
        else if(season == 'summer'){
          if(temp >= 22.2 && temp <= 26.6){
              return 'good';
          }
          else if(temp < 22.2){
              return 'moderate';
          }
          else{
            return 'high';
          }
      }

    }
    else if(humi < 30 && season == 'summer'){
          if(temp > 26.6){
            return 'Inadequate'
          }
          else{
            return 'moderate';
          }
    }
    else if(humi < 30 && season == 'winter'){
        if(temp > 23.3){
          return 'Inadequate'
        }
        else{
          return 'moderate';
        }
    }
}

function seasons(){
  let date = new Date();

  let month = date.getMonth();
  if(month == 9 || month == 10 || month == 11 || month == 0 || month == 1 || month == 2){
    return 'winter';
  }
  return 'summer';
}


function vps(co2, humi){
    let vps = 0;
    if(co2 < 1200){
      vps = 10;
    }
    else if(co2 < 1600){
      vps = 20;
    }
    else if(co2 < 2000){
      vps = 30;
    }
    else if(co2 < 2500){
      vps = 40;
    }
    else if(co2 < 2800){
      vps = 50;
    }
    else if(co2 < 3200){
      vps = 60;
    }
    else if(co2 < 3600){
      vps = 70;
    }
    else if(co2 < 4000){
      vps = 80;
    }
    else if(co2 < 4400){
      vps = 90;
    }
    else{
      vps = 100;
    }

    if(humi < 30){
      vps += 10;
    }
    else if(humi > 70){
      vps += 10;
    }

    return vps;

}





