let data_M = [0]; // malati
let data_S = [0]; // sani
let data_D = [0]; // deceduti
let labels_data = [0];
let massPopChart, cnv;

function setup() {
  cnv = createCanvas(0.7*windowHeight, 0.7*windowHeight-20);
  cnv.position(windowWidth-(0.7*windowHeight)-15, 10);

  let myChart = select("#myChart");
  // Global Options
  Chart.defaults.global.defaultFontFamily = 'sans-serif';
  Chart.defaults.global.defaultFontSize = 15;
  Chart.defaults.global.defaultFontColor = '#0A1128';
  Chart.defaults.global.animation.duration = 500;
  draw_chart();
}
let i = 0;
function draw() {
	background(0);
  if (mouseIsPressed) {
  	i++;
  	data_M.push(i);
  	data_S.push(2*i);
  	data_D.push(0.5*i);
  	labels_data.push(i)
  	massPopChart.update();
  	
    fill(0);
  } else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 80, 80);
}

function windowResized(){
	resizeCanvas(0.7*windowHeight, 0.7*windowHeight-20);
	cnv.position(windowWidth-(0.7*windowHeight)-15, 10);

	massPopChart.canvas.parentNode.style.height = str(0.7*windowHeight)+"px";
 	massPopChart.canvas.parentNode.style.width = str(windowWidth-(0.75*windowHeight))+"px";
}

function draw_chart(){
	massPopChart = new Chart(myChart.getContext('2d'), {
      type:'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data:{
        labels:labels_data,
        datasets:[
        {
          label:'Malati',
          data:data_M,
          //backgroundColor:'green',
          backgroundColor:[
          '#FF6B35',

          ],
          borderWidth:3,
          borderColor:'#FF6B35',
          hoverBorderWidth:3,
          hoverBorderColor:'green',
          fill:false
        },
          {
          label:'Sani',
          data:data_S,
          //backgroundColor:'green',
          backgroundColor:[
          '#004E89',
          ],
          borderWidth:3,
          borderColor:'#004E89',
          hoverBorderWidth:3,
          hoverBorderColor:'#2344',
          fill:false
        },
        {
          label:'Morti',
          data:data_D,
          //backgroundColor:'green',
          backgroundColor:[
          '#272838',
          ],
          borderWidth:3,
          borderColor:'#272838',
          hoverBorderWidth:3,
          hoverBorderColor:'#2344',
          fill:false
        }
        
        ]
      },
      options:{
      	responsive: true,
      	maintainAspectRatio: false,
        title:{
          display:true,
          text:'SIM Covid',
          fontSize:25,
          //fontfamily : 'Roboto'
        },
        legend:{
          display:true,
          position:'right',
          labels:{
            fontColor:'#000'
          }
        },
        layout:{
          padding:{
            left:0,
            right:0,
            bottom:0,
            top:0
          }
        },
        tooltips:{
          enabled:true
        }
      }
    });

    massPopChart.canvas.parentNode.style.height = str(0.7*windowHeight)+"px";
 	massPopChart.canvas.parentNode.style.width = str(windowWidth-(0.75*windowHeight))+"px";
}
 
    