let locations = [];
var deviceDelete = false;
var index = 0;
var y = 'rgb(238 182 0)';
var r = 'rgb(219 24 24)';
var g = 'rgb(9 187 9)';


function humiTemp(id){



}


function apiCall(id, load){
  var temp = 35;
  var humi = 55;
    let arr = id.split("-");
    // console.log(id)
    let url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${arr[0]}&lon=${arr[1]}&appid=891aa4b7bdb8858ead0d62c72f71ddb9`;
    
  fetch(url)
    .then(res => res.text())
    .then(response => {

      
      

        
        let res = JSON.parse(response)
        let para = res.list[0].components
        // console.log(res.list[0].components)

       
        let flag = filter(id);

        if(flag === 0){
          locations.push(id);
            localStorage.setItem("device", JSON.stringify(locations));
        } 

        hturl = `https://api.openweathermap.org/data/2.5/weather?lat=${arr[0]}&lon=${arr[1]}&appid=891aa4b7bdb8858ead0d62c72f71ddb9`
        fetch(hturl)
        .then(res2 => res2.text())
        .then(response2 => {
      
            
            let res2 = JSON.parse(response2)
            temp = res2.main.temp;
            humi = res2.main.humidity;
            addDevice(id,  para, temp, humi)
            recText(id, "adil", para.pm2_5)

            if(load && index < locations.length - 1){
              index++;
              apiCall(locations[index], true);
              // index++;
            }
      
        })
        .catch(function(error) {
            console.log(error)
        });
        

    })
    .catch(function(error) {
        console.log(error)
        if(input){
            alert( " Device ID Not Found.");
        }

        

        if(device.length > indexes){
            api_url(device[indexes].id, device[indexes].name, device[indexes].lon, device[indexes].lat);
        }
        });
}





var colours = {
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

function addDevice(id, res, temp, humi){
    let arr = id.split("-");
    let co = colours.co(res.co);
    let no = colours.no(res.no);
    let no2 = colours.no2(res.no2);
    let o3 = colours.o3(res.o3);
    let pm25 = colours.pm25(res.pm2_5)
    let pm10 = colours.pm10(res.pm10);
    let nh3 = colours.nh3(res.nh3);
    let so2 = colours.so2(res.so2);


    let device = `
    
    <div class="area-container" id="${id}-area-container" >
    <div class="location-heading">
        <div class="heading">
            <H1>${arr[2]}</H1>
        </div>
        <div class="delete">
           <div class="ic">
             <i onclick="dDelete('${id}')" class="fa fa-times deletebtn" aria-hidden="true"></i>
            </div>
        </div>
    </div>
    
    <div class="all-para">
        <div class="box">
            <div class="temp">
                <p id="temp-value">${Math.round(temp - 273)} °C</p>
                <h3>Temperature</h3>
            </div>
            <div class="temp">
                <p id="humi-value">${humi} %</p>
                <h3>Humidity</h3>
            </div>
        </div>
    <div class="parameter">

        <div class="left-parameter">

            <div class="para-element">
                <h2 class="para">CO</h2>
                <div class="values">
                    <div class="value" id="co-value">${res.co}</div>
                    <div class="indicator"  style="background-color: ${co}"></div>
                </div>
            </div>

            <div class="para-element">
                <h2 class="para" >NO</h2>
                <div class="values">
                    <div class="value" id="no-value">${res.no}</div>
                    <div class="indicator"  style="background-color: ${no}"></div>
                </div>
            </div>

            <div class="para-element">
                <h2 class="para">NO2</h2>
                <div class="values">
                    <div class="value" id="no2-value">${res.no2}</div>
                    <div class="indicator"  style="background-color: ${no2}"></div>
                </div>
            </div>

            <div class="para-element">
                <h2 class="para" >O3</h2>
                <div class="values">
                    <div class="value" id="o3-value">${res.o3}</div>
                    <div class="indicator" style="background-color: ${o3}"></div>
                </div>
            </div>



        </div>

        <div class="right-parameter">

            <div class="para-element">
                <h2 class="para">PM2.5</h2>
                <div class="values">
                    <div class="value" id="pm25-value">${res.pm2_5}</div>
                    <div class="indicator" style="background-color: ${pm25}"></div>
                </div>
            </div>

            <div class="para-element">
                <h2 class="para">PM10</h2>
                <div class="values">
                    <div class="value" id="pm10-value">${res.pm10}</div>
                    <div class="indicator" style="background-color: ${pm10}"></div>
                </div>
            </div>

            <div class="para-element">
                <h2 class="para">NH3</h2>
                <div class="values">
                    <div class="value" id="nh3-value">${res.nh3}</div>
                    <div class="indicator" style="background-color: ${nh3}"></div>
                </div>
            </div>

            <div class="para-element">
                <h2 class="para">SO2</h2>
                <div class="values">
                    <div class="value" id="so2-value">${res.so2}</div>
                    <div class="indicator" style="background-color: ${so2}"></div>
                </div>
            </div>

        </div>
    </div>
    </div>
    <div class="${id}-recomendation">
    <div class="rec-logos">            
    <i id="${id}-heart" class="fas fa-heartbeat icons tooltip" > <span class="tooltiptext">Heart Patient</span></i>
    <i id="${id}-sport"  class="fas fa-running icons tooltip" >  <span class="tooltiptext">Sports</span></i>
    <i id="${id}-pregnent" class="fas fa-female icons tooltip"> <span class="tooltiptext">Pregnant</span></i>
    <i id="${id}-kids" class="fas fa-child icons tooltip"> <span class="tooltiptext">Kids</span></i>
    <i id="${id}-senior" class="fas fa-blind icons tooltip"> <span class="tooltiptext">Senior Citizen</span></i>
    <i id="${id}-asthmatic" class="fas fa-lungs icons tooltip"><span class="tooltiptext">Asthmatic</span></i>
    <i id="${id}-gpublic" class="fas fa-users icons tooltip"><span class="tooltiptext">General Public</span></i>
</div>
<hr class="hr">
<div class="rec-text">
    <div id="${id}-recomend-text"></div> 
</div>
    </div>

</div>

    `;
    // document.getElementById("main").innerHTML = device;
    document.getElementById("main").insertAdjacentHTML("afterbegin", device);
  
}






function recText(dev, para,res){
    
    let g = 'rgb(9 187 9)';
    let y = 'rgb(238 182 0)';
    let recomendText;
    if(res <= 50){
        recomendText = "Air quality is satisfactory, and air pollution poses little or no risk.<br><b>Sports, exercise, picnic.</b>";
        document.getElementById(dev + "-heart").style.color = g;
        document.getElementById(dev + "-sport").style.color = g;
        document.getElementById(dev + "-pregnent").style.color = g;
        document.getElementById(dev + "-kids").style.color = g;
        document.getElementById(dev + "-senior").style.color = g;
        document.getElementById(dev + "-asthmatic").style.color = g;
        document.getElementById(dev + "-gpublic").style.color = g;
    }
    else if(res <= 100){
        document.getElementById(dev + "-heart").style.color = g;
        document.getElementById(dev + "-sport").style.color = g;
        document.getElementById(dev + "-pregnent").style.color = g;
        document.getElementById(dev + "-kids").style.color = g;
        document.getElementById(dev + "-senior").style.color = g;
        document.getElementById(dev + "-asthmatic").style.color = y;
        document.getElementById(dev + "-gpublic").style.color = g;
        recomendText = "Air quality is acceptable. However there may be a risk for some people, particularly those who are unusually sensitive to air polution. <br><b>Sports & exercises are allowed.</b>";
    }
    else if(res <= 200){
        document.getElementById(dev + "-heart").style.color = y;
        document.getElementById(dev + "-sport").style.color = y;
        document.getElementById(dev + "-pregnent").style.color = 'orange';
        document.getElementById(dev + "-kids").style.color = y;
        document.getElementById(dev + "-senior").style.color = y;
        document.getElementById(dev + "-asthmatic").style.color = y;
        document.getElementById(dev + "-gpublic").style.color = y;
        recomendText = "Member of sensitive group may experience health effect. The general public is less likely to be affected. <br><b>Sports & exercises are allowed for limited hours.</b>";
    }
    else if(res <= 300){
        document.getElementById(dev + "-sport").style.color = y;
        recomendText = "Some members of the general public may experience health effects; members of sensitive groups may expeience more serious health effects.<br> <b>Sports & exercises are allowed for max 1 hour toddlers, adults need special care.</b>";
    }
    else if(res <= 400){
        recomendText = "Health alert : The risk of health effects is increased for everyone.<br><b>No sport or exercises are allowed. Toddlers, adults need special care.</b>";
    }
    else{
        recomendText = "Health warning of emergency conditions : everyone is more likely to be affected.<br><b>Toddlers, adults need special care.</b>";
    }
    document.getElementById(dev + "-recomend-text").innerHTML = recomendText;
}



function openForm() {
  document.getElementById('dev-name').value = '';
  document.getElementById('latitude').value = '';
  document.getElementById('longitude').value = '';   
  // document.getElementById("myForm").classList.add('form-popup-on');
  modal.style.display = "grid";
  window.scrollTo(0, 0);
  // document.querySelector("body").style.height = "100%";
  // document.querySelector("body").style.overflow = "hidden";
  document.getElementById("dev-name").focus();
}

function formclose(){
  modal.style.display = "none";
  document.querySelector("body").style.overflow = "scroll";
}

window.onclick = function(event) {
if (event.target == modal) {
  modal.style.display = "none";
  document.querySelector("body").style.overflow = "scroll";
}
}

function dDelete(name){
    deviceDelete = true;
  //   console.log(name)
  let d = [];
  
    for(var i = 0; i < device.length; i++){
      //   console.log("inside for")
      if(device[i].id != name){
        d.push(device[i]);
      }
    }
    for(var i = 0; i < markerArray.length; i++){
      // console.log("inside for")
    if(markerArray[i].name == name){
      mymap.removeLayer(markerArray[i].marker);
    }
  }

    device = d;
    localStorage.setItem("device", JSON.stringify(device));
    document.getElementById("dev-con-" + name).remove();
}


function input(){
  // let id = document.getElementById("dev-id").value.toLowerCase(); 
  let devName = document.getElementById("dev-name").value; 
  let lon = document.getElementById("longitude").value;
  let lat = document.getElementById("latitude").value;
  let id = lat + "-" +lon + "-" + devName;
  let duplicate = filter(id);

  if(devName == ''){
    alert("Device name can not be empty.");
    document.getElementById("dev-name").focus();
  }
  else if(id == ''){
    alert("Device ID can not be empty.");
    document.getElementById("dev-id").focus();
  }
  else if(duplicate == 0){
      // api_url(id, devName, lon, lat, true);
      apiCall(id);
      modal.style.display = "none";
      x = document.getElementById("dev-name");
      x.focus();
  }
  else{
    alert("Location already added.");
  }
}


function filter(d){
  let flag = 0;
      for(i = 0 ; i < locations.length; i++){
          if(d == locations[i]){
             flag++;
             break;
          }
      }
      return flag;
}

window.onload = function(){


    if (localStorage.getItem("device") != null) {
      locations = JSON.parse(localStorage.getItem("device"));
      // console.log(locations);
      // for(let i = 0; i < locations.length; i++){
        let arr = locations[0].split("-");
        let id = arr[0] + "-" + arr[1] + "-" + arr[2];
        // console.log(id)
        apiCall(id, true);
      // }
    }
}

function dDelete(name){
  deviceDelete = true;
  // console.log(name)
  let arr = name.split("-");
let d = [];

  for(var i = 0; i < locations.length; i++){
    //   console.log("inside for")
    if(locations[i] != name){
      d.push(locations[i]);
    }
  }

  locations = d;
  localStorage.setItem("device", JSON.stringify(locations));
  document.getElementById(name + '-area-container').remove();
}


function toDashboard(dev, dName){
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('id', dev);
  
}





