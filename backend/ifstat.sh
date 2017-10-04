#!/bin/bash

#echo "output is"
#echo "timestamp|interface|tx kbps|rx kbps"
#echo ""
#
# run this script on system boot
#

mkdir -p /tmp/ifstat

declare -A R1
declare -A R2
declare -A T1
declare -A T2


while true
do
	IFLIST=`ls -1 /sys/class/net/ |grep -v lo|grep -v eth0`

	for if in $IFLIST; do

		R1[$if]=`cat /sys/class/net/$if/statistics/rx_bytes`
	        T1[$if]=`cat /sys/class/net/$if/statistics/tx_bytes`

	done

	sleep 1

	for if in $IFLIST; do

	        R2[$if]=`cat /sys/class/net/$if/statistics/rx_bytes`
	        T2[$if]=`cat /sys/class/net/$if/statistics/tx_bytes`
	done

	timestamp=`date +%s`
	for if in $IFLIST; do

		Tt2=${T2[$if]}
		Tt1=${T1[$if]}
		Rt2=${R2[$if]}
		Rt1=${R1[$if]}
	        TBPS=`expr $Tt2 - $Tt1`
	        RBPS=`expr $Rt2 - $Rt1`
	        TKBPS=`expr $TBPS / 128`
	        RKBPS=`expr $RBPS / 128`
	        echo "$timestamp|$if|$TKBPS|$RKBPS" >> /tmp/ifstat/$if.stat
	done
done
