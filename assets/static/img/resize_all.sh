#!/bin/bash

DIR="$1"
SIZE="$2"

[ "$DIR" == "-h" ] && usage && exit 0
[ -z "$DIR" ] && usage && exit 1
[ -z "$SIZE" ] && usage && exit 1


function usage(){
  echo "usage: resize_all [Directory] [pixel size]"
}

function new_name(){
  # insert the image size into the filename
  echo "$1" | sed "s/\(.*\)\(.JPG\)/\1_$2px\2/g"
}


for i in $DIR/*
do
  $(echo $i | grep -q 'px')
  [ $? -eq 0 ] && echo "skipping $i" && continue
  sips -Z $SIZE $i --out $(new_name $i $SIZE)
done


