#!/bin/bash

if [ -e "$box" ]
  then
    echo remote host not set!
    exit 1
fi

if [[ $(basename `pwd`) != 'alexramsdell.com' ]]
  then
    echo not in the base project directory!
    exit 1
fi

rsync -aP build/ $box:~/www/alexramsdell.com/
