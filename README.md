# Project Blazedemo-LoadTest-Jmeter-BlazeMeter

# JMeter Complete Guide:
Step 1: Download Java jdk 8 (https://www.oracle.com/java/technologies/javase/javase8u211-later-archive-downloads.html)
Step 2: Download JMeter (https://jmeter.apache.org/download_jmeter.cgi)
Step 3: Open JMeter -> File -> Thread group -> Give name of thread group, add user, rampup time (to set users, time)
step 4: Thread group ->Sampler ->http request ->provide details    // (to send requests to particular page)
step 5: Thread group ->Listener ->add listerner according to your choice (to see result)

# how to add assertion
step 6: HTTP request ->Add Asertion ->Response Assertionn (to add assertions)
step 7: HTTP request ->Add Asertion ->Duration Assertionn (to add duration assertions to check for specific time)
step 8: HTTP request ->Add Asertion ->Size Assertionn (to add size assertions to check for specific size)
step 9: Thread group -> Listener -> Assertion result (to see assertion result)

# How to record your test on JMeter
Step 11: Test Plan -> Add ->Non Test Elements ->HTTPS test script recorder (can add requests automatically) //no multiple
Step 12: Thread Group ->Add ->Logic Controller ->Recording controller (can add per page to see every page we request to) //can add multiple recording controller

# Configure Proxy and SSL Certificate with firefox:
Step 13: Change proxy to 8888 or same as jmeter HTTPS test script recorder
Step 14: Import SSL certificate ca from the bin folder of Jmeter //SSL certificate will be generated automatically after clicking the play button in HTTPS test script recorder

# Use Recording template to pull the above things automatically:
step 15: File ->Template

# How to use Blazemeter Extension: (https://chrome.google.com/webstore/detail/blazemeter-the-continuous/mbopgmdnpcbohhpnfglgohlbhfongabi?hl=en) 
Step 16: Chrome -> Extension ->Install Blazemeter ->Signup ->Open Blazemeter ->Put test name and other ->Click on record icon ->Start browsing ->Blazemeter will record automatically ->Edit or download as JMX file ->Import it in Jmeter

# Getting data from CSV:
Step 17: Test Plan ->Add ->Config Element ->CSV data set config ->Browse ->Import CSV file from the device

# Refer values from CSV using syntax:
Step 17: Test Plan ->Add ->Config Element ->CSV data set config ->Browse ->Import CSV file from the device
Step 18: Thread group ->Add ->Sampler ->Java request -> name the request as ${variableName}

# JMeter Config Elements - for HTTP (Web Test Plan)
Elements that are executed before the sampler requests at the same level
Configuration elements can be used to set up defaults and variables for later use by samplers. Note that these elements are processed at the start of the scope in which they are found, i.e. before any samplers in the same scope

# Use Jmeter using Command Line //Best practice due to memory size
Step 19 - Goto JMeter’s bin folder =>
Run command

Windows
jmeter -n -t “location of your test file” -l “location of results file”

# Use jmeter -h to get help

# Generate HTML report from CLI
Step 20: Create a new report after test
jmeter -n -t “location of your test file” -l “location of results file” -e -o "location of the reports folder"

Step 21: Create html report from existing CSV report
jmeter -g “location of results file” -o "location of the reports folder"

# N.B: You need an empty folder for html report generation

# If you need plugins, visit (https://jmeter-plugins.org/wiki/Start/)
=> Download plugins manager jar from https://jmeter-plugins.org/wiki/Plugi...
=> Add the jar file in jmeter lib/ext folder and restart JMeter
=> Check JMeter plugins manager is added
