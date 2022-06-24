#!/bin/bash
kill -9 $(lsof -i:8800 | awk '{print $2}')
nodemon 

