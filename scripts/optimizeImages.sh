#!/bin/bash

cd ../assets/img/full

# clean image output directory 
# rm ../assets/img/opt/*

mkdir opt

# iterate over images and optimize
i=0
for f in *
do
    ffmpeg -i $f -q:v 10 -vf scale=1000:-1 ./opt/$f
done

# manually copy img/full/top to img/opt for now....