#!/bin/bash
while IFS='' read -r line || [[ -n "$line" ]]; do
     mpv --sub-file="${line%.*}".vtt "$line"
#    echo "Text read from file: $line"
done < "$1"
# read a file line by line
