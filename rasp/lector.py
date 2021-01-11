import math
import sys
import time
from datetime import datetime
from grove.adc import ADC
import RPi.GPIO as gpio
import csv
import json
from influxdb import InfluxDBClient
import subprocess
import requests

class GroveGasSensorMQ2:
 
    def __init__(self, channel):
        self.channel = channel
        self.adc = ADC()
 
    @property
    def MQ2(self):
        value = self.adc.read(self.channel)
        return value
 
class GroveHCHOSensor:

    def __init__(self, channel):
        self.channel = channel
        self.adc = ADC()
 
    @property
    def HCHO(self):
        value = self.adc.read(self.channel)
        return value


class MagneticSensor:

    def __init__(self, channel):
        self.channel = channel
        gpio.setmode(gpio.BCM)
        gpio.setup(self.channel, gpio.IN)

 
    @property
    def Contact(self):
        value = gpio.input(self.channel)
        return value

class Led:

    def __init__(self, channel):
        self.channel = channel
        gpio.setmode(gpio.BCM)
        gpio.setup(self.channel, gpio.OUT)
        gpio.output(self.channel, True) # turn it off initially

    def turnOn(self):
        gpio.output(self.channel, False)
    
    def turnOff(self):
        gpio.output(self.channel, True)

    def turn(self, on):
        gpio.output(self.channel, not on)

Grove = GroveGasSensorMQ2
 
 
def do_sync():
    print("enviando datos al servidor")
    json_body = []
    with open("/mediciones/room_data.csv") as file:
        csv_reader = csv.reader((line.replace('\0', '') for line in file), delimiter=',')
        # date, gas, hcho, magnetic
        for row in csv_reader:
            json_body.append({
                "measurement": "room_data",
                "tags": {
                    "device": "grupodaic11p"
                },
                "time": row[0],
                "fields": {
                    "gas": int(row[1]),
                    "hcho": int(row[2]),
                    "magnetic": int(row[3])
                }
            })
        pass
    client = InfluxDBClient('93.189.90.190', 8086, 'rasp', 'rasp', 'mediciones')
    client.write_points(json_body)
    
    with open("/mediciones/room_data.csv", "w") as file:
        file.write("")

def resetParameters():
    print("Resetting parameters")
    params = None
    with open('/home/pi/proyecto/webserver/app/parametros.json') as f:
        params = json.load(f)
    
    if params["TES"]:
        time_between_syncs = int(params["TES"])
    else:
        time_between_syncs = 60
    
    if params["TEM"]:
        time_between_measurements = int(params["TEM"])
    else:
        time_between_measurements = 3

    if params["MAXGAS"]:
        max_gas = int(params["MAXGAS"])
    else:
        max_gas = 100
    
    if params["MAXHCHO"]:
        max_hcho = int(params["MAXHCHO"])
    else:
        max_hcho = 80
    
    return time_between_syncs, time_between_measurements, max_gas, max_hcho

def startHTTPTunnel(port):
    ngrok = subprocess.Popen(['/home/pi/bin/ngrok','http','8081'],stdout = subprocess.PIPE)
    time.sleep(10) # esperar para asegurarnos de que se inicializa la API

    ngrok_api_url = "http://localhost:4040/api/tunnels" 

    response = requests.get(ngrok_api_url).text 
    j = json.loads(response)
    print(j)

    while len(j['tunnels']) == 0:
        time.sleep(1)
        print("retrying tunnel fetch...")
        response = requests.get(ngrok_api_url).text 
        j = json.loads(response)
        print(j)


    tunnel_url = j['tunnels'][0]['public_url']
    tunnel_url = tunnel_url.replace('https', 'http', 1)
    return tunnel_url

def publishTunnelURL(tunnel_url):
    try:
        server_url = "http://93.189.90.190"
        resp = requests.post(server_url+"/api/deviceurl", data={"identifier": "grupodaic11p", "tunnel_url": str(tunnel_url)})
        return resp.json()['success']
    except:
        return False

def performCheck(red_led, gas, hcho, max_gas, max_hcho):
    if gas > max_gas or hcho > max_hcho:
        print("turning red led on")
        red_led.turnOn()
    else:
        print("turning red led off")
        red_led.turnOff()

def main():
    
    white_led = Led(22)
    red_led = Led(16)

    white_led.turnOff()
    red_led.turnOff()

    # start HTTP tunnel on port 8081
    tunnel_url = startHTTPTunnel(8081)
    print("ready to receive HTTP requests on " + str(tunnel_url))
    
    published = False
    attempts = 0
    while not published and attempts < 5:
        published = publishTunnelURL(tunnel_url)
        attempts = attempts + 1
        time.sleep(2)

    # time_between_syncs = 60
    # time_between_measurements = 3
 
    time_between_syncs, time_between_measurements, max_gas, max_hcho = resetParameters()
    time_till_sync = time_between_syncs

    gas_sensor = GroveGasSensorMQ2(0)
    hcho_sensor = GroveHCHOSensor(2)
    magnetic_sensor = MagneticSensor(5)

    white_led.turnOn()
    red_led.turnOff()

    print('Detecting...')
    while True:
        with open("/mediciones/room_data.csv", "a") as file:
            date = datetime.now().isoformat()
            line = "{0},{1},{2},{3}\n".format(date, gas_sensor.MQ2, hcho_sensor.HCHO, magnetic_sensor.Contact)
            file.write(line)

        performCheck(red_led, gas_sensor.MQ2, hcho_sensor.HCHO, max_gas, max_hcho)

        time.sleep(time_between_measurements)
        time_till_sync -= time_between_measurements
        if time_till_sync <= 0:                
            try:
                do_sync()
                time_between_syncs, time_between_measurements, max_gas, max_hcho = resetParameters()
                time_till_sync = time_between_syncs
                if not published:
                    published = publishTunnelURL(tunnel_url)

            except:
                print('Could not sync with server')
                pass


 
if __name__ == '__main__':
    main()

