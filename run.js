const express = require('express')
const app = express()
const config = require('./config.json')
const port = 3000
const request = require('request')


// Authentication
app.use((req, res, next) => {
  // TODO: my authentication logic
  next()
})

// Proxy request
app.get('/api/:device/:command/:value?', (req, res) => {
	
	var deviceReq = req.params.device
	var command = req.params.command
	var device = getDevice(deviceReq,config)	
	var value = req.params.value
	
	if (device) {
		var command = getCommand(command,device)
		if (command) {
			if (value){
				request.get('http://'+device.ipAddress+":"+ device.port+'/'+command.url+'/'+value,function(error,response,body){
					res.send('OK');				
				})
			} else {
				request.get('http://'+device.ipAddress+":"+ device.port+'/'+command.url,function(error,response,body){
					res.send('OK');				
				})

			}
		}	 
		
	} 

})



function getDevice(device, config ){
	var deviceObj;
	config.devices.forEach(
		function(obj) {
			if ( obj.deviceName == device){	
				deviceObj=obj
			}
		}
	)
	return deviceObj;
}

function getCommand(command, deviceObj ){
	var commandObj;
	deviceObj.commands.forEach(
		function(obj) {
			if ( obj.name == command){	
				commandObj=obj
			}
		}
	)
	return commandObj;
}


app.listen(port, () => console.log(`Home API gateway listening on port ${port}!`))
