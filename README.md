# ebaCliWeatherClient

## Summary

This commandline client that can be used to ask EBA questions, e.g. about the weather.
It will use a websocket connection to speak to the EBA server and display the results.
You can ask any supported question, for demonstration purposes there is special handling 
of answers builtin that talk about weather forecast.

## Instructions

You need to add a ```.env``` file with the following information to be able to run this

```console
RSAKEY='/home/user/.ssh/eba_key.pem'
ISS= 'cui-shell'
SUB='xxxxxxxxx'
NAME='yourname'
```

fill in the values that you get on the EBA headless settings page.
Also make sure that you generated your own private RSA key and that is configured here and
has its public key imported into your EBA client.
