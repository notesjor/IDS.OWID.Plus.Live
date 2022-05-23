# IDS.OWID.Plus.Live

A demo, based on 13 German-language news RSS feeds, can be found here: 
https://www.owid.de/plus/live-2021/

## System requirements

System requirements for a custom installation/corpora:

- Linux server
- Web server e.g. Apache or NGinx
- ElasticSearch
- You need a script that collects the ngrams from the sources and prepares them according to our specification. See section -INPUT-

## Step 1
On a Linux server (x64 architecture), first install Apache or NGINX. 
Extensions like PHP are not necessary. 
Also, please install ElasticSearch. 
Make sure that the ports of ElasitcSearch (default values: 9200 and 9300) are only locally accessible and not public.

## INPUT (Step 2)
You need a script that prepares the NGrams day by day. The script must create a separate file for each day. 
The file name must have the date formatted in ISO, e.g. 2020-11-31.csv

The NGrams per day are written mixed. I.e. you can write 1-grams, 2-grams and 3-grams in one file. 
For each N-gram you have to provide the following three layers: Word-form, Lemma, Part-of-Speech (tag).

According to the columns: Word form, Lemma, Part-of-Speech - is followed by another column with the absolute frequency. 
The columns are separated from each other with TAB. 
The tokens in the columns: Word form, Lemma, Part-of-Speech - are separated with spaces. 
The upload script determines the value for N based on the number of blanks - The relative frequency is calculated later in the WebClient.

Sample data:
```
wordform	lemma	tag	freq
.	.	$.	8489
der	die	ART	2942
in	in	APPR	2554
,	,	$,	2368
:	:	$.	2346
und	und	KON	2024
auf weitere	auf weit	APPR ADJA	1
auf welche	auf welche	APPR PIAT	1
auf wenige	auf wenige	APPR PIAT	1
im	in+die	APPRART	1224
für	für	APPR	1085
er die eigene	er die eigen	PPER ART ADJA	1
er die geschicke	er die geschick	PPER ART NN	1
er die lage	er die lage	PPER ART NN	1
```

## Step 3
Copy and run the web service (we provide an x64 binary). 
Tip: The web service should best start automatically with Linux - so consider registering it as a service. 


## Step 3 - Problem: If the WebService does not start

OWIDplusLIVE uses RocksDB - which is a local (file-based) key-value store. 
It can happen that the binaries we provide do not work. 
In this case there are two possible solutions: 
1. Copy the binaries from the 'PATCH' folder directly into the WebServices directory. Restart the WebService. 
2. If (1) doesn't work either, you will have to compile the binaries from the source yourself. 
