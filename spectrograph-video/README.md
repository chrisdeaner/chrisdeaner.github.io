## Spectrograph Video Creator

A simple bash script to create a stylized spectograph video given an audio file.
Used to create the images for the +/- {Plus/Minus} video
[Intentionally Left Blank](https://www.youtube.com/watch?v=-6VBBin0yHo). We
thought it would be nice to share the script in case anyone finds it useful.

The script takes a while to complete, a 5 second piece of audio takes
approximately one minute.

This process takes a while because the script goes through these processes:

-   Break an audio file into .2-second chunks
-   Create a high-quality spectrograph image of each of those chunks (this takes
    the most time)
-   Combine images to form a video

It's best to start with small audio file until you get your desired output, then
run the script on the entire song. A 5 sec snippet of Intentionally Left Blank
was included here as a starting point.

### Getting Started

You'll need [ffmpeg](https://ffmpeg.org/) installed on your system.

Open up a bash shell and run:

```bash
./spectro.sh
```

That's it. If you want to run the program on a file other than the default
`ILB-sample.wav`, edit line 4 of `spectro.sh` to point to the file of your
choosing.

Enjoy!

License: MIT License.
