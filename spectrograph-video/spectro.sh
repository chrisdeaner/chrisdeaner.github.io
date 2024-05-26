#!/bin/bash

# Location of audio file
SONG_PATH="./ILB.wav"
FINAL_NAME="ILB"

# Folders
RENDER_DIR="./render"
AUDIO_DIR=$RENDER_DIR'/audio'
IMAGES_DIR=$RENDER_DIR'/images'

# Clean render directory if it exists
if [ -d "$RENDER_DIR" ]; then rm -Rf $RENDER_DIR; fi
mkdir -p $AUDIO_DIR

# Seperate an audio file into small chunks
# Save chunks to a directory, save csv of chunk names in case useful
ffmpeg -i $SONG_PATH -f segment -segment_time 0.2 -segment_list out.csv -c copy $AUDIO_DIR'/out%03d.wav' -hide_banner -loglevel error

# create directory for the images
mkdir $IMAGES_DIR

# Iterate over images and create a spectrogram for each
i=0
for f in $AUDIO_DIR/*
do
    # Set the size (3840x2160), orientation (horizontal), and color(‘intensity’).
    # and save to the output folder
    # Docs: https://ffmpeg.org/ffmpeg-filters.html#showspectrumpic
    ffmpeg -i $f -lavfi showspectrumpic=s=3840x2160:orientation=1:color=1:stop=17500 -loglevel error $IMAGES_DIR/$i.png
    ((i++))
done

# Combine images to form a video
ffmpeg -r 5 -f image2 -s 3840x2160 -i $IMAGES_DIR'/%d.png' -vcodec libx264 -crf 25  -pix_fmt yuv420p silent.mp4 -hide_banner -loglevel error
# Add the song to the video
ffmpeg -i silent.mp4 -i ILB.wav -c:v copy -shortest -c:a aac $FINAL_NAME.mp4 -hide_banner -loglevel error

# Cleanup
rm silent.mp4
if [ -d "$RENDER_DIR" ]; then rm -Rf $RENDER_DIR; fi