let locations = [];
var deviceDelete = false;
var index = 0;
var y = 'rgb(238 182 0)';
var r = 'rgb(219 24 24)';
var g = 'rgb(9 187 9)';

var mainData;
var reported_co = "";
var reported_smoke = "";
var reported_time = "";
var reported_date ;
function dtTime(){
  let dt = new Date();
  
  document.getElementById("time").innerText = String(dt.getHours()).padStart(2, '0') + ":" + String(dt.getMinutes()).padStart(2, '0');
  document.getElementById("date").innerText = dt.toString().substring(0,15);
}

setInterval(dtTime,1000);



function active(time, d){
  let current_time = new Date();

  let date = new Date(d);
  date.setMinutes(time.substring(3,5));
  date.setHours(time.substring(0,2));
  let date_diff = Math.abs(current_time - date)/60000;
  // console.log(date_diff  +"----" + Math.round(current_time - date));
  // console.log("date = ",date,"Time = ",current_time);
  // console.log("current date = ",date,"current Time = ",time);
  console.log("The time diff = ",date_diff);
  if(date_diff <= 2){
    return 'Active Now';
  }
  else{
    if(date_diff <= 59){
      let active_time = 'Active ' + Math.round(date_diff) + 'm ago';
      return active_time;
    }
    else if(date_diff/60 >= 1 && date_diff/60 < 24){
      let active_time = 'Active ' + Math.round(date_diff/60) + 'h ago'
      return active_time;
    }
    else if(date_diff/60*24 >= 1 && date_diff/60*24 < 7){
      let active_time = 'Active ' + Math.round(date_diff/60*24) + 'd ago'
      return active_time;
    }
    else if(date_diff/60*24*7 >= 1 && date_diff/60*24*7 < 4){
      let active_time = 'Active ' + Math.round(date_diff/60*24*7) + 'w ago'
      return active_time;
    }
    else if(date_diff/60*24*30 >= 1 && date_diff/60*24*30 < 12){
      let active_time = 'Active ' + Math.round(date_diff/60*24*30) + 'mo ago'
      return active_time;
    }
  }
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




function othersDev(){
  location.href ="OthersDevices/index.html" 
}

window.onload = function(){
  apiCall();
}




function toDashboard(dev, dName){
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('id', dev);
  location.href ="Dashboard/Details.html?" + urlParams;
}


//this page code

// function apiCall(id, load){

//   fetch("https://api.thingspeak.com/channels/1996931/feeds.json?api_key=M2QLNQWUC8X5KGSI&results=10").then(function(response) {
//     return response.json();
//   }).then(function(data) {
//     console.log("The fields",data.feeds[0]);
//     document.getElementById("co").innerText = data.feeds[0].field1;
//     document.getElementById("smoke").innerText = data.feeds[0].field2;
//     console.log(data.feeds);
//   }).catch(function(err) {
//     console.log('Fetch Error :-S', err);
//   });
// }
function apiCall(id, load){

  fetch("https://api.thingspeak.com/channels/2171475/feeds.json?api_key=U20MPOMMJT6TN1BU&results=10").then(function(response) {
    return response.json();
  }).then(function(data) {
    // console.log("The fields",data.feeds);
    mainData = data.feeds;
    let ac_date = new Date(data.feeds[9].created_at)
    // console.log(ac_date)
    let date = ac_date.getFullYear() + '-' + ac_date.getMonth()+1 + '-'  +ac_date.getDate();
    let time = String(ac_date.getHours()).padStart(2, '0') + ":" +String( ac_date.getMinutes()).padStart(2, '0');
    let active_status = active(time, Activegetdt(date));
    console.log("active_status = ",active_status)
    // console.log(a.substring(0,10))
    // console.log(a.substring(12,16))

    // console.log(date + " " + time)
    document.getElementById("co").innerHTML = data.feeds[9].field1 + '<sub>PPM</sub>';
    document.getElementById("smoke").innerHTML = data.feeds[9].field2  + '<sub>PPM</sub>';
    document.getElementById("active").innerHTML = active_status;
    document.getElementById('d-tbl').innerHTML = dynamicTable(data);
    reported_smoke = data.feeds[9].field1;
    reported_co = data.feeds[9].field2;
    reported_date = date;
    reported_time = time;

    if(reported_smoke >= 500){
      sendMail()
      console.log("sendMail() function calls");
    }
    if(active_status == 'Active Now'){
      document.getElementById('status-circle').style.backgroundColor = '#33ff00'
      
    }
    else{
      document.getElementById('status-circle').style.backgroundColor = 'gray';

    }
    
  }).catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
}
 function dynamicTable(data){
    // console.log("the data is ",data)
    let str = "";
    for( i = 9; i >= 0; i--){
      console.log(data.feeds[i].created_at)
      str += "<tr>"+
      "<th>"+getdt(data.feeds[i].created_at)+"</th>"+
      "<th>"+mainData[i].field1+"</th>"+
      "<th>"+mainData[i].field2+"</th>"
      +"</tr>";
    }
    return str;
  }



// function graphPlot(arr){
  //const ctx = document.getElementById('chartJSContainer').getContext('2d');
// const timers = {
//   neutral: 10,
//   happy: 0,
//   sad: 0,
//   angry: 0,
//   surprised: 0,
//   disgust: 20
// };
//   const detection = new Chart(ctx, {
//     type: 'line',
//     data: {
//       datasets: [{
//         fill: false,
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.2)', // neutral
//           'rgba(54, 162, 235, 0.2)', // happy
//           'rgba(255, 206, 86, 0.2)', // sad
//           'rgba(75, 192, 192, 0.2)', // angry
//           'rgba(153, 102, 255, 0.2)', // surprised
//           'rgba(255, 159, 64, 0.2)', // disgust
//           'rgba(255, 99, 132, 0.2)', // neutral
//           'rgba(54, 162, 235, 0.2)', // happy
//           'rgba(255, 206, 86, 0.2)', // sad
//           'rgba(75, 192, 192, 0.2)'
//         ],
//         borderColor: [
//           'rgba(255, 99, 132, 1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 206, 86, 1)',
//           'rgba(75, 192, 192, 1)',
//           'rgba(153, 102, 255, 1)',
//           'rgba(255, 159, 64, 1)',
//           'rgba(255, 99, 132, 1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 206, 86, 1)',
//           'rgba(75, 192, 192, 1)'
//         ],
//         borderWidth: 2,
//         data: {dog:10, cat:20, monkey:30, lion:0, tiger:5,human:50, udayan:35, arif:30, adil:25, minsar:55}
//       }]
//     },
//     options: {
//       indexAxis: 'x',
//       responsive: true,
//       plugins: {
//         legend: {
//           display: false,
//           labels: {
//             font: {
//               size: 50
//             }
//           }
//         },
//         title: {
//           display: true,
//           text: "Emotion timers"
//         }
//       }
//     }
//   });

function Activegetdt(pdate){
  let ac_date = new Date(pdate)
  // console.log(ac_date)
  // let date = ac_date.getFullYear() + '-' + ac_date.getMonth()+1 + '-' + '0' +ac_date.getDate();
  let time = String(ac_date.getHours()).padStart(2, '0') + ":" +String( ac_date.getMinutes()).padStart(2, '0');
  // let dt = date + " " + time;
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const dt = yyyy+'/'+mm+'/'+dd;
  return dt;
}


  function getdt(pdate){
    let ac_date = new Date(pdate)
    // console.log(ac_date)
    // let date = ac_date.getFullYear() + '-' + ac_date.getMonth()+1 + '-' + '0' +ac_date.getDate();
    let time = String(ac_date.getHours()).padStart(2, '0') + ":" +String( ac_date.getMinutes()).padStart(2, '0');
    // let dt = date + " " + time;
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const dt = dd + '/' + mm + '/' + yyyy + ' ' + time;
    return dt;
  }
  
 
  
// }

//email api services


function sendMail() {
  console.log(reported_co,reported_smoke,reported_date,reported_time)
  var params = {
    email: document.getElementById("email").value,
    _co:reported_co,
    _smoke:reported_smoke,
    date: reported_date,
    time: reported_time
  };

  const serviceID = "service_dti799p";
  const templateID = "template_5i5ecp7";

    emailjs.send(serviceID, templateID, params)
    .then(res=>{
        document.getElementById("email").value = "";
        alert("Your message sent successfully!!")

    })
    .catch(err=>console.log(err));

}
// function ChangeFormateDate(oldDate)
// {
//    return oldDate.toString().split("/").reverse().join("/");
// }

setInterval(apiCall, 10000);
