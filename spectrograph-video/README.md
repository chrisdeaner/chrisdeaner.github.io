## Spectrograph Video Creator
A simple bash script to create a stylized spectograph video given an audio file. Used to create the images for the +/- {Plus/Minus} video Intentionally Left Blank. We thought it would be nice to share the script in case anyone finds it useful.

The script takes a while to complete, a 5 second piece of audio takes approximately one minute. 

The reason this process takes so long is that creating the video goes through these processes:
* Break an sudio file into .2 second chunks
* Create a high quality spectrograph image of each of those chunks (this takes the most time)
* Combine images to form a video

It's best to start with small audio file until you get your desired output, then run the script on the entire song.

License: MIT License.

