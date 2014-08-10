#!/bin/bash

mkdir -p /tmp/163
PID_FILE=/tmp/163/163.pid
LOG_FILE=/tmp/163/163.log
SOCKET=/tmp/163/163.socket

export PYTHON_PATH=~/Websites/163/src:~/163/src

uwsgi --stop $PID_FILE
uwsgi -s $SOCKET --module server --callable app --chmod-socket=666 --pidfile $PID_FILE --logto $LOG_FILE &
