from flask import Flask, render_template, request, redirect
import requests as req
import json
from flask_cors import CORS
import pkce
import uuid
import math

app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return {"hello": "User"}


@app.route('/login')
def login():
    global auth_code
    global auth_state
    global access_token

    auth_code = request.args.get('code', default="code", type=str)
    auth_state = request.args.get('state', default='state', type=str)

    print("\n" + 'pkce_verifier : ' + pkce_verifier + "\n")
    print('pkce_challenge : ' + pkce_challenge + "\n")
    print("auth_code : " + auth_code + "\n")
    print("auth_state : " + auth_state + "\n")

    headers_req = {'Authorization': 'Basic MjM5N1FIOjc2MmQzOWRiOTIyNDlmYzA1NjRjZTE0ZmVlZThkMTUx',
                   'Content-Type': 'application/x-www-form-urlencoded'}
    params = {'client_id': '2397QH', 'grant_type': 'authorization_code',
              'redirect_uri': 'http://127.0.0.1:5000/login', 'code': auth_code, 'code_verifier': pkce_verifier}

    access_tkn_req = req.post(
        'https://api.fitbit.com/oauth2/token', headers=headers_req, data=params)
    access_token = json.loads(access_tkn_req.text)
    access_token = str(access_token['access_token'])

    print("access_token : " + access_token + "\n")

    return render_template("index.html")


@app.route("/access_token", methods=["GET", "POST"])
def access_token():

    return {"access_token": access_token, 'pkce_verifier': pkce_verifier, 'pkce_challenge': pkce_challenge, "auth_code": auth_code, "auth_state": auth_state}


@app.route("/profile", methods=["GET", "POST"])
def profile():
    headers_req = {"Authorization": "Bearer " + access_token}
    profile_req = req.post(
        'https://api.fitbit.com/1/user/-/profile.json', headers=headers_req)

    return json.loads(profile_req.text)


@app.route("/auth", methods=["GET", "POST"])
def auth():
    global pkce_verifier
    global pkce_challenge
    global unique_state

    pkce_verifier = pkce.generate_code_verifier(length=128)
    pkce_challenge = pkce.get_code_challenge(pkce_verifier)
    unique_state = uuid.uuid1().hex

    return redirect("https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=2397QH&scope=activity+cardio_fitness+electrocardiogram+heartrate+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&code_challenge="+pkce_challenge+"&code_challenge_method=S256&state=" + unique_state + "&redirect_uri=http%3A%2F%2F127.0.0.1%3A5000%2Flogin", code=302)


@app.route("/sleep", methods=["GET", "POST"])
def sleep():
    print("test access" + access_token)
    headers_req = {"accept": "application/json",
                   "authorization": "Bearer " + access_token}

    data = {"date":["2021-07-20","2021-07-30"]}
    date = data['date']
    
    sleep_req = req.get(
        'https://api.fitbit.com/1.2/user/-/sleep/date/{0}/{1}.json'.format(date[0], date[1]), headers=headers_req)
    sleep_json = json.loads(sleep_req.text)
    
    count = 0
    sleep_data = {"sleep": [[], []]}

    for i in sleep_json["sleep"]:
        if sleep_json["sleep"][count]['isMainSleep'] == True:
            sleep_data["sleep"][0].append(str(sleep_json["sleep"][count]['dateOfSleep']))
            sleep_data["sleep"][1].append(round((sleep_json["sleep"][count]['duration']/(1000*60*60)) % 24, 1))

        count += 1

    return sleep_data


@app.route("/info", methods=["GET", "POST"])
def info():
    global device_info
    global lifetime_stats

    headers_req = {"accept": "application/json",
                   "authorization": "Bearer " + access_token}

    info_req = req.get(
        'https://api.fitbit.com/1/user/-/devices.json', headers=headers_req)
    device_info = json.loads(info_req.text)[0]

    info_req = req.get(
        'https://api.fitbit.com/1/user/-/activities.json', headers=headers_req)

    lifetime_stats = json.loads(info_req.text)

    return {'deviceVersion': device_info['deviceVersion'], "batteryLevel": device_info['batteryLevel'], "steps": lifetime_stats['lifetime']['total']['steps'], "distance": lifetime_stats['lifetime']['total']['distance']}


if __name__ == '__main__':
    app.run(debug=True)
