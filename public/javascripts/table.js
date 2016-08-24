

  var socket = io.connect('http://54.218.223.170:3002');
  var firstTime = true;
  var sizearray = 0;
  var deletetable = function()
  {
  	var table = document.getElementById("mtable");
	while(table.rows.length > 1) {
  		table.deleteRow(1);
	}

  };
  var findRow = function(idButton)
  {
  	var rows = document.getElementById("mtable").rows;
	for(var i = 1 ; i < rows.length ; i++ ) {
		var cells = rows[i].cells;

		cellAsignar = cells[3];

		buttons = cellAsignar.childNodes;
		if(buttons.length >= 1){
			idbutton = buttons[0].id.split("_")[1];
			if(idbutton == idButton)
			{
				return rows[i];
			}
		}
	}
  }
  var getAmbulanceNumber = function(row)
  {
  		var cells = row.cells;
  		var cellambulance = cells[2];
  		var childs = cellambulance.childNodes;
  		var input = childs[0];
  		console.log(input.value);
  		return input.value;
  }
  var isNumeric = function(string)
  {
  	if(string=="")
  	{
  		return false;
  	}
  	return !isNaN(string);
  }
  var setAmbulance = function()
  {
  	var id = this.id.split("_")[1];
  	var row = findRow(id);
  	var carid = getAmbulanceNumber(row);
  	if(isNumeric(carid))
  	{
  		socket.emit('setCar', { id: id, carID:carid } );
  	}
  	else
  	{
  		alert("Porfavor ingrese un dato numerico al asignar la ambulancia");
  	}
  }
  var finishEmergency = function()
  {
  	var id = this.id.split("_")[1];
  	socket.emit('finishEmergency', { id: id } );
  };
  var val = 0;
  socket.on('news', function (data) 
  {
  	var newdata = data.newdata;
  	console.log(newdata + "" + val);
  	val++;
    if(firstTime || data.newdata){

    	var table = document.getElementById("mtable");
    	var array = JSON.parse(data.data);
    	deletetable();
	    sizearray = array.length;
	    for(var i = 0; i < array.length ; i++)
	    {
	    	var row = table.insertRow(1);
	    	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
			var numEmergencia = row.insertCell(0);
			var telefono = row.insertCell(1).innerHTML = array[i]["telefone"];
			var ambulancia = row.insertCell(2);
			var asignar = row.insertCell(3);

			var ambulanceinput = document.createElement('input');
			ambulanceinput.type = "input";
			ambulanceinput.className = "form-control";
			ambulanceinput.placeholder = "Número de ambulancia";

			var deletebutton = document.createElement('input');
			deletebutton.id = "btn_"+array[i]["_id"];
			deletebutton.type = "button";
			deletebutton.className = "btn btn-danger"
			deletebutton.value = "Finalizar";
			deletebutton.onclick = finishEmergency;

			var asignbutton = document.createElement('input');
			asignbutton.id = "btn_"+array[i]["_id"];
			asignbutton.type = "button";
			asignbutton.className = "btn btn-warning";
			asignbutton.value = "Asignar ambulancia"
			asignbutton.onclick = setAmbulance;
			numEmergencia.innerHTML = array[i]["latitude"] + " / " + array[i]["longitude"];

	    	switch(array[i]["stats"]) {
			    case "Waiting":
			    	row.className = "danger" //warning, success
			    	ambulancia.appendChild(ambulanceinput);
					asignar.appendChild(asignbutton);
			    	asignar.appendChild(deletebutton);
			    	//console.log("waiting");
			        break;
			    case "InProcess":
			    	row.className = "warning" //danger, success
			    	ambulancia.innerHTML = array[i]["ambulance"];
			    	asignar.appendChild(deletebutton);
			    	//console.log("Inprocess");
			        break;
			    case "Finish":
			    	row.className = "success" //danger, succes
			    	ambulancia.innerHTML = "";
			    	asignar.innerHTML = "";
			    	//console.log("Finish");
			        break;
			}
	    }
	    socket.emit('success', { id: "aj" } );
		firstTime = false;
	}

	//}		
  
  });